function BarIndicator({ value, highlighted }) {
  return (
    <div className={`rounded-full bg-slate-200 p-1 ${highlighted ? 'bg-sky-100' : ''}`}>
      <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${value}%` }} />
      <div className="mt-2 text-xs font-semibold text-slate-700 text-right">{value}点</div>
    </div>
  )
}

export default function StarGrid({ companies, metrics, highlighted }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-[1.6fr_repeat(5,minmax(120px,1fr))] items-center gap-2 bg-slate-950 px-4 py-3 text-sm text-slate-100">
          <div className="font-semibold">指標</div>
          {companies.map((c) => (
            <div key={c.name} className="text-center font-semibold">{c.name}</div>
          ))}
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          {metrics.map((m) => (
            <div key={m} className={`grid grid-cols-[1.6fr_repeat(5,minmax(120px,1fr))] items-start gap-2 px-4 py-4 text-sm ${highlighted === m ? 'bg-sky-50' : ''}`}>
              <div className={`font-medium ${highlighted === m ? 'text-sky-600' : 'text-slate-700'}`}>{m}</div>
              {companies.map((company) => {
                const scoreObj = company.scores?.find((s) => s.label === m)
                const val = scoreObj?.value || 60
                return (
                  <div key={`${company.name}-${m}`} className="rounded-3xl bg-slate-50 p-3 shadow-sm">
                    <BarIndicator value={val} highlighted={highlighted === m} />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
