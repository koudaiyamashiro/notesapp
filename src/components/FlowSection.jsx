import { ArrowRight, Briefcase, Building2, ChartNoAxesCombined, FileCheck2, UserRoundSearch } from 'lucide-react'
import SectionReveal from './SectionReveal.jsx'

const steps = [
  {
    title: 'プロフィール入力',
    desc: '経験・スキル・志向を3分で入力',
    icon: UserRoundSearch,
  },
  {
    title: 'AI分析',
    desc: '市場価値と適性を構造化して分析',
    icon: ChartNoAxesCombined,
  },
  {
    title: '企業比較',
    desc: '条件軸を揃えて候補企業を比較',
    icon: Building2,
  },
  {
    title: 'ロードマップ設計',
    desc: '1年・3年・5年の戦略を生成',
    icon: Briefcase,
  },
  {
    title: '選考準備へ接続',
    desc: '面接訴求ポイントまで整理',
    icon: FileCheck2,
  },
]

export default function FlowSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal>
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-600">How It Works</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              3分で、キャリアの現在地がわかる。
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              入力から比較、ロードマップ、面接準備まで。転職の意思決定を1本の流れで支援します。
            </p>
          </div>
        </SectionReveal>

        <div className="mt-14 rounded-[2rem] border border-slate-200 bg-[#F8FAFC] p-6 shadow-[0_22px_70px_rgba(15,23,42,0.06)]">
          <div className="grid gap-4 lg:grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <SectionReveal key={step.title} delay={index * 0.07}>
                  <article className="relative h-full rounded-[1.2rem] border border-slate-200 bg-white p-5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6FF] text-sky-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{step.desc}</p>
                    {index < steps.length - 1 && (
                      <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-sky-500 lg:block" />
                    )}
                  </article>
                </SectionReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
