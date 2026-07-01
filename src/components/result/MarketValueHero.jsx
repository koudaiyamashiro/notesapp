import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartNoAxesCombined, TrendingUp } from 'lucide-react'

const PIE_COLORS = ['#0ea5e9', '#7dd3fc', '#bfdbfe']

function ProbabilityDonut({ data }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {data.map((item, index) => (
        <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">{item.label}</p>
          <div className="mt-2 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'success', value: item.value },
                    { name: 'remaining', value: 100 - item.value },
                  ]}
                  dataKey="value"
                  innerRadius={24}
                  outerRadius={34}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm font-semibold text-slate-900">{item.value}%</p>
        </div>
      ))}
    </div>
  )
}

export default function MarketValueHero({ marketMetrics, salarySeries, successRates, marketValueEvidence, salaryProjectionDetails, successProbabilityDetails }) {
  return (
    <section id="overview" className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            <ChartNoAxesCombined className="h-3.5 w-3.5" />
            診断結果サマリー
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">意思決定のためのキャリア分析ダッシュボード</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">市場価値、適性、企業比較、リスクを一画面で可視化。次に取るべき行動まで落とし込めます。</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3"><p className="text-xs text-slate-500">市場価値スコア</p><p className="mt-1 text-2xl font-semibold text-slate-900">{marketMetrics.score}<span className="text-sm">/100</span></p></div>
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3"><p className="text-xs text-slate-500">偏差値</p><p className="mt-1 text-2xl font-semibold text-slate-900">{marketMetrics.deviation}</p></div>
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3"><p className="text-xs text-slate-500">全国順位</p><p className="mt-1 text-lg font-semibold text-slate-900">{marketMetrics.nationalRank}</p></div>
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3"><p className="text-xs text-slate-500">同年代順位</p><p className="mt-1 text-lg font-semibold text-slate-900">{marketMetrics.sameAgeRank}</p></div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">推定年収レンジの推移</p>
              <span className="inline-flex items-center gap-1 text-xs text-sky-700"><TrendingUp className="h-3.5 w-3.5" />上昇予測</span>
            </div>
            <div className="mt-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salarySeries} margin={{ left: 6, right: 8, top: 10, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="min" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="max" stroke="#0f172a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500">現在: {marketMetrics.salaryCurrent} / 3年後: {marketMetrics.salary3y} / 5年後: {marketMetrics.salary5y}</p>
          </div>

          {marketValueEvidence && (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                <p className="text-sm font-semibold text-slate-900">このスコアの根拠</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{marketValueEvidence.reason}</p>
                <div className="mt-3 grid gap-2">
                  {Object.entries(marketValueEvidence.breakdown || {}).slice(0, 4).map(([key, item]) => (
                    <div key={key} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{key}</p>
                        <span className="text-sm font-semibold text-slate-900">{item.score}</span>
                      </div>
                      <p className="mt-1 text-xs leading-6 text-slate-600">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                <p className="text-sm font-semibold text-slate-900">改善すると伸びるポイント</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {(marketValueEvidence.improvementActions || []).map((item) => <li key={item}>- {item}</li>)}
                </ul>
                <p className="mt-4 text-sm font-semibold text-slate-900">プラス評価</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {(marketValueEvidence.positiveFactors || []).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
          <p className="text-sm font-semibold text-slate-900">転職成功確率</p>
          <p className="mt-1 text-xs text-slate-500">準備期間による内定確率の比較</p>
          <div className="mt-4">
            <ProbabilityDonut data={successRates} />
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
            {successProbabilityDetails?.reason || '現時点でも十分戦えますが、半年で書類と面接訴求を改善すると確率が大きく伸びます。'}
          </div>
          {(salaryProjectionDetails || successProbabilityDetails) && (
            <div className="mt-4 space-y-3">
              {salaryProjectionDetails && (
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
                  <p className="font-semibold text-slate-900">年収推移の前提</p>
                  <p className="mt-1 leading-6">{salaryProjectionDetails.projectionReason}</p>
                </div>
              )}
              {successProbabilityDetails && (
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
                  <p className="font-semibold text-slate-900">転職成功確率が上がる理由</p>
                  <ul className="mt-2 space-y-1">
                    {(successProbabilityDetails.actionsToImprove || []).map((item) => <li key={item}>- {item}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
