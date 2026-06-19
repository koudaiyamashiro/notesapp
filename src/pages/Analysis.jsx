import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

const STEPS = [
  '職種とスキルの適性を解析中',
  '業界マッチ度を算出中',
  '企業候補を比較中',
  '5年後ロードマップを生成中',
]

export default function Analysis() {
  const location = useLocation()
  const navigate = useNavigate()
  const form = location.state
  const [phase, setPhase] = useState(0)
  const [progress, setProgress] = useState(0)

  const completed = useMemo(() => STEPS.map((_, index) => index <= phase), [phase])

  useEffect(() => {
    if (!form) {
      navigate('/assessment')
      return
    }

    const interval = setInterval(() => {
      setPhase((prev) => Math.min(prev + 1, STEPS.length - 1))
      setProgress((prev) => Math.min(prev + 25, 100))
    }, 700)

    const timeout = setTimeout(() => {
      navigate('/result', { state: form })
    }, 3200)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [form, navigate])

  return (
    <div className="bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-12">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-500">AI 分析中</p>
          <h1 className="mt-5 text-3xl font-semibold text-slate-950 sm:text-4xl">AIがキャリア戦略を分析しています</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            ご入力いただいた内容から、現在の市場価値・適性・おすすめ企業・未来戦略を精緻に生成します。
          </p>

          <div className="mt-12 space-y-4">
            {STEPS.map((label, index) => (
              <div key={label} className="flex items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${completed[index] ? 'bg-sky-500 text-white' : 'border border-slate-300 text-slate-500'}`}>
                  {completed[index] ? '✓' : index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{label}</p>
                  <p className="text-sm text-slate-500">{completed[index] ? '完了' : '解析中...'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.24em] text-sky-300">
              <span>全体進捗</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-sm text-slate-300">AIエンジンがキャリア情報を分析し、最適な結果レポートを組み立てています。</p>
          </div>
        </section>
      </main>
    </div>
  )
}
