import SectionCard from './SectionCard.jsx'

function companyDifficulty(company) {
  if (company.growthScore >= 90) return '高'
  if (company.growthScore >= 82) return '中'
  return '中-'
}

function turnoverRate(company) {
  const estimated = Math.max(4, 18 - Math.round((company.stabilityScore || 70) / 8))
  return `${estimated}%`
}

function benefitLabel(company) {
  if ((company.workLifeBalanceScore || 0) >= 70) return '充実'
  if ((company.workLifeBalanceScore || 0) >= 60) return '標準'
  return '要確認'
}

function growthLabel(company) {
  if ((company.growthScore || 0) >= 90) return '非常に高い'
  if ((company.growthScore || 0) >= 80) return '高い'
  return '中程度'
}

function parseSalaryMid(rangeText) {
  const match = String(rangeText || '').match(/(\d+)[^\d]+(\d+)/)
  if (!match) return 0
  return Math.round((Number(match[1]) + Number(match[2])) / 2)
}

const rows = [
  { key: 'salary', label: '年収', getter: (c) => c.salaryRange || '-', score: (c) => parseSalaryMid(c.salaryRange), higherBetter: true },
  { key: 'raise', label: '昇給率', getter: (c) => `${Math.max(3, Math.round((c.growthScore || 70) / 15))}%`, score: (c) => Math.max(3, Math.round((c.growthScore || 70) / 15)), higherBetter: true },
  { key: 'overtime', label: '残業時間', getter: (c) => `${Math.max(12, 42 - Math.round((c.workLifeBalanceScore || 60) / 2))}h/月`, score: (c) => Math.max(12, 42 - Math.round((c.workLifeBalanceScore || 60) / 2)), higherBetter: false, caution: true },
  { key: 'remote', label: 'リモート率', getter: (c) => `${c.remoteScore || 0}%`, score: (c) => c.remoteScore || 0, higherBetter: true },
  { key: 'turnover', label: '離職率', getter: (c) => `${turnoverRate(c)} (推定)`, score: (c) => Number(String(turnoverRate(c)).replace('%', '')), higherBetter: false, caution: true },
  { key: 'members', label: '社員数', getter: (c) => `${Math.max(400, (c.stabilityScore || 70) * 120)}名 (推定)`, score: (c) => Math.max(400, (c.stabilityScore || 70) * 120), higherBetter: true },
  { key: 'age', label: '平均年齢', getter: (c) => `${28 + Math.round((100 - (c.stabilityScore || 70)) / 6)}歳 (推定)`, score: (c) => 28 + Math.round((100 - (c.stabilityScore || 70)) / 6), higherBetter: false },
  { key: 'benefit', label: '福利厚生', getter: (c) => benefitLabel(c), score: (c) => c.workLifeBalanceScore || 0, higherBetter: true },
  { key: 'culture', label: 'カルチャー', getter: (c) => c.culture || '標準', score: (c) => c.stabilityScore || 0, higherBetter: true },
  { key: 'difficulty', label: '難易度', getter: (c) => companyDifficulty(c), score: (c) => c.growthScore || 0, higherBetter: false, caution: true },
  { key: 'growth', label: '成長性', getter: (c) => growthLabel(c), score: (c) => c.growthScore || 0, higherBetter: true },
]

export default function CompanyComparisonTable({ companies = [] }) {
  const safeCompanies = Array.isArray(companies) ? companies.slice(0, 5) : []

  const bestCompanyNameByRow = rows.reduce((acc, row) => {
    if (safeCompanies.length === 0) {
      acc[row.key] = ''
      return acc
    }
    const sorted = [...safeCompanies].sort((a, b) => {
      const av = Number(row.score(a) || 0)
      const bv = Number(row.score(b) || 0)
      return row.higherBetter ? bv - av : av - bv
    })
    acc[row.key] = sorted[0]?.name || ''
    return acc
  }, {})

  return (
    <SectionCard
      id="compare"
      title="企業比較テーブル"
      subtitle="主要11項目を横並びで比較。Best列をハイライトし、注意項目は控えめなオレンジで示しています。"
    >
      {safeCompanies.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-8 text-center text-sm text-slate-500">比較できる企業データがありません</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-[1040px] w-full text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#F1F5F9] text-slate-600">
                <th className="sticky left-0 z-20 border-r border-slate-200 bg-[#F1F5F9] px-4 py-3 font-semibold">比較項目</th>
                {safeCompanies.map((company) => (
                  <th key={company.name} className="px-4 py-3 font-semibold">{company.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={row.key} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                  <td className="sticky left-0 z-10 border-r border-t border-slate-200 bg-inherit px-4 py-3 font-medium text-slate-800">
                    {row.label}
                    {row.caution && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">注意</span>}
                  </td>
                  {safeCompanies.map((company) => {
                    const isBest = bestCompanyNameByRow[row.key] === company.name
                    return (
                      <td
                        key={`${company.name}-${row.key}`}
                        className={`border-t border-slate-200 px-4 py-3 ${
                          row.caution
                            ? 'text-amber-700'
                            : isBest
                              ? 'bg-sky-50 font-semibold text-sky-800'
                              : 'text-slate-700'
                        }`}
                      >
                        <div className="inline-flex items-center gap-2">
                          <span>{row.getter(company)}</span>
                          {isBest && <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-semibold text-white">Best</span>}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  )
}
