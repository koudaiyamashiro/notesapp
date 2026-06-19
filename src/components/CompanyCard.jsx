export default function CompanyCard({ company, rank, onDetail }) {
  return (
    <article tabIndex={0} className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] transition-transform transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">{rank}</span>
            TOP {rank}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-950">{company.name}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{company.reason}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="inline-flex h-12 min-w-[3rem] items-center justify-center rounded-full bg-sky-500 px-4 text-sm font-semibold text-white shadow-sm">{company.overallFit}%</span>
          <button onClick={() => onDetail(company)} className="rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
            詳細を見る
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">推奨理由</p>
          <p className="mt-2 leading-6 line-clamp-3">{company.recommendation}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">注目ポイント</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {company.matchedConditions?.slice(0, 3).map((condition) => (
              <span key={condition} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">{condition}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
