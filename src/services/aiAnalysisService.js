function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function resolveCareerInsightsEndpoint() {
  const envUrl = import.meta.env.VITE_GENERATE_CAREER_INSIGHTS_URL || import.meta.env.VITE_AI_ANALYSIS_ENDPOINT || ''
  if (envUrl) return envUrl

  if (typeof window !== 'undefined') {
    const customOutputs = window.__AMPLIFY_CUSTOM_OUTPUTS__ || window.amplify_outputs || window.__AMPLIFY_OUTPUTS__
    const outputUrl = customOutputs?.custom?.generateCareerInsightsUrl
    if (typeof outputUrl === 'string' && outputUrl) return outputUrl
  }

  return ''
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

function normalizeCompanyInsight(company, index) {
  const reasons = Array.isArray(company.reasons) ? company.reasons.filter((item) => typeof item === 'string') : []
  const risks = Array.isArray(company.risks) ? company.risks.filter((item) => typeof item === 'string') : []
  const reasonCards = reasons.map((reason, reasonIndex) => ({
    title: `理由${reasonIndex + 1}`,
    detail: reason,
  }))

  return {
    ...company,
    rank: company.rank || index + 1,
    reasonCards: company.reasonCards || reasonCards,
    cautionPoints: company.cautionPoints || risks,
    comparisonReasons: company.comparisonReasons || reasons,
    summary: company.summary || company.recommendation || '',
  }
}

function normalizeBreakdownItem(item = {}, fallback = {}) {
  return {
    score: Number(item.score ?? fallback.score ?? 70),
    reason: String(item.reason || fallback.reason || ''),
    positiveFactors: Array.isArray(item.positiveFactors) ? item.positiveFactors : (fallback.positiveFactors || []),
    negativeFactors: Array.isArray(item.negativeFactors) ? item.negativeFactors : (fallback.negativeFactors || []),
    improvementActions: Array.isArray(item.improvementActions) ? item.improvementActions : (fallback.improvementActions || []),
  }
}

function normalizeCompanyRecommendation(item = {}, index = 0) {
  return {
    companyName: item.companyName || item.name || `Company ${index + 1}`,
    matchScore: Number(item.matchScore || item.fitScore || 75),
    whyRecommended: String(item.whyRecommended || item.summary || ''),
    matchedUserFactors: Array.isArray(item.matchedUserFactors) ? item.matchedUserFactors : [],
    companyFitReasons: Array.isArray(item.companyFitReasons) ? item.companyFitReasons : [],
    roleFit: String(item.roleFit || ''),
    salaryFit: String(item.salaryFit || ''),
    cultureFit: String(item.cultureFit || ''),
    workStyleFit: String(item.workStyleFit || ''),
    growthFit: String(item.growthFit || ''),
    concerns: Array.isArray(item.concerns) ? item.concerns : [],
    interviewAppealPoints: Array.isArray(item.interviewAppealPoints) ? item.interviewAppealPoints : [],
    preparationActions: Array.isArray(item.preparationActions) ? item.preparationActions : [],
    evidenceSummary: String(item.evidenceSummary || ''),
    sources: Array.isArray(item.sources) ? item.sources : [],
    scoreDetails: item.scoreDetails && typeof item.scoreDetails === 'object' ? item.scoreDetails : {},
    hiringReality: String(item.hiringReality || ''),
    weaknessRisk: String(item.weaknessRisk || ''),
  }
}

async function callGenerateCareerInsights(payload) {
  const endpoint = resolveCareerInsightsEndpoint()
  if (!endpoint) return null

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`generateCareerInsights request failed: ${response.status}`)
  }

  const data = await response.json()
  if (data && typeof data.body === 'string') {
    try {
      return JSON.parse(data.body)
    } catch {
      return data
    }
  }

  return data
}

