import React from 'react'

export default function CompanyModal({ open, onClose, company }) {
  if (!open || !company) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{company.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{company.reason}</p>
          </div>
          <button onClick={onClose} className="ml-4 rounded-full bg-slate-100 px-3 py-2 text-sm">閉じる</button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">向いている理由</p>
            <p className="text-sm text-slate-600">{company.reason}</p>
            <p className="text-sm font-semibold text-slate-700 mt-2">向いていない理由</p>
            <p className="text-sm text-slate-600">{company.reason.includes('コンサル') ? '競争が激しくスピード感が求められる' : '職種によっては専門性の差が出やすい'}</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">カルチャー</p>
            <p className="text-sm text-slate-600">{company.culture || 'プロフェッショナル'}</p>
            <p className="text-sm font-semibold text-slate-700">成長環境</p>
            <p className="text-sm text-slate-600">{company.growth || '高'}</p>
            <p className="text-sm font-semibold text-slate-700">平均年収レンジ</p>
            <p className="text-sm text-slate-600">{company.income ? `${company.income - 100}万円〜${company.income + 200}万円` : '情報なし'}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-3xl bg-slate-100 px-4 py-2 text-sm">閉じる</button>
          <button className="rounded-3xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">企業詳細ページへ</button>
        </div>
      </div>
    </div>
  )
}
