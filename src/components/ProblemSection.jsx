import { AlertTriangle, Compass, Layers3, Route, SearchX } from 'lucide-react'
import SectionReveal from './SectionReveal.jsx'

const problems = [
  {
    title: '自分に向いている業界が分からない',
    description: '経験の延長で選びがちになり、本当に相性の良い選択肢を見落としやすい。',
    icon: Compass,
  },
  {
    title: '職種ごとの将来性を比較できない',
    description: '求人票では市場価値の伸びしろが見えず、意思決定が感覚に寄る。',
    icon: Layers3,
  },
  {
    title: '企業ごとの違いが曖昧',
    description: '年収だけでなく、成長環境・裁量・文化の差分を把握しづらい。',
    icon: SearchX,
  },
  {
    title: '5年後のキャリアが描けない',
    description: '次の転職先は選べても、その先の戦略が曖昧なままになりやすい。',
    icon: Route,
  },
  {
    title: '転職活動が短期最適になる',
    description: '目先の条件で判断すると、長期での市場価値が伸びにくくなる。',
    icon: AlertTriangle,
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="bg-[#F5F7FA] py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-600">The Problem</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              求人を見るだけでは、
              <span className="block text-slate-700">キャリアは決められない。</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              情報は増えたのに、判断基準が不足している。Career Strategist AI は、
              感覚的な転職活動を戦略的な意思決定へ変えるために設計されています。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {problems.map((item, index) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className={`rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 ${index === 0 ? 'sm:col-span-2' : ''}`}
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6FF] text-sky-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              )
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
