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
  const conditionTags = company.conditionTags || company.matchedConditions || []
  const interviewAppeals = company.aiInsights?.interviewAppealPoints || reasonCards.slice(0, 2).map((item) => item.title)
  const preparations = company.aiInsights?.preparationActions || ['職務経歴書の成果を数値で統一', '志望動機を企業課題と接続して整理']
  const expectedRole = company.aiInsights?.profileSummary?.role || company.aiInsights?.careerPath || company.recommendedRoles?.[0] || '適性の高いポジション'
  const offerProbability = company.aiInsights?.estimatedOfferProbability || `約${Math.max(55, Math.min(92, Number(company.overallFit || 70)))}%`
  const avgAge = `${28 + Math.round((100 - Number(company.stabilityScore || 70)) / 6)}歳`
  const workStyle = Number(company.remoteScore || 0) >= 70 ? 'リモート中心' : Number(company.remoteScore || 0) >= 50 ? 'ハイブリッド' : '出社中心'
  const scoreBreakdown = Array.isArray(company.scoreBreakdown) ? company.scoreBreakdown : []
  const recommendation = company.aiRecommendation || {}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-8">
      <div className="w-full max-w-2xl max-h-[82vh] overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.2)]">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">{company.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{company.recommendation || company.description || '企業分析結果を表示します。'}</p>
              {company.profileHighlights?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.profileHighlights.slice(0, 4).map((item) => (
                    <span key={item} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{item}</span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onClose} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">×</button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-[#F8FAFC] p-5">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">会社概要</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{company.description || `${company.name}は成長性と安定性のバランスが良い企業です。`}</p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">想定ポジション</p>
                <p className="mt-2 text-sm text-slate-600">{expectedRole}</p>
              </div>

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
                <p className="text-sm font-semibold text-slate-900">懸念点</p>
                <div className="mt-3 grid gap-2">
                  {cautionPoints.slice(0, 4).map((item) => (
                    <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-600 shadow-sm">{item}</div>
                  ))}
                  {cautionPoints.length === 0 && <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-600 shadow-sm">現在時点で大きな懸念は少ないですが、応募要件との最終照合は必要です。</div>}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">一致条件</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {conditionTags.slice(0, 8).map((condition) => (
                    <span key={condition} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">✓ {condition}</span>
                  ))}
                  {conditionTags.length === 0 && <span className="text-xs text-slate-500">表示可能な一致条件はありません</span>}
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-[#F8FAFC] p-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">総合適合度</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{company.overallFit}点</p>
              </div>
              <div className="space-y-3">
                {scoreBreakdown.map((item) => (
                  <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-950">{item.value}%</span>
                  </div>
                ))}
                {scoreBreakdown.length === 0 && <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">スコア内訳は準備中です。</div>}
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
                <p className="mt-2 text-sm text-slate-600">{company.salaryRange || '情報なし'}</p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">カルチャー・働き方</p>
                <div className="mt-2 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <p>カルチャー: {company.culture || '標準'}</p>
                  <p>働き方: {workStyle}</p>
                  <p>成長環境: {company.growthScore || '-'}点</p>
                  <p>平均年齢: {avgAge}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">面接で訴求すべきポイント</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {((recommendation.interviewAppealPoints || interviewAppeals) || []).slice(0, 3).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">選考前にやるべき準備</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {((recommendation.preparationActions || preparations) || []).slice(0, 3).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">診断結果との接続点</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {(recommendation.matchedUserFactors || []).slice(0, 4).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">企業情報に基づく推薦理由</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {(recommendation.companyFitReasons || []).slice(0, 4).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">参照情報の要約</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{recommendation.evidenceSummary || '公開情報ベースの要約は準備中です。'}</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-500">
                  {(recommendation.sources || []).slice(0, 4).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">内定可能性の目安</p>
                <p className="mt-2 text-sm text-slate-600">{offerProbability}</p>
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
