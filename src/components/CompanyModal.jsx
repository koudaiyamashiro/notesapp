import React from 'react'

export default function CompanyModal({ open, onClose, company }) {
  if (!open || !company) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="bg-slate-950 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold">{company.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{company.recommendation}</p>
            </div>
            <button onClick={onClose} className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700">閉じる</button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">推薦理由</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{company.recommendation}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">注意点</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{company.caution}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">一致した条件</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.matchedConditions.map((condition) => (
                    <span key={condition} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">✓ {condition}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">総合適合度</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{company.overallFit}点</p>
              </div>
              <div className="space-y-3">
                {company.scoreBreakdown.map((item) => (
                  <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-950">{item.value}点</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">想定キャリアパス</p>
                <ol className="mt-3 space-y-2 text-sm text-slate-600">
                  {company.careerPath.map((path) => (
                    <li key={path} className="flex gap-3">
                      <span className="text-slate-400">•</span>
                      <span>{path}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">想定年収レンジ</p>
                <p className="mt-2 text-sm text-slate-600">{company.salaryRange}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button onClick={onClose} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">閉じる</button>
            <button className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">企業詳細ページへ</button>
          </div>
        </div>
      </div>
    </div>
  )
}
