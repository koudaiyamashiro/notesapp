const FEATURES = [
  {
    title: '市場価値スコア',
    description: 'スキル・経験・市場ニーズをスコア化し、あなたの価値を可視化します。',
    key: 'A1',
  },
  {
    title: '向いている業界・職種診断',
    description: 'AIがあなたに合う業界と職種をランク付けして提案します。',
    key: 'A2',
  },
  {
    title: '企業比較レポート',
    description: '年収・成長環境・カルチャーを横並びで比較。',
    key: 'A3',
  },
  {
    title: 'キャリアロードマップ',
    description: '1年後・3年後・5年後の意思決定に役立つ道筋を描きます。',
    key: 'A4',
  },
]

export default function FeatureSection() {
  return (
    <section id="feature" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-500">What you get</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            AIがあなた専属の、キャリア戦略コンサルに。
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            あなたに合う業界・職種・企業がわかる。意思決定に必要な材料を、AIが一枚の戦略にまとめます。
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6FF] text-sm font-semibold text-sky-700">
                {feature.key}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
