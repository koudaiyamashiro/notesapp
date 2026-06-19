import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="bg-slate-950 py-24 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-400">Call to Action</p>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                転職活動を始める前に、キャリア戦略を始めよう。
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                5年後から逆算して、今やるべきことが見える。まずは3分の無料診断から。
              </p>
            </div>
            <div className="flex items-center justify-start lg:justify-end">
              <Link to="/assessment" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-sky-500/30 transition hover:bg-sky-400">
                無料でキャリア分析を始める
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
