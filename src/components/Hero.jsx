import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_32%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="flex flex-col justify-center gap-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm shadow-sky-100/70">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
            AI「求人を探す」から「キャリアを設計する」へ
          </div>

          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              転職先を探す前に、あなたの
              <span className="block text-sky-600">キャリア戦略</span>
              をつくる。
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Career Strategist AI は、あなたの経験・スキル・価値観を分析し、向いている業界・職種・企業・5年後のキャリアロードマップまで提案するAIキャリアコーチです。
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:bg-slate-800" to="/assessment">
              無料でキャリア分析を始める
            </Link>
            <Link className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-semibold text-slate-950 transition hover:border-slate-300" to="#feature">
              デモを見る
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
              <p className="text-4xl font-semibold text-slate-950">72</p>
              <p className="mt-2 text-sm text-slate-500">市場価値スコア</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
              <p className="text-4xl font-semibold text-slate-950">ITコンサル</p>
              <p className="mt-2 text-sm text-slate-500">最適業界</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
              <p className="text-4xl font-semibold text-slate-950">5年</p>
              <p className="mt-2 text-sm text-slate-500">ロードマップ推奨</p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_32px_90px_rgba(15,23,42,0.12)] sm:p-10">
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-sky-100 blur-3xl" aria-hidden="true" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between rounded-[2rem] bg-slate-950 px-5 py-4 text-white shadow-[0_16px_40px_rgba(15,23,42,0.15)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-300">app.careerstrategist.ai / dashboard</p>
                  <p className="mt-3 text-lg font-semibold">市場価値スコア</p>
                </div>
                <div className="rounded-3xl bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.24em] text-slate-200">
                  同年代上位 15%
                </div>
              </div>

              <div className="grid gap-5">
                <div className="rounded-[2rem] bg-slate-50 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">市場価値スコア</p>
                      <p className="mt-3 text-4xl font-semibold text-slate-950">72</p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-xl font-bold text-white">72</div>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-slate-200">
                    <div className="h-2 w-4/5 rounded-full bg-sky-500" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">向いている業界TOP5</p>
                    <ol className="mt-4 space-y-3 text-sm text-slate-600">
                      <li className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">ITコンサル<span className="text-slate-950 font-semibold">92%</span></li>
                      <li className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">SaaS / クラウド<span className="text-slate-950 font-semibold">88%</span></li>
                      <li className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">AI・データ分析<span className="text-slate-950 font-semibold">85%</span></li>
                      <li className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">事業会社DX推進部門<span className="text-slate-950 font-semibold">80%</span></li>
                      <li className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">SIer (上流工程)<span className="text-slate-950 font-semibold">75%</span></li>
                    </ol>
                  </div>
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">スコア内訳</p>
                    <div className="mt-4 space-y-4 text-sm text-slate-600">
                      {['専門スキル', '実務経験', '市場ニーズ', '学習意欲', 'ポータブルスキル'].map((label, index) => (
                        <div key={label}>
                          <div className="mb-2 flex items-center justify-between text-slate-500">
                            <span>{label}</span>
                            <span className="font-semibold text-slate-950">{80 - index * 5}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200">
                            <div className={`h-2 rounded-full bg-sky-500 ${['w-4/5', 'w-5/6', 'w-11/12', 'w-3/4', 'w-4/5'][index]}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
