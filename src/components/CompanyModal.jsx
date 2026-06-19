import React, { useEffect } from 'react'

export default function CompanyModal({ open, onClose, company }) {
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open || !company) return null
  const reasonCards = company.recommendationReasons?.reasonCards || []
  const cautionPoints = Array.isArray(company.caution) ? company.caution : company.caution ? [company.caution] : []
  const comparisonReasons = company.recommendationReasons?.comparisonReasons || company.comparisonReasons || []
  const careerPath = company.careerPathPreview || {}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 bg-slate-950 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold">{company.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{company.recommendation}</p>
              {company.profileHighlights?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.profileHighlights.slice(0, 4).map((item) => (
                    <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">{item}</span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onClose} className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700">×</button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">向いている理由</p>
                <div className="mt-3 grid gap-3">
                  {reasonCards.slice(0, 5).map((item, index) => (
                    <div key={item.title} className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">理由{index + 1}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">注意点・向いていない理由</p>
                <div className="mt-3 grid gap-2">
                  {cautionPoints.slice(0, 4).map((item) => (
                    <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-600 shadow-sm">{item}</div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">一致条件</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(company.conditionTags || company.matchedConditions || []).slice(0, 8).map((condition) => (
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
                  <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-950">{item.value}%</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">他社との比較理由</p>
                <p className="mt-2 text-sm text-slate-600">
                  {company.comparisonTarget ? `${company.name}が${company.comparisonTarget}より高評価な理由` : '比較対象企業より高い評価を得た理由'}
                </p>
                <div className="mt-3 grid gap-2">
                  {(comparisonReasons.length > 0 ? comparisonReasons : ['比較対象より総合スコアが高いです。']).map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">- {item}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">想定キャリアパス</p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">1年後: {careerPath.oneYear || '専門性を深める'}</div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">3年後: {careerPath.threeYear || 'リード経験を積む'}</div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">5年後: {careerPath.fiveYear || '事業責任を担う'}</div>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
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
