import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from '../components/Header.jsx'
import Roadmap from '../components/Roadmap.jsx'
import CompanyCard from '../components/CompanyCard.jsx'
import CompanyModal from '../components/CompanyModal.jsx'
import MarketValueModal from '../components/MarketValueModal.jsx'
import { generateCompanyInsights } from '../services/aiAnalysisService.js'
import { analyzeCareerProfile } from '../services/careerAnalysisService.js'
const RadarWrapper = lazy(() => import('../components/RadarWrapper.jsx'))
const StarGrid = lazy(() => import('../components/StarGrid.jsx'))

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

function ProgressBar({ value }) {
  return (
    <div className="rounded-full bg-slate-200 h-4 overflow-hidden">
      <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${value}%` }} />
    </div>
  )
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
        shortReasons: aiCompany.reasonCards?.map((item) => item.title) || company.recommendationReasons?.shortReasons || [],
        comparisonTarget: aiCompany.comparisonTarget || company.recommendationReasons?.comparisonTarget || '',
        comparisonReasons: aiCompany.comparisonReasons || company.recommendationReasons?.comparisonReasons || [],
      },
      recommendation: aiCompany.summary || company.recommendation,
      caution: aiCompany.cautionPoints || company.caution,
      conditionTags: aiCompany.conditionTags || company.conditionTags,
      scoreBreakdown: aiCompany.scoreBreakdown || company.scoreBreakdown,
      careerPathPreview: aiCompany.careerPath || company.careerPathPreview,
      profileHighlights: [
        ...(aiCompany.profileSummary ? [aiCompany.profileSummary.role, aiCompany.profileSummary.level, aiCompany.profileSummary.workStyle].filter(Boolean) : []),
        ...(company.profileHighlights || []),
      ].slice(0, 8),
      aiInsights: aiCompany,
    }
  })
}

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const form = location.state || DEFAULT_FORM
  const result = useMemo(() => analyzeCareerProfile(form), [form])
  const [aiInsights, setAiInsights] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [openCompany, setOpenCompany] = useState(null)
  const [openMarket, setOpenMarket] = useState(false)
  const [highlightedMetric, setHighlightedMetric] = useState('')
  const [showOtherCompanies, setShowOtherCompanies] = useState(false)

  useEffect(() => {
    let active = true
    setAiInsights(null)
    setAiError('')
    setAiLoading(true)

    generateCompanyInsights(form, result.recommendedCompanies, result)
      .then((response) => {
        console.log('generateCompanyInsights response:', response)
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
  }, [form, result.recommendedCompanies])

  const recommendedCompanies = useMemo(
    () => mergeCompanyInsights(result.recommendedCompanies, aiInsights?.companies),
    [aiInsights?.companies, result.recommendedCompanies]
  )

  const selectedCompany = openCompany

  const openModal = (company) => setOpenCompany(company)
  const closeModal = () => setOpenCompany(null)

  return (
    <div className="bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-500">AI分析レポート</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">あなたの市場価値とキャリア戦略</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                現在の職務と志向をもとに生成した、AI風のキャリア戦略ダッシュボードです。
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">同世代比較</p>
              <p className="mt-4 text-3xl font-semibold">{result.generationComparison}%</p>
              <p className="mt-2 text-sm text-slate-300">年収・経験を同世代と比較した適合度</p>
              <div className="mt-6">
                <ProgressBar value={result.generationComparison} />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.95fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">市場価値スコア</p>
                  <p className="mt-4 text-5xl font-semibold text-slate-950">{result.score}</p>
                </div>
                <div className="rounded-[1.5rem] bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700">{form.role || '職種未設定'}</div>
              </div>
              <div className="mt-8 grid gap-3">
                {result.insights.map((insight, index) => (
                  <div key={index} className="rounded-3xl bg-slate-50 px-5 py-4">
                    <p className="text-sm text-slate-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">スキルレーダー</p>
              <Suspense fallback={<div className="mt-6 h-[360px] flex items-center justify-center">読み込み中...</div>}>
                <RadarWrapper data={result.radarData} />
              </Suspense>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">向いている業界ランキング</p>
              <div className="mt-6 space-y-4">
                {result.industries.map((item, index) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950">{index + 1}. {item.label}</p>
                        <p className="text-sm text-slate-500">適性 {item.score}%</p>
                      </div>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase text-sky-700">おすすめ</span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">向いている職種ランキング</p>
              <div className="mt-6 space-y-4">
                {result.roles.map((item, index) => (
                  <div key={item.role} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950">{index + 1}. {item.role}</p>
                        <p className="text-sm text-slate-500">適性 {item.score}%</p>
                      </div>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">おすすめ企業ランキング</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">上位5社の企業候補</h2>
                <p className="mt-2 text-sm text-slate-600">表示は上位5社までに絞り、100社以上の候補から特に合う企業を厳選しています。</p>
                <p className="mt-2 text-xs text-slate-500">{aiLoading ? 'AI分析中...' : aiError || aiInsights?.aiSummary || aiInsights?.summary || 'AI分析中...'}</p>
              </div>
              <button onClick={() => setShowOtherCompanies((prev) => !prev)} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                {showOtherCompanies ? '6〜20位候補を閉じる' : 'その他の候補企業を見る'}
              </button>
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              {recommendedCompanies.map((company, index) => (
                <CompanyCard key={company.name} company={company} rank={index + 1} onDetail={openModal} />
              ))}
            </div>
            {showOtherCompanies && (
              <div className="mt-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">その他の候補企業</p>
                    <p className="mt-1 text-sm text-slate-600">6位〜20位までの候補を一覧表示します。</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4">
                  {result.otherCompanies.map((company, index) => (
                    <div key={company.name} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{index + 6}. {company.name}</p>
                        <p className="mt-2 text-sm text-slate-600">{company.recommendation}</p>
                      </div>
                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">{company.overallFit}%</span>
                        <button onClick={() => openModal(company)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition hover:bg-slate-100">詳細</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">AI分析サマリー</p>
                <p className="mt-2 text-sm text-slate-600">Lambda Function から取得したAI分析結果を表示します。</p>
                <details className="mt-2 rounded-lg border border-dashed border-slate-300 bg-white/60 px-3 py-2 text-[11px] text-slate-500">
                  <summary className="cursor-pointer select-none font-medium text-slate-500">開発用デバッグ情報</summary>
                  <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                    <p>frontendDebugVersion: 2026-06-19-frontend-v1</p>
                    <p>aiAnalysis.debugVersion: {aiInsights?.debugVersion || '-'}</p>
                    <p>aiAnalysis.debugSource: {aiInsights?.debugSource || '-'}</p>
                    <p>aiAnalysis.fallbackReason: {aiInsights?.fallbackReason || '-'}</p>
                  </div>
                </details>
              </div>
            </div>

            {aiLoading && (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600">
                AI分析中...
              </div>
            )}

            {!aiLoading && aiError && (
              <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
                AI分析を取得できませんでした
              </div>
            )}

            {!aiLoading && !aiError && aiInsights && (
              <div className="mt-6 grid gap-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">aiSummary</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{aiInsights.aiSummary || aiInsights.summary || 'AIサマリーはありません。'}</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">riskAnalysis</p>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                      {(aiInsights.riskAnalysis || []).length > 0 ? (aiInsights.riskAnalysis || []).map((item) => (
                        <li key={item}>- {item}</li>
                      )) : <li>リスク分析はありません。</li>}
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">nextActions</p>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                      {(aiInsights.nextActions || []).length > 0 ? (aiInsights.nextActions || []).map((item) => (
                        <li key={item}>- {item}</li>
                      )) : <li>次アクションはありません。</li>}
                    </ul>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">companyInsights</p>
                  <div className="mt-4 grid gap-3">
                    {(aiInsights.companyInsights || aiInsights.companies || []).length > 0 ? (aiInsights.companyInsights || aiInsights.companies || []).map((item) => (
                      <div key={item.companyName} className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">{item.companyName}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.summary || item.recommendationTitle || '概要なし'}</p>
                      </div>
                    )) : <p className="text-sm text-slate-600">企業別インサイトはありません。</p>}
                  </div>
                </div>
              </div>
            )}
          </section>

          <CompanyModal open={!!selectedCompany} onClose={closeModal} company={selectedCompany} />
          <MarketValueModal open={openMarket} onClose={() => setOpenMarket(false)} form={form} result={result} />

          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">企業比較</p>
                <p className="mt-2 text-sm text-slate-600">おすすめ企業のスコアとフィット感をすばやく比較できます。</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setOpenMarket(true)} className="rounded-3xl bg-white px-4 py-2 text-sm border">市場価値の詳細を見る</button>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-white">
              <Suspense fallback={<div className="p-6">読み込み中...</div>}>
                <StarGrid companies={result.comparison} metrics={['年収', '成長環境', '裁量', '安定性', 'カルチャー適合', '働き方適合']} highlighted={highlightedMetric} />
              </Suspense>
              <div className="mt-4 flex flex-wrap gap-2">
                {['年収', '成長環境', '裁量', '安定性', 'カルチャー適合', '働き方適合'].map((m) => (
                  <button key={m} onClick={() => setHighlightedMetric(highlightedMetric === m ? '' : m)} className={`rounded-full px-3 py-2 text-sm ${highlightedMetric === m ? 'bg-sky-500 text-white' : 'bg-slate-100'}`}>{m}</button>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">5年キャリアロードマップ</p>
              <Roadmap steps={result.roadmap} />
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">今からやるべき3つのアクション</p>
              <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
                {result.actions.map((action, index) => (
                  <li key={action} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-start gap-3 text-slate-950">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">{index + 1}</span>
                      <span>{action}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-slate-800" onClick={() => navigate('/assessment')}>
              再診断する
            </button>
            <p className="max-w-2xl text-sm text-slate-600">
              AI風ダミーロジックで結果を生成しています。入力内容に応じて適性と企業候補を反映します。
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
