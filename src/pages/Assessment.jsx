import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

const INITIAL_FORM = {
  age: '',
  role: '',
  level: '',
  experience: '',
  income: '',
  strengths: [],
  weaknesses: [],
  otherStrength: '',
  otherWeakness: '',
  purpose: '',
  desiredIndustry: [],
  workStyle: '',
  idealFuture: '',
}

const ROLE_OPTIONS = [
  '営業',
  'マーケティング',
  'エンジニア',
  'コンサルタント',
  '企画',
  '人事',
  '経理・財務',
  'カスタマーサクセス',
  'デザイナー',
  'その他',
]

const LEVEL_OPTIONS = ['メンバー', 'リーダー', 'マネージャー', '責任者・役員クラス']

const STRENGTH_OPTIONS = {
  営業: ['新規開拓', '既存深耕', '提案営業', '無形商材営業', 'エンタープライズ営業', 'クロージング', '顧客折衝', 'プレゼン', 'その他'],
  マーケティング: ['SEO', 'SNS運用', '広告運用', 'CRM', 'コンテンツ企画', 'データ分析', 'MAツール', 'ブランド戦略', 'その他'],
  エンジニア: ['フロントエンド', 'バックエンド', 'AWS', 'AI開発', 'データ基盤', 'SRE', '要件定義', 'アーキテクチャ設計', 'その他'],
  コンサルタント: ['PMO', '要件定義', '業務改革', 'DX推進', '戦略策定', 'データ分析', '資料作成', 'ファシリテーション', 'その他'],
  企画: ['事業企画', '経営企画', '新規事業', 'KPI設計', '市場分析', 'プロジェクト推進', 'その他'],
  人事: ['採用', '育成', '評価制度', '組織開発', '労務', 'HRBP', 'その他'],
  '経理・財務': ['決算', '管理会計', '予算管理', '財務分析', '内部統制', '資金繰り', 'その他'],
  'カスタマーサクセス': ['オンボーディング', '顧客支援', '解約防止', 'アップセル', 'ヘルススコア分析', 'その他'],
  デザイナー: ['UIデザイン', 'UXリサーチ', 'プロトタイピング', 'ブランドデザイン', 'デザインシステム', 'その他'],
  その他: ['課題解決', 'コミュニケーション', 'マネジメント', 'データ分析', '企画力', '実行力', 'その他'],
}

const WEAKNESS_OPTIONS = ['単純作業', '細かい事務作業', '長時間会議', '数字管理', '顧客折衝', '資料作成', 'コーディング', 'マネジメント', '新規開拓', '調整業務', 'その他']

const PURPOSE_OPTIONS = ['年収を上げたい', '裁量を増やしたい', '専門性を高めたい', 'マネジメントに挑戦したい', 'ワークライフバランスを改善したい', '成長産業に移りたい', 'その他']

const INDUSTRY_OPTIONS = ['ITコンサル', 'SaaS', 'AI', 'DX', '事業会社', '金融', '製造', '人材', '広告', 'その他']

const WORK_STYLE_OPTIONS = ['出社中心', 'ハイブリッド', 'フルリモート', '裁量重視', '安定重視']

const steps = ['基本情報', '得意/苦手領域', '志向性']