function normalizeAiResponse(response, profile, topCompanies) {
  if (!response) return null

  console.log('Career insights response received')

  const debug = response.debug && typeof response.debug === 'object' ? response.debug : {}
  const researchSource = typeof debug.researchSource === 'string' ? debug.researchSource : 'none'
  const researchedCompanyCount = Number.isFinite(Number(debug.researchedCompanyCount)) ? Number(debug.researchedCompanyCount) : 0
  const totalProcessingMs = Number.isFinite(Number(debug.totalProcessingMs)) ? Number(debug.totalProcessingMs) : 0

  const companies = (response.topCompanies || response.companies || response.companyInsights || []).map((company, index) => normalizeCompanyInsight(company, index))
  const companyRecommendations = (response.companyRecommendations || []).map((company, index) => normalizeCompanyRecommendation(company, index))
  const careerArchetype = response.careerArchetype || {
    type: '実行推進型ストラテジスト',
    summary: '課題整理と実行推進のバランスで成果を出しやすいタイプです。',
    strengths: [],
    risks: [],
  }
  const marketValue = response.marketValue || {
    score: 70,
    percentile: '上位30%前後（推定）',
    currentEstimatedSalaryRange: '700万〜900万円（目安）',
    threeYearSalaryRange: '850万〜1050万円（目安）',
    fiveYearSalaryRange: '950万〜1200万円（目安）',
    evaluation: '入力情報に基づく推定です。',
    breakdown: {
      skillRarity: 70,
      industryDemand: 70,
      transferability: 70,
      managementPotential: 65,
      growthPotential: 75,
    },
  }
  const marketValueAnalysis = response.marketValueAnalysis || {
    score: marketValue.score,
    deviation: 58,
    nationalRank: '約24,000位 / 120,000人',
    reason: marketValue.evaluation || '入力情報に基づく推定です。',
    positiveFactors: [],
    negativeFactors: [],
    improvementActions: [],
    breakdown: {
      skillFit: normalizeBreakdownItem(),
      experienceDepth: normalizeBreakdownItem(),
      industryDemand: normalizeBreakdownItem(),
      salaryRealism: normalizeBreakdownItem(),
      careerConsistency: normalizeBreakdownItem(),
      weaknessRisk: normalizeBreakdownItem(),
      growthPotential: normalizeBreakdownItem(),
    },
  }
  const salaryProjection = response.salaryProjection || {
    currentRange: marketValue.currentEstimatedSalaryRange,
    after3YearsRange: marketValue.threeYearSalaryRange,
    after5YearsRange: marketValue.fiveYearSalaryRange,
    projectionReason: marketValue.evaluation || '入力情報に基づく推定です。',
    optimisticScenario: '成果の定量化と訴求整理により上振れ余地があります。',
    conservativeScenario: '役割期待値とのズレが残ると上昇幅は抑えられます。',
    requiredActions: [],
  }
  const successProbability = response.successProbability || {
    current: 68,
    after6Months: 76,
    after1Year: 82,
    reason: '書類と面接準備の精度で改善余地があります。',
    assumptions: [],
    blockers: [],
    actionsToImprove: [],
  }
  const careerScenarios = Array.isArray(response.careerScenarios) ? response.careerScenarios : []
  const companyStrategyReports = Array.isArray(response.companyStrategyReports) ? response.companyStrategyReports : []
  const careerRoadmap = response.careerRoadmap || {
    next1Month: [],
    next3Months: [],
    next6Months: [],
    next1Year: [],
    next3Years: [],
  }
  return {
    debugVersion: response.debugVersion || '2026-06-19-debug-v1',
    debugSource: response.debugSource || 'mock',
    fallbackReason: response.fallbackReason || '',
    provider: response.provider || 'remote',
    mode: response.mode || 'remote',
    generatedAt: response.generatedAt || new Date().toISOString(),
    profileSummary: response.profileSummary || extractProfileSignals(profile),
    aiSummary: response.aiSummary || response.summary || 'AI推薦理由を取得しました。',
    summary: response.summary || response.aiSummary || 'AI推薦理由を取得しました。',
    companyInsights: companies,
    companies,
    companyRecommendations,
    riskAnalysis: response.riskAnalysis || [],
    nextActions: response.nextActions || [],
    careerArchetype,
    marketValue,
    marketValueAnalysis: {
      ...marketValueAnalysis,
      breakdown: {
        skillFit: normalizeBreakdownItem(marketValueAnalysis.breakdown?.skillFit),
        experienceDepth: normalizeBreakdownItem(marketValueAnalysis.breakdown?.experienceDepth),
        industryDemand: normalizeBreakdownItem(marketValueAnalysis.breakdown?.industryDemand),
        salaryRealism: normalizeBreakdownItem(marketValueAnalysis.breakdown?.salaryRealism),
        careerConsistency: normalizeBreakdownItem(marketValueAnalysis.breakdown?.careerConsistency),
        weaknessRisk: normalizeBreakdownItem(marketValueAnalysis.breakdown?.weaknessRisk),
        growthPotential: normalizeBreakdownItem(marketValueAnalysis.breakdown?.growthPotential),
      },
    },
    salaryProjection,
    successProbability,
    careerScenarios,
    companyStrategyReports,
    careerRoadmap,
    debug,
    researchSource,
    researchedCompanyCount,
    totalProcessingMs,
    topCompanies: response.topCompanies || topCompanies,
  }
}

