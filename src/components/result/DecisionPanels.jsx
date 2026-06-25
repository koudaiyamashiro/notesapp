import { AlertTriangle, CheckCircle2, Lightbulb, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionCard from './SectionCard.jsx'

function AiSummaryBlock({ summary, positives, warnings }) {
  return (
    <SectionCard
      id="ai-summary"
      title="AI総評"
      subtitle="結論を吹き出し形式で表示。強みと注意点を分けて読みやすく整理しています。"
      className="h-full"
    >
      <div className="space-y-3">
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-7 text-slate-700">
          <p className="font-semibold text-slate-900">総評</p>
          <p className="mt-1">{summary}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><CheckCircle2 className="h-4 w-4 text-sky-500" />良い兆候</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {positives.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><AlertTriangle className="h-4 w-4 text-amber-500" />注意ポイント</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {warnings.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function RiskBlock({ risks }) {
  return (
    <SectionCard
      id="risk"
      title="リスク分析"
      subtitle="向いていない理由、転職時の注意点、市場リスクを優先度つきで整理しています。"
      className="h-full"
    >
      <div className="space-y-2">
        {risks.map((risk, idx) => (
          <div key={risk.title} className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldAlert className={`h-4 w-4 ${idx === 0 ? 'text-rose-500' : idx === 1 ? 'text-amber-500' : 'text-sky-500'}`} />
              {risk.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{risk.detail}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function ActionBlock({ actions }) {
  return (
    <SectionCard
      id="actions"
      title="次にやるべきアクション"
      subtitle="すぐに動ける実行カード。所要時間と効果が分かるので優先度を決めやすくなります。"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {actions.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><Lightbulb className="h-4 w-4 text-sky-500" />{item.title}</p>
            <p className="mt-2 text-xs text-slate-500">所要: {item.time}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.detail}</p>
            <Link to="/assessment" className="mt-3 inline-flex rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-400">
              {item.cta}
            </Link>
          </article>
        ))}
      </div>
    </SectionCard>
  )
}

export default function DecisionPanels({ aiSummary, positives, warnings, risks, actions }) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <AiSummaryBlock summary={aiSummary} positives={positives} warnings={warnings} />
        <RiskBlock risks={risks} />
      </div>
      <ActionBlock actions={actions} />
    </div>
  )
}
