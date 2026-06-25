import { Link } from 'react-router-dom'
import { ArrowRight, ChartSpline, Target } from 'lucide-react'

export default function ResultSidebarNav({ sections, summary }) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Decision Dashboard</p>
        <p className="mt-2 text-sm text-slate-600">下のセクションを順に見ると、意思決定に必要な情報を一通り確認できます。</p>
        <div className="mt-4 space-y-2">
          {sections.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-sm text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick Summary</p>
          <ChartSpline className="h-4 w-4 text-sky-500" />
        </div>
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          <p className="rounded-lg bg-[#F8FAFC] px-3 py-2">市場価値スコア: <span className="font-semibold text-slate-900">{summary.score}</span></p>
          <p className="rounded-lg bg-[#F8FAFC] px-3 py-2">推奨業界1位: <span className="font-semibold text-slate-900">{summary.topIndustry}</span></p>
          <p className="rounded-lg bg-[#F8FAFC] px-3 py-2">推奨職種1位: <span className="font-semibold text-slate-900">{summary.topRole}</span></p>
          <p className="rounded-lg bg-[#F8FAFC] px-3 py-2">推奨企業1位: <span className="font-semibold text-slate-900">{summary.topCompany}</span></p>
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-slate-200 bg-gradient-to-b from-sky-50 to-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700">
          <Target className="h-3.5 w-3.5" />
          Next
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-700">再診断して条件を調整すると、成功確率とおすすめ企業が更新されます。</p>
        <Link
          to="/assessment"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          再診断する
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}