export async function generateCompanyInsights(profile, topCompanies = [], analysisResult = {}) {
  const payload = {
    userProfile: profile,
    topCompanies,
    analysisResult,
  }

  try {
    const remoteResponse = await callGenerateCareerInsights(payload)
    if (remoteResponse) {
      return normalizeAiResponse(remoteResponse, profile, topCompanies)
    }
  } catch {
    // Keep UI stable even when backend is temporarily unavailable.
  }

  await sleep(120)

  const normalizedProfile = extractProfileSignals(profile)
  const companies = topCompanies.map((company, index) => buildCompanyInsights(normalizedProfile, company, index, topCompanies.length))
  const companyRecommendations = companies.map((company) => ({
    companyName: company.companyName,
    matchScore: Number(company.scoreBreakdown?.[0]?.value || 75),
    whyRecommended: `${company.companyName}は、現在の経験と希望条件の接点が大きい候補です。`,
    matchedUserFactors: (company.conditionTags || []).slice(0, 4),
    companyFitReasons: (company.reasonCards || []).slice(0, 3).map((item) => item.detail),
    roleFit: `${normalizedProfile.role || '現職'}経験を活かせる余地があります。`,
    salaryFit: `${company.salaryRange || '想定レンジ未設定'} と現在の期待値の接続を取りやすいです。`,
    cultureFit: `${company.culture || '公開情報未設定'}な文化傾向です。`,
    workStyleFit: `${normalizedProfile.workStyle || '働き方未設定'}との整合を見ています。`,
    growthFit: '成長機会と裁量のバランスが取りやすい候補です。',
    concerns: company.cautionPoints || [],
    interviewAppealPoints: (company.reasonCards || []).slice(0, 2).map((item) => item.title),
    preparationActions: ['成果の定量化', '企業課題との接続整理'],
    evidenceSummary: `${company.companyName}の公開情報ベースで、事業と役割の接点を整理しています。`,
    sources: ['公開情報ベースの企業情報'],
  }))
  const marketValueAnalysis = {
    score: 72,
    deviation: 59,
    nationalRank: '約21,000位 / 120,000人',
    reason: '職種経験、得意領域、希望業界、年収帯のバランスから見て、市場価値は比較的高い水準です。',
    positiveFactors: ['得意領域の再現性が高い', '希望業界の需要が高い'],
    negativeFactors: ['企業ごとの訴求軸が未整理だと通過率が伸びにくい'],
    improvementActions: ['実績の数値化', '応募先ごとの訴求整理'],
    breakdown: {
      skillFit: normalizeBreakdownItem({ score: 78, reason: '得意領域と希望職種の接続が強いです。', positiveFactors: ['要件定義・推進経験'], negativeFactors: ['見せ方が曖昧だと減点'], improvementActions: ['強みを3つに絞る'] }),
      experienceDepth: normalizeBreakdownItem({ score: 74, reason: '経験年数と役割深度は一定水準です。', positiveFactors: ['経験年数が十分'], negativeFactors: ['上位ロール証跡の余地'], improvementActions: ['責任範囲を明示'] }),
      industryDemand: normalizeBreakdownItem({ score: 80, reason: '希望業界の需要が高いです。', positiveFactors: ['SaaS/AI需要'], negativeFactors: ['業界を広げすぎると分散'], improvementActions: ['業界を絞る'] }),
      salaryRealism: normalizeBreakdownItem({ score: 68, reason: '年収期待はやや高めですが説明可能です。', positiveFactors: ['推薦企業レンジと接続可能'], negativeFactors: ['短期でのジャンプは難しい場合がある'], improvementActions: ['成果根拠を整える'] }),
      careerConsistency: normalizeBreakdownItem({ score: 73, reason: '転職目的と将来像の整合は比較的高いです。', positiveFactors: ['目的が明確'], negativeFactors: ['優先順位の整理余地'], improvementActions: ['優先順位を言語化'] }),
      weaknessRisk: normalizeBreakdownItem({ score: 70, reason: '苦手領域が一部職種で懸念になります。', positiveFactors: ['避けるべき役割が明確'], negativeFactors: ['分析/調整系は一部で懸念'], improvementActions: ['補完策を準備'] }),
      growthPotential: normalizeBreakdownItem({ score: 82, reason: '半年〜1年で伸びる余地が大きいです。', positiveFactors: ['追加準備の効果が高い'], negativeFactors: ['未整備だと機会損失'], improvementActions: ['学習と実績追加'] }),
    },
  }
  const salaryProjection = {
    currentRange: '700万〜900万円',
    after3YearsRange: '850万〜1050万円',
    after5YearsRange: '950万〜1250万円',
    projectionReason: '現在のスキルと推薦企業レンジを踏まえると、3年・5年での伸長余地があります。',
    optimisticScenario: '高需要職種へ寄せて成果訴求を強化すると上振れ余地があります。',
    conservativeScenario: '役割との整合説明が弱い場合は伸び幅が抑えられます。',
    requiredActions: ['成果の定量化', '高需要領域の実績追加'],
  }
  const successProbability = {
    current: 68,
    after6Months: 77,
    after1Year: 84,
    reason: '現時点でも競争力はありますが、書類と面接準備の精度で確率が大きく変わります。',
    assumptions: ['応募先を絞る', '成果を数値で示す'],
    blockers: ['希望条件と役割期待値のズレ', '企業別の訴求不足'],
    actionsToImprove: ['職務経歴書の再設計', '面接回答の標準化', '実績の追加・学習証跡化'],
  }

  return {
    debugVersion: '2026-06-19-debug-v1',
    debugSource: 'mock',
    fallbackReason: 'frontend_local_fallback',
    provider: 'mock',
    mode: 'mock',
    generatedAt: new Date().toISOString(),
    profileSummary: normalizedProfile,
    aiSummary: '現時点の入力情報から、市場価値の強みと転職先候補の接点を整理しました。優先度の高い準備を進めることで、選考通過率の向上が見込めます。',
    summary: '現時点の入力情報から、市場価値の強みと転職先候補の接点を整理しました。優先度の高い準備を進めることで、選考通過率の向上が見込めます。',
    companyInsights: companies,
    companies,
    companyRecommendations,
    riskAnalysis: [
      '企業ごとに求められる成果指標の違いを整理しないと、訴求軸がぶれる可能性があります。',
      '選考前に職務経歴書の実績表現を数値ベースへ揃えると、評価の一貫性が高まります。',
    ],
    nextActions: [
      '実績を課題・施策・成果の順で再整理し、転用可能な強みを明確化する',
      '応募優先企業を3社に絞り、企業ごとの訴求ポイントを調整する',
      '面接で話す代表エピソードを2〜3本に統一して準備する',
    ],
    careerArchetype: {
      type: '実行推進型ストラテジスト',
      summary: '課題整理から実行までをつなぐ強みがあり、事業インパクトを作る役割と相性が良い傾向です。',
      strengths: ['課題整理', '要件定義', 'プロジェクト推進'],
      risks: ['短期成果圧力が高い環境では、優先順位の揺れが負荷になりやすいです。'],
    },
    marketValue: {
      score: 72,
      percentile: '上位25%前後（推定）',
      currentEstimatedSalaryRange: '700万〜900万円（目安）',
      threeYearSalaryRange: '850万〜1050万円（目安）',
      fiveYearSalaryRange: '950万〜1250万円（目安）',
      evaluation: '専門性と推進力の掛け合わせで市場価値を伸ばしやすい見立てです。',
      breakdown: {
        skillRarity: 72,
        industryDemand: 74,
        transferability: 78,
        managementPotential: 67,
        growthPotential: 80,
      },
    },
    marketValueAnalysis,
    salaryProjection,
    successProbability,
    careerScenarios: [
      {
        title: '業務改革リード',
        targetRole: 'DX企画 / 業務改革',
        targetIndustry: 'SaaS / ITサービス',
        expectedSalaryRange: '850万〜1100万円（目安）',
        timeline: '1〜3年',
        reason: '現職の推進経験と課題整理力の再現性を示しやすいためです。',
        requiredActions: ['実績を定量で棚卸しする', 'KPI改善事例を職務経歴書に反映する'],
      },
    ],
    companyStrategyReports: companies.map((company) => ({
      companyName: company.companyName,
      fitScore: Math.max(60, Number(company.scoreBreakdown?.[0]?.value || 75)),
      expectedRole: normalizedProfile.role || '想定ポジション未設定',
      recommendationReason: ['経験と役割要件の重なりが大きいと推定されます。'],
      concernPoints: ['成果期待が高く、立ち上がり速度が問われる可能性があります。'],
      interviewAppealPoints: ['直近の成果を数値で示し、再現プロセスを語ることが有効です。'],
      preparationActions: ['想定質問に対するSTAR形式の回答を準備する'],
      estimatedOfferProbability: '中（目安）',
    })),
    careerRoadmap: {
      next1Month: ['実績の定量化と書類更新を完了する'],
      next3Months: ['不足スキルを学習し、実務適用の証拠を作る'],
      next6Months: ['希望領域に近い業務比率を増やす'],
      next1Year: ['上位ロールでの成果責任を持つ'],
      next3Years: ['事業成果に直結するポジションへ接続する'],
    },
  }
}

export const aiAnalysisAdapter = {
  generateCompanyInsights,
}
