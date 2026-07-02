import { generateClient } from 'aws-amplify/data'
import { getPlanCapabilities, normalizePlan, normalizeStatus, PLAN_IDS, PLAN_STATUS } from '../lib/planCapabilities.js'

const client = generateClient()

function normalizeSubscriptionRecord(record, user) {
  const plan = normalizePlan(record?.plan)
  const status = normalizeStatus(record?.status)

  return {
    id: record?.id || user?.id || 'unknown-user',
    userId: record?.userId || user?.id || '',
    userEmail: record?.userEmail || user?.email || '',
    plan,
    status,
    stripeCustomerId: record?.stripeCustomerId || '',
    stripeSubscriptionId: record?.stripeSubscriptionId || '',
    stripePriceId: record?.stripePriceId || '',
    currentPeriodStart: record?.currentPeriodStart || null,
    currentPeriodEnd: record?.currentPeriodEnd || null,
    cancelAtPeriodEnd: Boolean(record?.cancelAtPeriodEnd),
    canceledAt: record?.canceledAt || null,
    capabilities: getPlanCapabilities(plan),
  }
}

export function createGuestSubscriptionSnapshot() {
  const plan = PLAN_IDS.FREE
  return {
    id: 'guest',
    userId: '',
    userEmail: '',
    plan,
    status: PLAN_STATUS.NONE,
    stripeCustomerId: '',
    stripeSubscriptionId: '',
    stripePriceId: '',
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    capabilities: getPlanCapabilities(plan),
  }
}

async function ensureFreeSubscription(user) {
  const defaultInput = {
    id: String(user.id),
    userId: String(user.id),
    userEmail: String(user.email || ''),
    plan: PLAN_IDS.FREE,
    status: PLAN_STATUS.NONE,
    cancelAtPeriodEnd: false,
  }

  const { data, errors } = await client.models.SubscriptionStatus.create(defaultInput, {
    authMode: 'userPool',
  })

  if (errors?.length) {
    const merged = errors.map((error) => error.message).join('\n')
    if (!merged.includes('already exists')) {
      throw new Error(merged)
    }
  }

  return data || defaultInput
}

export async function getCurrentSubscription(user) {
  if (!user?.id) return createGuestSubscriptionSnapshot()

  const { data, errors } = await client.models.SubscriptionStatus.get(
    { id: String(user.id) },
    { authMode: 'userPool' }
  )

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join('\n'))
  }

  if (data) {
    return normalizeSubscriptionRecord(data, user)
  }

  const created = await ensureFreeSubscription(user)
  return normalizeSubscriptionRecord(created, user)
}

export async function createCheckoutSession(plan) {
  const { data, errors } = await client.mutations.createCheckoutSession(
    { plan: normalizePlan(plan) },
    { authMode: 'userPool' }
  )

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join('\n'))
  }

  if (!data?.url) {
    throw new Error('チェックアウトURLを取得できませんでした。')
  }

  return data
}

export async function createCustomerPortalSession() {
  const { data, errors } = await client.mutations.createCustomerPortalSession({}, { authMode: 'userPool' })

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join('\n'))
  }

  if (!data?.url) {
    throw new Error('契約管理URLを取得できませんでした。')
  }

  return data
}
