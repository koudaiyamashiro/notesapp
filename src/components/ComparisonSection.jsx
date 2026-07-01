import SectionReveal from './SectionReveal.jsx'

const comparisons = [
  { label: '求人一覧の閲覧', generic: '◎', ai: '◯' },
  { label: '自己分析の構造化', generic: '△', ai: '◎' },
  { label: '市場価値スコア', generic: '△', ai: '◎' },
  { label: '業界/職種の適性分析', generic: '△', ai: '◎' },
  { label: '企業比較（年収/環境/文化）', generic: '△', ai: '◎' },
  { label: '5年ロードマップ', generic: '✕', ai: '◎' },
  { label: '面接訴求ポイント設計', generic: '✕', ai: '◎' },
]

function markClass(value, isPrimary = false) {
  if (value === '◎') return isPrimary ? 'bg-sky-500 text-white' : 'bg-slate-900 text-white'
  if (value === '◯') return 'bg-sky-100 text-sky-700'
  if (value === '△') return 'bg-slate-100 text-slate-600'
  return 'bg-slate-100 text-slate-400'
}

export default function ComparisonSection() {
  return (
    <section id="comparison" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <SectionReveal>
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-600">Comparison</p>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              求人検索だけで終わらない。
              <span className="block text-slate-700">意思決定の質を上げるLP設計。</span>
            </h2>
          </div>
        </SectionReveal>

        <SectionReveal className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_26px_80px_rgba(15,23,42,0.08)]" delay={0.08}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600">
                <th className="px-6 py-4 text-left font-semibold">比較項目</th>
                <th className="px-6 py-4 text-center font-semibold">一般的な転職サイト</th>
                <th className="px-6 py-4 text-center font-semibold">Career Strategist AI</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, index) => (
                <tr key={item.label} className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                  <td className="border-t border-slate-200 px-6 py-4 text-slate-800">{item.label}</td>
                  <td className="border-t border-slate-200 px-6 py-4 text-center">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${markClass(item.generic)}`}>
                      {item.generic}
                    </span>
                  </td>
                  <td className="border-t border-slate-200 px-6 py-4 text-center">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${markClass(item.ai, true)}`}>
                      {item.ai}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionReveal>
      </div>
    </section>
  )
}
