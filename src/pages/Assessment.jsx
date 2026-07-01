import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import MultiSelectTags from '../components/MultiSelectTags.jsx'
import {
  AGE_OPTIONS,
  EXPERIENCE_OPTIONS,
  INCOME_OPTIONS,
  INDUSTRY_OPTIONS,
  LEVEL_OPTIONS,
  PURPOSE_OPTIONS,
  WORK_STYLE_OPTIONS,
  getGroupedRoleOptions,
  getStrengthOptionsForRole,
  getWeaknessOptionsForRole,
} from '../data/assessmentOptions.js'

const INITIAL_FORM = {
  age: '',
  role: '',
  level: '',
  experience: '',
  income: '',
  strengths: [],
  weaknesses: [],
  purpose: [],
  desiredIndustry: [],
  workStyle: '',
  idealFuture: '',
}

const steps = ['基本情報', '得意/苦手領域', '志向性']
export default function Assessment() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [missingFields, setMissingFields] = useState({})
  const [, setValidationAttempted] = useState({})

  const groupedRoleOptions = useMemo(() => getGroupedRoleOptions(), [])
  const strengthOptions = useMemo(() => getStrengthOptionsForRole(form.role), [form.role])
  const weaknessOptions = useMemo(() => getWeaknessOptionsForRole(form.role), [form.role])

  const markValidationAttempted = (stepIndex) => {
    setValidationAttempted((prev) => ({ ...prev, [stepIndex]: true }))
  }

  const toggleChip = (key, value) => {
    const current = form[key] || []
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    setForm({ ...form, [key]: next })
    setMissingFields((prev) => ({ ...prev, [key]: false }))
    setError('')
  }

  const handleChange = (key) => (event) => {
    const rawValue = event.target.value
    const value = key === 'age' && rawValue !== '' ? Number(rawValue) : rawValue
    if (key === 'role') {
      setForm({ ...form, role: value, strengths: [], weaknesses: [] })
    } else {
      setForm({ ...form, [key]: value })
    }
    setMissingFields((prev) => ({ ...prev, [key]: false }))
    setError('')
  }

  const addCustomTag = (key, value, setter) => {
    const trimmed = String(value || '').trim()
    if (!trimmed) return
    const next = Array.from(new Set([...(form[key] || []), trimmed]))
    setForm({ ...form, [key]: next })
    setMissingFields((prev) => ({ ...prev, [key]: false }))
    setter('')
    setError('')
  }

  const getStepMissingFields = (stepIndex) => {
    if (stepIndex === 0) {
      return {
        age: !String(form.age).trim(),
        role: !String(form.role).trim(),
        level: !String(form.level).trim(),
        experience: !String(form.experience).trim(),
        income: !String(form.income).trim(),
      }
    }
    if (stepIndex === 1) {
      return {
        strengths: !Array.isArray(form.strengths) || form.strengths.length === 0,
        weaknesses: !Array.isArray(form.weaknesses) || form.weaknesses.length === 0,
      }
    }
    if (stepIndex === 2) {
      return {
        purpose: !Array.isArray(form.purpose) || form.purpose.length === 0,
        workStyle: !String(form.workStyle).trim(),
        desiredIndustry: !Array.isArray(form.desiredIndustry) || form.desiredIndustry.length === 0,
        idealFuture: !String(form.idealFuture).trim(),
      }
    }
    return {}
  }

  const isStepComplete = (stepIndex) => {
    if (stepIndex === 0) {
      return [form.age, form.role, form.level, form.experience, form.income].every((value) => String(value).trim().length > 0)
    }
    if (stepIndex === 1) {
      const strengthsOk = form.strengths.length > 0
      const weaknessesOk = form.weaknesses.length > 0
      return strengthsOk && weaknessesOk
    }
    if (stepIndex === 2) {
      return Array.isArray(form.purpose) && form.purpose.length > 0 && form.desiredIndustry.length > 0 && form.workStyle && String(form.idealFuture).trim().length > 0
    }
    return false
  }

  const goNext = () => {
    markValidationAttempted(step)
    const missing = getStepMissingFields(step)
    const hasMissing = Object.values(missing).some(Boolean)
    if (hasMissing) {
      setMissingFields(missing)
      setError('')
      return
    }
    if (step < steps.length - 1) {
      setStep(step + 1)
      setMissingFields({})
      setError('')
    }
  }

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1)
      setMissingFields({})
      setError('')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    markValidationAttempted(step)
    const missing = getStepMissingFields(step)
    const hasMissing = Object.values(missing).some(Boolean)
    if (hasMissing) {
      setMissingFields(missing)
      setError('')
      return
    }
    setMissingFields({})
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

          <div className="mt-12 flex gap-3 rounded-xl bg-slate-100 p-2 sm:gap-4">
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (isStepComplete(step)) {
                    setStep(index)
                  }
                }}
                disabled={step < index && !isStepComplete(step)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition sm:px-4 sm:py-2.5 ${
                  index === step
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50'
                }`}
              >
                <span className="hidden sm:inline">Step {index + 1} </span>{label}
              </button>
            ))}
          </div>

          <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
            {step === 0 && (
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  年齢
                  <select
                    value={form.age === '' ? '' : String(form.age)}
                    onChange={handleChange('age')}
                    className={`rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${missingFields.age ? 'border-rose-400' : 'border-slate-300'}`}
                  >
                    <option value="">選択してください</option>
                    {AGE_OPTIONS.map((age) => (
                      <option key={age} value={age}>{age}歳</option>
                    ))}
                  </select>
                  {missingFields.age && <p className="text-xs text-rose-600">選択してください</p>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  現在の職種
                  <select
                    value={form.role}
                    onChange={handleChange('role')}
                    className={`rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${missingFields.role ? 'border-rose-400' : 'border-slate-300'}`}
                  >
                    <option value="">選択してください</option>
                    {Object.entries(groupedRoleOptions).map(([category, options]) => (
                      <optgroup key={category} label={category}>
                        {options.map((item) => (
                          <option key={item.id} value={item.label}>{item.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {missingFields.role && <p className="text-xs text-rose-600">入力してください</p>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  職種レベル
                  <select
                    value={form.level}
                    onChange={handleChange('level')}
                    className={`rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${missingFields.level ? 'border-rose-400' : 'border-slate-300'}`}
                  >
                    <option value="">選択してください</option>
                    {LEVEL_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  {missingFields.level && <p className="text-xs text-rose-600">選択してください</p>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  経験年数
                  <select
                    value={form.experience}
                    onChange={handleChange('experience')}
                    className={`rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${missingFields.experience ? 'border-rose-400' : 'border-slate-300'}`}
                  >
                    <option value="">選択してください</option>
                    {EXPERIENCE_OPTIONS.map((item) => (
                      <option key={item.label} value={item.value}>{item.label}</option>
                    ))}
                    <option value="41">40年以上</option>
                  </select>
                  {missingFields.experience && <p className="text-xs text-rose-600">選択してください</p>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  年収レンジ
                  <select
                    value={form.income}
                    onChange={handleChange('income')}
                    className={`rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${missingFields.income ? 'border-rose-400' : 'border-slate-300'}`}
                  >
                    <option value="">選択してください</option>
                    {INCOME_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                  {missingFields.income && <p className="text-xs text-rose-600">選択してください</p>}
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5">
                <MultiSelectTags
                  label="得意領域"
                  description="現在の職種に近い実務スキルを上部表示しています。検索しながら複数選択できます。"
                  selected={form.strengths}
                  options={strengthOptions}
                  onToggle={(item) => toggleChip('strengths', item)}
                  onCustomAdd={(val) => addCustomTag('strengths', val, () => {})}
                  hasError={!!missingFields.strengths}
                  errorMessage="入力してください"
                />

                <MultiSelectTags
                  label="苦手領域"
                  description="避けたい業務や負荷になりやすい実務シーンを選択してください。"
                  selected={form.weaknesses}
                  options={weaknessOptions}
                  onToggle={(item) => toggleChip('weaknesses', item)}
                  onCustomAdd={(val) => addCustomTag('weaknesses', val, () => {})}
                  hasError={!!missingFields.weaknesses}
                  errorMessage="入力してください"
                />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5">
                <MultiSelectTags
                  label="転職目的"
                  description="あなたが転職先に求める価値やゴールを複数選択してください"
                  selected={form.purpose}
                  options={PURPOSE_OPTIONS}
                  onToggle={(item) => toggleChip('purpose', item)}
                  onCustomAdd={(val) => addCustomTag('purpose', val, () => {})}
                  hasError={!!missingFields.purpose}
                  errorMessage="入力してください"
                />

                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  希望する働き方
                  <select
                    value={form.workStyle}
                    onChange={handleChange('workStyle')}
                    className={`rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${missingFields.workStyle ? 'border-rose-400' : 'border-slate-300'}`}
                  >
                    <option value="">選択してください</option>
                    {WORK_STYLE_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  {missingFields.workStyle && <p className="text-xs text-rose-600">選択してください</p>}
                </label>

                <MultiSelectTags
                  label="希望業界"
                  description="キャリアを築きたい業界を選んでください。よく選ばれる業界を上部表示しています。"
                  selected={form.desiredIndustry}
                  options={INDUSTRY_OPTIONS}
                  onToggle={(item) => toggleChip('desiredIndustry', item)}
                  onCustomAdd={(val) => addCustomTag('desiredIndustry', val, () => {})}
                  hasError={!!missingFields.desiredIndustry}
                  errorMessage="入力してください"
                />

                <label className="grid gap-2 text-sm font-medium text-slate-900">
                  5年後の理想像
                  <textarea
                    value={form.idealFuture}
                    onChange={handleChange('idealFuture')}
                    placeholder="例: 事業責任者として組織を牽引したい"
                    className={`min-h-[110px] rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${missingFields.idealFuture ? 'border-rose-400' : 'border-slate-300'}`}
                  />
                  {missingFields.idealFuture && <p className="text-xs text-rose-600">入力してください</p>}
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
