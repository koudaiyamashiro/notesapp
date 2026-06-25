import SectionCard from './SectionCard.jsx'

function companyDifficulty(company) {
  if (company.growthScore >= 90) return '高'
  if (company.growthScore >= 82) return '中'
  return '中-'
}

function turnoverRate(company) {
  const estimated = Math.max(4, 18 - Math.round(company.stabilityScore / 8))
  return `${estimated}%`
}

function benefitLabel(company) {
  if (company.workLifeBalanceScore >= 70) return '充実'
  if (company.workLifeBalanceScore >= 60) return '標準'
  return '要確認'
}

function growthLabel(company) {
  if (company.growthScore >= 90) return '非常に高い'
  if (company.growthScore >= 80) return '高い'
  return '中程度'
}

export default function CompanyComparisonTable({ companies }) {
  return (
    <SectionCard
      id="compare"
      title="企業比較テーブル"
      subtitle="主要11項目を横並びで比較。数値不足の項目は推定値として表示し、判断軸を揃えています。"
    >
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead>
            <tr className="bg-[#F8FAFC] text-slate-600">
              <th className="px-4 py-3 font-semibold">比較項目</th>
              {companies.slice(0, 5).map((company) => (
                <th key={company.name} className="px-4 py-3 font-semibold">{company.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['年収', (c) => c.salaryRange],
              ['昇給率', (c) => `${Math.max(3, Math.round(c.growthScore / 15))}%`],
              ['残業時間', (c) => `${Math.max(12, 42 - Math.round(c.workLifeBalanceScore / 2))}h/月`],
              ['リモート率', (c) => `${c.remoteScore}%`],
              ['離職率', (c) => `${turnoverRate(c)} (推定)`],
              ['社員数', (c) => `${Math.max(400, c.stabilityScore * 120)}名 (推定)`],
              ['平均年齢', (c) => `${28 + Math.round((100 - c.stabilityScore) / 6)}歳 (推定)`],
              ['福利厚生', (c) => benefitLabel(c)],
              ['カルチャー', (c) => c.culture || '標準'],
              ['難易度', (c) => companyDifficulty(c)],
              ['成長性', (c) => growthLabel(c)],
            ].map(([label, getter], rowIdx) => (
              <tr key={label} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                <td className="border-t border-slate-200 px-4 py-3 font-medium text-slate-800">{label}</td>
                {companies.slice(0, 5).map((company) => (
                  <td key={`${company.name}-${label}`} className="border-t border-slate-200 px-4 py-3 text-slate-700">{getter(company)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}
