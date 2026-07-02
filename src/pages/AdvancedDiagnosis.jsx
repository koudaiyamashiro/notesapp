import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { useSubscriptionPlan } from '../hooks/useSubscriptionPlan.js'
import { PLAN_IDS } from '../lib/planCapabilities.js'
import { generateAdvancedDiagnosis } from '../services/advancedDiagnosisService.js'

const initialForm = {
  recentJob: '',
  quantAchievement: '',
  strengthExample: '',
  weaknessExample: '',
  transitionTiming: '',
  desiredSalary: '',
  preferredCompanySize: '',
  preferredCulture: '',
  avoidConditions: '',
  hasResume: '',
  interviewAnxiety: '',
}

export default function AdvancedDiagnosis() {
  const subscription = useSubscriptionPlan()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const canUseAdvancedDiagnosis = subscription.canUseAdvancedDiagnosis
  const planLabel = useMemo(() => {
    if (subscription.plan === PLAN_IDS.PRO) return 'Pro'
    if (subscription.plan === PLAN_IDS.STANDARD) return 'Standard'
    return 'Free'
  }, [subscription.plan])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!canUseAdvancedDiagnosis) {
      setError('詳細診断はStandard以上で利用できます。')
      return
    }

    try {
      setLoading(true)
      const advanced = await generateAdvancedDiagnosis({
        plan: subscription.plan,
        profile: form,
      })
      setResult(advanced)
    } catch (e) {
      setError(e instanceof Error ? e.message : '詳細診断に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F8FAFC] text-slate-950">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Advanced Diagnosis</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">詳細診断</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">追加情報をもとに、詳細市場価値分析・企業比較・90日アクションプランにつながる高度分析の枠を生成します。</p>

          <div className="mt-5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm text-slate-700">
            現在のプラン: <span className="font-semibold text-slate-900">{planLabel}</span>
            <span className="ml-3">利用可否: {canUseAdvancedDiagnosis ? '利用可能' : 'ロック中'}</span>
            {subscription.plan === PLAN_IDS.STANDARD && <span className="ml-3">上限: 月3回</span>}
            {subscription.plan === PLAN_IDS.PRO && <span className="ml-3">上限: 無制限</span>}
          </div>

          {!canUseAdvancedDiagnosis && (
            <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-7 text-slate-700">
              <p className="font-semibold text-slate-900">詳細診断はStandard以上で利用できます</p>
              <p className="mt-1">より精密な市場価値分析・企業比較・キャリアロードマップを確認できます。</p>
              <Link to="/#pricing" className="mt-3 inline-flex rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-400">プランをアップグレードする</Link>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          )}

          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="text-sm text-slate-700">直近の職務内容<textarea name="recentJob" value={form.recentJob} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" rows={4} /></label>
            <label className="text-sm text-slate-700">主要な成果・定量実績<textarea name="quantAchievement" value={form.quantAchievement} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" rows={4} /></label>
            <label className="text-sm text-slate-700">強みの具体例<textarea name="strengthExample" value={form.strengthExample} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" rows={3} /></label>
            <label className="text-sm text-slate-700">苦手領域の具体例<textarea name="weaknessExample" value={form.weaknessExample} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" rows={3} /></label>
            <label className="text-sm text-slate-700">転職希望時期<input name="transitionTiming" value={form.transitionTiming} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" /></label>
            <label className="text-sm text-slate-700">希望年収<input name="desiredSalary" value={form.desiredSalary} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" /></label>
            <label className="text-sm text-slate-700">希望企業規模<input name="preferredCompanySize" value={form.preferredCompanySize} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" /></label>
            <label className="text-sm text-slate-700">希望カルチャー<input name="preferredCulture" value={form.preferredCulture} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" /></label>
            <label className="text-sm text-slate-700">避けたい条件<input name="avoidConditions" value={form.avoidConditions} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" /></label>
            <label className="text-sm text-slate-700">職務経歴書の有無<input name="hasResume" value={form.hasResume} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" /></label>
            <label className="text-sm text-slate-700 sm:col-span-2">面接で不安なこと<textarea name="interviewAnxiety" value={form.interviewAnxiety} onChange={handleChange} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" rows={3} /></label>

            <div className="sm:col-span-2">
              <button type="submit" disabled={loading || !canUseAdvancedDiagnosis} className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? '分析中...' : '詳細診断を開始する'}
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm font-semibold text-slate-900">詳細市場価値分析</p><p className="mt-2 text-sm text-slate-700">{result.advancedMarketValue.summary}</p></article>
              <article className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm font-semibold text-slate-900">スキル棚卸し</p><p className="mt-2 text-sm text-slate-700">{result.skillInventory.strengths.join(' / ')}</p></article>
              <article className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm font-semibold text-slate-900">キャリアリスク</p><p className="mt-2 text-sm text-slate-700">{result.careerRisks.join(' / ')}</p></article>
              <article className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm font-semibold text-slate-900">90日アクションプラン</p><p className="mt-2 text-sm text-slate-700">{result.actionPlan90Days.join(' / ')}</p></article>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
