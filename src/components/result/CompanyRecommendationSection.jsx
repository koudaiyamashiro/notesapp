import { Building2, Clock3, Leaf, TrendingUp, Users } from 'lucide-react'
import SectionCard from './SectionCard.jsx'

function logoText(name) {
  return String(name || '').slice(0, 2)
}

function workStyleLabel(remoteScore) {
  if (remoteScore >= 70) return 'リモート中心'
  if (remoteScore >= 50) return 'ハイブリッド'
  return '出社中心'
}

function cultureTone(culture) {
  if (!culture) return 'バランス型'
  if (culture.includes('プロフェッショナル')) return 'プロ志向'
  if (culture.includes('実行')) return '実行志向'
  if (culture.includes('安定')) return '安定志向'
  return culture
}

export default function CompanyRecommendationSection({ companies = [], onOpenCompany }) {
  const safeCompanies = Array.isArray(companies) ? companies : []

  return (
    <SectionCard
      id="companies"
      title="おすすめ企業 TOP5"
      subtitle="企業ロゴ、年収、カルチャー、成長環境、働き方、平均年齢、推薦理由を並べて比較しやすくしています。"
      right={<Building2 className="h-5 w-5 text-sky-500" />}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {safeCompanies.slice(0, 5).map((company, idx) => (
          <article key={company.name} className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-800 shadow-sm">
                  {logoText(company.name)}
                </div>
                <div>
                  <p className="text-xs text-slate-500">TOP {idx + 1}</p>
                  <h3 className="text-base font-semibold text-slate-900">{company.name}</h3>
                </div>
              </div>
              <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white">適合度 {company.overallFit}%</span>
            </div>

            <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-2">年収: <span className="font-semibold text-slate-900">{company.salaryRange}</span></p>
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-2">カルチャー: <span className="font-semibold text-slate-900">{cultureTone(company.culture)}</span></p>
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-2">成長環境: <span className="font-semibold text-slate-900">{company.growthScore}点</span></p>
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-2">働き方: <span className="font-semibold text-slate-900">{workStyleLabel(company.remoteScore)}</span></p>
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-2">平均年齢: <span className="font-semibold text-slate-900">{28 + Math.round((100 - company.stabilityScore) / 6)}歳</span></p>
              <p className="rounded-lg border border-slate-200 bg-white px-3 py-2">働きやすさ: <span className="font-semibold text-slate-900">{company.workLifeBalanceScore}点</span></p>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4 text-sky-500" />{company.recommendationReasons?.reasonCards?.[0]?.detail || company.recommendation}</p>
              <p className="inline-flex items-center gap-2"><Leaf className="h-4 w-4 text-sky-500" />{company.recommendationReasons?.reasonCards?.[1]?.detail || '強みとの一致が高く、成果を出しやすい環境です。'}</p>
              <p className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-sky-500" />{company.concernPoints?.[0] || '期待値が高いため、事前準備の質が重要です。'}</p>
              <p className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-sky-500" />今やるべき準備: 実績の数値化と面接訴求ポイントの統一</p>
            </div>

            {company.aiRecommendation && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">なぜこの企業なのか</p>
                <p className="mt-1 leading-6">{company.aiRecommendation.whyRecommended}</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-600">
                  {(company.aiRecommendation.matchedUserFactors || []).slice(0, 2).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onOpenCompany?.(company)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                詳細を見る
              </button>
            </div>
          </article>
        ))}

        {safeCompanies.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">表示できる企業データがありません。</div>
        )}
      </div>
    </SectionCard>
  )
}
