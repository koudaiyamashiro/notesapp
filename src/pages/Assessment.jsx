import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import MultiSelectTags from '../components/MultiSelectTags.jsx'

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

function filterOptions(options, query) {
  const keyword = String(query || '').trim().toLowerCase()
  if (!keyword) return options
  return options.filter((item) => item.toLowerCase().includes(keyword))
}

const AGE_OPTIONS = Array.from({ length: 65 - 18 + 1 }, (_, index) => 18 + index)
const EXPERIENCE_OPTIONS = Array.from({ length: 40 }, (_, index) => ({ value: String(index + 1), label: `${index + 1}年` }))

const ROLE_OPTIONS = [
  '営業',
  'マーケティング',
  'ITコンサル',
  '戦略コンサル',
  'PM',
  'BizDev',
  '人事',
  '経理',
  '事業企画',
  'エンジニア',
  'データアナリスト',
  'カスタマーサクセス',
  'その他',
]

const LEVEL_OPTIONS = ['メンバー', '主任', '係長', '課長', '部長', '執行役員', '経営層']

const COMMON_STRENGTH_OPTIONS = [
  '課題整理',
  '要件定義',
  '顧客折衝',
  '関係者調整',
  'プロジェクト推進',
  'データ分析',
  '業務改善',
  '戦略立案',
  '企画立案',
  '施策実行',
  '新規開拓',
  '既存顧客深耕',
  'マネジメント',
  'チームリード',
  'プロダクト企画',
  'マーケティング戦略',
  '広告運用',
  'CRM/MA活用',
  '採用/組織開発',
  '財務/数値管理',
  'AI/デジタル活用',
  'その他',
]

const STRENGTH_OPTIONS = {
  営業: ['新規開拓', '既存顧客深耕', '顧客折衝', '関係者調整', '提案設計', '施策実行', '数値管理', 'チームリード', ...COMMON_STRENGTH_OPTIONS],
  マーケティング: ['マーケティング戦略', '広告運用', 'CRM/MA活用', 'データ分析', '施策実行', '企画立案', 'プロジェクト推進', ...COMMON_STRENGTH_OPTIONS],
  エンジニア: ['要件定義', '課題整理', 'AI/デジタル活用', 'プロジェクト推進', '業務改善', 'データ分析', 'チームリード', ...COMMON_STRENGTH_OPTIONS],
  'ITコンサル': ['課題整理', '要件定義', '関係者調整', 'プロジェクト推進', '戦略立案', '業務改善', 'データ分析', ...COMMON_STRENGTH_OPTIONS],
  '戦略コンサル': ['戦略立案', '課題整理', '要件定義', '企画立案', 'データ分析', '関係者調整', ...COMMON_STRENGTH_OPTIONS],
  PM: ['プロダクト企画', '要件定義', 'プロジェクト推進', '関係者調整', 'データ分析', 'チームリード', ...COMMON_STRENGTH_OPTIONS],
  BizDev: ['戦略立案', '企画立案', '新規開拓', '顧客折衝', '関係者調整', '施策実行', ...COMMON_STRENGTH_OPTIONS],
  人事: ['採用/組織開発', '関係者調整', '企画立案', '施策実行', 'データ分析', 'マネジメント', ...COMMON_STRENGTH_OPTIONS],
  経理: ['財務/数値管理', '業務改善', 'データ分析', '関係者調整', '課題整理', ...COMMON_STRENGTH_OPTIONS],
  事業企画: ['戦略立案', '企画立案', '課題整理', 'プロジェクト推進', 'データ分析', '関係者調整', ...COMMON_STRENGTH_OPTIONS],
  カスタマーサクセス: ['顧客折衝', '関係者調整', '業務改善', '施策実行', 'データ分析', ...COMMON_STRENGTH_OPTIONS],
  データアナリスト: ['データ分析', '課題整理', '要件定義', '業務改善', 'AI/デジタル活用', ...COMMON_STRENGTH_OPTIONS],
  その他: COMMON_STRENGTH_OPTIONS,
}

const WEAKNESS_OPTIONS = [
  '曖昧な要件を自分で整理すること',
  '関係者調整が多い環境',
  '数値責任を強く求められる環境',
  '新規開拓中心の営業活動',
  '短期成果を強く求められる環境',
  '高速な意思決定と変化対応',
  '事業責任を持つこと',
  'マネジメント業務',
  '深い専門性を継続的に磨くこと',
  '顧客折衝が多い業務',
  '未経験領域を自走で学ぶこと',
  '定量分析・データ活用',
  '企画から実行まで一気通貫で担うこと',
  'プレッシャーの高い環境',
  '出社頻度が高い働き方',
  '大企業的な調整文化',
  'ベンチャー的な曖昧さ',
  'グローバル/英語対応',
  'その他',
]

const PURPOSE_OPTIONS = ['年収アップ', '市場価値向上', '裁量拡大', 'マネジメント経験', 'リモート勤務', 'ワークライフバランス', '専門性向上', '事業責任者', '起業準備', 'グローバル経験', 'その他']

const INDUSTRY_OPTIONS = ['SaaS', 'AI', 'DX', 'ITコンサル', '人材', '広告', '金融', '製造', 'ヘルスケア', '教育', 'その他']

const WORK_STYLE_OPTIONS = ['出社中心', 'ハイブリッド', 'フルリモート', '裁量重視', '安定重視']

const steps = ['基本情報', '得意/苦手領域', '志向性']
export default function Assessment() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [missingFields, setMissingFields] = useState({})

  const strengthOptions = useMemo(() => STRENGTH_OPTIONS[form.role] || STRENGTH_OPTIONS['その他'], [form.role])

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
      setForm({ ...form, role: value, strengths: [] })
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
                    {ROLE_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
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
                    <option value="200未満">200万円未満</option>
                    <option value="200-300">200〜300万円</option>
                    <option value="300-400">300〜400万円</option>
                    <option value="400-500">400〜500万円</option>
                    <option value="500-600">500〜600万円</option>
                    <option value="600-700">600〜700万円</option>
                    <option value="700-800">700〜800万円</option>
                    <option value="800-900">800〜900万円</option>
                    <option value="900-1000">900〜1000万円</option>
                    <option value="1000-1200">1000〜1200万円</option>
                    <option value="1200以上">1200万円以上</option>
                  </select>
                  {missingFields.income && <p className="text-xs text-rose-600">選択してください</p>}
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5">
                <MultiSelectTags
                  label="得意領域"
                  description="あなたが強みとして活かせる領域を選択してください"
                  selected={form.strengths}
                  options={Array.from(new Set(strengthOptions))}
                  onToggle={(item) => toggleChip('strengths', item)}
                  onCustomAdd={(val) => addCustomTag('strengths', val, () => {})}
                  hasError={!!missingFields.strengths}
                  errorMessage="入力してください"
                />

                <MultiSelectTags
                  label="苦手領域"
                  description="避けたい業務や負荷に感じやすい領域を選択してください"
                  selected={form.weaknesses}
                  options={WEAKNESS_OPTIONS}
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
                  description="キャリアを築きたい業界を選んでください。複数選択できます。"
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
