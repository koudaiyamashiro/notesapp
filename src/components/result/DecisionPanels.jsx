import { AlertTriangle, CheckCircle2, Lightbulb, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionCard from './SectionCard.jsx'

function AiSummaryBlock({ strategy }) {
  const safeStrategy = strategy || {}
  return (
    <SectionCard
      id="ai-summary"
      title="AIによる総合キャリア戦略"
      subtitle="自己分析と企業分析を統合し、次に取るべき戦略まで一つの視点で整理しています。"
      className="h-full"
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-7 text-slate-700">
          <p className="font-semibold text-slate-900">総評</p>
          <p className="mt-1">{safeStrategy.summary || '-'}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><CheckCircle2 className="h-4 w-4 text-sky-500" />市場価値・強み</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {(safeStrategy.marketAndStrengths || []).map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><CheckCircle2 className="h-4 w-4 text-sky-500" />業界・職種の要約</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {(safeStrategy.fitSummary || []).map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><CheckCircle2 className="h-4 w-4 text-sky-500" />おすすめ企業との接点</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {(safeStrategy.companyConnections || []).map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><AlertTriangle className="h-4 w-4 text-amber-500" />企業選びの注意点</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {(safeStrategy.cautions || []).map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">次に取るべき戦略</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {(safeStrategy.nextStrategies || []).map((item) => <li key={item}>- {item}</li>)}
          </ul>
          {(safeStrategy.nextStrategies || []).length === 0 && <p className="mt-2 text-sm text-slate-600">戦略サマリーは準備中です。</p>}
        </div>
      </div>
    </SectionCard>
  )
}

function RiskBlock({ risks }) {
  const safeRisks = Array.isArray(risks) ? risks : []
  return (
    <SectionCard
      id="risk"
      title="リスク分析"
      subtitle="向いていない理由、転職時の注意点、市場リスクを優先度つきで整理しています。"
      className="h-full"
    >
      <div className="space-y-2">
        {safeRisks.map((risk, idx) => (
          <div key={risk.title} className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldAlert className={`h-4 w-4 ${idx === 0 ? 'text-rose-500' : idx === 1 ? 'text-amber-500' : 'text-sky-500'}`} />
              {risk.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{risk.detail}</p>
          </div>
        ))}
        {safeRisks.length === 0 && <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">現在表示できるリスク情報はありません。</div>}
      </div>
    </SectionCard>
  )
}

function ActionBlock({ actions }) {
  const safeActions = Array.isArray(actions) ? actions : []
  return (
    <SectionCard
      id="actions"
      title="次にやるべきアクション"
      subtitle="すぐに動ける実行カード。所要時間と効果が分かるので優先度を決めやすくなります。"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {safeActions.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><Lightbulb className="h-4 w-4 text-sky-500" />{item.title}</p>
            <p className="mt-2 text-xs text-slate-500">所要: {item.time}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.detail}</p>
            {item.locked ? (
              <button type="button" className="mt-3 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                {item.cta}
              </button>
            ) : (
              <Link to={item.href || '/assessment'} className="mt-3 inline-flex rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-400">
                {item.cta}
              </Link>
            )}
          </article>
        ))}
        {safeActions.length === 0 && <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">表示できるアクションがありません。</div>}
      </div>
    </SectionCard>
  )
}

export default function DecisionPanels({ aiSummary, positives, warnings, risks, actions }) {
  const strategy = aiSummary || {
    summary: '-',
    marketAndStrengths: [],
    fitSummary: [],
    companyConnections: [],
    cautions: [],
    nextStrategies: [],
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <AiSummaryBlock strategy={{
          ...strategy,
          marketAndStrengths: strategy.marketAndStrengths?.length ? strategy.marketAndStrengths : positives,
          cautions: strategy.cautions?.length ? strategy.cautions : warnings,
        }} />
        <RiskBlock risks={risks} />
      </div>
      <ActionBlock actions={actions} />
    </div>
  )
}
