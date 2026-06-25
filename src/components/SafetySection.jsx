import { LockKeyhole, Shield, Sparkles } from 'lucide-react'
import SectionReveal from './SectionReveal.jsx'

const items = [
  {
    title: 'プライバシー保護',
    description: '入力情報は本人同意なく第三者共有しません。診断データは意思決定支援のみに使用します。',
    icon: LockKeyhole,
  },
  {
    title: 'セキュリティ設計',
    description: '通信は暗号化し、アクセス制御を実施。正式版では監査ログと保護ポリシーを順次拡張します。',
    icon: Shield,
  },
  {
    title: 'AI活用ポリシー',
    description: 'AIの提案は補助情報として提示し、比較根拠と判断材料を併記して最終判断を支援します。',
    icon: Sparkles,
  },
]

export default function SafetySection() {
  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal>
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-600">Trust and Safety</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              安心して使える設計を、
              <span className="block text-slate-700">正式版クオリティで整備。</span>
            </h2>
          </div>
        </SectionReveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <SectionReveal key={item.title} delay={index * 0.08}>
                <article className="h-full rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6FF] text-sky-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
