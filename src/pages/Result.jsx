import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import CompanyModal from '../components/CompanyModal.jsx'
import { generateCompanyInsights } from '../services/aiAnalysisService.js'
import { analyzeCareerProfile } from '../services/careerAnalysisService.js'
import { createDiagnosisHistory } from '../services/diagnosisHistoryService.js'
import { useAuth } from '../auth/AuthProvider.jsx'
import ResultSidebarNav from '../components/result/ResultSidebarNav.jsx'
import MarketValueHero from '../components/result/MarketValueHero.jsx'
import StrengthRadarPanel from '../components/result/StrengthRadarPanel.jsx'
import RankingPanels from '../components/result/RankingPanels.jsx'
import CompanyRecommendationSection from '../components/result/CompanyRecommendationSection.jsx'
import CompanyComparisonTable from '../components/result/CompanyComparisonTable.jsx'
import RoadmapTimelineSection from '../components/result/RoadmapTimelineSection.jsx'
import DecisionPanels from '../components/result/DecisionPanels.jsx'
import { useSubscriptionPlan } from '../hooks/useSubscriptionPlan.js'
import { PLAN_IDS } from '../lib/planCapabilities.js'

const DEFAULT_FORM = {
  age: '32',
  role: 'エンジニア',
  level: 'リーダー',
  experience: '6',
  income: '850',
  strengths: ['要件定義', 'データ分析'],
  weaknesses: ['単純作業'],
  otherStrength: '',
  otherWeakness: '',
  purpose: '裁量を増やしたい',
  desiredIndustry: ['SaaS', 'AI'],
  workStyle: 'ハイブリッド',
  idealFuture: '事業責任者として組織を牽引したい',
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getPercentileText(score) {
  const top = Math.max(10, Math.min(45, 100 - Math.round(score * 0.9)))
  return `上位${top}%`
}

function getSalaryProjection(income) {
  const map = {
    '200未満': { current: '200万未満', y3: '300万〜450万円', y5: '450万〜600万円' },
    '200-300': { current: '200万〜300万円', y3: '350万〜500万円', y5: '500万〜700万円' },
    '300-400': { current: '300万〜400万円', y3: '450万〜600万円', y5: '600万〜800万円' },
    '400-500': { current: '400万〜500万円', y3: '550万〜700万円', y5: '700万〜900万円' },
    '500-600': { current: '500万〜600万円', y3: '650万〜800万円', y5: '800万〜1000万円' },
    '600-700': { current: '600万〜700万円', y3: '750万〜900万円', y5: '900万〜1100万円' },
    '700-800': { current: '700万〜800万円', y3: '850万〜1000万円', y5: '1000万〜1200万円' },
    '800-900': { current: '800万〜900万円', y3: '900万〜1100万円', y5: '1100万〜1300万円' },
    '900-1000': { current: '900万〜1000万円', y3: '1000万〜1200万円', y5: '1200万〜1400万円' },
    '1000-1200': { current: '1000万〜1200万円', y3: '1100万〜1300万円', y5: '1300万〜1600万円' },
    '1200以上': { current: '1200万円以上', y3: '1300万〜1600万円', y5: '1500万〜1800万円' },
  }
  return map[String(income)] || { current: '600万〜800万円', y3: '750万〜950万円', y5: '900万〜1150万円' }
}

function parseRangeMid(value) {
  const match = String(value || '').match(/(\d+)[^\d]+(\d+)/)
  if (!match) return { min: 0, max: 0 }
  return { min: Number(match[1]), max: Number(match[2]) }
}

function mergeCompanyInsights(baseCompanies, aiCompanies = []) {
  return baseCompanies.map((company) => {
    const aiCompany = aiCompanies.find((item) => item.companyName === company.name)
    const aiRecommendation = aiCompanies.find((item) => item.companyName === company.name)
    if (!aiCompany) return company

    return {
      ...company,
      recommendationReasons: {
        ...(company.recommendationReasons || {}),
        reasonCards: aiCompany.reasonCards || company.recommendationReasons?.reasonCards || [],
      },
      recommendation: aiCompany.summary || company.recommendation,
      caution: aiCompany.cautionPoints || company.caution,
      conditionTags: aiCompany.conditionTags || company.conditionTags,
      scoreBreakdown: aiCompany.scoreBreakdown || company.scoreBreakdown,
      careerPathPreview: aiCompany.careerPath || company.careerPathPreview,
      aiRecommendation,
      aiInsights: aiCompany,
    }
  })
}

function buildRadarData(radarSource = [], form = {}) {
  const get = (keyword) => {
    const row = radarSource.find((item) => String(item.subject || '').includes(keyword))
    return {
      you: Number(row?.A || 60),
      avg: Number(row?.B || 58),
    }
  }

  const hasAiStrength = (form.strengths || []).some((item) => String(item).toLowerCase().includes('ai') || String(item).toLowerCase().includes('データ'))
  const hasPlanStrength = (form.strengths || []).some((item) => String(item).includes('要件') || String(item).includes('企画'))

  const analysis = get('分析')
  const management = get('マネジ')
  const communication = get('コミュ')
  const execution = get('推進')
  const specialization = get('専門')

  return [
    { axis: '論理思考', you: analysis.you, avg: analysis.avg },
    { axis: '分析力', you: clamp(analysis.you + 2, 0, 100), avg: clamp(analysis.avg + 2, 0, 100) },
    { axis: 'リーダーシップ', you: clamp(execution.you + 3, 0, 100), avg: clamp(execution.avg + 2, 0, 100) },
    { axis: 'マネジメント', you: management.you, avg: management.avg },
    { axis: '営業力', you: clamp(execution.you - 2, 0, 100), avg: clamp(execution.avg, 0, 100) },
    { axis: '企画力', you: clamp(specialization.you + (hasPlanStrength ? 6 : 0), 0, 100), avg: specialization.avg },
    { axis: 'AI活用', you: clamp(analysis.you + (hasAiStrength ? 10 : 0), 0, 100), avg: clamp(analysis.avg - 4, 0, 100) },
    { axis: 'コミュニケーション', you: communication.you, avg: communication.avg },
  ]
}

function buildHistoryTitle(form = {}) {
  const role = String(form.role || '未設定職種')
  const industries = Array.isArray(form.desiredIndustry) ? form.desiredIndustry : []
  const industry = industries[0] || '業界未設定'
  return `${role}・${industry}志望の診断`
}

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const subscription = useSubscriptionPlan()

  const statePayload = location.state && typeof location.state === 'object' ? location.state : null
  const historyPayload = statePayload?.__historyPayload || null
  const isHistoryView = Boolean(historyPayload)

  const inputForm = isHistoryView
    ? historyPayload?.profile || DEFAULT_FORM
    : statePayload || null

  const hasDiagnosisData = Boolean(inputForm)
  const form = hasDiagnosisData ? inputForm : DEFAULT_FORM
  const analyzedResult = useMemo(() => analyzeCareerProfile(form), [form])
  const result = isHistoryView && historyPayload?.result ? historyPayload.result : analyzedResult

  const initialAiFromHistory = null
  const historyTopCompanies = isHistoryView && Array.isArray(historyPayload?.topCompanies) ? historyPayload.topCompanies : []

  const [aiInsights, setAiInsights] = useState(initialAiFromHistory)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [saveStatus, setSaveStatus] = useState('idle')
  const [saveMessage, setSaveMessage] = useState('')
  const [activeSectionId, setActiveSectionId] = useState('overview')
  const [openCompany, setOpenCompany] = useState(null)

  useEffect(() => {
    if (!hasDiagnosisData) {
      setAiInsights(null)
      setAiError('')
      setAiLoading(false)
      return
    }

    if (isHistoryView) {
      setAiInsights(null)
      setAiError('')
      setAiLoading(false)
      return
    }

    let active = true
    setAiInsights(null)
    setAiError('')
    setAiLoading(true)

    generateCompanyInsights(form, result?.recommendedCompanies || [], result || {})
      .then((response) => {
        if (active) {
          setAiInsights(response)
          setAiLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setAiInsights(null)
          setAiError('AI分析を取得できませんでした')
          setAiLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [form, hasDiagnosisData, result, isHistoryView])

  const recommendedCompanies = useMemo(() => {
    if (historyTopCompanies.length > 0) return historyTopCompanies
    return mergeCompanyInsights(result?.recommendedCompanies || [], aiInsights?.companies || [])
  }, [aiInsights?.companies, result?.recommendedCompanies, historyTopCompanies])

  const marketMetrics = useMemo(() => {
    const score = Number(aiInsights?.marketValueAnalysis?.score || aiInsights?.marketValue?.score || result.rawScore || 0)
    const percentileText = aiInsights?.marketValue?.percentile || getPercentileText(score)
    const nationalRank = aiInsights?.marketValueAnalysis?.nationalRank || `約${Math.max(1200, 22 * 280).toLocaleString()}位 / 120,000人`
    const sameAgeTop = Math.max(8, 100 - Number(result.generationComparison || 75))
    const sameAgeRank = `上位${sameAgeTop}%`
    const salaryFallback = getSalaryProjection(form.income)
    const salaryCurrent = aiInsights?.salaryProjection?.currentRange || aiInsights?.marketValue?.currentEstimatedSalaryRange || salaryFallback.current
    const salary3y = aiInsights?.salaryProjection?.after3YearsRange || aiInsights?.marketValue?.threeYearSalaryRange || salaryFallback.y3
    const salary5y = aiInsights?.salaryProjection?.after5YearsRange || aiInsights?.marketValue?.fiveYearSalaryRange || salaryFallback.y5

    return {
      score,
      deviation: Number(aiInsights?.marketValueAnalysis?.deviation || clamp(Math.round((score - 50) * 0.6 + 50), 35, 75)),
      nationalRank,
      sameAgeRank,
      salaryCurrent,
      salary3y,
      salary5y,
    }
  }, [aiInsights?.marketValue, aiInsights?.marketValueAnalysis, aiInsights?.salaryProjection, form.income, result.generationComparison, result.rawScore])

  const salarySeries = useMemo(() => {
    const current = parseRangeMid(marketMetrics.salaryCurrent)
    const y3 = parseRangeMid(marketMetrics.salary3y)
    const y5 = parseRangeMid(marketMetrics.salary5y)

    return [
      { label: '現在', min: current.min, max: current.max },
      { label: '3年後', min: y3.min, max: y3.max },
      { label: '5年後', min: y5.min, max: y5.max },
    ]
  }, [marketMetrics.salary3y, marketMetrics.salary5y, marketMetrics.salaryCurrent])

  const successRates = useMemo(() => {
    const base = clamp(Math.round(Number(aiInsights?.successProbability?.current || result.rawScore || 65) * 1), 45, 88)
    return [
      { label: '現在応募した場合', value: base },
      { label: '半年後', value: clamp(Number(aiInsights?.successProbability?.after6Months || base + 8), 52, 93) },
      { label: '1年後', value: clamp(Number(aiInsights?.successProbability?.after1Year || base + 14), 58, 96) },
    ]
  }, [aiInsights?.successProbability, result.rawScore])

  const radarData = useMemo(() => buildRadarData(result.radarData, form), [form, result.radarData])

  const industryReasons = useMemo(() => {
    const preferred = Array.isArray(form.desiredIndustry) ? form.desiredIndustry : []
    return Object.fromEntries(
      (result.industries || []).map((item) => [
        item.label,
        preferred.some((d) => item.label.includes(d) || d.includes(item.label))
          ? `希望業界との一致が高く、経験を横展開しやすい領域です。`
          : `あなたの強みと市場需要の交点が大きく、転職後に成果を出しやすい業界です。`,
      ])
    )
  }, [form.desiredIndustry, result.industries])

  const roleReasons = useMemo(() => {
    const currentRole = String(form.role || '')
    return Object.fromEntries(
      (result.roles || []).map((item) => [
        item.role,
        currentRole && item.role.includes(currentRole)
          ? `現在の職種経験を活かしつつ、年収と裁量を伸ばしやすいポジションです。`
          : `強みと志向の一致率が高く、中長期の市場価値を上げやすい職種です。`,
      ])
    )
  }, [form.role, result.roles])

  const roadmapItems = useMemo(() => {
    const aiSteps = Array.isArray(aiInsights?.careerRoadmapDetails) ? aiInsights.careerRoadmapDetails : []
    const defaults = [
      {
        period: '半年後',
        title: '応募戦略を固める',
        tasks: ['実績をKPIで棚卸しする', '職務経歴書をターゲット企業向けに調整', '企業研究テンプレートを作成'],
      },
      {
        period: '1年後',
        title: '強み領域で成果を再現',
        tasks: ['入社先での初期成果を数値化', '上司評価と自己評価を接続', '次の役割拡張に向けた課題を整理'],
      },
      {
        period: '3年後',
        title: 'リード経験を積む',
        tasks: ['チーム/プロジェクト推進を担当', '難易度の高い課題に挑戦', '社内外で専門性を発信'],
      },
      {
        period: '5年後',
        title: '事業価値を担うポジションへ',
        tasks: ['事業KPI責任のある役割へ遷移', '後進育成と組織成果を両立', '次のキャリア選択肢を複線化'],
      },
    ]

    return defaults.map((item, idx) => {
      const ai = aiSteps[idx]
      return {
        period: ai?.period || item.period,
        title: ai?.title || item.title,
        tasks: Array.isArray(ai?.actions) && ai.actions.length > 0 ? ai.actions.slice(0, 3) : item.tasks,
      }
    })
  }, [aiInsights?.careerRoadmapDetails])

  const aiSummary = historyPayload?.aiSummary || aiInsights?.aiSummary || aiInsights?.summary || result.insights?.[0] || '現時点では市場価値が高く、準備次第でより良い条件の転職が狙えます。'
  const positives = (aiInsights?.careerArchetype?.strengths || result.insights || []).slice(0, 3)
  const warningCandidates = (aiInsights?.riskAnalysis || aiInsights?.careerArchetype?.risks || []).slice(0, 3)
  const warnings = warningCandidates.length > 0
    ? warningCandidates
    : ['訴求ポイントが散らばると面接で強みが伝わりにくくなるため、軸の統一が必要です。', '希望条件を増やしすぎると選考母数が減るため、優先順位を決める必要があります。', '市場変動により採用要件が短期で変わるため、情報の更新頻度を上げる必要があります。']

  const risks = [
    { title: '向いていない理由', detail: warnings[0] || '現時点では強みの再現性を示す具体エピソードが不足しています。' },
    { title: '転職時の注意点', detail: warnings[1] || '応募企業ごとに訴求ポイントを調整しないと通過率が下がる可能性があります。' },
    { title: '市場リスク', detail: warnings[2] || '市況変化により採用ポジションの難易度が変動するため、応募タイミングの見極めが重要です。' },
  ]

  const nextActionTexts = (aiInsights?.nextActions || result.actions || []).slice(0, 6)
  const actionTitles = ['履歴書作成', '職務経歴書改善', '面接対策', '企業研究', 'AI相談', 'さらに詳細診断を行う']
  const isFreePlan = subscription.plan === PLAN_IDS.FREE || !subscription.isPaid
  const advancedDiagnosisCta = isFreePlan ? 'Standard以上で利用可能' : '詳細診断を開始する'
  const advancedDiagnosisDetail = isFreePlan
    ? '詳細診断はStandard以上で利用できます。より精密な市場価値分析・企業比較・キャリアロードマップを確認できます。'
    : subscription.plan === PLAN_IDS.STANDARD
      ? '詳細診断を開始できます。Standardプランは月3回まで利用可能です。'
      : '詳細診断を開始できます。Proプランは無制限で利用可能です。'

  const actions = actionTitles.map((title, idx) => ({
    title,
    time: idx < 2 ? '60分' : idx < 4 ? '45分' : '30分',
    detail:
      idx === 5
        ? advancedDiagnosisDetail
        : nextActionTexts[idx] || '転職成功確率を上げるための実行アクションを具体化してください。',
    cta: idx === 5 ? advancedDiagnosisCta : idx === 4 ? 'AIに相談する' : '着手する',
    href: idx === 5 ? (isFreePlan ? '/#pricing' : '/advanced-diagnosis') : '/assessment',
    locked: idx === 5 ? isFreePlan : false,
  }))

  const aiStrategySummary = useMemo(() => {
    const topIndustry = result.industries?.[0]?.label || '-'
    const topRole = result.roles?.[0]?.role || '-'
    const topCompany = recommendedCompanies?.[0]?.name || '-'
    return {
      summary: aiSummary,
      marketAndStrengths: [
        `市場価値スコアは ${marketMetrics.score} / 100（偏差値 ${marketMetrics.deviation}）です。`,
        positives[0] || '強みの再現性が高く、企業との接点を作りやすい状態です。',
        positives[1] || '経験領域と市場需要の重なりが大きく、短期で成果を示しやすいです。',
      ],
      fitSummary: [
        `向いている業界は「${topIndustry}」、向いている職種は「${topRole}」が最上位です。`,
        '応募戦略は上位2-3業界・職種に絞ると選考密度と準備品質を両立できます。',
      ],
      companyConnections: [
        `おすすめ企業1位は「${topCompany}」。強みとキャリア志向の接点が最も大きい候補です。`,
        '企業比較では年収/成長性/働き方を同じ軸で比較すると意思決定の精度が上がります。',
      ],
      cautions: warnings.slice(0, 3),
      nextStrategies: [
        actions[0]?.detail || '職務経歴書の訴求軸を先に統一する。',
        actions[1]?.detail || '面接で伝える成果を定量化する。',
        actions[5]?.detail || '追加診断で精度を上げる。',
      ],
    }
  }, [actions, aiSummary, marketMetrics.deviation, marketMetrics.score, positives, recommendedCompanies, result.industries, result.roles, warnings])

  const marketValueEvidence = aiInsights?.marketValueAnalysis || null
  const salaryProjectionDetails = aiInsights?.salaryProjection || null
  const successProbabilityDetails = aiInsights?.successProbability || null

  useEffect(() => {
    if (!hasDiagnosisData || isHistoryView || !user?.id) return
    if (saveStatus !== 'idle') return

    const payload = {
      userId: String(user.id),
      userEmail: String(user.email || ''),
      title: buildHistoryTitle(form),
      profileJson: JSON.stringify(form),
      topCompaniesJson: JSON.stringify((recommendedCompanies || []).slice(0, 5)),
      aiSummary,
      marketValueScore: Number(marketMetrics.score || 0),
      successProbability: Number(successRates?.[0]?.value || 0),
    }

    setSaveStatus('saving')
    setSaveMessage('診断履歴を保存しています...')

    createDiagnosisHistory(payload)
      .then(() => {
        setSaveStatus('success')
        setSaveMessage('診断履歴を保存しました。')
      })
      .catch((error) => {
        console.error('DiagnosisHistory save failed:', error, 'payload:', payload)
        setSaveStatus('error')
        setSaveMessage('診断履歴の保存に失敗しました。結果表示は続行できます。')
      })
  }, [
    hasDiagnosisData,
    isHistoryView,
    user?.id,
    user?.email,
    saveStatus,
    form,
    result,
    recommendedCompanies,
    aiInsights,
    aiSummary,
    positives,
    warnings,
    aiStrategySummary,
    marketMetrics.score,
    successRates,
  ])

  const navSections = useMemo(
    () => [
      { id: 'overview', label: 'サマリー' },
      { id: 'strength', label: '強み・弱み分析' },
      { id: 'rankings', label: '業界・職種ランキング' },
      { id: 'companies', label: 'おすすめ企業' },
      { id: 'compare', label: '企業比較' },
      { id: 'roadmap', label: 'ロードマップ' },
      { id: 'ai-summary', label: 'AI総評' },
      { id: 'risk', label: 'リスク分析' },
      { id: 'actions', label: '次のアクション' },
    ],
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ids = navSections.map((item) => item.id)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) {
          setActiveSectionId(visible[0].target.id)
        }
      },
      {
        root: null,
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.15, 0.25, 0.4],
      }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [navSections])

  const jumpSection = (id) => {
    const target = document.getElementById(id)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSectionId(id)
  }

  if (!hasDiagnosisData) {
    return (
      <div className="bg-slate-50 text-slate-950">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-10">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
            <h1 className="text-2xl font-semibold text-slate-900">診断データが見つかりません。もう一度診断してください</h1>
            <p className="mt-3 text-sm text-slate-600">/result に直接アクセスしたため、表示に必要な入力データを復元できませんでした。</p>
            <button
              onClick={() => navigate('/assessment')}
              className="mt-6 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              診断画面へ戻る
            </button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-[#F8FAFC] text-slate-950">
      <Header />
      <main className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-10">
        {aiLoading && (
          <div className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">AI分析を更新しています...</div>
        )}
        {!aiLoading && aiError && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{aiError}</div>
        )}
        {saveStatus !== 'idle' && !isHistoryView && (
          <div
            className={`mb-5 rounded-xl px-4 py-3 text-sm ${
              saveStatus === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                : saveStatus === 'error'
                  ? 'border border-rose-200 bg-rose-50 text-rose-700'
                  : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            {saveMessage}
          </div>
        )}
        {isHistoryView && (
          <div className="mb-5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
            履歴から読み込んだ診断結果を表示しています。
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <ResultSidebarNav
            sections={navSections}
            activeSectionId={activeSectionId}
            onJumpSection={jumpSection}
            summary={{
              aiSummaryShort: aiSummary,
              topIndustry: result.industries?.[0]?.label || '-',
              topRole: result.roles?.[0]?.role || '-',
              topCompany: recommendedCompanies?.[0]?.name || '-',
              successRate: `${successRates?.[0]?.value || '-'}%`,
              topAction: actions?.[0]?.title || '-',
            }}
          />

          <div className="space-y-5">
            <MarketValueHero
              marketMetrics={marketMetrics}
              salarySeries={salarySeries}
              successRates={successRates}
              marketValueEvidence={marketValueEvidence}
              salaryProjectionDetails={salaryProjectionDetails}
              successProbabilityDetails={successProbabilityDetails}
            />
            <StrengthRadarPanel data={radarData} onOpenDetailed={() => navigate('/advanced-diagnosis')} />
            <RankingPanels
              industries={result.industries || []}
              roles={result.roles || []}
              industryReasons={industryReasons}
              roleReasons={roleReasons}
            />
            <CompanyRecommendationSection companies={recommendedCompanies} onOpenCompany={(company) => setOpenCompany(company)} />
            <CompanyComparisonTable companies={isFreePlan ? recommendedCompanies.slice(0, 3) : recommendedCompanies} />
            <RoadmapTimelineSection roadmapItems={roadmapItems} />
            <DecisionPanels
              aiSummary={aiStrategySummary}
              positives={positives.length > 0 ? positives : ['強みが明確で、候補企業との一致率が高いです。']}
              warnings={warnings}
              risks={risks}
              actions={actions}
            />
          </div>
        </div>

        <CompanyModal open={Boolean(openCompany)} onClose={() => setOpenCompany(null)} company={openCompany} />
      </main>
    </div>
  )
}
