import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import ScoreCard from '../components/ScoreCard.jsx'
import CompanyCard from '../components/CompanyCard.jsx'
import Roadmap from '../components/Roadmap.jsx'

const RECOMMENDED_INDUSTRIES = ['ITコンサル', 'SaaS', 'AI関連']
const RECOMMENDED_ROLES = ['ITコンサルタント', 'PM', 'BizDev']
const COMPANIES = [
  { name: 'アクセンチュア', description: 'グローバルな経営とITのリーディングカンパニー' },
  { name: 'ベイカレント', description: '成長企業向けにDXとIT投資を支援する企業' },
  { name: 'Dirbato', description: '次世代プロダクト開発を支えるイノベーティブ企業' },
  { name: 'SmartHR', description: '人事労務のSaaSで働き方を変える企業' },
  { name: 'LayerX', description: 'FinTechとセキュリティを組み合わせた事業展開' },
]
const ROADMAP_STEPS = ['現在', 'ITコンサル', 'マネージャー', '事業責任者']

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const fallback = !location.state

  return (
    <div className="bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-10">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-500">診断結果</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">あなたのキャリア戦略サマリー</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">ダミーデータをもとに、今後のキャリアの方向性をビジュアル化しました。</p>
            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <ScoreCard score="82点" label="市場価値スコア" />
              <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
                <p className="text-sm uppercase tracking-[0.24em] text-sky-400">おすすめ業界</p>
                <ol className="mt-6 space-y-3 text-sm leading-7 text-slate-200">
                  {RECOMMENDED_INDUSTRIES.map((item, index) => (
                    <li key={item} className="flex items-center gap-3 rounded-3xl bg-slate-900/80 p-4">
                      <span className="inline-flex h-8 min-w-[32px] items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-slate-950">{index + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <section className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">おすすめ職種</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {RECOMMENDED_ROLES.map((role) => (
                    <span key={role} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">{role}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">おすすめ企業</p>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">人気</span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {COMPANIES.map((company) => (
                    <CompanyCard key={company.name} {...company} />
                  ))}
                </div>
              </div>
            </section>
            <div className="mt-10">
              <Roadmap steps={ROADMAP_STEPS} />
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-slate-800" onClick={() => navigate('/assessment')}>
                再診断する
              </button>
              {fallback && <p className="text-sm text-rose-600">診断結果にはフォームからの入力が必要です。トップまたは診断画面にお戻りください。</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
