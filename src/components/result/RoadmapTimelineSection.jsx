import { Milestone, Route } from 'lucide-react'
import SectionCard from './SectionCard.jsx'

export default function RoadmapTimelineSection({ roadmapItems }) {
  return (
    <SectionCard
      id="roadmap"
      title="キャリアロードマップ"
      subtitle="半年後から5年後まで、各フェーズでやるべきことをタイムラインで整理しています。"
      right={<Route className="h-5 w-5 text-sky-500" />}
    >
      <div className="space-y-4">
        {roadmapItems.map((item, idx) => (
          <div key={item.period} className="relative rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
                <Milestone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.period}</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{item.title}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                  {item.tasks.map((task) => <li key={task}>- {task}</li>)}
                </ul>
              </div>
            </div>
            {idx < roadmapItems.length - 1 && <div className="ml-4 mt-4 h-6 w-[2px] bg-sky-300" />}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
