import { useEffect } from 'react'
import { Brain, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react'

const detailItems = [
  '具体的な業務経験',
  '成果実績（KPI/定量成果）',
  'マネジメント経験',
  '使用ツール・技術スタック',
  'プロジェクト規模',
  '苦手な業務シーン',
]

export default function DetailedDiagnosisModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-6">
      <div className="w-full max-w-2xl rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Detailed Assessment</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">さらに詳細診断を行う</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            閉じる
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-7 text-slate-700">
            <p className="inline-flex items-center gap-2 font-semibold text-slate-900"><Brain className="h-4 w-4 text-sky-600" />診断精度をさらに高める追加分析</p>
            <p className="mt-2">
              追加情報を入力すると、より精緻なレーダーチャート・市場価値スコア・企業推薦・キャリアロードマップを生成できます。
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="text-sm font-semibold text-slate-900">追加で確認する項目</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {detailItems.map((item) => (
                <div key={item} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  <ChevronRight className="h-4 w-4 text-sky-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><Sparkles className="h-4 w-4 text-sky-500" />得られる価値</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>- 面接で話すべき強みの解像度が上がる</li>
                <li>- 企業比較の判断精度が高まる</li>
                <li>- 3年後/5年後の戦略が明確になる</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><ShieldCheck className="h-4 w-4 text-sky-500" />提供予定</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                詳細診断機能は正式版で提供予定です。現時点では先行導線のみ表示しています。
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              onClick={onClose}
            >
              後で確認する
            </button>
            <button
              className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
              onClick={onClose}
            >
              近日提供
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
