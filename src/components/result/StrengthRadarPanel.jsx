import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import SectionCard from './SectionCard.jsx'

export default function StrengthRadarPanel({ data }) {
  const diffRows = [...data]
    .map((item) => ({ ...item, diff: item.you - item.avg }))
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))

  return (
    <SectionCard
      id="strength"
      title="強み・弱み分析"
      subtitle="8軸レーダーであなたと同年代平均を比較。差分を見れば、面接で推すべき軸がすぐに分かります。"
    >
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="h-[320px] rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="78%" data={data}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: '#475569', fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} />
              <Radar dataKey="you" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.32} />
              <Radar dataKey="avg" stroke="#64748b" fill="#cbd5e1" fillOpacity={0.26} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
          <p className="text-sm font-semibold text-slate-900">平均との差</p>
          <div className="mt-3 space-y-2">
            {diffRows.map((item) => (
              <div key={item.axis} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                <span className="text-slate-700">{item.axis}</span>
                <span className={`font-semibold ${item.diff >= 0 ? 'text-sky-600' : 'text-amber-600'}`}>
                  {item.diff >= 0 ? '+' : ''}{item.diff} pt
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
