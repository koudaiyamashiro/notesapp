const COMPARISONS = [
  { label: '求人検索', general: '◎', ai: '◯' },
  { label: '自己分析', general: '△', ai: '◎' },
  { label: '市場価値診断', general: '△', ai: '◎' },
  { label: '業界分析', general: '△', ai: '◎' },
  { label: '企業比較', general: '△', ai: '◎' },
  { label: 'キャリアロードマップ', general: '✕', ai: '◎' },
  { label: '意思決定支援', general: '✕', ai: '◯' },
]

function FeatureMark({ value, highlight }) {
  return (
    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${highlight ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-100 text-slate-700'}`}>
      {value}
    </div>
  )
}

export default function ComparisonSection() {
  return (
    <section id="compare" className="bg-white py-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-600">Why us</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            なぜCareer Strategist AIなのか
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            一般的な転職サービスが「求人を届ける」のに対し、Career Strategist AIは「キャリア戦略を設計する」。
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-0 bg-[#F8FAFC] px-6 py-5 text-sm uppercase tracking-[0.24em] text-slate-600">
            <span className="font-semibold">項目</span>
            <span className="font-semibold text-right">一般的な転職サイト</span>
            <span className="font-semibold text-right">Career Strategist AI</span>
          </div>
          <div className="divide-y divide-slate-200 px-6 py-6 text-sm text-slate-600">
            {COMPARISONS.map((row, index) => (
              <div key={row.label} className={`grid grid-cols-[1.6fr_1fr_1fr] items-center gap-4 py-5 ${index % 2 === 0 ? 'bg-[#F8FAFC]' : 'bg-white'}`}>
                <span className="text-slate-900">{row.label}</span>
                <div className="flex justify-end">
                  <FeatureMark value={row.general} highlight={false} />
                </div>
                <div className="flex justify-end">
                  <FeatureMark value={row.ai} highlight={true} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
