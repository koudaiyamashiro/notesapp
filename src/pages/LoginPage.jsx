import { useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Header from '../components/Header.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'

function PasswordPolicyChecklist({ value }) {
  const checks = useMemo(() => {
    const v = String(value || '')
    return [
      { key: 'len', label: '8文字以上', ok: v.length >= 8 },
      { key: 'num', label: '数字を含む', ok: /\d/.test(v) },
      { key: 'lower', label: '小文字を含む', ok: /[a-z]/.test(v) },
      { key: 'upper', label: '大文字を含む', ok: /[A-Z]/.test(v) },
      { key: 'special', label: '特殊文字を含む', ok: /[^A-Za-z0-9]/.test(v) },
      { key: 'trim', label: '先頭・末尾にスペースなし', ok: v.length > 0 && v.trim() === v },
    ]
  }, [value])

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Password Policy</p>
      <ul className="mt-2 space-y-1.5 text-sm">
        {checks.map((item) => (
          <li key={item.key} className={item.ok ? 'text-emerald-700' : 'text-slate-400'}>
            <span className="mr-2 font-semibold">{item.ok ? '✓' : '✗'}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function isPasswordPolicyValid(value) {
  const v = String(value || '')
  return (
    v.length >= 8 &&
    /\d/.test(v) &&
    /[a-z]/.test(v) &&
    /[A-Z]/.test(v) &&
    /[^A-Za-z0-9]/.test(v) &&
    v.trim() === v
  )
}

function mapAuthErrorToJa(error, fallbackMessage) {
  const raw = String(error?.name || error?.code || error?.message || '')
  if (raw.includes('UsernameExistsException')) return '既に登録済みのメールアドレスです。'
  if (raw.includes('CodeMismatchException')) return '認証コードが正しくありません。'
  if (raw.includes('ExpiredCodeException')) return '認証コードの有効期限が切れています。再送してください。'
  if (raw.includes('InvalidPasswordException')) return 'パスワード条件を満たしていません。'
  if (raw.includes('NotAuthorizedException')) return 'メールアドレスまたはパスワードが正しくありません。'
  if (raw.includes('UserNotFoundException')) return 'アカウントが見つかりません。メールアドレスを確認してください。'
  if (raw.includes('LimitExceededException') || raw.includes('TooManyRequestsException')) return '試行回数が多すぎます。時間を置いて再試行してください。'
  if (raw.includes('UserNotConfirmedException')) return 'メール認証が未完了です。認証コードを入力してください。'
  return fallbackMessage
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    signInWithEmail,
    signUpWithEmail,
    confirmSignUpCode,
    resendSignUpConfirmationCode,
    startResetPassword,
    submitResetPassword,
    confirmNewPassword,
    isAuthenticated,
    loading,
    isAmplifyReady,
    configError,
  } = useAuth()

  const [mode, setMode] = useState('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [resetNewPassword, setResetNewPassword] = useState('')
  const [resetNewPasswordConfirm, setResetNewPasswordConfirm] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showSignUpPasswordConfirm, setShowSignUpPasswordConfirm] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false)
  const [showResetNewPassword, setShowResetNewPassword] = useState(false)
  const [showResetNewPasswordConfirm, setShowResetNewPasswordConfirm] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const isSignUpPasswordValid = isPasswordPolicyValid(signUpPassword)
  const signUpPasswordsMatched = signUpPasswordConfirm.length > 0 && signUpPassword === signUpPasswordConfirm

  const isNewPasswordValid = isPasswordPolicyValid(newPassword)
  const passwordsMatched = newPasswordConfirm.length > 0 && newPassword === newPasswordConfirm

  const isResetPasswordValid = isPasswordPolicyValid(resetNewPassword)
  const resetPasswordsMatched = resetNewPasswordConfirm.length > 0 && resetNewPassword === resetNewPasswordConfirm

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

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
    setNotice('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)
    if (mode !== 'login') {
      switchMode('login')
    }

    try {
      const result = await signInWithEmail(email.trim(), password)
      if (isNewPasswordChallenge(result)) {
        switchMode('new-password-required')
        setNotice('初回ログインのため、新しいパスワードを設定してください。')
        return
      }

      if (!result?.isSignedIn) {
        const nextStep = result?.nextStep?.signInStep || 'UNKNOWN'
        setError(`追加認証が必要です（${nextStep}）。`)
        return
      }
      navigate(redirectTo, { replace: true })
    } catch (e) {
      if (String(e?.name || '').includes('UserNotConfirmedException')) {
        switchMode('confirm-signup')
        setNotice('メール認証が未完了です。認証コードを入力してください。')
        return
      }
      setError(mapAuthErrorToJa(e, 'ログインに失敗しました。メールアドレスまたはパスワードを確認してください。'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!isSignUpPasswordValid) {
      setError('パスワード条件を満たしていません。')
      return
    }
    if (signUpPassword !== signUpPasswordConfirm) {
      setError('確認用パスワードが一致しません。')
      return
    }

    setSubmitting(true)
    try {
      const result = await signUpWithEmail(email.trim(), signUpPassword)
      if (result?.nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        switchMode('confirm-signup')
        setNotice('認証コードをメールに送信しました。受信したコードを入力してください。')
        return
      }
      switchMode('login')
      setNotice('アカウント登録が完了しました。ログインしてください。')
    } catch (e) {
      setError(mapAuthErrorToJa(e, '新規登録に失敗しました。入力内容を確認してください。'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmSignUp = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)

    try {
      await confirmSignUpCode(email.trim(), verificationCode.trim())
      switchMode('login')
      setNotice('メール認証が完了しました。ログインしてください。')
    } catch (e) {
      setError(mapAuthErrorToJa(e, '認証コードの確認に失敗しました。'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setNotice('')
    setSubmitting(true)
    try {
      await resendSignUpConfirmationCode(email.trim())
      setNotice('認証コードを再送しました。メールをご確認ください。')
    } catch (e) {
      setError(mapAuthErrorToJa(e, '認証コードの再送に失敗しました。'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

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
    } catch (e) {
      setError(mapAuthErrorToJa(e, '新しいパスワードの設定に失敗しました。'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleStartResetPassword = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)

    try {
      await startResetPassword(resetEmail.trim())
      switchMode('forgot-password-confirm')
      setNotice('パスワード再設定コードをメールに送信しました。')
    } catch (e) {
      setError(mapAuthErrorToJa(e, 'パスワード再設定メールの送信に失敗しました。'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmResetPassword = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!isResetPasswordValid) {
      setError('新しいパスワードがポリシーを満たしていません。')
      return
    }
    if (resetNewPassword !== resetNewPasswordConfirm) {
      setError('確認用パスワードが一致しません。')
      return
    }

    setSubmitting(true)
    try {
      await submitResetPassword(resetEmail.trim(), resetCode.trim(), resetNewPassword)
      switchMode('login')
      setNotice('パスワードを再設定しました。新しいパスワードでログインしてください。')
    } catch (e) {
      setError(mapAuthErrorToJa(e, 'パスワード再設定に失敗しました。'))
    } finally {
      setSubmitting(false)
    }
  }

  const isModeLogin = mode === 'login'
  const isModeSignUp = mode === 'signup'
  const isModeConfirmSignUp = mode === 'confirm-signup'
  const isModeForgotPassword = mode === 'forgot-password'
  const isModeForgotPasswordConfirm = mode === 'forgot-password-confirm'
  const isModeNewPasswordRequired = mode === 'new-password-required'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-white text-slate-900">
      <Header />
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <section className="rounded-[2rem] border border-sky-100 bg-white/95 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Career Strategist AI Auth</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-900">
            {isModeLogin && 'ログイン'}
            {isModeSignUp && '新規登録'}
            {isModeConfirmSignUp && 'メール認証'}
            {isModeForgotPassword && 'パスワード再設定'}
            {isModeForgotPasswordConfirm && '新しいパスワード設定'}
            {isModeNewPasswordRequired && '初回ログイン設定'}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            診断フォームと結果画面はログインユーザーのみ利用できます。メールアドレスでアカウント作成・認証・ログインが可能です。
          </p>

          {!isAmplifyReady && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-semibold">Amplify設定を読み込めませんでした。</p>
              <p className="mt-1">主な原因: amplify_outputs.json が未生成、またはHosting成果物に含まれていない可能性があります。</p>
              {configError && <p className="mt-1">詳細: {configError}</p>}
              <p className="mt-2">対処: 1) Amplifyバックエンドを更新/デプロイ 2) Hostingを再デプロイ 3) 再読み込み</p>
            </div>
          )}

          {notice && <p className="mt-6 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-800">{notice}</p>}
          {error && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          {isModeLogin && (
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

              <button
                type="submit"
                disabled={submitting || !isAmplifyReady}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'ログイン中...' : 'ログインして診断を開始'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => switchMode('signup')} className="font-semibold text-sky-700 hover:text-sky-600">
                  新規登録はこちら
                </button>
                <button type="button" onClick={() => switchMode('forgot-password')} className="font-semibold text-sky-700 hover:text-sky-600">
                  パスワードを忘れた場合
                </button>
              </div>
            </form>
          )}

          {isModeSignUp && (
            <form className="mt-8 space-y-4" onSubmit={handleSignUp}>
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
                新規登録パスワード
                <div className="relative">
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={signUpPassword}
                    onChange={(event) => setSignUpPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="パスワードを入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={showSignUpPassword ? '新規登録パスワードを非表示にする' : '新規登録パスワードを表示する'}
                  >
                    {showSignUpPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <PasswordPolicyChecklist value={signUpPassword} />

              <label className="grid gap-2 text-sm font-medium text-slate-800">
                新規登録パスワード（確認）
                <div className="relative">
                  <input
                    type={showSignUpPasswordConfirm ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={signUpPasswordConfirm}
                    onChange={(event) => setSignUpPasswordConfirm(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="もう一度入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPasswordConfirm((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={showSignUpPasswordConfirm ? '新規登録確認パスワードを非表示にする' : '新規登録確認パスワードを表示する'}
                  >
                    {showSignUpPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {signUpPasswordConfirm.length > 0 && (
                <p className={`rounded-lg px-3 py-2 text-sm ${signUpPasswordsMatched ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-slate-200 bg-slate-100 text-slate-500'}`}>
                  {signUpPasswordsMatched ? 'パスワードが一致しています' : 'パスワードが一致しません'}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !isAmplifyReady || !isSignUpPasswordValid || !signUpPasswordsMatched}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? '登録中...' : 'アカウントを作成する'}
              </button>

              <button type="button" onClick={() => switchMode('login')} className="w-full text-sm font-semibold text-sky-700 hover:text-sky-600">
                ログイン画面へ戻る
              </button>
            </form>
          )}

          {isModeConfirmSignUp && (
            <form className="mt-8 space-y-4" onSubmit={handleConfirmSignUp}>
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
                認証コード
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="メールに届いたコードを入力"
                />
              </label>

              <button
                type="submit"
                disabled={submitting || !isAmplifyReady}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? '確認中...' : '認証コードを確認する'}
              </button>

              <button
                type="button"
                disabled={submitting || !isAmplifyReady || !email.trim()}
                onClick={handleResendCode}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                認証コードを再送する
              </button>

              <button type="button" onClick={() => switchMode('login')} className="w-full text-sm font-semibold text-sky-700 hover:text-sky-600">
                ログイン画面へ戻る
              </button>
            </form>
          )}

          {isModeForgotPassword && (
            <form className="mt-8 space-y-4" onSubmit={handleStartResetPassword}>
              <label className="grid gap-2 text-sm font-medium text-slate-800">
                メールアドレス
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="you@example.com"
                />
              </label>

              <button
                type="submit"
                disabled={submitting || !isAmplifyReady}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? '送信中...' : '再設定コードを送信する'}
              </button>

              <button type="button" onClick={() => switchMode('login')} className="w-full text-sm font-semibold text-sky-700 hover:text-sky-600">
                ログイン画面へ戻る
              </button>
            </form>
          )}

          {isModeForgotPasswordConfirm && (
            <form className="mt-8 space-y-4" onSubmit={handleConfirmResetPassword}>
              <label className="grid gap-2 text-sm font-medium text-slate-800">
                メールアドレス
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-800">
                再設定コード
                <input
                  type="text"
                  required
                  value={resetCode}
                  onChange={(event) => setResetCode(event.target.value)}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="メールに届いたコード"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-800">
                新しいパスワード
                <div className="relative">
                  <input
                    type={showResetNewPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={resetNewPassword}
                    onChange={(event) => setResetNewPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="新しいパスワードを入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetNewPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={showResetNewPassword ? '再設定パスワードを非表示にする' : '再設定パスワードを表示する'}
                  >
                    {showResetNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <PasswordPolicyChecklist value={resetNewPassword} />

              <label className="grid gap-2 text-sm font-medium text-slate-800">
                新しいパスワード（確認）
                <div className="relative">
                  <input
                    type={showResetNewPasswordConfirm ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={resetNewPasswordConfirm}
                    onChange={(event) => setResetNewPasswordConfirm(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 pr-10 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="もう一度入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetNewPasswordConfirm((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={showResetNewPasswordConfirm ? '再設定確認パスワードを非表示にする' : '再設定確認パスワードを表示する'}
                  >
                    {showResetNewPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {resetNewPasswordConfirm.length > 0 && (
                <p className={`rounded-lg px-3 py-2 text-sm ${resetPasswordsMatched ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-slate-200 bg-slate-100 text-slate-500'}`}>
                  {resetPasswordsMatched ? 'パスワードが一致しています' : 'パスワードが一致しません'}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !isAmplifyReady || !isResetPasswordValid || !resetPasswordsMatched}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? '再設定中...' : '新しいパスワードを設定する'}
              </button>

              <button type="button" onClick={() => switchMode('login')} className="w-full text-sm font-semibold text-sky-700 hover:text-sky-600">
                ログイン画面へ戻る
              </button>
            </form>
          )}

          {isModeNewPasswordRequired && (
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
              <PasswordPolicyChecklist value={newPassword} />
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

              <button
                type="submit"
                disabled={submitting || !isAmplifyReady || !isNewPasswordValid || !passwordsMatched}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? '設定中...' : '新しいパスワードを設定して続行'}
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-slate-600">
            <Link to="/" className="font-semibold text-sky-700 hover:text-sky-600">LPへ戻る</Link>
          </p>
        </section>

        <aside className="rounded-[2rem] border border-sky-100 bg-gradient-to-b from-white to-sky-50 p-8 text-slate-800 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Account Guide</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">本番運用向け認証フロー</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            メール登録、認証コード確認、ログイン、パスワード再設定まで、自己完結で利用できる認証導線を提供します。
          </p>
          <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-slate-700">
            <p>テストアカウント例: test@example.com</p>
            <p className="mt-2">パスワードはコードに保存せず、Cognito 側で設定してください。</p>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>1. LPは未ログインでも閲覧可能</li>
            <li>2. 診断開始でログイン画面へ誘導</li>
            <li>3. 新規登録後はメール認証で有効化</li>
            <li>4. ログイン後は診断フォームへ遷移</li>
            <li>5. パスワード忘れはコードで再設定可能</li>
          </ul>
        </aside>
      </main>
    </div>
  )
}
