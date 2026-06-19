import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

const INITIAL_FORM = {
  age: '',
  industry: '',
  role: '',
  experience: '',
  income: '',
  skills: '',
  weakTasks: '',
  purpose: '',
  desiredIndustry: '',
  workStyle: '',
  idealFuture: '',
}

export default function Assessment() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)

  const handleChange = (key) => (event) => {
    setForm({ ...form, [key]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/result', { state: form })
  }

  return (
    <div className="bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-500">キャリア診断</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">あなたの今と、5年後の理想像を入力ください</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                12項目の入力内容をもとに、AI風のダミー診断でキャリア戦略を可視化します。API不要で実用的なMVPを体験できます。
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <p className="font-semibold text-slate-950">入力内容</p>
              <ul className="mt-4 space-y-3">
                <li>年齢</li>
                <li>現在の業界 / 職種</li>
                <li>経験年数 / 年収</li>
                <li>得意スキル / 苦手業務</li>
                <li>転職目的 / 希望業界</li>
                <li>希望する働き方 / 5年後の理想像</li>
              </ul>
            </div>
          </div>

          <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
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
                  required
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                現在の業界
                <input
                  type="text"
                  value={form.industry}
                  onChange={handleChange('industry')}
                  placeholder="例: ITサービス"
                  required
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                現在の職種
                <input
                  type="text"
                  value={form.role}
                  onChange={handleChange('role')}
                  placeholder="例: プロジェクトマネージャー"
                  required
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                />
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
                  required
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                年収（万円）
                <input
                  type="number"
                  min="200"
                  max="3000"
                  value={form.income}
                  onChange={handleChange('income')}
                  placeholder="例: 850"
                  required
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                希望する働き方
                <select
                  value={form.workStyle}
                  onChange={handleChange('workStyle')}
                  required
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">選択してください</option>
                  <option value="フルリモート">フルリモート</option>
                  <option value="ハイブリッド">ハイブリッド</option>
                  <option value="オフィス中心">オフィス中心</option>
                </select>
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                得意スキル
                <textarea
                  value={form.skills}
                  onChange={handleChange('skills')}
                  placeholder="例: 要件定義、チームマネジメント、データ分析"
                  required
                  className="min-h-[130px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                苦手業務
                <textarea
                  value={form.weakTasks}
                  onChange={handleChange('weakTasks')}
                  placeholder="例: 単純作業、長時間会議、細かい資料作成"
                  required
                  className="min-h-[130px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-slate-900">
              転職目的
              <textarea
                value={form.purpose}
                onChange={handleChange('purpose')}
                placeholder="例: より裁量のある仕事に集中したい、年収を上げたい"
                required
                className="min-h-[130px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
              />
            </label>
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                希望業界
                <input
                  type="text"
                  value={form.desiredIndustry}
                  onChange={handleChange('desiredIndustry')}
                  placeholder="例: SaaS、AI関連、DX"
                  required
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                5年後の理想像
                <textarea
                  value={form.idealFuture}
                  onChange={handleChange('idealFuture')}
                  placeholder="例: 事業責任者として組織を牽引したい"
                  required
                  className="min-h-[130px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </div>

            <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-slate-800">
              診断結果を表示する
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
