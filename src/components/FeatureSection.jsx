import { Building2, ChartNoAxesCombined, Map, Sparkles } from 'lucide-react'
import SectionReveal from './SectionReveal.jsx'

const features = [
  {
    title: '市場価値スコア',
    description: '経験・スキル・市場需要を統合して、現在地を数値化。',
    icon: ChartNoAxesCombined,
  },
  {
    title: '業界・職種の適性提案',
    description: '向いている業界・役割を根拠付きでランキング化。',
    icon: Sparkles,
  },
  {
    title: '企業比較レポート',
    description: '年収レンジ、成長環境、カルチャーを同一条件で比較。',
    icon: Building2,
  },
  {
    title: 'キャリアロードマップ',
    description: '1年、3年、5年の意思決定と必要アクションを提示。',
    icon: Map,
  },
]

export default function FeatureSection() {
  return (
    <section id="feature" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-[#F8FAFC] p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-600">What You Get</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900">
              AIがあなた専属の
              <span className="block text-slate-700">キャリア戦略コンサルに。</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              単なる求人紹介ではなく、転職前に必要な判断材料を構造化して提供します。
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
              <svg viewBox="0 0 360 180" className="w-full">
                <rect x="16" y="22" width="190" height="122" rx="14" fill="#EAF6FF" />
                <rect x="30" y="36" width="92" height="10" rx="5" fill="#38bdf8" opacity="0.7" />
                <rect x="30" y="56" width="150" height="8" rx="4" fill="#93c5fd" />
                <rect x="30" y="70" width="132" height="8" rx="4" fill="#93c5fd" />
                <rect x="30" y="84" width="120" height="8" rx="4" fill="#93c5fd" />
                <polyline points="240,134 270,96 300,78 332,48" fill="none" stroke="#0ea5e9" strokeWidth="4" />
                <circle cx="240" cy="134" r="5" fill="#0ea5e9" />
                <circle cx="270" cy="96" r="5" fill="#0ea5e9" />
                <circle cx="300" cy="78" r="5" fill="#0ea5e9" />
                <circle cx="332" cy="48" r="5" fill="#0ea5e9" />
              </svg>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6FF] text-sky-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
