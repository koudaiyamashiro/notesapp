const STEPS = [
  { title: 'プロフィール・職歴を入力' },
  { title: 'AIがスキル・志向性を分析' },
  { title: '向いている業界・職種を提案' },
  { title: '企業比較・ロードマップを確認' },
  { title: '職務経歴書・面接対策に活用' },
]

export default function FlowSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-500">How it works</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            3分で、キャリアの現在地がわかる。
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            5年後から逆算して、今やるべきことが見える。入力から戦略まで、ステップはたった5つ。
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-base font-semibold text-white">
                {index + 1}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
