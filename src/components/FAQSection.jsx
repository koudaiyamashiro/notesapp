const faqs = [
  {
    question: '診断は無料ですか？',
    answer:
      '基本診断は無料で利用できます。正式版では詳細レポートや面接対策などを有料機能として提供予定です。',
  },
  {
    question: '診断には何分かかりますか？',
    answer: '目安は3〜5分です。',
  },
  {
    question: '入力した情報は企業に共有されますか？',
    answer: 'ユーザーの許可なく企業へ共有されることはありません。',
  },
  {
    question: 'AIだけで判断されますか？',
    answer:
      'AIによる分析結果は意思決定の補助です。最終判断はユーザー自身で行えるよう、根拠や比較情報も提示します。',
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-600">FAQ</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            よくある質問
          </h2>
        </div>

        <div className="mt-12 grid gap-4">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 open:bg-white open:shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                Q. {item.question}
              </summary>
              <p className="mt-4 text-sm leading-7 text-slate-600">A. {item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
