import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import ScoreCard from '../components/ScoreCard.jsx'
import CompanyCard from '../components/CompanyCard.jsx'
import Roadmap from '../components/Roadmap.jsx'

const DEFAULT_FORM = {
  age: '32',
  industry: 'ITサービス',
  role: 'プロジェクトマネージャー',
  experience: '6',
  income: '850',
  skills: '要件定義、チームマネジメント、データ分析',
  weakTasks: '細かい単純作業、長時間ルーティン',
  purpose: 'キャリアの幅を広げ、裁量を高めたい',
  desiredIndustry: 'SaaS / クラウド',
  workStyle: 'ハイブリッド',
  idealFuture: '事業責任者として組織を牽引する',
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function buildResult(form) {
  const experience = Number(form.experience) || 0
  const income = Number(form.income) || 500
  const skills = normalizeText(form.skills)
  const weakTasks = normalizeText(form.weakTasks)
  const desiredIndustry = normalizeText(form.desiredIndustry)
  const purpose = normalizeText(form.purpose)
  const workStyle = normalizeText(form.workStyle)
  const role = normalizeText(form.role)

  let score = 50 + Math.min(experience * 3, 24)
  score += income >= 1000 ? 10 : income >= 700 ? 6 : 3
  score += skills.includes('マネジメント') || skills.includes('管理') ? 5 : 2
  score -= weakTasks.includes('単純') ? 2 : 0
  score -= weakTasks.includes('長時間') ? 1 : 0
  score = clamp(score, 48, 96)

  const industries = []
  if (desiredIndustry.includes('saa')) {
    industries.push('SaaS / クラウド', 'AI・データ分析', '事業会社DX')
  } else if (desiredIndustry.includes('ai')) {
    industries.push('AI・データ分析', 'SaaS / クラウド', 'FinTech')
  } else if (desiredIndustry.includes('コンサル') || normalizeText(form.industry).includes('コンサル')) {
    industries.push('ITコンサル', '戦略コンサル', 'DX推進')
  } else if (workStyle.includes('リモート')) {
    industries.push('SaaS / クラウド', 'リモートサービス', 'AI・データ分析')
  } else {
    industries.push('ITコンサル', '事業会社DX', 'SaaS / クラウド')
  }

  const roles = []
  if (workStyle.includes('リモート')) {
    roles.push('プロダクトマネージャー', 'データアナリスト', 'カスタマーサクセス')
  } else if (purpose.includes('裁量') || purpose.includes('責任')) {
    roles.push('事業企画', 'ITコンサルタント', 'プロジェクトマネージャー')
  } else {
    roles.push('ITコンサルタント', 'プロジェクトマネージャー', 'BizDev')
  }
  if (skills.includes('データ')) {
    roles.unshift('データアナリスト')
  }
  if (skills.includes('リード') || skills.includes('マネジメント')) {
    roles.unshift('プロジェクトマネージャー')
  }
  const uniqueRoles = [...new Set(roles)].slice(0, 5)

  const recommendedCompanies = [
    {
      name: 'キャリア・ストラテジー',
      description: 'DX・SaaSプロジェクトをリードする成長企業。',
    },
    {
      name: 'ラピッドイノベーション',
      description: 'AI活用を加速するプロダクト志向の企業。',
    },
    {
      name: 'ネクストワークス',
      description: 'ハイブリッドワークと事業開発に強みをもつ企業。',
    },
  ]

  const comparison = [
    {
      label: '成長性',
      companyA: '◎',
      companyB: '◯',
      companyC: '◯',
    },
    {
      label: '裁量の大きさ',
      companyA: '◯',
      companyB: '◎',
      companyC: '◯',
    },
    {
      label: 'リモート適性',
      companyA: workStyle.includes('リモート') ? '◎' : '◯',
      companyB: '◯',
      companyC: workStyle.includes('ハイブリッド') ? '◎' : '◯',
    },
    {
      label: '年収ポテンシャル',
      companyA: income >= 900 ? '◎' : '◯',
      companyB: income >= 700 ? '◯' : '△',
      companyC: '◯',
    },
  ]

  const roadmap = [
    '現在',
    form.role || '現職',
    purpose.includes('責任') ? 'マネージャー' : 'シニアスペシャリスト',
    '部門リーダー',
    '事業責任者',
  ]

  const actions = [
    `今の得意スキル「${form.skills || '未入力'}」を活かせる求人を3件ピックアップする`,
    `希望業界「${form.desiredIndustry || 'なし'}」の事業戦略と成長シナリオを調査する`,
    `${workStyle.includes('リモート') ? 'リモート対応の求人情報を優先して収集する' : 'ハイブリッド/オフィス勤務の条件を明確にする'}`,
  ]

  return {
    score: `${score}点`,
    industries,
    roles: uniqueRoles,
    recommendedCompanies,
    comparison,
    roadmap,
    actions,
  }
}

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const form = location.state || DEFAULT_FORM
  const result = buildResult(form)

  return (
    <div className="bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-500">結果</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">あなたのキャリア戦略レポート</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            診断結果をもとに、市場価値・適性業界・おすすめ職種・企業比較・5年ロードマップ・アクションを提示します。
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <ScoreCard score={result.score} label="市場価値スコア" />
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">向いている業界ランキング</p>
              <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
                {result.industries.map((industry, index) => (
                  <li key={industry} className="flex items-center gap-4 rounded-3xl bg-slate-900/80 px-4 py-3">
                    <span className="inline-flex h-8 min-w-[32px] items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-slate-950">{index + 1}</span>
                    <span>{industry}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">向いている職種ランキング</p>
              <div className="mt-6 space-y-3">
                {result.roles.map((role, index) => (
                  <div key={role} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">{index + 1}</div>
                    <div>
                      <p className="font-semibold text-slate-950">{role}</p>
                      <p className="text-sm text-slate-600">あなたの強みを活かせる職種です。</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">おすすめ企業</p>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">おすすめ</span>
              </div>
              <div className="mt-6 grid gap-4">
                {result.recommendedCompanies.map((company) => (
                  <CompanyCard key={company.name} {...company} />
                ))}
              </div>
            </div>
          </div>

          <section className="mt-12 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">企業比較</p>
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
              <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-0 border-b border-slate-200 bg-slate-950 px-5 py-4 text-sm uppercase tracking-[0.24em] text-slate-100">
                <span>比較項目</span>
                <span className="text-center">キャリア・ストラテジー</span>
                <span className="text-center">ラピッドイノベーション</span>
                <span className="text-center">ネクストワークス</span>
              </div>
              <div className="divide-y divide-slate-200">
                {result.comparison.map((row) => (
                  <div key={row.label} className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-0 px-5 py-4 text-sm text-slate-700">
                    <span>{row.label}</span>
                    <span className="text-center">{row.companyA}</span>
                    <span className="text-center">{row.companyB}</span>
                    <span className="text-center">{row.companyC}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">5年キャリアロードマップ</p>
              <Roadmap steps={result.roadmap} />
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">今からやるべき3つのアクション</p>
              <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
                {result.actions.map((action, index) => (
                  <li key={action} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center gap-3 text-slate-950">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">{index + 1}</span>
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
              入力に応じてダミーロジックが市場価値スコアと適性おすすめを自動生成します。
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
