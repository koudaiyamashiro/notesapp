import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

const rows = [
  ['販売事業者名', '未定'],
  ['運営責任者', '未定'],
  ['所在地', '未定'],
  ['メールアドレス', '未定'],
  ['販売価格', '各プランページに表示'],
  ['商品代金以外の必要料金', '通信料、インターネット接続費用等は利用者負担'],
  ['支払方法', 'クレジットカード（予定）'],
  ['支払時期', '申込時（予定）'],
  ['提供時期', '決済完了後、直ちに利用可能（予定）'],
  ['返品・キャンセル', 'デジタルサービスの性質上、原則返金不可（法令上必要な場合を除く）'],
  ['解約', 'マイページまたはお問い合わせ経由で手続き可能（予定）'],
  ['動作環境', 'インターネット接続環境および主要ブラウザの最新版'],
]

export default function Commerce() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-slate-100 p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Commerce</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">特定商取引法に基づく表記</h1>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            有料サービス提供開始時に、未確定項目は速やかに更新します。
          </p>
          <p className="mt-4 text-xs text-slate-500">最終改定日: 2026-07-02</p>
        </header>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-10">
          <dl>
            {rows.map(([label, value]) => (
              <div key={label} className="grid border-b border-slate-100 p-5 sm:grid-cols-[220px_1fr] sm:gap-6 sm:p-6">
                <dt className="text-sm font-semibold text-slate-900">{label}</dt>
                <dd className="mt-2 text-sm leading-7 text-slate-700 sm:mt-0">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">補足</h2>
          <p className="mt-3">
            本ページは、SaaS有料機能の正式提供に向けた暫定版です。料金、更新条件、自動更新、解約、返金条件等の詳細は有料プラン提供開始時に確定版へ更新します。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
