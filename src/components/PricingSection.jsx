import PricingCard from './PricingCard.jsx'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useSubscriptionPlan } from '../hooks/useSubscriptionPlan.js'
import { createCheckoutSession } from '../services/subscriptionService.js'
import { PLAN_IDS } from '../lib/planCapabilities.js'

const pricingPlans = [
  {
    title: 'Free',
    planId: PLAN_IDS.FREE,
    price: '0円',
    description: 'まずはトライアル。今の自分を見える化。',
    features: ['簡易診断', '市場価値スコア（簡易）', 'おすすめ業界診断', '適職診断', 'おすすめ企業は限定表示'],
    subNote: '詳細診断・企業比較・書類/面接対策は有料プランで利用できます。',
  },
  {
    title: 'Standard',
    planId: PLAN_IDS.STANDARD,
    price: '550円/月',
    description: 'キャリアを具体化したい方に。',
    features: ['詳細診断 月3回', '市場価値スコア（詳細）', 'おすすめ企業TOP10', '企業比較', 'キャリアロードマップ', 'AIキャリア相談 月5回'],
    subNote: '税込・月額課金。毎月自動更新、いつでも解約可能。',
    recommended: true,
  },
  {
    title: 'Pro',
    planId: PLAN_IDS.PRO,
    price: '1,498円/月',
    description: '戦略を実行まで支援するフル機能。',
    features: ['詳細診断 無制限', '全機能利用可能', '企業比較', 'AIキャリア相談 無制限', '職務経歴書作成/添削', '面接対策', '転職戦略レポート'],
    subNote: '税込・月額課金。毎月自動更新、いつでも解約可能。',
    featured: true,
  },
]

export default function PricingSection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { plan, status, isPaid, loading: subscriptionLoading } = useSubscriptionPlan()
  const [submittingPlanId, setSubmittingPlanId] = useState('')
  const [checkoutError, setCheckoutError] = useState('')

  const currentPlanId = useMemo(() => {
    if (!isPaid) return PLAN_IDS.FREE
    return plan
  }, [isPaid, plan])

  const handleSelectPlan = async (planId) => {
    setCheckoutError('')

    if (planId === PLAN_IDS.FREE) {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }
      navigate('/assessment')
      return
    }

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if ((planId === PLAN_IDS.STANDARD || planId === PLAN_IDS.PRO) && currentPlanId === planId && isPaid) {
      navigate('/billing')
      return
    }

    try {
      setSubmittingPlanId(planId)
      const session = await createCheckoutSession(planId)
      window.location.href = session.url
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : '決済ページの表示に失敗しました。時間をおいて再度お試しください。')
      setSubmittingPlanId('')
    }
  }

  const getActionLabel = (planId) => {
    if (!isAuthenticated) return 'ログインして選択'
    if (planId === PLAN_IDS.FREE) return '無料で始める'
    if (currentPlanId === planId && isPaid) return '契約中'
    if (planId === PLAN_IDS.PRO && currentPlanId === PLAN_IDS.STANDARD) return 'Proへアップグレード'
    if (planId === PLAN_IDS.STANDARD && currentPlanId === PLAN_IDS.PRO) return '契約管理から変更'
    return '今すぐ選ぶ'
  }

  return (
    <section id="pricing" className="bg-[#F5F7FA] py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-600">Pricing</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            転職前に、戦略をつくるサブスク。
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            まずは無料で現状を把握し、必要に応じて機能をアップグレードしていくモデルです。
          </p>
          {!subscriptionLoading && (
            <p className="mt-3 text-sm text-slate-500">
              現在のプラン: <span className="font-semibold text-slate-900">{currentPlanId === PLAN_IDS.PRO ? 'Pro' : currentPlanId === PLAN_IDS.STANDARD ? 'Standard' : 'Free'}</span>
              {isPaid && <span className="ml-2 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{status}</span>}
            </p>
          )}
        </div>

        {checkoutError && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700">
            {checkoutError}
          </div>
        )}

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.title}
              {...plan}
              isCurrentPlan={currentPlanId === plan.planId}
              isLoading={submittingPlanId === plan.planId}
              actionLabel={getActionLabel(plan.planId)}
              onSelect={() => handleSelectPlan(plan.planId)}
            />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs leading-6 text-slate-600 sm:text-sm">
          <p>表記価格は税込です。Standard/Proは月額サブスクリプションで毎月自動更新されます。解約は契約管理ページからいつでも実行できます。</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link className="text-sky-700 underline underline-offset-2" to="/terms">利用規約</Link>
            <Link className="text-sky-700 underline underline-offset-2" to="/privacy">プライバシーポリシー</Link>
            <Link className="text-sky-700 underline underline-offset-2" to="/commerce">特定商取引法に基づく表記</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
