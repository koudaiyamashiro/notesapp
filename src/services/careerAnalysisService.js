import companies from '../data/companies/index.js'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function countMatches(source, targets) {
  const values = Array.isArray(source) ? source : [source]
  return targets.reduce((sum, target) => {
    const matches = values.some((value) => normalizeText(value).includes(normalizeText(target)))
    return sum + (matches ? 1 : 0)
  }, 0)
}

function parseSalaryRange(rangeText) {
  const match = String(rangeText).match(/(\d+)[^\d]+(\d+)/)
  const min = match ? Number(match[1]) : 0
  const max = match ? Number(match[2]) : min || 0
  const mid = min && max ? Math.round((min + max) / 2) : min || 800
  return { min, max, mid }
}

const defaultCompany = {
  id: '',
  name: '',
  industry: 'その他',
  companyType: '',
  description: '',
  recommendedRoles: [],
  strengths: [],
  risks: [],
  culture: '',
  salaryRange: '0-0万円',
  growthScore: 70,
  stabilityScore: 50,
  ownershipScore: 50,
  remoteScore: 50,
  workLifeBalanceScore: 50,
  suitableFor: [],
  notSuitableFor: [],
  matchKeywords: [],
}

const companyCandidates = companies.map((company) => {
  const companyData = { ...defaultCompany, ...company }
  const { min: salaryMin, max: salaryMax, mid: salaryMid } = parseSalaryRange(companyData.salaryRange)
  return {
    ...companyData,
    key: companyData.id,
    salaryMin,
    salaryMax,
    salaryMid,
    income: salaryMid,
    score: companyData.growthScore,
    discretion: companyData.ownershipScore >= 80 ? '高' : companyData.ownershipScore >= 65 ? '中' : '低',
    stability: companyData.stabilityScore >= 85 ? '高' : companyData.stabilityScore >= 70 ? '中' : '低',
  }
})

