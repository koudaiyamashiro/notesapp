import React from 'react'

function Stars({ value }) {
  const count = Math.round((value / 100) * 5)
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-4 w-4 ${i < count ? 'text-yellow-400' : 'text-slate-200'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.382 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.49 2.721c-.784.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.51 9.397c-.784-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      ))}
    </div>
  )
}

export default function StarGrid({ companies, metrics, highlighted }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[1.6fr_repeat(var(--cols),1fr)] items-center gap-2 bg-slate-950 px-4 py-3 text-sm text-slate-100" style={{ ['--cols']: companies.length }}>
        <div className="font-semibold">指標</div>
        {companies.map((c) => (
          <div key={c.name} className="text-center font-semibold">{c.name}</div>
        ))}
      </div>
      <div className="divide-y divide-slate-200 bg-white">
        {metrics.map((m) => (
          <div key={m} className="grid grid-cols-[1.6fr_repeat(var(--cols),1fr)] items-center gap-2 px-4 py-4 text-sm text-slate-700" style={{ ['--cols']: companies.length }}>
            <div className={`font-medium ${highlighted === m ? 'text-sky-600' : ''}`}>{m}</div>
            {companies.map((company) => {
              const scoreObj = company.scores?.find((s) => s.label === m)
              const val = scoreObj?.value || 60
              return (
                <div key={`${company.name}-${m}`} className={`flex items-center justify-center ${highlighted === m ? 'bg-sky-50' : ''} rounded-lg p-2`}>
                  <Stars value={val} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
