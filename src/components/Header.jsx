import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'

export default function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, signOutUser } = useAuth()

  const handleLogout = async () => {
    await signOutUser()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-500 text-xs text-white">C</span>
          Career Strategist AI
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Home</a>
          <a href="#problem" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">課題</a>
          <a href="#feature" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">機能</a>
          <a href="#result-preview" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">診断結果</a>
          <a href="#compare" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">比較</a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">料金</a>
          <a href="#faq" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Link
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-transform transform hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                to="/login"
              >
                ログイン
              </Link>
              <Link className="inline-flex h-11 items-center justify-center rounded-full bg-sky-500 px-5 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition-transform transform hover:-translate-y-0.5 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300" to="/assessment">
                無料で始める
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 md:inline-flex">
                {user?.email || 'ログイン中'}
              </span>
              <Link className="inline-flex h-11 items-center justify-center rounded-full bg-sky-500 px-5 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition-transform transform hover:-translate-y-0.5 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300" to="/assessment">
                診断を始める
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-transform transform hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                ログアウト
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
