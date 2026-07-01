import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import { deleteDiagnosisHistory, listDiagnosisHistory } from '../services/diagnosisHistoryService.js'

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('ja-JP')
}

function getPrimaryRecommendation(history) {
  const industry = Array.isArray(history?.profile?.desiredIndustry) ? history.profile.desiredIndustry[0] : ''
  const company = history?.topCompanies?.[0]?.name
  return industry || company || '-'
}

function mapHistoryError(error) {
  const text = String(error?.message || error || '')
  if (text.includes('Unauthorized') || text.includes('Not Authorized') || text.includes('User needs to be authenticated')) {
    return 'ログイン情報の有効期限が切れました。再ログインしてください。'
  }
  return '診断履歴の取得に失敗しました。時間をおいて再試行してください。'
}

export default function History() {
  const navigate = useNavigate()
  const [histories, setHistories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoadingId, setDeleteLoadingId] = useState('')

  const loadHistories = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listDiagnosisHistory()
      setHistories(data)
    } catch (e) {
      const message = mapHistoryError(e)
      setError(message)
      if (message.includes('再ログイン')) {
        navigate('/login', { replace: true, state: { from: '/history' } })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistories()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('この診断履歴を削除しますか？この操作は元に戻せません。')
    if (!confirmed) return

    setDeleteLoadingId(id)
    setError('')
    try {
      await deleteDiagnosisHistory(id)
      setHistories((prev) => prev.filter((item) => item.id !== id))
    } catch {
      setError('診断履歴の削除に失敗しました。時間をおいて再試行してください。')
    } finally {
      setDeleteLoadingId('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <section className="rounded-[2rem] border border-sky-100 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Diagnosis History</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">診断履歴</h1>
          <p className="mt-3 text-sm text-slate-600">過去の診断結果をいつでも確認できます。ログインユーザーごとに履歴を分離しています。</p>

          {error && <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

          {loading && <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">履歴を読み込んでいます...</div>}

          {!loading && histories.length === 0 && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              保存済みの診断履歴はありません。診断を実行すると履歴がここに表示されます。
            </div>
          )}

          {!loading && histories.length > 0 && (
            <div className="mt-6 space-y-4">
              {histories.map((history) => (
                <article key={history.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold text-slate-900">{history.title || '診断履歴'}</h2>
                      <p className="text-sm text-slate-600">作成日: {formatDate(history.createdAt)}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-700">市場価値: {history.marketValueScore ?? '-'} / 100</span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">転職成功確率: {history.successProbability ?? '-'}%</span>
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-slate-700">推奨: {getPrimaryRecommendation(history)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => navigate('/result', { state: { __historyPayload: history } })}
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500"
                      >
                        結果を見る
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(history.id)}
                        disabled={deleteLoadingId === history.id}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deleteLoadingId === history.id ? '削除中...' : '削除'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