const INDUSTRY_LABELS = {
  'ITコンサル': 'ITコンサル',
  SaaS: 'SaaS',
  AI: 'AI',
  DX: 'DX',
  '事業会社': '事業会社',
  金融: '金融',
  製造: '製造',
  人材: '人材',
  広告: '広告',
  その他: 'その他',
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function includesIn(field, substr) {
  if (Array.isArray(field)) return field.some((v) => normalizeText(v).includes(normalizeText(substr)))
  return normalizeText(String(field)).includes(normalizeText(substr))
}

function scoreForIndustry(desiredIndustries, target) {
  const hasTarget = desiredIndustries.some((industry) => normalizeText(industry).includes(normalizeText(target)))
  return hasTarget ? 92 : 78
}

function buildRadarBenchmark(role) {
  const normalizedRole = normalizeText(role)
  if (normalizedRole.includes('エンジニア')) {
    return { specialization: 74, execution: 66, analytics: 72, communication: 60, management: 58, growth: 68 }
  }
  if (normalizedRole.includes('マーケ')) {
    return { specialization: 68, execution: 68, analytics: 66, communication: 64, management: 57, growth: 67 }
  }
  if (normalizedRole.includes('営業')) {
    return { specialization: 64, execution: 70, analytics: 58, communication: 72, management: 60, growth: 66 }
  }
  if (normalizedRole.includes('コンサル')) {
    return { specialization: 71, execution: 69, analytics: 70, communication: 67, management: 62, growth: 70 }
  }
  return { specialization: 66, execution: 65, analytics: 62, communication: 63, management: 58, growth: 64 }
}

function buildRadarData(form) {
  const role = normalizeText(form.role)
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const hasData = strengths.some((s) => normalizeText(s).includes('データ') || normalizeText(s).includes('ai'))
  const hasCommunicate = strengths.some((option) => ['プレゼン', '顧客折衝', 'ファシリテーション'].some((k) => normalizeText(option).includes(normalizeText(k))))
  const hasManage = ['主任', '係長', '課長', '部長', '執行役員', '経営層'].includes(form.level)
  const benchmark = buildRadarBenchmark(form.role)
  return [
    { subject: '専門性', A: Math.min(100, 60 + (role.includes('エンジニア') ? 18 : role.includes('マーケティング') ? 12 : 8) + (hasData ? 6 : 0)), B: benchmark.specialization, fullMark: 100 },
    { subject: '推進力', A: Math.min(100, 58 + (strengths.includes('新規開拓') ? 12 : includesIn(form.purpose, '裁量') ? 8 : 4)), B: benchmark.execution, fullMark: 100 },
    { subject: '分析力', A: Math.min(100, 54 + (hasData ? 18 : strengths.includes('資料作成') ? 8 : 4)), B: benchmark.analytics, fullMark: 100 },
    { subject: 'コミュニケーション', A: Math.min(100, 56 + (hasCommunicate ? 16 : 6)), B: benchmark.communication, fullMark: 100 },
    { subject: 'マネジメント', A: Math.min(100, 50 + (hasManage ? 20 : 6) + (form.level === 'マネージャー' ? 6 : 0)), B: benchmark.management, fullMark: 100 },
    { subject: '成長意欲', A: Math.min(100, 62 + Math.min(Number(form.experience) * 2, 18) + (includesIn(form.purpose, '成長') ? 8 : 0)), B: benchmark.growth, fullMark: 100 },
  ]
}

function mapIncomeRangeToValue(incomeRange) {
  const incomeMap = {
    '200未満': 150,
    '200-300': 250,
    '300-400': 350,
    '400-500': 450,
    '500-600': 550,
    '600-700': 650,
    '700-800': 750,
    '800-900': 850,
    '900-1000': 950,
    '1000-1200': 1100,
    '1200以上': 1300,
  }
  return incomeMap[String(incomeRange) || ''] || 500
}

function buildProfileHighlights(form) {
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const weaknesses = Array.isArray(form.weaknesses) ? form.weaknesses : []
  const purpose = Array.isArray(form.purpose) ? form.purpose : [form.purpose]
  const desiredIndustry = Array.isArray(form.desiredIndustry) ? form.desiredIndustry : []
  const highlights = []

  if (form.role) highlights.push(`現在の職種は${form.role}`)
  if (form.level) highlights.push(`職位は${form.level}`)
  if (String(form.experience || '').trim()) highlights.push(`経験年数は${form.experience}年`)
  if (String(form.income || '').trim()) highlights.push(`年収レンジは${form.income}`)
  if (strengths.length > 0) highlights.push(`得意領域は${strengths.slice(0, 2).join('、')}`)
  if (weaknesses.length > 0) highlights.push(`苦手領域は${weaknesses.slice(0, 2).join('、')}`)
  if (purpose.length > 0) highlights.push(`転職目的は${purpose.slice(0, 2).join('、')}`)
  if (desiredIndustry.length > 0) highlights.push(`希望業界は${desiredIndustry.slice(0, 2).join('、')}`)
  if (form.workStyle) highlights.push(`働き方は${form.workStyle}`)
  if (form.idealFuture) highlights.push(`5年後は${form.idealFuture}`)

  return highlights.slice(0, 8)
}

function buildCareerPathPreview(company) {
  const annualPath = buildCareerPath(company)
  return {
    oneYear: annualPath[0] || '専門性を深める',
    threeYear: annualPath[1] || 'リード経験を積む',
    fiveYear: annualPath[2] || '事業責任を担う',
  }
}

function buildComparisonNote(company, referenceCompany, fit, referenceFit) {
  if (!referenceCompany) return []
  const notes = []
  if (fit.skillFit > referenceFit.skillFit) {
    notes.push(`「${company.name}」は「${referenceCompany.name}」より、現在の職種や得意領域との親和性が高いです。`)
  }
  if (fit.workStyleFit > referenceFit.workStyleFit) {
    notes.push('希望する働き方との一致度が高く、日々の負荷を合わせやすいです。')
  }
  if (fit.industryFit > referenceFit.industryFit) {
    notes.push('希望業界との一致率が高く、キャリアの軸を崩さずに進めます。')
  }
  if (fit.salaryFit > referenceFit.salaryFit) {
    notes.push('年収レンジもより近く、転職後の条件面で納得感が出やすいです。')
  }
  if (fit.careerGoalFit > referenceFit.careerGoalFit) {
    notes.push('5年後の理想像に向けたキャリアのつながりが作りやすいです。')
  }
  return notes.slice(0, 3)
}

function buildConditionTags(form, company, fit) {
  const conditions = []
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const purpose = Array.isArray(form.purpose) ? form.purpose : [form.purpose]

  if (form.role) conditions.push(form.role)
  if (strengths[0]) conditions.push(strengths[0])
  if (purpose.some((item) => includesIn(item, '年収'))) conditions.push('年収アップ志向')
  if (purpose.some((item) => includesIn(item, '裁量'))) conditions.push('裁量重視')
  if (purpose.some((item) => includesIn(item, '成長'))) conditions.push('成長志向')
  if (String(form.workStyle || '').includes('リモート')) conditions.push('リモート志向')
  if (String(form.workStyle || '').includes('ハイブリッド')) conditions.push('ハイブリッド志向')
  if (String(form.idealFuture || '').includes('リーダー') || String(form.idealFuture || '').includes('管理職')) conditions.push('リーダー志向')
  if (company.industry) conditions.push(`${company.industry}志向`)
  if (fit.skillFit >= 80 && strengths.length > 0) conditions.push('スキル適合度高')

  return Array.from(new Set(conditions)).slice(0, 6)
}

function buildRoleRecommendations(form, strengths) {
  const role = normalizeText(form.role)
  const preferences = [
    { role: 'SaaS営業', score: role.includes('営業') ? 92 : 72 },
    { role: 'BizDev', score: (role.includes('営業') || role.includes('マーケティング')) ? 88 : 68 },
    { role: 'カスタマーサクセス', score: role.includes('営業') ? 86 : 68 },
    { role: '事業企画', score: role.includes('企画') ? 92 : role.includes('コンサル') ? 86 : 70 },
    { role: 'データアナリスト', score: (role.includes('マーケ') || role.includes('エンジニア') || strengths.some((s) => normalizeText(s).includes('データ'))) ? 90 : 72 },
    { role: 'プロジェクトマネージャー', score: (role.includes('コンサル') || role.includes('pm') || role.includes('エンジニア')) ? 88 : 70 },
    { role: 'ITコンサルタント', score: role.includes('コンサル') ? 94 : 74 },
  ]
  return preferences.sort((a, b) => b.score - a.score).slice(0, 5)
}

function buildCompanyFit(form, company) {
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const weaknesses = Array.isArray(form.weaknesses) ? form.weaknesses : []
  const desiredIndustry = Array.isArray(form.desiredIndustry) ? form.desiredIndustry : []
  const purpose = Array.isArray(form.purpose) ? form.purpose : [form.purpose]
  const workStyle = String(form.workStyle || '')
  const idealFuture = String(form.idealFuture || '')
  const experience = Number(form.experience) || 0
  const level = normalizeText(form.level)
  const userIncome = mapIncomeRangeToValue(form.income)
  const role = normalizeText(form.role)

  const roleMatch = company.recommendedRoles.some((item) => normalizeText(item).includes(role) || role.includes(normalizeText(item)))
  const levelMatch = ['リーダー', '主任', '係長', '課長', '部長', 'マネージャ', '経営'].some((item) => level.includes(item))
  const skillOverlap = countMatches(strengths, company.strengths.concat(company.matchKeywords))
  const weaknessOverlap = countMatches(weaknesses, company.risks.concat(company.notSuitableFor))
  const industryMatches = desiredIndustry.reduce((sum, item) => {
    const normalized = normalizeText(item)
    return sum + (normalizeText(company.industry).includes(normalized) || company.matchKeywords.some((keyword) => normalizeText(keyword).includes(normalized)) ? 1 : 0)
  }, 0)
  const targetIndustry = desiredIndustry.find((item) => normalizeText(company.industry).includes(normalizeText(item)) || company.matchKeywords.some((keyword) => normalizeText(keyword).includes(normalizeText(item))))

  let skillFit = 46 + Math.min(24, skillOverlap * 9) + (roleMatch ? 10 : 0) + Math.min(8, experience)
  if (levelMatch) skillFit += 4
  if (weaknessOverlap > 0) skillFit -= Math.min(10, weaknessOverlap * 4)
  if (company.ownershipScore >= 80 && (level.includes('マネージャ') || level.includes('リーダー'))) skillFit += 4
  skillFit = clamp(Math.round(skillFit), 35, 100)

  let industryFit = 54 + Math.min(30, industryMatches * 12)
  if (!desiredIndustry.length) industryFit = 70
  if (targetIndustry) industryFit = clamp(Math.round(industryFit + 10), 55, 100)
  industryFit = clamp(industryFit, 40, 100)

  let workStyleFit = 50
  if (includesIn(workStyle, 'リモート')) {
    workStyleFit += company.remoteScore * 0.35
  }
  if (includesIn(workStyle, 'ハイブリッド')) {
    workStyleFit += company.remoteScore * 0.2 + company.workLifeBalanceScore * 0.2
  }
  if (includesIn(workStyle, '出社')) {
    workStyleFit += (100 - company.remoteScore) * 0.3 + 8
  }
  if (includesIn(workStyle, 'ワークライフ') || includesIn(workStyle, 'バランス')) {
    workStyleFit += company.workLifeBalanceScore * 0.35
  }
  workStyleFit = clamp(Math.round(workStyleFit), 30, 100)

  let careerGoalFit = 46
  if (includesIn(purpose, '裁量')) {
    careerGoalFit += company.ownershipScore >= 70 ? 18 : -8
  }
  if (includesIn(purpose, '成長')) {
    careerGoalFit += company.growthScore >= 85 ? 18 : 2
  }
  if (includesIn(purpose, '安定')) {
    careerGoalFit += company.stabilityScore >= 85 ? 18 : -6
  }
  if (includesIn(purpose, '年収')) {
    careerGoalFit += fitSalary(company, userIncome) >= 80 ? 10 : -8
  }
  if (includesIn(idealFuture, 'リーダー') || includesIn(idealFuture, '管理職')) {
    careerGoalFit += company.ownershipScore >= 75 ? 10 : 0
  }
  if (includesIn(idealFuture, '専門家') || includesIn(idealFuture, 'スペシャリスト')) {
    careerGoalFit += includesIn(company.culture, 'プロフェッショナル') ? 10 : 4
  }
  if (includesIn(idealFuture, '起業') || includesIn(idealFuture, '事業成長') || includesIn(idealFuture, '新規事業')) {
    careerGoalFit += company.growthScore >= 88 ? 10 : 2
  }
  careerGoalFit = clamp(Math.round(careerGoalFit), 30, 100)

  const salaryFit = fitSalary(company, userIncome)

  const matchScore = Math.round(
    skillFit * 0.3 +
    industryFit * 0.22 +
    workStyleFit * 0.18 +
    careerGoalFit * 0.18 +
    salaryFit * 0.12
  )

  return {
    skillFit,
    industryFit,
    workStyleFit,
    careerGoalFit,
    salaryFit,
    matchScore,
    roleMatch,
    targetIndustry,
    strengthMatches: skillOverlap,
    weaknessOverlap,
  }
}

function fitSalary(company, userIncome) {
  if (!userIncome || !company.salaryMin || !company.salaryMax) return 60
  const min = company.salaryMin
  const max = company.salaryMax
  if (userIncome >= min && userIncome <= max) return 95
  if (userIncome < min) return clamp(Math.round(85 - (min - userIncome) / 15), 40, 95)
  return clamp(Math.round(75 - (userIncome - max) / 15), 20, 85)
}

function buildCompanyCandidates(form) {
  const rankedCandidates = companyCandidates
    .map((company) => {
      const fit = buildCompanyFit(form, company)
      const conditions = buildMatchedConditions(form, company)
      const recommendationReasons = buildRecommendationReasons(form, company, fit)
      const concernPoints = buildConcernPoints(form, company, fit)
      const scoreBreakdown = buildScoreBreakdown(form, company, fit)
      return {
        ...company,
        reason: company.description,
        recommendation: recommendationReasons.reasonCards?.[0]?.detail || company.description,
        recommendationReasons,
        caution: concernPoints,
        concernPoints,
        matchedConditions: conditions.length > 0 ? conditions : ['年収アップ', 'キャリア成長'],
        conditionTags: buildConditionTags(form, company, fit),
        scoreBreakdown,
        overallFit: fit.matchScore,
        fit,
        careerPath: buildCareerPath(company),
        careerPathPreview: buildCareerPathPreview(company),
        salaryRange: buildSalaryRange(company),
        profileHighlights: buildProfileHighlights(form),
      }
    })
    .sort((a, b) => b.overallFit - a.overallFit)

  return rankedCandidates.map((company, index, allCompanies) => {
    const referenceCompany = allCompanies[index + 1] || allCompanies.find((item) => item.name !== company.name) || null
    const referenceFit = referenceCompany?.fit || company.fit
    const comparisonReasons = buildComparisonNote(company, referenceCompany, company.fit, referenceFit)
    const recommendationReasons = company.recommendationReasons || {}
    return {
      ...company,
      comparisonTarget: referenceCompany?.name || '',
      comparisonReasons,
      recommendationReasons: {
        ...recommendationReasons,
        comparisonTarget: referenceCompany?.name || '',
        comparisonReasons,
      },
    }
  })
}

function buildComparison(candidates) {
  return candidates.map((company) => ({
    name: company.name,
    scores: [
      { label: '年収', value: clamp(Math.round((company.salaryMid / 1200) * 100), 40, 100) },
      { label: '成長環境', value: clamp(company.growthScore, 40, 100) },
      { label: '裁量', value: clamp(company.ownershipScore, 40, 100) },
      { label: '安定性', value: clamp(company.stabilityScore, 40, 100) },
      { label: 'カルチャー適合', value: clamp(Math.round((company.stabilityScore + company.workLifeBalanceScore) / 2), 40, 100) },
      { label: '働き方適合', value: clamp(Math.round((company.remoteScore + company.workLifeBalanceScore) / 2), 40, 100) },
    ],
  }))
}

function buildInsights(form, finalScore, roles) {
  const experience = Number(form.experience) || 0
  return [
    `現在の市場価値スコアは${finalScore}点です。経験${experience}年、年収レンジ${String(form.income || '未設定')}を基に算出しています。`,
    includesIn(form.purpose, '裁量')
      ? '裁量重視のポジションを狙うことで市場価値をさらに引き上げられます。'
      : '専門性を深めることでキャリアの上昇余地が広がります。',
    `${form.role}の経験を活かすと、${roles[0]?.role || '専門職'}や${roles[1]?.role || 'PM'}への遷移が自然です。`,
  ]
}

function buildActions(form, strengths, desired) {
  return [
    `強みの「${strengths.join('、') || 'スキル'}」を求人要件に反映し、適合度の高い案件を3件ピックアップする`,
    `希望業界「${desired.join('、')}」の企業カルチャーと成長戦略を比較分析する`,
    `${String(form.workStyle || '').includes('フルリモート') ? 'リモート可の企業を優先して検討する' : 'ハイブリッド/出社条件を企業ごとに整理する'}`,
  ]
}

function buildAnalytics(form) {
  const experience = Number(form.experience) || 0
  const income = mapIncomeRangeToValue(form.income)
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const desired = Array.isArray(form.desiredIndustry) ? form.desiredIndustry : []

  let skillFit = 50 + Math.min(30, strengths.length * 6) + Math.min(10, experience)
  if (normalizeText(form.role).includes('エンジニア') && strengths.some((s) => normalizeText(s).includes('データ'))) skillFit += 6
  skillFit = Math.min(100, Math.round(skillFit))

  let orientationFit = 40
  orientationFit += Math.min(40, (Array.isArray(form.purpose) ? form.purpose.length : 0) * 6)
  if (includesIn(form.purpose, '年収') || includesIn(form.purpose, '年収アップ') || includesIn(form.purpose, '市場価値')) orientationFit += 4
  orientationFit += String(form.idealFuture || '').length > 20 ? 6 : 0
  orientationFit = Math.min(100, Math.round(orientationFit))

  let marketValue = Math.min(100, Math.round((income / 1300) * 100))
  if (desired.some((d) => normalizeText(d).includes('saas') || normalizeText(d).includes('ai'))) marketValue = Math.min(100, marketValue + 8)

  let workFit = 50
  if (String(form.workStyle || '').includes('フルリモート') && desired.some((d) => normalizeText(d).includes('saas') || normalizeText(d).includes('it'))) workFit = 85
  if (String(form.workStyle || '').includes('ハイブリッド')) workFit = 72
  workFit = Math.min(100, Math.round(workFit))

  const finalScore = Math.round(skillFit * 0.4 + orientationFit * 0.3 + marketValue * 0.2 + workFit * 0.1)

  return {
    skillFit,
    orientationFit,
    marketValue,
    workFit,
    finalScore,
  }
}

function buildMatchedConditions(form, company) {
  const conditions = []
  const desiredIndustry = Array.isArray(form.desiredIndustry) ? form.desiredIndustry : []
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const purpose = Array.isArray(form.purpose) ? form.purpose : [form.purpose]
  const workStyle = String(form.workStyle || '')
  const idealFuture = String(form.idealFuture || '')

  const industryMatch = desiredIndustry.some((item) => normalizeText(company.industry).includes(normalizeText(item)) || company.matchKeywords.some((keyword) => normalizeText(keyword).includes(normalizeText(item))))
  if (industryMatch) {
    const label = normalizeText(company.industry).includes('saas') ? 'SaaS志向' : normalizeText(company.industry).includes('ai') ? 'AI志向' : `${company.industry}志向`
    conditions.push(label)
  }

  const strengthMatch = strengths.find((item) => company.strengths.some((keyword) => normalizeText(keyword).includes(normalizeText(item))) || company.matchKeywords.some((keyword) => normalizeText(keyword).includes(normalizeText(item))))
  if (strengthMatch) conditions.push(strengthMatch)

  if (purpose.some((item) => includesIn(item, '年収') || includesIn(item, '報酬') || includesIn(item, '収入'))) conditions.push('年収アップ')
  if (purpose.some((item) => includesIn(item, '裁量'))) conditions.push('裁量重視')
  if (purpose.some((item) => includesIn(item, '成長'))) conditions.push('成長志向')
  if (purpose.some((item) => includesIn(item, '安定'))) conditions.push('安定重視')
  if (String(workStyle).includes('リモート')) conditions.push('リモート志向')
  if (String(workStyle).includes('ハイブリッド')) conditions.push('ハイブリッド志向')
  if (String(workStyle).includes('ワークライフ') || String(workStyle).includes('バランス')) conditions.push('ワークライフバランス重視')
  if (String(idealFuture).includes('リーダー') || String(idealFuture).includes('管理職')) conditions.push('リーダー志向')

  return Array.from(new Set(conditions)).slice(0, 6)
}

function buildRecommendationReasons(form, company, fit) {
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const purpose = Array.isArray(form.purpose) ? form.purpose : [form.purpose]
  const workStyle = String(form.workStyle || '')
  const idealFuture = String(form.idealFuture || '')
  const reasonCards = []

  if (form.role) {
    reasonCards.push({
      title: '経験の活用',
      detail: `現在の職種「${form.role}」の経験をそのまま活かしやすいです。`,
    })
  }

  const strengthMatch = strengths.find((item) => company.strengths.some((keyword) => normalizeText(keyword).includes(normalizeText(item))) || company.matchKeywords.some((keyword) => normalizeText(keyword).includes(normalizeText(item))))
  if (strengthMatch) {
    reasonCards.push({
      title: '得意領域との一致',
      detail: `得意領域の「${strengthMatch}」が企業の強みや事業で直接活きます。`,
    })
  }

  if (fit.targetIndustry) {
    reasonCards.push({
      title: '業界の一致',
      detail: `希望業界の「${fit.targetIndustry}」と一致し、キャリアの軸を崩さずに進めます。`,
    })
  }

  if (purpose.some((item) => includesIn(item, '裁量')) && company.ownershipScore >= 70) {
    reasonCards.push({
      title: '目的の一致',
      detail: '裁量を増やしたいという転職目的と、任される範囲の広さが一致しています。',
    })
  }

  if (fit.salaryFit >= 70) {
    reasonCards.push({
      title: '年収条件の納得感',
      detail: '希望年収レンジと企業の給与水準に大きな乖離がなく、条件面でも検討しやすいです。',
    })
  }

  if (String(idealFuture).length > 0 && (includesIn(idealFuture, 'リーダー') || includesIn(idealFuture, '管理職') || includesIn(idealFuture, '責任者'))) {
    reasonCards.push({
      title: 'キャリア目標との接続',
      detail: '5年後の理想像に向けて、1年後から段階的に役割を広げやすいです。',
    })
  }

  if (fit.workStyleFit >= 75) {
    reasonCards.push({
      title: '働き方の一致',
      detail: `希望する働き方と、${company.name}のリモート・出社バランスが合っています。`,
    })
  }

  if (reasonCards.length === 0) {
    reasonCards.push({
      title: '総合評価',
      detail: `${company.description}の特徴が、あなたのキャリア志向と噛み合っています。`,
    })
  }

  if (reasonCards.length < 3) {
    if (fit.skillFit >= 75) {
      reasonCards.push({
        title: 'スキル適合度',
        detail: '企業が求めるスキルと、あなたの強みの重なりが十分にあります。',
      })
    }
    if (fit.careerGoalFit >= 75) {
      reasonCards.push({
        title: 'キャリア接続',
        detail: '5年後の理想像に向けて、次の一歩を積みやすい環境です。',
      })
    }
    if (fit.salaryFit >= 75) {
      reasonCards.push({
        title: '条件の納得感',
        detail: '年収レンジが近く、転職後の条件面でも比較しやすいです。',
      })
    }
  }

  const seen = new Set()
  const unique = reasonCards.filter((item) => {
    if (seen.has(item.title)) return false
    seen.add(item.title)
    return true
  })

  return {
    reasonCards: unique.slice(0, 5),
    shortReasons: unique.slice(0, 5).map((item) => item.title),
    profileLead: buildProfileHighlights(form),
    comparisonTarget: '',
    comparisonReasons: [],
  }
}

function buildCaution(company) {
  const defaultWarnings = {
    accenture: '成長環境は高いが多忙なプロジェクトも多い。',
    baycurrent: '裁量が高い反面、スピード感のある対応が求められる。',
    dirbato: '成長ポテンシャルは高いが、スタートアップらしい変化の速さがある。',
    layerx: '挑戦的なミッションが多く、業務範囲が広がりやすい。',
    smarthr: 'SaaS特有の顧客対応力が求められる。',
    cyberagent: '成果主義が強く、短期で結果を出す姿勢が必要。',
    recruit: '業務範囲が広く、裁量と調整の両方が求められる。',
    sansan: '成長期ならではの変化が激しく、柔軟性が必要。',
    freee: 'リモート志向が強いが、プロダクト理解が必須。',
    mercari: 'スピード感が高く、意思決定の速さが求められる。',
  }
  return defaultWarnings[company.key] || '魅力が大きい一方で、スピード感のある対応が求められます。'
}

function buildConcernPoints(form, company, fit) {
  const concerns = []
  const purpose = Array.isArray(form.purpose) ? form.purpose : [form.purpose]
  const workStyle = String(form.workStyle || '')
  const weaknesses = Array.isArray(form.weaknesses) ? form.weaknesses : []

  if (purpose.some((item) => includesIn(item, '安定')) && company.stabilityScore < 75) {
    concerns.push('変化が大きく、安定志向の方には注意が必要です。')
  }
  if (workStyle.includes('ワークライフ') && company.workLifeBalanceScore < 60) {
    concerns.push('ワークライフバランス重視の場合、負荷が高く感じる可能性があります。')
  }
  if (purpose.some((item) => includesIn(item, '年収')) && fit.salaryFit < 70) {
    concerns.push('年収アップ重視では、希望レンジとのギャップが残る可能性があります。')
  }
  if (purpose.some((item) => includesIn(item, '裁量')) && company.ownershipScore < 70) {
    concerns.push('裁量拡大を求める場合、任せられる範囲がやや限定的です。')
  }
  if (weaknesses.some((item) => includesIn(item, '長時間')) && company.workLifeBalanceScore < 60) {
    concerns.push('長時間労働を避けたい方には、稼働量が負担になる可能性があります。')
  }
  if (weaknesses.some((item) => includesIn(item, '変化')) && company.growthScore > 88) {
    concerns.push('変化が苦手な方には、社風のスピード感が合わない可能性があります。')
  }
  if (workStyle.includes('リモート') && company.remoteScore < 55) {
    concerns.push('リモート志向に対して、出社比率が高めです。')
  }

  if (concerns.length < 2) {
    concerns.push(buildCaution(company))
  }
  if (concerns.length < 2) {
    concerns.push('成果期待が高く、受け身だと手応えが弱くなる可能性があります。')
  }

  return Array.from(new Set(concerns)).slice(0, 4)
}

function buildScoreBreakdown(form, company, fit) {
  return [
    { label: 'スキル適合度', value: fit.skillFit },
    { label: '業界適合度', value: fit.industryFit },
    { label: '働き方適合度', value: fit.workStyleFit },
    { label: 'キャリア適合度', value: fit.careerGoalFit },
    { label: '年収適合度', value: fit.salaryFit },
  ]
}

function buildCareerPath(company) {
  const paths = {
    accenture: ['入社1年目：プロジェクト参画', '3年目：チームリード', '5年目：DX戦略担当'],
    baycurrent: ['入社1年目：顧客導入支援', '3年目：ソリューション設計', '5年目：事業開発リード'],
    dirbato: ['入社1年目：AIプロジェクト参画', '3年目：データ戦略構築', '5年目：事業責任者'],
    layerx: ['入社1年目：プロダクト開発', '3年目：プロジェクトリード', '5年目：新規事業オーナー'],
    smarthr: ['入社1年目：SaaS運用', '3年目：事業企画', '5年目：領域リーダー'],
    cyberagent: ['入社1年目：広告プロジェクト', '3年目：グロース戦略担当', '5年目：事業統括'],
    recruit: ['入社1年目：人材戦略支援', '3年目：事業企画', '5年目：組織戦略責任者'],
    sansan: ['入社1年目：B2B営業支援', '3年目：プロダクト改善', '5年目：事業責任者'],
    freee: ['入社1年目：SaaSプロダクト担当', '3年目：機能企画', '5年目：カスタマーエクスペリエンス統括'],
    mercari: ['入社1年目：CtoCサービス運用', '3年目：プロダクトグロース', '5年目：事業横断リード'],
  }
  return paths[company.key] || ['入社1年目：現場経験を積む', '3年目：専門性を高める', '5年目：戦略的キャリアを構築する']
}

function buildSalaryRange(company) {
  const income = company.income || 800
  return `${income - 100}万円〜${income + 200}万円`
}

export function analyzeCareerProfile(input = {}) {
  const form = { ...input }
  const { finalScore } = buildAnalytics(form)
  const roles = buildRoleRecommendations(form, Array.isArray(form.strengths) ? form.strengths : [])
  const candidates = buildCompanyCandidates(form)
  const comparison = buildComparison(candidates)

  const top5Companies = candidates.slice(0, 5)
  const otherCompanies = candidates.slice(5, 20)

  return {
    score: `${finalScore}点`,
    rawScore: finalScore,
    generationComparison: Math.min(98, 70 + Math.round((Number(form.experience) || 0) * 2 + (mapIncomeRangeToValue(form.income) / 100))),
    radarData: buildRadarData(form),
    industries: Object.values(INDUSTRY_LABELS)
      .filter((industry) => industry !== 'その他')
      .map((industry) => ({ label: industry, score: scoreForIndustry(Array.isArray(form.desiredIndustry) ? form.desiredIndustry : [], industry) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5),
    roles,
    recommendedCompanies: top5Companies,
    otherCompanies,
    companyCandidates: candidates,
    comparison: comparison.slice(0, 5),
    roadmap: [
      '現在：現職で強みを棚卸し',
      '1年後：おすすめ職種へ転職',
      '3年後：リーダー・PMとして経験蓄積',
      '5年後：事業責任者・専門家として市場価値最大化',
    ],
    insights: buildInsights(form, finalScore, roles),
    actions: buildActions(form, Array.isArray(form.strengths) ? form.strengths : [], Array.isArray(form.desiredIndustry) ? form.desiredIndustry : []),
  }
}

export { companyCandidates }
