const previewCards = [
  {
    title: '市場価値スコア',
    value: '78 / 100',
    description: '同年代・同職種比較で上位18%のポジション',
    tone: 'sky',
  },
  {
    title: '向いている業界・職種',
    value: 'ITコンサル / SaaS PMM / 事業企画',
    description: '経験と志向性から適性の高い順で提示',
    tone: 'slate',
  },
  {
    title: '企業比較',
    value: '年収 / 成長環境 / カルチャー',
    description: '候補企業を横並びで比較し、意思決定を支援',
    tone: 'sky',
  },
  {
    title: 'キャリアロードマップ',
    value: '1年 / 3年 / 5年',
    description: '次に取るべきアクションまで具体化',
    tone: 'slate',
  },
]

export default function ResultPreviewSection() {
  return (
    <section id="result-preview" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-600">Result Preview</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            診断後に何が分かるかを、先に確認できます。
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            市場価値、向いている業界・職種、企業比較、ロードマップまでを一画面で把握できるため、
            応募前に意思決定の精度を高められます。
          </p>
        </div>

        <div className="mt-14 rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-10">
          <div className="grid gap-5 lg:grid-cols-2">
            {previewCards.map((card) => (
              <article
                key={card.title}
                className={`rounded-[1.6rem] border p-6 ${
                  card.tone === 'sky'
                    ? 'border-sky-100 bg-[#EAF6FF]'
                    : 'border-slate-200 bg-[#F8FAFC]'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{card.title}</p>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{card.value}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
