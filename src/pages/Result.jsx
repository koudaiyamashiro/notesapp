import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from '../components/Header.jsx'
import Roadmap from '../components/Roadmap.jsx'
import CompanyModal from '../components/CompanyModal.jsx'
import MarketValueModal from '../components/MarketValueModal.jsx'
const RadarWrapper = lazy(() => import('../components/RadarWrapper.jsx'))
const StarGrid = lazy(() => import('../components/StarGrid.jsx'))
import { useState } from 'react'

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

const COMPANY_POOL = [
  { name: 'アクセンチュア', key: 'accenture' },
  { name: 'ベイカレント', key: 'baycurrent' },
  { name: 'Dirbato', key: 'dirbato' },
  { name: 'LayerX', key: 'layerx' },
  { name: 'SmartHR', key: 'smarthr' },
  { name: 'サイバーエージェント', key: 'cyberagent' },
  { name: 'リクルート', key: 'recruit' },
  { name: 'Sansan', key: 'sansan' },
  { name: 'freee', key: 'freee' },
  { name: 'メルカリ', key: 'mercari' },
]

const INDUSTRY_LABELS = {
  'ITコンサル': 'ITコンサル',
  SaaS: 'SaaS',
  AI: 'AI',
  DX: 'DX',
  '事業会社': '事業会社',
  金融: '金融',
  製造: '製造',
  人材: '人材',
  広告: '広告',
  その他: 'その他',
}

const METRICS = ['専門性', '推進力', '分析力', 'コミュニケーション', 'マネジメント', '成長意欲']

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function scoreForIndustry(desiredIndustries, target) {
  const hasTarget = desiredIndustries.some((industry) => normalizeText(industry).includes(normalizeText(target)))
  return hasTarget ? 92 : 78
}

function includesIn(field, substr) {
  if (Array.isArray(field)) return field.some((v) => normalizeText(v).includes(normalizeText(substr)))
  return normalizeText(String(field)).includes(normalizeText(substr))
}

function buildRadarData(form) {
  const role = normalizeText(form.role)
  const level = normalizeText(form.level)
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const hasData = strengths.some((s) => normalizeText(s).includes('データ') || normalizeText(s).includes('ai'))
  const hasCommunicate = strengths.some((option) => ['プレゼン', '顧客折衝', 'ファシリテーション'].some((k) => normalizeText(option).includes(normalizeText(k))))
  const hasManage = ['主任', '係長', '課長', '部長', '執行役員', '経営層'].includes(form.level)
  return [
    { subject: '専門性', A: Math.min(100, 60 + (role.includes('エンジニア') ? 18 : role.includes('マーケティング') ? 12 : 8) + (hasData ? 6 : 0)), fullMark: 100 },
    { subject: '推進力', A: Math.min(100, 58 + (strengths.includes('新規開拓') ? 12 : includesIn(form.purpose, '裁量') ? 8 : 4)), fullMark: 100 },
    { subject: '分析力', A: Math.min(100, 54 + (hasData ? 18 : strengths.includes('資料作成') ? 8 : 4)), fullMark: 100 },
    { subject: 'コミュニケーション', A: Math.min(100, 56 + (hasCommunicate ? 16 : 6)), fullMark: 100 },
    { subject: 'マネジメント', A: Math.min(100, 50 + (hasManage ? 20 : 6) + (form.level === 'マネージャー' ? 6 : 0)), fullMark: 100 },
    { subject: '成長意欲', A: Math.min(100, 62 + Math.min(Number(form.experience) * 2, 18) + (includesIn(form.purpose, '成長') ? 8 : 0)), fullMark: 100 },
  ]
}

