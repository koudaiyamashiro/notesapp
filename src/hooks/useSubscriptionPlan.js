import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthProvider.jsx'
import {
  createGuestSubscriptionSnapshot,
  getCurrentSubscription,
} from '../services/subscriptionService.js'
import { isPaidPlan, isSubscriptionActive } from '../lib/planCapabilities.js'

export function useSubscriptionPlan() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState(createGuestSubscriptionSnapshot())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (authLoading) return

    if (!isAuthenticated || !user?.id) {
      setSubscription(createGuestSubscriptionSnapshot())
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    try {
      const latest = await getCurrentSubscription(user)
      setSubscription(latest)
    } catch (e) {
      setError(e instanceof Error ? e.message : '契約情報の取得に失敗しました。')
      setSubscription(createGuestSubscriptionSnapshot())
    } finally {
      setLoading(false)
    }
  }, [authLoading, isAuthenticated, user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const derived = useMemo(() => {
    const plan = subscription.plan
    const status = subscription.status
    const isPaid = isPaidPlan(plan) && isSubscriptionActive(status)
    return {
      plan,
      status,
      capabilities: subscription.capabilities,
      isPaid,
      canUseAdvancedDiagnosis: Boolean(subscription.capabilities?.canUseAdvancedDiagnosis && isPaid),
    }
  }, [subscription])

  return {
    ...subscription,
    ...derived,
    loading,
    error,
    refresh,
  }
}
