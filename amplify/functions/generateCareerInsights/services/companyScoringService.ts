import { CompanyProfile, uniqueStrings } from './responseNormalizer'

type ScoreDetail = {
  skillFit: number
  roleFit: number
  industryFit: number
  salaryFit: number
  workStyleFit: number
  cultureFit: number
  growthFit: number
  careerGoalFit: number
  weaknessRisk: number
  hiringReality: number
  weightedScore: number
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0) : []
}

function overlapScore(left: string[], right: string[]): number {
  if (left.length === 0 || right.length === 0) return 55
  const normLeft = left.map((v) => v.toLowerCase())
  const normRight = right.map((v) => v.toLowerCase())
  let hit = 0
  for (const item of normLeft) {
    if (normRight.some((r) => r.includes(item) || item.includes(r))) hit += 1
  }
  return Math.max(40, Math.min(98, 45 + hit * 18))
}

function salaryBucketMid(income: string): number {
  const text = String(income || '')
  if (text === '200未満') return 180
  if (text === '1200以上') return 1250
  const m = text.match(/(\d+)[^\d]+(\d+)/)
  if (!m) return 700
  return Math.round((Number(m[1]) + Number(m[2])) / 2)
}

function rangeMid(range: string): number {
  const m = String(range || '').match(/(\d+)[^\d]+(\d+)/)
  if (!m) return 900
  return Math.round((Number(m[1]) + Number(m[2])) / 2)
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function buildWeightMap(profile: Record<string, unknown>) {
  const purpose = asStringArray(profile.purpose)
  const workStyle = String(profile.workStyle || '')
  const future = String(profile.idealFuture || '')

  const weights = {
    skillFit: 1.1,
    roleFit: 1.1,
    industryFit: 1.0,
    salaryFit: 1.0,
    workStyleFit: 1.0,
    cultureFit: 0.9,
    growthFit: 1.0,
    careerGoalFit: 1.0,
    weaknessRisk: 1.0,
    hiringReality: 0.9,
  }

  if (purpose.some((p) => p.includes('年収'))) weights.salaryFit += 0.35
  if (purpose.some((p) => p.includes('働き方')) || /リモート|ハイブリッド/.test(workStyle)) weights.workStyleFit += 0.35
  if (/事業責任者|マネジ|経営/.test(future)) {
    weights.growthFit += 0.35
    weights.careerGoalFit += 0.35
  }

  return weights
}

function scoreCompany(profile: Record<string, unknown>, company: CompanyProfile): ScoreDetail {
  const strengths = asStringArray(profile.strengths)
  const weaknesses = asStringArray(profile.weaknesses)
  const industries = asStringArray(profile.desiredIndustry)
  const role = String(profile.role || '')
  const workStyle = String(profile.workStyle || '')
  const future = String(profile.idealFuture || '')

  const skillFit = overlapScore(strengths, company.requiredSkills)
  const roleFit = overlapScore([role], company.targetRoles)
  const industryFit = overlapScore(industries, [company.industry])

  const userIncomeMid = salaryBucketMid(String(profile.income || ''))
  const companySalaryMid = rangeMid(company.salaryRange)
  const salaryGap = Math.abs(companySalaryMid - userIncomeMid)
  const salaryFit = clamp(95 - Math.round(salaryGap / 6), 40, 96)

  const workStyleFit = /リモート/.test(workStyle)
    ? clamp(company.workStyle.includes('リモート') ? 90 : company.workStyle.includes('ハイブリッド') ? 75 : 55, 45, 95)
    : /ハイブリッド/.test(workStyle)
      ? clamp(company.workStyle.includes('ハイブリッド') ? 90 : 70, 45, 95)
      : 70

  const cultureFit = /プロフェッショナル/.test(company.culture) ? 78 : 72
  const growthFit = clamp(55 + company.growthAreas.length * 8 + Math.round(company.qualityScore * 0.15), 45, 96)
  const careerGoalFit = future ? clamp(65 + Math.round(growthFit * 0.25), 45, 96) : 70

  const weaknessRisk = clamp(
    100 - overlapScore(weaknesses, [...company.requiredSkills, ...company.concernSignals]) + 15,
    25,
    92
  )
  const hiringReality = clamp(50 + company.hiringSignals.length * 10 + company.officialSourceCount * 8, 40, 98)

  const weights = buildWeightMap(profile)
  const positive =
    skillFit * weights.skillFit +
    roleFit * weights.roleFit +
    industryFit * weights.industryFit +
    salaryFit * weights.salaryFit +
    workStyleFit * weights.workStyleFit +
    cultureFit * weights.cultureFit +
    growthFit * weights.growthFit +
    careerGoalFit * weights.careerGoalFit +
    hiringReality * weights.hiringReality

  const denom =
    weights.skillFit +
    weights.roleFit +
    weights.industryFit +
    weights.salaryFit +
    weights.workStyleFit +
    weights.cultureFit +
    weights.growthFit +
    weights.careerGoalFit +
    weights.hiringReality

  const weightedScore = clamp(Math.round(positive / denom - (100 - weaknessRisk) * 0.28), 35, 98)

  return {
    skillFit,
    roleFit,
    industryFit,
    salaryFit,
    workStyleFit,
    cultureFit,
    growthFit,
    careerGoalFit,
    weaknessRisk,
    hiringReality,
    weightedScore,
  }
}

export function rankCompanies(profile: Record<string, unknown>, companyProfiles: CompanyProfile[]) {
  const ranked = companyProfiles
    .map((company) => ({ company, score: scoreCompany(profile, company) }))
    .filter((item) => item.company.qualityScore >= 45)
    .filter((item) => item.company.officialSourceCount > 0 || item.company.qualityScore >= 65)
    .sort((a, b) => b.score.weightedScore - a.score.weightedScore)

  const top = ranked.slice(0, 5)

  return top.map(({ company, score }, idx) => {
    const scoreBreakdown = [
      { label: 'スキル適合度', value: score.skillFit },
      { label: '職種適合度', value: score.roleFit },
      { label: '業界適合度', value: score.industryFit },
      { label: '年収適合度', value: score.salaryFit },
      { label: '働き方適合度', value: score.workStyleFit },
    ]

    const concerns = uniqueStrings([
      ...company.concernSignals,
      score.weaknessRisk < 55 ? '苦手領域と役割期待の衝突リスクがあります。' : '',
      company.officialSourceCount < 2 ? '公式情報が限定的なため、面接で事実確認が必要です。' : '',
    ], 4)

    return {
      id: company.normalizedName,
      name: company.name,
      industry: company.industry,
      companyType: 'Dynamic Discovery',
      description: company.businessSummary,
      recommendedRoles: company.targetRoles,
      strengths: company.requiredSkills,
      risks: concerns,
      culture: company.culture,
      salaryRange: company.salaryRange,
      growthScore: score.growthFit,
      stabilityScore: score.hiringReality,
      ownershipScore: score.careerGoalFit,
      remoteScore: score.workStyleFit,
      workLifeBalanceScore: score.workStyleFit,
      suitableFor: [company.industry, ...company.targetRoles.slice(0, 2)],
      notSuitableFor: concerns,
      matchKeywords: [...company.requiredSkills, ...company.growthAreas].slice(0, 6),
      overallFit: score.weightedScore,
      matchScore: score.weightedScore,
      scoreBreakdown,
      recommendation: `${company.name}は診断結果との接続点が多く、事業情報と採用情報の両面から推薦可能性が高い候補です。`,
      recommendationReasons: {
        reasonCards: [
          { title: '診断接続', detail: `職種・強みとの一致度が高く、想定役割は${company.targetRoles[0] || '主要ポジション'}です。` },
          { title: '企業根拠', detail: company.sourceSummaries[0] || '公開情報ベースで事業と採用情報の根拠を確認しています。' },
          { title: '年収現実性', detail: `想定レンジは${company.salaryRange}で、現年収帯との接続可能性があります。` },
        ],
      },
      concernPoints: concerns,
      conditionTags: uniqueStrings([company.industry, company.workStyle, ...company.requiredSkills.slice(0, 2)], 6),
      sourceSummaries: company.sourceSummaries,
      sources: company.sources.map((s) => `${s.title} ${s.url}`),
      sourceObjects: company.sources,
      qualityScore: company.qualityScore,
      rank: idx + 1,
      fit: score,
    }
  })
}
