const COMPARISONS = [
  { label: '求人検索', general: '◯', ai: '◯' },
  { label: '自己分析', general: '△', ai: '◯' },
  { label: '業界分析', general: '△', ai: '◯' },
  { label: '企業比較', general: '△', ai: '◯' },
  { label: 'キャリアシミュレーション', general: '✕', ai: '◯' },
  { label: '日々のスキル蓄積', general: '✕', ai: '◯' },
]

function FeatureMark({ value, highlighted }) {
  return (
    <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${highlighted ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
      {value}
    </div>
  )
}

export default function ComparisonSection() {
  return (
    <section id="compare" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-0 bg-slate-950 px-6 py-5 text-sm uppercase tracking-[0.24em] text-slate-100">
            <span className="font-semibold">項目</span>
            <span className="font-semibold text-right">一般的な転職サービス</span>
            <span className="font-semibold text-right">Career Strategist AI</span>
          </div>
          <div className="divide-y divide-slate-200 px-6 py-6 text-sm text-slate-600">
            {COMPARISONS.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.6fr_1fr_1fr] items-center gap-4 py-4">
                <span className="text-slate-950">{row.label}</span>
                <div className="flex justify-end">
                  <FeatureMark value={row.general} highlighted={false} />
                </div>
                <div className="flex justify-end">
                  <FeatureMark value={row.ai} highlighted={true} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
