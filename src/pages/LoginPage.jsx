import { useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithEmail, isAuthenticated, loading, isAmplifyReady } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = useMemo(() => {
    const from = location.state?.from
    return typeof from === 'string' && from.startsWith('/') ? from : '/assessment'
  }, [location.state])

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const result = await signInWithEmail(email.trim(), password)
      if (!result?.isSignedIn) {
        setError('このアカウントは追加認証が必要です。管理者設定を確認してください。')
        return
      }
      navigate(redirectTo, { replace: true })
    } catch {
      setError('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-white text-slate-900">
      <Header />
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <section className="rounded-[2rem] border border-sky-100 bg-white/95 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Member Login</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-900">Career Strategist AI にログイン</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            診断フォームと結果画面はログインユーザーのみ利用できます。Cognito で作成したメールアドレスとパスワードでログインしてください。
          </p>

          {!isAmplifyReady && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              amplify_outputs.json を読み込めませんでした。Amplify 環境をデプロイ後、再読み込みしてください。
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              メールアドレス
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              パスワード
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                placeholder="パスワードを入力"
              />
            </label>

            {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !isAmplifyReady}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'ログイン中...' : 'ログインして診断を開始'}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            アカウント未作成の場合は管理者が Cognito にユーザー追加してください。<Link to="/" className="font-semibold text-sky-700 hover:text-sky-600">LPへ戻る</Link>
          </p>
        </section>

        <aside className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-slate-100 shadow-[0_20px_80px_rgba(15,23,42,0.2)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Developer Note</p>
          <h2 className="mt-4 text-2xl font-semibold">検証用ログイン導線</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            本番コードに固定ID/固定パスワードは実装していません。開発時は Cognito ユーザーを作成して動作確認してください。
          </p>
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/70 p-4 text-sm text-slate-200">
            <p>テストアカウント例: test@example.com</p>
            <p className="mt-2">パスワードはコードに保存せず、Cognito 側で設定してください。</p>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            <li>1. LPは未ログインでも閲覧可能</li>
            <li>2. 診断開始でログイン画面へ誘導</li>
            <li>3. ログイン後は診断フォームへ遷移</li>
          </ul>
        </aside>
      </main>
    </div>
  )
}
