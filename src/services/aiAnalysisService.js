function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function extractProfileSignals(profile) {
  const strengths = Array.isArray(profile.strengths) ? profile.strengths : []
  const weaknesses = Array.isArray(profile.weaknesses) ? profile.weaknesses : []
  const purpose = Array.isArray(profile.purpose) ? profile.purpose : [profile.purpose]
  const desiredIndustry = Array.isArray(profile.desiredIndustry) ? profile.desiredIndustry : []

  return {
    role: profile.role || '未設定',
    level: profile.level || '未設定',
    experience: profile.experience || '未設定',
    income: profile.income || '未設定',
    strengths,
    weaknesses,
    purpose,
    desiredIndustry,
    workStyle: profile.workStyle || '未設定',
    idealFuture: profile.idealFuture || '未設定',
  }
}

function buildCompanyInsights(profile, company, index, total) {
  const strengths = Array.isArray(profile.strengths) ? profile.strengths : []
  const weaknesses = Array.isArray(profile.weaknesses) ? profile.weaknesses : []
  const purpose = Array.isArray(profile.purpose) ? profile.purpose : [profile.purpose]
  const desiredIndustry = Array.isArray(profile.desiredIndustry) ? profile.desiredIndustry : []
  const reasonCards = []
  const cautionPoints = []
  const conditionTags = []

  if (profile.role) {
    reasonCards.push({
      title: '経験の活用',
      detail: `${profile.role}としての経験を、そのまま事業成果に変換しやすいです。`,
    })
  }

  if (strengths[0]) {
    reasonCards.push({
      title: '得意領域との一致',
      detail: `得意領域の「${strengths[0]}」が、この企業の実務で活きやすいです。`,
    })
    conditionTags.push(strengths[0])
  }

  const industry = desiredIndustry.find((item) => normalizeText(company.industry).includes(normalizeText(item)) || normalizeText(company.matchKeywords?.join(' ')).includes(normalizeText(item)))
  if (industry) {
    reasonCards.push({
      title: '業界の一致',
      detail: `希望業界の「${industry}」と親和性が高く、キャリアの軸を崩しにくいです。`,
    })
    conditionTags.push(`${industry}志向`)
  }

  if (purpose.some((item) => normalizeText(item).includes('裁量'))) {
    reasonCards.push({
      title: '目的の一致',
      detail: '裁量を広げたい意図と、任される範囲の広さが合っています。',
    })
    conditionTags.push('裁量重視')
  }

  if (purpose.some((item) => normalizeText(item).includes('年収'))) {
    conditionTags.push('年収アップ志向')
  }

  if (profile.workStyle && normalizeText(profile.workStyle).includes('リモート')) {
    conditionTags.push('リモート志向')
  }
  if (profile.workStyle && normalizeText(profile.workStyle).includes('ハイブリッド')) {
    conditionTags.push('ハイブリッド志向')
  }

  if (profile.idealFuture && (normalizeText(profile.idealFuture).includes('リーダー') || normalizeText(profile.idealFuture).includes('管理職') || normalizeText(profile.idealFuture).includes('責任者'))) {
    reasonCards.push({
      title: 'キャリア目標との接続',
      detail: '5年後の理想像に向けて、1年後・3年後の役割拡張が描きやすいです。',
    })
    conditionTags.push('リーダー志向')
  }

  if (company.overallFit >= 80) {
    reasonCards.push({
      title: '総合適合度',
      detail: '他候補と比べても総合バランスが良く、第一候補として検討しやすいです。',
    })
  }

  if (company.workLifeBalanceScore < 65 || company.remoteScore < 60) {
    cautionPoints.push('出社比率が高めで、働き方の柔軟性は限定的です。')
  }
  if (company.growthScore > 88) {
    cautionPoints.push('変化が速く、受け身だと負荷を感じやすい環境です。')
  }
  if (company.ownershipScore > 82) {
    cautionPoints.push('成果責任が強く、裁量と同時に期待値も高めです。')
  }
  if (purpose.some((item) => normalizeText(item).includes('安定')) && company.stabilityScore < 75) {
    cautionPoints.push('安定重視の方には、変化の大きさが負担になる可能性があります。')
  }

  if (reasonCards.length < 3) {
    reasonCards.push({
      title: '条件の納得感',
      detail: `年収レンジ「${company.salaryRange || '未設定'}」とスコアのバランスが取りやすいです。`,
    })
  }

  if (cautionPoints.length < 2) {
    cautionPoints.push('成果基準が比較的高く、自走する前提で評価されやすいです。')
    cautionPoints.push('変化対応のスピードが必要で、学習余地は大きい一方で負荷もあります。')
  }

  const scoreBreakdown = [
    { label: 'スキル適合度', value: company.fit?.skillFit ?? company.overallFit ?? 0 },
    { label: '業界適合度', value: company.fit?.industryFit ?? company.overallFit ?? 0 },
    { label: '働き方適合度', value: company.fit?.workStyleFit ?? company.overallFit ?? 0 },
    { label: 'キャリア適合度', value: company.fit?.careerGoalFit ?? company.overallFit ?? 0 },
    { label: '年収適合度', value: company.fit?.salaryFit ?? company.overallFit ?? 0 },
  ]

  const oneYear = company.careerPathPreview?.oneYear || company.careerPath?.[0] || '専門性を深める'
  const threeYear = company.careerPathPreview?.threeYear || company.careerPath?.[1] || 'リード経験を積む'
  const fiveYear = company.careerPathPreview?.fiveYear || company.careerPath?.[2] || '事業責任を担う'

  return {
    companyName: company.name,
    rank: index + 1,
    totalCompanies: total,
    recommendationTitle: `${company.name}を推奨する理由`,
    profileSummary: extractProfileSignals(profile),
    reasonCards: reasonCards.slice(0, 5),
    cautionPoints: Array.from(new Set(cautionPoints)).slice(0, 4),
    conditionTags: Array.from(new Set(conditionTags)).slice(0, 6),
    scoreBreakdown,
    comparisonTarget: company.comparisonTarget || '',
    comparisonReasons: Array.isArray(company.comparisonReasons) ? company.comparisonReasons.slice(0, 3) : [],
    careerPath: {
      oneYear,
      threeYear,
      fiveYear,
    },
    summary: `総合的に見ると、${company.name}はあなたの現在の経験と5年後の理想像をつなぎやすい候補です。`,
  }
}

export async function generateCompanyInsights(profile, topCompanies = []) {
  await sleep(120)

  const normalizedProfile = extractProfileSignals(profile)
  const companies = topCompanies.map((company, index) => buildCompanyInsights(normalizedProfile, company, index, topCompanies.length))

  return {
    provider: 'mock',
    mode: 'mock',
    generatedAt: new Date().toISOString(),
    profileSummary: normalizedProfile,
    summary: 'AI推薦理由のモックレスポンスです。後で OpenAI / Perplexity に差し替え可能な形で返しています。',
    companies,
  }
}

export const aiAnalysisAdapter = {
  generateCompanyInsights,
}
