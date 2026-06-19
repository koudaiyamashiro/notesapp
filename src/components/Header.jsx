import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-3xl bg-sky-600 text-white">C</span>
          Career Strategist AI
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#problem" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">課題</a>
          <a href="#feature" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">機能</a>
          <a href="#compare" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">比較</a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">料金</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-transform transform hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200">
            ログイン
          </button>
          <Link className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition-transform transform hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-300" to="/assessment">
            無料で始める
          </Link>
        </div>
      </div>
    </header>
  )
}
