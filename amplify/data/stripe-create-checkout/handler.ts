import type { Schema } from '../resource'
import Stripe from 'stripe'

declare const process: { env: Record<string, string | undefined> }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-06-24.dahlia',
})

function resolvePlan(plan: unknown): 'standard' | 'pro' {
  const normalized = String(plan || '').trim().toLowerCase()
  if (normalized === 'pro') return 'pro'
  return 'standard'
}

function resolvePriceId(plan: 'standard' | 'pro') {
  if (plan === 'pro') return process.env.STRIPE_PRO_PRICE_ID || ''
  return process.env.STRIPE_STANDARD_PRICE_ID || ''
}

function resolveBaseUrl(event: unknown) {
  const configured = process.env.APP_BASE_URL || ''
  if (configured) return configured

  const originHeader = (event as { request?: { headers?: Record<string, string> } })?.request?.headers?.origin || ''
  return originHeader || 'http://localhost:5173'
}

function readIdentity(event: unknown) {
  const identity = (event as { identity?: { claims?: Record<string, unknown> } })?.identity
  const claims = identity?.claims || {}
  const userId = String(claims.sub || claims.username || '').trim()
  const userEmail = String(claims.email || '').trim()

  if (!userId) {
    throw new Error('認証情報を確認できませんでした。')
  }

  return {
    userId,
    userEmail,
  }
}

async function findOrCreateCustomer(userId: string, userEmail: string) {
  if (userEmail) {
    const listed = await stripe.customers.list({
      email: userEmail,
      limit: 20,
    })

    const matched = listed.data.find((customer) => String(customer.metadata?.userId || '') === userId)
    if (matched) return matched.id
  }

  const customer = await stripe.customers.create({
    email: userEmail || undefined,
    metadata: {
      userId,
    },
  })

  return customer.id
}

export const handler: Schema['createCheckoutSession']['functionHandler'] = async (event) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY が未設定です。')
  }

  const { userId, userEmail } = readIdentity(event)
  const plan = resolvePlan(event.arguments.plan)
  const priceId = resolvePriceId(plan)

  if (!priceId) {
    throw new Error('Price ID が未設定です。')
  }

  const baseUrl = resolveBaseUrl(event)
  const stripeCustomerId = await findOrCreateCustomer(userId, userEmail)

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: stripeCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/billing/cancel`,
    subscription_data: {
      metadata: {
        userId,
        userEmail,
      },
    },
    metadata: {
      userId,
      userEmail,
      plan,
    },
    allow_promotion_codes: true,
  })

  if (!session.url) {
    throw new Error('Checkout URL の作成に失敗しました。')
  }

  return {
    url: session.url,
    message: 'Checkout session created',
  }
}
