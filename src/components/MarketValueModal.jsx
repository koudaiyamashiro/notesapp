import React from 'react'

export default function MarketValueModal({ open, onClose, form, result }) {
  if (!open) return null
  const estIncome = result.recommendedCompanies?.[0]?.income || '情報なし'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">市場価値の詳細</h3>
            <p className="mt-2 text-sm text-slate-600">入力内容をもとに市場価値の根拠と改善アクションを提示します。</p>
          </div>
          <button onClick={onClose} className="ml-4 rounded-full bg-slate-100 px-3 py-2 text-sm">閉じる</button>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">強み</p>
            <p className="text-sm text-slate-600 mt-2">{(form.strengths || []).join('、') || '特定された強みがありません'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">弱み</p>
            <p className="text-sm text-slate-600 mt-2">{(form.weaknesses || []).join('、') || '特定された弱みがありません'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">市場で評価される理由</p>
            <p className="text-sm text-slate-600 mt-2">{result.insights?.[0] || '市場価値の説明がありません'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">想定年収レンジ</p>
            <p className="text-sm text-slate-600 mt-2">{estIncome ? `${estIncome - 100}万円〜${estIncome + 200}万円` : '情報なし'}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-3xl bg-slate-100 px-4 py-2 text-sm">閉じる</button>
        </div>
      </div>
    </div>
  )
}
