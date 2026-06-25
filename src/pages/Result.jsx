import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import { generateCompanyInsights } from '../services/aiAnalysisService.js'
import { analyzeCareerProfile } from '../services/careerAnalysisService.js'
import ResultSidebarNav from '../components/result/ResultSidebarNav.jsx'
import MarketValueHero from '../components/result/MarketValueHero.jsx'
import StrengthRadarPanel from '../components/result/StrengthRadarPanel.jsx'
import RankingPanels from '../components/result/RankingPanels.jsx'
import CompanyRecommendationSection from '../components/result/CompanyRecommendationSection.jsx'
import CompanyComparisonTable from '../components/result/CompanyComparisonTable.jsx'
import RoadmapTimelineSection from '../components/result/RoadmapTimelineSection.jsx'
import DecisionPanels from '../components/result/DecisionPanels.jsx'

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

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const hasDiagnosisData = Boolean(location.state && typeof location.state === 'object')
  const form = hasDiagnosisData ? location.state : DEFAULT_FORM
  const result = useMemo(() => analyzeCareerProfile(form), [form])

  const [aiInsights, setAiInsights] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    if (!hasDiagnosisData) {
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
  }, [form, hasDiagnosisData, result])

  const recommendedCompanies = useMemo(
    () => mergeCompanyInsights(result?.recommendedCompanies || [], aiInsights?.companies || []),
    [aiInsights?.companies, result?.recommendedCompanies]
  )

  const marketMetrics = useMemo(() => {
    const score = Number(aiInsights?.marketValue?.score || result.rawScore || 0)
    const percentileText = aiInsights?.marketValue?.percentile || getPercentileText(score)
    const percentileMatch = percentileText.match(/(\d+)/)
    const percentile = Number(percentileMatch?.[1] || 22)
    const nationalRank = `約${Math.max(1200, percentile * 280).toLocaleString()}位 / 120,000人`
    const sameAgeTop = Math.max(8, 100 - Number(result.generationComparison || 75))
    const sameAgeRank = `上位${sameAgeTop}%`
    const salaryFallback = getSalaryProjection(form.income)
    const salaryCurrent = aiInsights?.marketValue?.currentEstimatedSalaryRange || salaryFallback.current
    const salary3y = aiInsights?.marketValue?.threeYearSalaryRange || salaryFallback.y3
    const salary5y = aiInsights?.marketValue?.fiveYearSalaryRange || salaryFallback.y5

    return {
      score,
      deviation: clamp(Math.round((score - 50) * 0.6 + 50), 35, 75),
      nationalRank,
      sameAgeRank,
      salaryCurrent,
      salary3y,
      salary5y,
    }
  }, [aiInsights?.marketValue, form.income, result.generationComparison, result.rawScore])

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
    const base = clamp(Math.round(Number(result.rawScore || 65) * 0.82), 45, 88)
    return [
      { label: '現在応募した場合', value: base },
      { label: '半年後', value: clamp(base + 8, 52, 93) },
      { label: '1年後', value: clamp(base + 14, 58, 96) },
    ]
  }, [result.rawScore])

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

  const aiSummary = aiInsights?.aiSummary || aiInsights?.summary || result.insights?.[0] || '現時点では市場価値が高く、準備次第でより良い条件の転職が狙えます。'
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

  const nextActionTexts = (aiInsights?.nextActions || result.actions || []).slice(0, 5)
  const actionTitles = ['履歴書作成', '職務経歴書改善', '面接対策', '企業研究', 'AI相談']
  const actions = actionTitles.map((title, idx) => ({
    title,
    time: idx < 2 ? '60分' : idx < 4 ? '45分' : '30分',
    detail: nextActionTexts[idx] || '転職成功確率を上げるための実行アクションを具体化してください。',
    cta: idx === 4 ? 'AIに相談する' : '着手する',
  }))

  const navSections = [
    { id: 'overview', label: 'サマリー' },
    { id: 'strength', label: '強み・弱み分析' },
    { id: 'rankings', label: '業界・職種ランキング' },
    { id: 'companies', label: 'おすすめ企業' },
    { id: 'compare', label: '企業比較' },
    { id: 'roadmap', label: 'ロードマップ' },
    { id: 'ai-summary', label: 'AI総評' },
    { id: 'risk', label: 'リスク分析' },
    { id: 'actions', label: '次のアクション' },
  ]

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

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <ResultSidebarNav
            sections={navSections}
            summary={{
              score: `${marketMetrics.score} / 100`,
              topIndustry: result.industries?.[0]?.label || '-',
              topRole: result.roles?.[0]?.role || '-',
              topCompany: recommendedCompanies?.[0]?.name || '-',
            }}
          />

          <div className="space-y-5">
            <MarketValueHero marketMetrics={marketMetrics} salarySeries={salarySeries} successRates={successRates} />
            <StrengthRadarPanel data={radarData} />
            <RankingPanels
              industries={result.industries || []}
              roles={result.roles || []}
              industryReasons={industryReasons}
              roleReasons={roleReasons}
            />
            <CompanyRecommendationSection companies={recommendedCompanies} />
            <CompanyComparisonTable companies={recommendedCompanies} />
            <RoadmapTimelineSection roadmapItems={roadmapItems} />
            <DecisionPanels
              aiSummary={aiSummary}
              positives={positives.length > 0 ? positives : ['強みが明確で、候補企業との一致率が高いです。']}
              warnings={warnings}
              risks={risks}
              actions={actions}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
