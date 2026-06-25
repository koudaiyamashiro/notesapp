import { Building2, BriefcaseBusiness } from 'lucide-react'
import SectionCard from './SectionCard.jsx'

function RankingCard({ index, title, score, reason }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{index}. {title}</p>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">適性 {score}%</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-sky-500" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{reason}</p>
    </article>
  )
}

export default function RankingPanels({ industries, roles, industryReasons, roleReasons }) {
  return (
    <div id="rankings" className="grid gap-5 xl:grid-cols-2">
      <SectionCard
        title="向いている業界ランキング TOP5"
        subtitle="適性スコアと理由を同時に表示。なぜ向いているかを短時間で把握できます。"
        right={<Building2 className="h-5 w-5 text-sky-500" />}
      >
        <div className="grid gap-3">
          {industries.slice(0, 5).map((item, idx) => (
            <RankingCard key={item.label} index={idx + 1} title={item.label} score={item.score} reason={industryReasons[item.label] || 'あなたの志向・強みとの一致率が高い業界です。'} />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="向いている職種ランキング TOP5"
        subtitle="現在の経験から遷移しやすく、年収と成長の両面で期待値が高い職種を表示しています。"
        right={<BriefcaseBusiness className="h-5 w-5 text-sky-500" />}
      >
        <div className="grid gap-3">
          {roles.slice(0, 5).map((item, idx) => (
            <RankingCard key={item.role} index={idx + 1} title={item.role} score={item.score} reason={roleReasons[item.role] || 'あなたの強みとキャリア目的の一致度が高い職種です。'} />
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
