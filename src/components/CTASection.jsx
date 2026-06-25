import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="bg-white py-24 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-sky-100 bg-[#EAF6FF] p-10 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-600">Call to Action</p>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                転職活動を始める前に、キャリア戦略を始めよう。
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                5年後から逆算して、今やるべきことが見える。まずは3分の無料診断から。
              </p>
            </div>
            <div className="flex items-center justify-start lg:justify-end">
              <Link to="/assessment" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 transition hover:bg-slate-800">
                無料でキャリア分析を始める
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
