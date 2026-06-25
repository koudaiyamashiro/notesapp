import { CircleHelp, ShieldCheck, Sparkles } from 'lucide-react'
import SectionReveal from './SectionReveal.jsx'

const faqs = [
  {
    question: '診断は無料ですか？',
    answer:
      '基本診断は無料で利用できます。正式版では詳細レポートや面接対策などを有料機能として提供予定です。',
  },
  {
    question: '診断には何分かかりますか？',
    answer: '目安は3〜5分です。入力内容が明確なほど、分析結果の精度も高まります。',
  },
  {
    question: '入力した情報は企業に共有されますか？',
    answer: 'ユーザーの許可なく企業へ共有されることはありません。プライバシー保護を前提に設計しています。',
  },
  {
    question: 'AIだけで判断されますか？',
    answer:
      'AIによる分析結果は意思決定の補助です。最終判断はユーザー自身で行えるよう、根拠と比較情報を併記します。',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-[#EAF6FF] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              <CircleHelp className="h-3.5 w-3.5" />
              FAQ
            </div>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">よくある質問</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              使い方・料金・データ取り扱いに関する質問をまとめています。
              不明点がある場合でも、まずは無料診断で体験できます。
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-sky-500" />プライバシー重視の設計</p>
              <p className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-sky-500" />AI分析は根拠付きで提示</p>
            </div>
          </div>

          <div className="grid gap-4">
            {faqs.map((item, index) => (
              <SectionReveal key={item.question} delay={index * 0.06}>
                <details className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 open:bg-white open:shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                  <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-slate-900">Q. {item.question}</summary>
                  <p className="mt-4 text-sm leading-7 text-slate-600">A. {item.answer}</p>
                </details>
              </SectionReveal>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