export default function Assessment() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')

  const strengthOptions = useMemo(() => STRENGTH_OPTIONS[form.role] || STRENGTH_OPTIONS['その他'], [form.role])

  const toggleChip = (key, value) => {
    const current = form[key] || []
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    setForm({ ...form, [key]: next })
    setError('')
  }

  const handleChange = (key) => (event) => {
    const value = event.target.value
    if (key === 'role') {
      setForm({ ...form, role: value, strengths: [], otherStrength: '' })
    } else {
      setForm({ ...form, [key]: value })
    }
    setError('')
  }

  const isStepComplete = (stepIndex) => {
    if (stepIndex === 0) {
      return [form.age, form.role, form.level, form.experience, form.income].every((value) => String(value).trim().length > 0)
    }
    if (stepIndex === 1) {
      const strengthsOk = form.strengths.length > 0 && (!form.strengths.includes('その他') || String(form.otherStrength).trim().length > 0)
      const weaknessesOk = form.weaknesses.length > 0 && (!form.weaknesses.includes('その他') || String(form.otherWeakness).trim().length > 0)
      return strengthsOk && weaknessesOk
    }
    if (stepIndex === 2) {
      return form.purpose && form.desiredIndustry.length > 0 && form.workStyle && String(form.idealFuture).trim().length > 0
    }
    return false
  }

  const goNext = () => {
    if (!isStepComplete(step)) {
      setError('このステップの入力を全て完了してください。')
      return
    }
    if (step < steps.length - 1) {
      setStep(step + 1)
      setError('')
    }
  }

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1)
      setError('')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isStepComplete(step)) {
      setError('このステップの入力を全て完了してください。')
      return
    }
    navigate('/analysis', { state: form })
  }

  const progress = Math.round(((step + 1) / steps.length) * 100)

  return (
    <div className="bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-500">キャリア診断</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">職種ごとに自然な入力で進める診断</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                選択式中心の3ステップで、AIキャリア戦略レポートに必要な情報を効率よく収集します。
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <p className="font-semibold text-slate-950">進行状況</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Step {step + 1} / {steps.length}</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((label, index) => (
              <div key={label} className={`rounded-[1.5rem] border px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.24em] ${index === step ? 'border-sky-500 bg-sky-50 text-slate-950' : 'border-slate-200 bg-white text-slate-500'}`}>
                {label}
              </div>
            ))}
          </div>

          <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
            {step === 0 && (
              <div className="grid gap-6 lg:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  年齢
                  <input
                    type="number"
                    min="18"
                    max="70"
                    value={form.age}
                    onChange={handleChange('age')}
                    placeholder="例: 32"
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  現在の職種
                  <select
                    value={form.role}
                    onChange={handleChange('role')}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="">選択してください</option>
                    {ROLE_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  職種レベル
                  <select
                    value={form.level}
                    onChange={handleChange('level')}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="">選択してください</option>
                    {LEVEL_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  経験年数
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={form.experience}
                    onChange={handleChange('experience')}
                    placeholder="例: 5"
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  年収（万円）
                  <input
                    type="number"
                    min="200"
                    max="3000"
                    value={form.income}
                    onChange={handleChange('income')}
                    placeholder="例: 850"
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                  />
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-8">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">得意領域</p>
                    <p className="text-sm text-slate-500">複数選択可・「その他」時は入力</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {strengthOptions.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleChip('strengths', item)}
                        className={`rounded-3xl border px-4 py-3 text-sm transition ${form.strengths.includes(item) ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                  {form.strengths.includes('その他') && (
                    <label className="grid gap-2 text-sm font-medium text-slate-900">
                      その他の得意領域
                      <input
                        type="text"
                        value={form.otherStrength}
                        onChange={handleChange('otherStrength')}
                        placeholder="例: 組織開発"
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </label>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">苦手領域</p>
                    <p className="text-sm text-slate-500">複数選択可・「その他」時は入力</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {WEAKNESS_OPTIONS.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleChip('weaknesses', item)}
                        className={`rounded-3xl border px-4 py-3 text-sm transition ${form.weaknesses.includes(item) ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                  {form.weaknesses.includes('その他') && (
                    <label className="grid gap-2 text-sm font-medium text-slate-900">
                      その他の苦手領域
                      <input
                        type="text"
                        value={form.otherWeakness}
                        onChange={handleChange('otherWeakness')}
                        placeholder="例: 交渉対応"
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-slate-900">
                    転職目的
                    <select
                      value={form.purpose}
                      onChange={handleChange('purpose')}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="">選択してください</option>
                      {PURPOSE_OPTIONS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-900">
                    希望する働き方
                    <select
                      value={form.workStyle}
                      onChange={handleChange('workStyle')}
                      className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="">選択してください</option>
                      {WORK_STYLE_OPTIONS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4">
                  <p className="text-sm font-medium text-slate-900">希望業界</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {INDUSTRY_OPTIONS.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleChip('desiredIndustry', item)}
                        className={`rounded-3xl border px-4 py-3 text-sm transition ${form.desiredIndustry.includes(item) ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  5年後の理想像
                  <textarea
                    value={form.idealFuture}
                    onChange={handleChange('idealFuture')}
                    placeholder="例: 事業責任者として組織を牽引したい"
                    className="min-h-[130px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                  />
                </label>
              </div>
            )}

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" disabled={step === 0} onClick={goBack} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50">
                前のステップへ
              </button>
              {step < steps.length - 1 ? (
                <button type="button" onClick={goNext} className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-slate-800">
                  次へ進む
                </button>
              ) : (
                <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-slate-800 sm:w-auto">
                  分析を開始する
                </button>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