function buildResult(form) {
  const experience = Number(form.experience) || 0
  const incomeRaw = String(form.income || '')
  const desired = Array.isArray(form.desiredIndustry) ? form.desiredIndustry : []
  const strengths = Array.isArray(form.strengths) ? form.strengths : []

  // map income range to approximate numeric value (万円)
  const incomeMap = {
    '200未満': 150,
    '200-300': 250,
    '300-400': 350,
    '400-500': 450,
    '500-600': 550,
    '600-700': 650,
    '700-800': 750,
    '800-900': 850,
    '900-1000': 950,
    '1000-1200': 1100,
    '1200以上': 1300,
  }
  const income = incomeMap[incomeRaw] || 500

  // Sub-scores (0-100)
  // 1) skillFit (40%) - based on strengths count, experience and role match
  let skillFit = 50 + Math.min(30, strengths.length * 6) + Math.min(10, experience)
  if (normalizeText(form.role).includes('エンジニア') && strengths.some((s) => normalizeText(s).includes('データ'))) skillFit += 6
  skillFit = Math.min(100, Math.round(skillFit))

  // 2) orientationFit (30%) - based on purpose alignment and idealFuture
  let orientationFit = 40
  if (Array.isArray(form.purpose)) {
    orientationFit += Math.min(40, form.purpose.length * 6)
    if (includesIn(form.purpose, '年収') || includesIn(form.purpose, '年収アップ') || includesIn(form.purpose, '市場価値')) orientationFit += 4
  } else {
    orientationFit += includesIn(form.purpose || '', '年収') ? 6 : 0
  }
  orientationFit += String(form.idealFuture || '').length > 20 ? 6 : 0
  orientationFit = Math.min(100, Math.round(orientationFit))

  // 3) marketValue (20%) - based on current income and industry demand
  let marketValue = Math.min(100, Math.round((income / 1300) * 100))
  if (desired.some((d) => normalizeText(d).includes('saas') || normalizeText(d).includes('ai'))) marketValue = Math.min(100, marketValue + 8)

  // 4) workStyleFit (10%) - simple heuristic
  let workFit = 50
  if (String(form.workStyle || '').includes('フルリモート') && desired.some((d) => normalizeText(d).includes('saas') || normalizeText(d).includes('it'))) workFit = 85
  if (String(form.workStyle || '').includes('ハイブリッド')) workFit = 72
  workFit = Math.min(100, Math.round(workFit))

  const finalScore = Math.round(skillFit * 0.4 + orientationFit * 0.3 + marketValue * 0.2 + workFit * 0.1)

  const industries = Object.values(INDUSTRY_LABELS)
    .filter((industry) => industry !== 'その他')
    .map((industry) => ({
      label: industry,
      score: scoreForIndustry(desired, industry),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  // role recommendations (kept simple and deterministic)
  const rolePreferences = [
    { role: 'SaaS営業', score: normalizeText(form.role).includes('営業') ? 92 : 72 },
    { role: 'BizDev', score: (normalizeText(form.role).includes('営業') || normalizeText(form.role).includes('マーケティング')) ? 88 : 68 },
    { role: 'カスタマーサクセス', score: normalizeText(form.role).includes('営業') ? 86 : 68 },
    { role: '事業企画', score: normalizeText(form.role).includes('企画') ? 92 : normalizeText(form.role).includes('コンサル') ? 86 : 70 },
    { role: 'データアナリスト', score: (normalizeText(form.role).includes('マーケ') || normalizeText(form.role).includes('エンジニア') || strengths.some((s) => normalizeText(s).includes('データ'))) ? 90 : 72 },
    { role: 'プロジェクトマネージャー', score: (normalizeText(form.role).includes('コンサル') || normalizeText(form.role).includes('pm') || normalizeText(form.role).includes('エンジニア')) ? 88 : 70 },
    { role: 'ITコンサルタント', score: normalizeText(form.role).includes('コンサル') ? 94 : 74 },
  ]
  const roles = rolePreferences.sort((a, b) => b.score - a.score).slice(0, 5)

  const hasAI = desired.some((item) => normalizeText(item).includes('ai'))
  const hasSaaS = desired.some((item) => normalizeText(item).includes('saas'))
  const recommendations = COMPANY_POOL.filter((company) => {
    if (hasAI && ['layerx', 'dirbato'].includes(company.key)) return true
    if (hasSaaS && ['smarthr', 'sansan', 'freee'].includes(company.key)) return true
    return ['accenture', 'baycurrent', 'cyberagent', 'recruit', 'mercari'].includes(company.key)
  }).slice(0, 5)

  const recommendedCompanies = recommendations.map((company) => {
    const base = {
      accenture: { description: '大規模DX・ITコンサルティングをリードするグローバル企業。', score: 92 },
      baycurrent: { description: '顧客実装力に強みを持つコンサル型SIer。', score: 86 },
      dirbato: { description: 'AI戦略とデータ活用推進を加速する成長企業。', score: 88 },
      layerx: { description: 'ブロックチェーンやAIに挑戦するプロダクト志向の企業。', score: 90 },
      smarthr: { description: 'SaaSプロダクトを軸にHR領域で拡大を続ける企業。', score: 91 },
      cyberagent: { description: '広告×ITで成長環境が豊富なデジタル企業。', score: 89 },
      recruit: { description: '人材から事業開発まで幅広いキャリアを設計できる企業。', score: 93 },
      sansan: { description: 'B2B SaaSで顧客価値を追求する成長フェーズ企業。', score: 90 },
      freee: { description: 'クラウド会計・HR SaaSで柔軟なキャリアを築ける。', score: 92 },
      mercari: { description: 'CtoCプラットフォームでプロダクト成長を牽引。', score: 89 },
    }
    return {
      name: company.name,
      reason: base[company.key].description,
      income: 800 + (company.key === 'accenture' ? 120 : company.key === 'recruit' ? 140 : 80),
      growth: ['優良', '高', '最高', '高', '高'][Math.floor(Math.random() * 5)],
      discretion: ['高', '中', '高', '中', '中'][Math.floor(Math.random() * 5)],
      stability: ['高', '高', '中', '中', '高'][Math.floor(Math.random() * 5)],
      culture: ['挑戦的', 'プロフェッショナル', 'イノベーティブ', '柔軟', 'スピード感'][Math.floor(Math.random() * 5)],
      score: base[company.key].score,
    }
  })

  const compareValues = ['成長環境', '裁量', '安定性', 'カルチャー適合', '総合適性']
  const comparison = recommendedCompanies.map((company) => ({
    name: company.name,
    scores: compareValues.map((metric, index) => ({
      label: metric,
      value: Math.min(100, company.score + (4 - index) * 2 - (metric === '安定性' ? 5 : 0)),
    })),
  }))

  const roadmap = [
    '現在：現職で強みを棚卸し',
    '1年後：おすすめ職種へ転職',
    '3年後：リーダー・PMとして経験蓄積',
    '5年後：事業責任者・専門家として市場価値最大化',
  ]

  const insights = [
    `現在の市場価値スコアは${finalScore}点です。経験${experience}年、年収レンジ${incomeRaw || '未設定'}を基に算出しています。`,
    includesIn(form.purpose, '裁量')
      ? '裁量重視のポジションを狙うことで市場価値をさらに引き上げられます。'
      : '専門性を深めることでキャリアの上昇余地が広がります。',
    `${form.role}の経験を活かすと、${roles[0]?.role || '専門職'}や${roles[1]?.role || 'PM'}への遷移が自然です。`,
  ]

  const actions = [
    `強みの「${strengths.join('、') || 'スキル'}」を求人要件に反映し、適合度の高い案件を3件ピックアップする`,
    `希望業界「${desired.join('、')}」の企業カルチャーと成長戦略を比較分析する`,
    `${form.workStyle === 'フルリモート' ? 'リモート可の企業を優先して検討する' : 'ハイブリッド/出社条件を企業ごとに整理する'}`,
  ]

  return {
    score: `${finalScore}点`,
    generationComparison: Math.min(98, 70 + Math.round(experience * 2 + (income / 100))),
    radarData: buildRadarData(form),
    industries,
    roles,
    recommendedCompanies,
    comparison,
    roadmap,
    insights,
    actions,
  }
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
  const result = useMemo(() => buildResult(form), [form])
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
