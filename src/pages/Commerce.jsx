import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

const commerceProfile = {
  BusinessName: '未定',
  Representative: '未定',
  Address: '未定',
  SupportEmail: '未定',
}

const rows = [
  ['販売事業者名', commerceProfile.BusinessName],
  ['運営責任者', commerceProfile.Representative],
  ['所在地', commerceProfile.Address],
  ['問い合わせ先メールアドレス', commerceProfile.SupportEmail],
  ['販売価格', '各プランページに表示（特段の記載がない限り税込表示）'],
  ['商品代金以外の必要料金', '通信料、インターネット接続費用、端末費用等は利用者負担'],
  ['支払方法', 'Stripeによるクレジットカード決済（Visa、Mastercard、JCB、American Express、Diners Club 等）'],
  ['支払時期', '初回申込時に課金。以後は契約更新日に自動課金'],
  ['提供時期', '決済完了後に有料機能が利用可能。通信状況やシステム処理状況により開始が遅延する場合があります'],
  ['契約期間・自動更新', '月額契約を前提とし、契約は毎月自動更新されます。次回更新日前までに解約した場合、翌月以降の請求は停止されます'],
  ['途中解約・返金', '途中解約は可能ですが、契約期間の残存日数に対する日割返金は行いません。法令上必要な場合を除き返金には応じません'],
  ['解約方法', 'マイページまたはお問い合わせ窓口から解約手続きが可能です。解約後も契約期間満了日までは利用できます'],
  ['動作環境', 'Google Chrome、Safari、Microsoft Edge、Firefox 各最新版（いずれもインターネット接続が必要）'],
  ['AIサービスに関する注意', 'Career Strategist AIはAIによる参考情報を提供するサービスであり、転職成功、内定獲得、年収向上その他成果を保証しません'],
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
            有料サービスの提供条件、決済条件、解約条件等を特定商取引法に基づき表示しています。
          </p>
          <div className="mt-4 space-y-1 text-xs text-slate-500">
            <p>制定日: 2026-07-02</p>
            <p>最終改定日: 2026-07-02</p>
          </div>
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
            本ページは、法令改正、サービス内容変更、決済事業者仕様変更等に応じて更新される場合があります。最新の内容をご確認ください。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
