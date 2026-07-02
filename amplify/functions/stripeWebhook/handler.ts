import type { APIGatewayProxyResultV2 } from 'aws-lambda'
import Stripe from 'stripe'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

declare const process: { env: Record<string, string | undefined> }
declare const Buffer: {
  from: (input: string, encoding: string) => {
    toString: (encoding: string) => string
  }
}

type PlanType = 'free' | 'standard' | 'pro'
type SubscriptionState = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'none'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-06-24.dahlia',
})

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

function toIso(timestamp?: number | null) {
  if (!timestamp) return null
  return new Date(timestamp * 1000).toISOString()
}

function resolvePlanFromPrice(priceId: string | null | undefined): PlanType {
  if (!priceId) return 'free'

  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  if (priceId === process.env.STRIPE_STANDARD_PRICE_ID) return 'standard'
  return 'free'
}

function resolveEffectivePlan(subscription: Stripe.Subscription): PlanType {
  const priceId = subscription.items.data[0]?.price?.id || null
  const fromPrice = resolvePlanFromPrice(priceId)
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    return fromPrice
  }
  return 'free'
}

function normalizeStatus(status: string): SubscriptionState {
  const raw = String(status || '').trim().toLowerCase()
  if (raw === 'active') return 'active'
  if (raw === 'trialing') return 'trialing'
  if (raw === 'past_due') return 'past_due'
  if (raw === 'canceled') return 'canceled'
  if (raw === 'unpaid') return 'unpaid'
  if (raw === 'incomplete') return 'incomplete'
  return 'none'
}

async function findByCustomerId(tableName: string, stripeCustomerId: string) {
  const scanned = await ddb.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: 'stripeCustomerId = :customerId',
      ExpressionAttributeValues: {
        ':customerId': stripeCustomerId,
      },
      Limit: 1,
    })
  )

  return scanned.Items?.[0] || null
}

async function upsertSubscriptionStatus(tableName: string, input: {
  userId: string
  userEmail: string
  plan: PlanType
  status: SubscriptionState
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripePriceId: string
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  canceledAt: string | null
}) {
  await ddb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        id: input.userId,
      },
      UpdateExpression:
        'SET userId = :userId, userEmail = :userEmail, #plan = :plan, #status = :status, stripeCustomerId = :stripeCustomerId, stripeSubscriptionId = :stripeSubscriptionId, stripePriceId = :stripePriceId, currentPeriodStart = :currentPeriodStart, currentPeriodEnd = :currentPeriodEnd, cancelAtPeriodEnd = :cancelAtPeriodEnd, canceledAt = :canceledAt',
      ExpressionAttributeNames: {
        '#plan': 'plan',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':userId': input.userId,
        ':userEmail': input.userEmail,
        ':plan': input.plan,
        ':status': input.status,
        ':stripeCustomerId': input.stripeCustomerId,
        ':stripeSubscriptionId': input.stripeSubscriptionId,
        ':stripePriceId': input.stripePriceId,
        ':currentPeriodStart': input.currentPeriodStart,
        ':currentPeriodEnd': input.currentPeriodEnd,
        ':cancelAtPeriodEnd': input.cancelAtPeriodEnd,
        ':canceledAt': input.canceledAt,
      },
    })
  )
}

async function syncFromSubscription(tableName: string, subscription: Stripe.Subscription) {
  const metadataUserId = String(subscription.metadata?.userId || '').trim()
  const metadataEmail = String(subscription.metadata?.userEmail || '').trim()
  const stripeCustomerId = String(subscription.customer || '').trim()

  let userId = metadataUserId
  let userEmail = metadataEmail

  if (!userId && stripeCustomerId) {
    const existing = await findByCustomerId(tableName, stripeCustomerId)
    userId = String(existing?.userId || '').trim()
    userEmail = String(existing?.userEmail || '').trim()
  }

  if (!userId) {
    console.warn('Webhook event skipped: userId not resolved', {
      stripeCustomerId,
      subscriptionId: subscription.id,
    })
    return
  }

  if (!userEmail) {
    const existing = await ddb.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          id: userId,
        },
      })
    )
    userEmail = String(existing.Item?.userEmail || '').trim()
  }

  if (!userEmail && stripeCustomerId) {
    const customer = await stripe.customers.retrieve(stripeCustomerId)
    if (!('deleted' in customer)) {
      userEmail = String(customer.email || '').trim()
    }
  }

  const priceId = String(subscription.items.data[0]?.price?.id || '')
  const subAny = subscription as unknown as Record<string, unknown>
  const currentPeriodStart = Number(subAny.current_period_start || 0)
  const currentPeriodEnd = Number(subAny.current_period_end || 0)

  await upsertSubscriptionStatus(tableName, {
    userId,
    userEmail,
    plan: resolveEffectivePlan(subscription),
    status: normalizeStatus(subscription.status),
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    currentPeriodStart: toIso(currentPeriodStart),
    currentPeriodEnd: toIso(currentPeriodEnd),
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    canceledAt: toIso(subscription.canceled_at),
  })
}

function response(statusCode: number, body: Record<string, unknown>): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}

type WebhookEvent = {
  headers?: Record<string, string | undefined>
  body?: string | null
  isBase64Encoded?: boolean
}

export const handler = async (event: WebhookEvent): Promise<APIGatewayProxyResultV2> => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET || !process.env.SUBSCRIPTION_STATUS_TABLE) {
    console.error('Stripe webhook environment variables are missing')
    return response(500, { message: 'webhook configuration error' })
  }

  const signature = event.headers?.['stripe-signature'] || event.headers?.['Stripe-Signature']
  if (!signature) {
    return response(400, { message: 'missing signature' })
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : String(event.body || '')

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error('Stripe signature verification failed', error)
    return response(400, { message: 'invalid signature' })
  }

  try {
    const tableName = process.env.SUBSCRIPTION_STATUS_TABLE

    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const checkout = stripeEvent.data.object as Stripe.Checkout.Session
        const subscriptionId = typeof checkout.subscription === 'string' ? checkout.subscription : checkout.subscription?.id
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          await syncFromSubscription(tableName, subscription)
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        await syncFromSubscription(tableName, subscription)
        break
      }
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object as unknown as { subscription?: string | { id?: string } }
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          await syncFromSubscription(tableName, subscription)
        }
        break
      }
      default:
        break
    }

    return response(200, { received: true })
  } catch (error) {
    console.error('Stripe webhook processing failed', {
      type: stripeEvent.type,
      error,
    })
    return response(500, { message: 'processing failed' })
  }
}
