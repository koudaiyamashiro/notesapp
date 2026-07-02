import type { Schema } from '../resource'
import Stripe from 'stripe'

declare const process: { env: Record<string, string | undefined> }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-06-24.dahlia',
})

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

function resolveBaseUrl(event: unknown) {
  const configured = process.env.APP_BASE_URL || ''
  if (configured) return configured

  const originHeader = (event as { request?: { headers?: Record<string, string> } })?.request?.headers?.origin || ''
  return originHeader || 'http://localhost:5173'
}

async function findCustomerId(userId: string, userEmail: string) {
  if (userEmail) {
    const listed = await stripe.customers.list({
      email: userEmail,
      limit: 20,
    })

    const matched = listed.data.find((customer) => String(customer.metadata?.userId || '') === userId)
    if (matched) return matched.id
  }

  const listedByMetadata = await stripe.customers.list({ limit: 100 })
  const matchedByMetadata = listedByMetadata.data.find((customer) => String(customer.metadata?.userId || '') === userId)
  return matchedByMetadata?.id || ''
}

export const handler: Schema['createCustomerPortalSession']['functionHandler'] = async (event) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY が未設定です。')
  }

  const { userId, userEmail } = readIdentity(event)
  const stripeCustomerId = await findCustomerId(userId, userEmail)

  if (!stripeCustomerId) {
    throw new Error('契約情報が見つかりません。先にプランを選択してください。')
  }

  const baseUrl = resolveBaseUrl(event)

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${baseUrl}/billing`,
  })

  if (!session.url) {
    throw new Error('契約管理URLの作成に失敗しました。')
  }

  return {
    url: session.url,
    message: 'Portal session created',
  }
}
