import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider.jsx'

const navItems = [
  { label: 'Home', id: 'home' },
  { label: '課題', id: 'problem' },
  { label: '機能', id: 'features' },
  { label: '診断結果', id: 'result-preview' },
  { label: '比較', id: 'comparison' },
  { label: '料金', id: 'pricing' },
  { label: 'FAQ', id: 'faq' },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, signOutUser } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOutUser()
    setMobileMenuOpen(false)
    navigate('/')
  }

  const handleNavClick = (event, id) => {
    setMobileMenuOpen(false)
    if (location.pathname !== '/') return
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    window.history.replaceState(window.history.state, '', `/#${id}`)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-950 sm:text-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-500 text-xs text-white shadow-[0_12px_24px_rgba(14,165,233,0.18)]">C</span>
          <span className="hidden sm:inline">Career Strategist AI</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 lg:flex xl:gap-6">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              onClick={(event) => handleNavClick(event, item.id)}
              className="whitespace-nowrap text-xs font-medium text-slate-600 transition hover:text-slate-950 xl:text-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
          {!isAuthenticated && (
            <>
              <Link
                className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-transform transform hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                to="/login"
              >
                ログイン
              </Link>
              <Link className="inline-flex h-10 whitespace-nowrap items-center justify-center rounded-full bg-sky-500 px-4 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition-transform transform hover:-translate-y-0.5 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300" to="/assessment">
                無料で始める
              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-transform transform hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200" to="/history">
                診断履歴
              </Link>
              <span className="hidden max-w-[11rem] truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 2xl:inline-flex">
                {user?.email || 'ログイン中'}
              </span>
              <Link className="inline-flex h-10 whitespace-nowrap items-center justify-center rounded-full bg-sky-500 px-4 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition-transform transform hover:-translate-y-0.5 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300" to="/assessment">
                診断を始める
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="whitespace-nowrap rounded-full border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-transform transform hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                ログアウト
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
          aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200/80 bg-white/95 px-4 py-4 shadow-[0_20px_40px_rgba(15,23,42,0.08)] lg:hidden">
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                onClick={(event) => handleNavClick(event, item.id)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4">
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
                >
                  ログイン
                </Link>
                <Link
                  to="/assessment"
                  onClick={closeMobileMenu}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-500 px-4 text-sm font-semibold text-white"
                >
                  無料で始める
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <div className="truncate rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {user?.email || 'ログイン中'}
                </div>
                <Link
                  to="/history"
                  onClick={closeMobileMenu}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
                >
                  診断履歴
                </Link>
                <Link
                  to="/assessment"
                  onClick={closeMobileMenu}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-500 px-4 text-sm font-semibold text-white"
                >
                  診断を始める
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
                >
                  ログアウト
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
