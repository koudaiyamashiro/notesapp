import { useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Header from '../components/Header.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithEmail, confirmNewPassword, isAuthenticated, loading, isAmplifyReady, configError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [requiresNewPassword, setRequiresNewPassword] = useState(false)

  const newPasswordChecks = useMemo(() => {
    const value = String(newPassword || '')
    return [
      { key: 'len', label: '8文字以上', ok: value.length >= 8 },
      { key: 'num', label: '数字を含む', ok: /\d/.test(value) },
      { key: 'lower', label: '小文字を含む', ok: /[a-z]/.test(value) },
      { key: 'upper', label: '大文字を含む', ok: /[A-Z]/.test(value) },
      { key: 'special', label: '特殊文字を含む', ok: /[^A-Za-z0-9]/.test(value) },
      { key: 'trim', label: '先頭・末尾にスペースなし', ok: value.length > 0 && value.trim() === value },
    ]
  }, [newPassword])

  const isNewPasswordValid = useMemo(() => newPasswordChecks.every((item) => item.ok), [newPasswordChecks])
  const passwordsMatched = newPasswordConfirm.length > 0 && newPassword === newPasswordConfirm

  const isNewPasswordChallenge = (result) => {
    const step = result?.nextStep?.signInStep || ''
    return step === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED' || step.includes('NEW_PASSWORD_REQUIRED')
  }

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
    setRequiresNewPassword(false)

    try {
      const result = await signInWithEmail(email.trim(), password)
      if (isNewPasswordChallenge(result)) {
        setRequiresNewPassword(true)
        setError('初回ログインのため、新しいパスワードを設定してください。')
        return
      }

      if (!result?.isSignedIn) {
        const nextStep = result?.nextStep?.signInStep || 'UNKNOWN'
        setError(`追加認証が必要です。認証ステップ: ${nextStep}`)
        return
      }
      navigate(redirectTo, { replace: true })
    } catch {
      setError('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!isNewPasswordValid) {
      setError('新しいパスワードがポリシーを満たしていません。条件を確認してください。')
      return
    }
    if (newPassword !== newPasswordConfirm) {
      setError('新しいパスワードが一致していません。')
      return
    }

    setSubmitting(true)
    try {
      const result = await confirmNewPassword(newPassword)
      if (!result?.isSignedIn) {
        const nextStep = result?.nextStep?.signInStep || 'UNKNOWN'
        setError(`新しいパスワード設定後に追加認証が必要です。認証ステップ: ${nextStep}`)
        return
      }
      navigate(redirectTo, { replace: true })
    } catch {
      setError('新しいパスワードの設定に失敗しました。ポリシーを満たす値で再入力してください。')
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
              <p className="font-semibold">Amplify設定を読み込めませんでした。</p>
              <p className="mt-1">主な原因: amplify_outputs.json が未生成、またはHosting成果物に含まれていない可能性があります。</p>
              {configError && <p className="mt-1">詳細: {configError}</p>}
              <p className="mt-2">対処: 1) Amplifyバックエンドを更新/デプロイ 2) Hostingを再デプロイ 3) 再読み込み</p>
            </div>
          )}

          {!requiresNewPassword && (
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="パスワードを入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={showPassword ? 'パスワードを非表示にする' : 'パスワードを表示する'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
          )}

          {requiresNewPassword && (
            <form className="mt-8 space-y-4" onSubmit={handleNewPasswordSubmit}>
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">
                初回ログインです。新しいパスワードを設定してください。
              </div>
              <label className="grid gap-2 text-sm font-medium text-slate-800">
                新しいパスワード
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="8文字以上で入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={showNewPassword ? '新しいパスワードを非表示にする' : '新しいパスワードを表示する'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Password Policy</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {newPasswordChecks.map((item) => (
                    <li key={item.key} className={item.ok ? 'text-emerald-700' : 'text-slate-400'}>
                      <span className="mr-2 font-semibold">{item.ok ? '✓' : '✗'}</span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
              <label className="grid gap-2 text-sm font-medium text-slate-800">
                新しいパスワード（確認）
                <div className="relative">
                  <input
                    type={showNewPasswordConfirm ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={newPasswordConfirm}
                    onChange={(event) => setNewPasswordConfirm(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="もう一度入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPasswordConfirm((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={showNewPasswordConfirm ? '確認用パスワードを非表示にする' : '確認用パスワードを表示する'}
                  >
                    {showNewPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {newPasswordConfirm.length > 0 && (
                <p className={`rounded-lg px-3 py-2 text-sm ${passwordsMatched ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-slate-200 bg-slate-100 text-slate-500'}`}>
                  {passwordsMatched ? 'パスワードが一致しています' : 'パスワードが一致しません'}
                </p>
              )}

              {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !isAmplifyReady || !isNewPasswordValid || !passwordsMatched}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? '設定中...' : '新しいパスワードを設定して続行'}
              </button>
            </form>
          )}

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
