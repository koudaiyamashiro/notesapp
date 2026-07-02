import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function BillingCancel() {
  return (
    <div className="bg-[#F8FAFC] text-slate-950">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Billing Cancel</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">決済はキャンセルされました</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">プランの契約は完了していません。必要に応じて、もう一度プランを選択してください。</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/#pricing" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400">
              Pricingへ戻る
            </Link>
            <Link to="/billing" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              契約管理へ
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
