import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_20%_10%,_rgba(14,165,233,0.16),_transparent_48%)]" />
      <div className="absolute inset-x-0 top-20 h-[32rem] bg-[radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.12),_transparent_42%)]" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="relative z-10 flex flex-col justify-center gap-8">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-sky-200 bg-[#EAF6FF] px-4 py-2 text-sm font-semibold text-sky-700">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
            AI Career Strategy Platform
          </div>

          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              転職先を探す前に、
              <span className="block text-sky-600">あなたのキャリア戦略を設計する。</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              経験・スキル・志向性をもとに、AIが市場価値、向いている業界・職種、
              企業候補、5年後のロードマップまで可視化します。
            </p>
          </div>

          <div>
            <Link
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(14,165,233,0.25)] transition hover:bg-sky-400"
              to="/assessment"
            >
              無料でキャリア分析を始める
            </Link>
          </div>

          <div className="overflow-hidden rounded-[1.4rem] border border-sky-100 bg-[#F5F7FA] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 sm:gap-3">
              <span className="rounded-full bg-white px-4 py-2">市場価値分析</span>
              <span className="text-sky-500">→</span>
              <span className="rounded-full bg-white px-4 py-2">企業比較</span>
              <span className="text-sky-500">→</span>
              <span className="rounded-full bg-white px-4 py-2">5年ロードマップ</span>
              <span className="text-sky-500">→</span>
              <span className="rounded-full bg-white px-4 py-2">面接対策</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              <p className="text-base font-semibold text-slate-900">AI分析</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">経験・スキル・志向から市場価値を可視化</p>
            </article>
            <article className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              <p className="text-base font-semibold text-slate-900">企業比較</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">年収・成長環境・カルチャーを横並びで比較</p>
            </article>
            <article className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
              <p className="text-base font-semibold text-slate-900">ロードマップ</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">1年後・3年後・5年後のキャリア戦略を提示</p>
            </article>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center">
          <div className="w-full overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-[0_32px_95px_rgba(15,23,42,0.1)] sm:p-8">
            <div className="grid gap-4">
              <div className="rounded-[1.4rem] border border-sky-100 bg-[#EAF6FF] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">市場価値分析</p>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-4xl font-semibold text-slate-900">78</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700">同年代上位 18%</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white">
                  <div className="h-2 w-[78%] rounded-full bg-sky-500" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-slate-200 bg-[#F8FAFC] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">企業比較</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    <li className="flex items-center justify-between rounded-xl bg-white px-3 py-2">年収レンジ<span className="font-semibold">820-980万</span></li>
                    <li className="flex items-center justify-between rounded-xl bg-white px-3 py-2">成長環境<span className="font-semibold">高速</span></li>
                    <li className="flex items-center justify-between rounded-xl bg-white px-3 py-2">カルチャー<span className="font-semibold">裁量高</span></li>
                  </ul>
                </div>

                <div className="rounded-[1.4rem] border border-slate-200 bg-[#F8FAFC] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">5年ロードマップ</p>
                  <ol className="mt-4 space-y-2 text-sm text-slate-700">
                    <li className="rounded-xl bg-white px-3 py-2">1年目: 強み領域の成果最大化</li>
                    <li className="rounded-xl bg-white px-3 py-2">3年目: 事業KPI責任を拡張</li>
                    <li className="rounded-xl bg-white px-3 py-2">5年目: 戦略と実行の統括</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
