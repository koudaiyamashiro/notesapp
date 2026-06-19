import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from '../components/Header.jsx'
import Roadmap from '../components/Roadmap.jsx'
import CompanyModal from '../components/CompanyModal.jsx'
import MarketValueModal from '../components/MarketValueModal.jsx'
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

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const form = location.state || DEFAULT_FORM
  const result = useMemo(() => analyzeCareerProfile(form), [form])
  const [openCompany, setOpenCompany] = useState(null)
  const [openMarket, setOpenMarket] = useState(false)
  const [highlightedMetric, setHighlightedMetric] = useState('')

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
            <div className="grid gap-4 lg:grid-cols-2">
              {result.recommendedCompanies.map((company) => (
                <div key={company.name} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{company.name}</p>
                      <h3 className="mt-3 text-xl font-semibold text-slate-950">{company.reason}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Score {company.score}</div>
                      <button onClick={() => openModal(company)} className="rounded-full bg-white/80 px-3 py-2 text-sm border">企業詳細</button>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">年収ポテンシャル: {company.income}万円</div>
                    <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">成長環境: {company.growth}</div>
                    <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">裁量: {company.discretion}</div>
                    <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">安定性: {company.stability}</div>
                    <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">カルチャー: {company.culture}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CompanyModal open={!!openCompany} onClose={closeModal} company={openCompany} />
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
                <StarGrid companies={result.comparison} metrics={['成長環境', '裁量', '安定性', 'カルチャー適合', '総合適性']} highlighted={highlightedMetric} />
              </Suspense>
              <div className="mt-4 flex flex-wrap gap-2">
                {['成長環境', '裁量', '安定性', 'カルチャー適合', '総合適性'].map((m) => (
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
