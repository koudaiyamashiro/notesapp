import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { useSubscriptionPlan } from '../hooks/useSubscriptionPlan.js'
import { createCustomerPortalSession } from '../services/subscriptionService.js'
import { PLAN_IDS } from '../lib/planCapabilities.js'

function formatDate(value) {
  if (!value) return '未設定'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '未設定'
  return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium' }).format(date)
}

function statusLabel(status) {
  switch (status) {
    case 'active':
      return '有効'
    case 'trialing':
      return 'トライアル中'
    case 'past_due':
      return '支払い遅延'
    case 'canceled':
      return '解約済み'
    case 'unpaid':
      return '未払い'
    case 'incomplete':
      return '処理中'
    default:
      return '未契約'
  }
}

export default function Billing() {
  const subscription = useSubscriptionPlan()
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState('')

  const planLabel = useMemo(() => {
    if (subscription.plan === PLAN_IDS.PRO) return 'Pro'
    if (subscription.plan === PLAN_IDS.STANDARD) return 'Standard'
    return 'Free'
  }, [subscription.plan])

  const handleOpenPortal = async () => {
    setPortalError('')
    try {
      setPortalLoading(true)
      const session = await createCustomerPortalSession()
      window.location.href = session.url
    } catch (e) {
      setPortalError(e instanceof Error ? e.message : '契約管理ページを開けませんでした。')
      setPortalLoading(false)
    }
  }

  const advancedDiagnosisLimit = subscription.capabilities?.advancedDiagnosisLimit

  return (
    <div className="bg-[#F8FAFC] text-slate-950">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Billing</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">契約管理</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">現在のプラン、課金状態、契約管理導線を確認できます。</p>

          {subscription.error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {subscription.error}
            </div>
          )}

          {portalError && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {portalError}
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">現在のプラン</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{planLabel}</p>
              <p className="mt-2 text-sm text-slate-600">詳細診断: {subscription.capabilities?.canUseAdvancedDiagnosis ? (advancedDiagnosisLimit === 'unlimited' ? '無制限' : `月${advancedDiagnosisLimit}回`) : '利用不可'}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">契約ステータス</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{statusLabel(subscription.status)}</p>
              <p className="mt-2 text-sm text-slate-600">次回更新日: {formatDate(subscription.currentPeriodEnd)}</p>
              <p className="mt-1 text-sm text-slate-600">解約予定: {subscription.cancelAtPeriodEnd ? 'あり' : 'なし'}</p>
            </article>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleOpenPortal}
              disabled={portalLoading || subscription.plan === PLAN_IDS.FREE}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {portalLoading ? '読み込み中...' : '契約管理を開く'}
            </button>
            <Link to="/#pricing" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              プランを確認する
            </Link>
            <Link to="/advanced-diagnosis" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              詳細診断へ進む
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">利用可能な機能</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>- 詳細市場価値分析: {subscription.capabilities?.canUseDetailedMarketValue ? '利用可能' : 'ロック中'}</li>
              <li>- 企業比較: {subscription.capabilities?.canUseCompanyComparison ? '利用可能' : 'ロック中'}</li>
              <li>- AIキャリア相談: {subscription.capabilities?.aiChatLimit === 'unlimited' ? '無制限' : `${subscription.capabilities?.aiChatLimit || 0}回`}</li>
              <li>- 職務経歴書作成: {subscription.capabilities?.canUseResumeBuilder ? '利用可能' : 'ロック中'}</li>
              <li>- 面接対策: {subscription.capabilities?.canUseInterviewPrep ? '利用可能' : 'ロック中'}</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
