import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

export default function Assessment() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    age: '',
    industry: '',
    role: '',
    experience: '',
    skills: '',
    interests: '',
  })

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
      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-500">キャリア診断</p>
            <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">あなたの経験と価値観を入力してください</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">シンプルな6つの質問で、キャリア戦略のベースを作成します。入力内容は全てダミーデータに基づき表示されます。</p>
          </div>
          <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                年齢
                <input type="number" min="18" max="70" value={form.age} onChange={handleChange('age')} placeholder="例: 32" required className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-900">
                経験年数
                <input type="number" min="0" max="50" value={form.experience} onChange={handleChange('experience')} placeholder="例: 5" required className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-900">
              現在の業界
              <input type="text" value={form.industry} onChange={handleChange('industry')} placeholder="例: ITサービス" required className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-900">
              現在の職種
              <input type="text" value={form.role} onChange={handleChange('role')} placeholder="例: プロジェクトマネージャー" required className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-900">
              得意スキル
              <textarea value={form.skills} onChange={handleChange('skills')} placeholder="例: 要件定義、チームマネジメント、データ分析" required className="min-h-[130px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-900">
              興味のある領域
              <textarea value={form.interests} onChange={handleChange('interests')} placeholder="例: デジタルトランスフォーメーション、AI、SaaS" required className="min-h-[130px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-sky-100" />
            </label>
            <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition hover:bg-slate-800">
              診断する
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
