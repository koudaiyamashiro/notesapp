import React from 'react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function RadarWrapper({ data }) {
  return (
    <div className="mt-6 h-[360px]">
      <div className="mb-3 flex items-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" />本人</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-slate-400" />同年代・同職種平均</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar name="あなた" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
          <Radar name="同年代・同職種平均" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
