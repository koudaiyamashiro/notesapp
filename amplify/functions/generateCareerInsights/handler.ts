declare const process: { env: Record<string, string | undefined> }

const DEBUG_VERSION = '2026-06-19-debug-v1'
const MAX_PROMPT_CHARS = 8000

type CareerInsightsRequest = {
  userProfile?: Record<string, unknown>
  topCompanies?: Array<Record<string, unknown>>
  analysisResult?: Record<string, unknown>
}

type CareerInsightsResponse = {
  debugVersion: string
  debugSource: 'openai' | 'mock'
  fallbackReason?: string | null
  aiSummary: string
  companyInsights: Array<Record<string, unknown>>
  riskAnalysis: string[]
  nextActions: string[]
  careerArchetype: {
    type: string
    summary: string
    strengths: string[]
    risks: string[]
  }
  marketValue: {
    score: number
    percentile: string
    currentEstimatedSalaryRange: string
    threeYearSalaryRange: string
    fiveYearSalaryRange: string
    evaluation: string
    breakdown: {
      skillRarity: number
      industryDemand: number
      transferability: number
      managementPotential: number
      growthPotential: number
    }
  }
  careerScenarios: Array<{
    title: string
    targetRole: string
    targetIndustry: string
    expectedSalaryRange: string
    timeline: string
    reason: string
    requiredActions: string[]
  }>
  companyStrategyReports: Array<{
    companyName: string
    fitScore: number
    expectedRole: string
    recommendationReason: string[]
    concernPoints: string[]
    interviewAppealPoints: string[]
    preparationActions: string[]
    estimatedOfferProbability: string
  }>
  careerRoadmap: {
    next1Month: string[]
    next3Months: string[]
    next6Months: string[]
    next1Year: string[]
    next3Years: string[]
  }
  debug?: {
    researchSource: 'tavily' | 'none'
    researchedCompanyCount: number
  }
  userProfileSummary?: Record<string, unknown>
  analysisSnapshot?: Record<string, unknown>
}

type OpenAIErrorCode = 'invalid_response' | 'parse_error' | 'openai_error' | 'openai_bad_request' | 'openai_context_length'

type OpenAIError = Error & {
  code: OpenAIErrorCode
  responseType?: string
}

type CompanyResearchItem = {
  companyName: string
  researchSummary: string
}

type CompanyResearchMeta = {
  researchSource: 'tavily' | 'none'
  researchedCompanyCount: number
  researchFallback: boolean
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : []
}

function compressResearchText(text: string, minLength = 300, maxLength = 500) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return ''
  if (normalized.length <= maxLength) return normalized
  const clipped = normalized.slice(0, maxLength)
  const lastStop = Math.max(clipped.lastIndexOf('。'), clipped.lastIndexOf('.'))
  if (lastStop >= minLength) return clipped.slice(0, lastStop + 1)
  return clipped
}

async function fetchCompanyResearchFromTavily(apiKey: string, companyName: string) {
  const query = [
    `${companyName} 会社概要`,
    `${companyName} 主力プロダクト サービス`,
    `${companyName} 注力領域 採用 求める人物像`,
    `${companyName} 働き方 カルチャー`,
    `${companyName} 直近ニュース プレスリリース`,
    `${companyName} 想定リスク`,
  ].join(' ')

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'basic',
      max_results: 4,
      include_answer: true,
      include_raw_content: false,
    }),
  })

  if (!response.ok) {
    return ''
  }

  const payload = await response.json()
  const answer = typeof payload?.answer === 'string' ? payload.answer : ''
  const snippets = asArray(payload?.results)
    .slice(0, 4)
    .map((item) => {
      if (!item || typeof item !== 'object') return ''
      return safeText((item as Record<string, unknown>).content, 180)
    })
    .filter(Boolean)

  return compressResearchText([answer, ...snippets].join(' '), 300, 500)
}

async function fetchTopCompanyResearch(tavilyApiKey: string, topCompanies: unknown[]) {
  const companies = topCompanies.slice(0, 5).map((company, index) => {
    const typed = (company || {}) as Record<string, unknown>
    return {
      companyName: String(typed.name || `Company ${index + 1}`),
    }
  })

  console.log('companyResearchStart')

  const settled = await Promise.allSettled(
    companies.map(async (company) => {
      const summary = await fetchCompanyResearchFromTavily(tavilyApiKey, company.companyName)
      if (!summary) throw new Error('research_unavailable')
      return {
        companyName: company.companyName,
        researchSummary: summary,
      } as CompanyResearchItem
    })
  )

  const companyResearch = settled
    .filter((item): item is PromiseFulfilledResult<CompanyResearchItem> => item.status === 'fulfilled')
    .map((item) => item.value)

  const failedCount = settled.length - companyResearch.length
  console.log('companyResearchSuccess', companyResearch.length)
  console.log('companyResearchFailed', failedCount)
  console.log('researchFallback', companyResearch.length === 0)

  return {
    companyResearch,
    meta: {
      researchSource: companyResearch.length > 0 ? 'tavily' : 'none',
      researchedCompanyCount: companyResearch.length,
      researchFallback: companyResearch.length === 0,
    } as CompanyResearchMeta,
  }
}

function asStringArray(value: unknown, max = 5) {
  return asArray(value).filter((item): item is string => typeof item === 'string' && item.trim().length > 0).slice(0, max)
}

function asSafeNumber(value: unknown, fallback: number, min = 0, max = 100) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return fallback
  return Math.min(max, Math.max(min, Math.round(numeric)))
}

function safeText(value: unknown, maxLength = 120) {
  return String(value || '').slice(0, maxLength)
}

function toStringList(value: unknown, maxItems: number, maxLength = 80) {
  return asArray(value)
    .filter((item): item is string => typeof item === 'string')
    .map((item) => safeText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems)
}

function extractRecommendationReasons(company: Record<string, unknown>) {
  const typedCompany = company as Record<string, any>
  const fromCards = asArray(typedCompany.recommendationReasons?.reasonCards || typedCompany.reasonCards)
    .map((item) => {
      if (!item || typeof item !== 'object') return ''
      const title = safeText((item as Record<string, unknown>).title, 60)
      const detail = safeText((item as Record<string, unknown>).detail, 100)
      return `${title}${title && detail ? ': ' : ''}${detail}`.trim()
    })
    .filter(Boolean)

  const fromShort = toStringList(typedCompany.recommendationReasons?.shortReasons || typedCompany.shortReasons, 2, 120)
  const fromDirect = toStringList(typedCompany.recommendationReasons, 2, 120)

  return [...fromCards, ...fromShort, ...fromDirect].slice(0, 2)
}

function extractConcernPoints(company: Record<string, unknown>) {
  const typedCompany = company as Record<string, any>
  return toStringList(typedCompany.concernPoints || typedCompany.caution || typedCompany.cautionPoints, 1, 120)
}

function sanitizeCompanyForPrompt(company: Record<string, unknown>) {
  const matchedConditions = toStringList(company.matchedConditions || company.conditionTags, 5, 60)
  const recommendationReasons = extractRecommendationReasons(company)
  const concernPoints = extractConcernPoints(company)
  const numericScore = Number((company as Record<string, any>).matchScore ?? (company as Record<string, any>).overallFit ?? 0)

  return {
    name: safeText(company.name, 80),
    industry: safeText(company.industry, 60),
    matchScore: Number.isFinite(numericScore) ? Math.round(numericScore) : 0,
    summary: safeText((company as Record<string, any>).summary || (company as Record<string, any>).recommendation, 220),
    matchedConditions,
    recommendationReasons: recommendationReasons.slice(0, 2),
    concernPoints: concernPoints.slice(0, 1),
  }
}

function sanitizeProfileForPrompt(userProfile: Record<string, unknown>) {
  return {
    role: safeText(userProfile.role, 40),
    level: safeText(userProfile.level, 40),
    experience: safeText(userProfile.experience, 20),
    income: safeText(userProfile.income, 20),
    workStyle: safeText(userProfile.workStyle, 40),
    desiredIndustry: toStringList(userProfile.desiredIndustry, 3, 40),
    purpose: toStringList(userProfile.purpose, 3, 60),
    strengths: toStringList(userProfile.strengths, 3, 40),
  }
}

function sanitizeAnalysisForPrompt(analysisResult: Record<string, unknown>) {
  const typedAnalysis = analysisResult as Record<string, any>
  const topIndustries = asArray(typedAnalysis.industries)
    .slice(0, 3)
    .map((item) => {
      if (!item || typeof item !== 'object') return ''
      return safeText((item as Record<string, unknown>).label, 40)
    })
    .filter(Boolean)

  const topRoles = asArray(typedAnalysis.roles)
    .slice(0, 3)
    .map((item) => {
      if (!item || typeof item !== 'object') return ''
      return safeText((item as Record<string, unknown>).role, 40)
    })
    .filter(Boolean)

  return {
    score: safeText(typedAnalysis.score || typedAnalysis.rawScore, 20),
    topIndustries,
    topRoles,
  }
}

function buildPromptPayload(
  userProfile: Record<string, unknown>,
  topCompanies: unknown[],
  analysisResult: Record<string, unknown>,
  companyResearch: CompanyResearchItem[],
  strict = false
) {
  const companies = topCompanies
    .slice(0, 5)
    .map((company) => sanitizeCompanyForPrompt((company || {}) as Record<string, unknown>))
    .map((company) => {
      if (!strict) return company
      return {
        ...company,
        summary: safeText(company.summary, 120),
        matchedConditions: company.matchedConditions.slice(0, 3).map((item) => safeText(item, 40)),
        recommendationReasons: company.recommendationReasons.slice(0, 2).map((item) => safeText(item, 80)),
        concernPoints: company.concernPoints.slice(0, 1).map((item) => safeText(item, 80)),
      }
    })

  return {
    userProfile: sanitizeProfileForPrompt(userProfile),
    topCompanies: companies,
    analysisResult: sanitizeAnalysisForPrompt(analysisResult),
    companyResearch: companyResearch
      .slice(0, 5)
      .map((item) => ({
        companyName: safeText(item.companyName, 80),
        researchSummary: strict ? safeText(item.researchSummary, 320) : safeText(item.researchSummary, 500),
      })),
  }
}

function pickProfileSummary(userProfile: Record<string, unknown> = {}) {
  return {
    role: String(userProfile.role || '未設定'),
    level: String(userProfile.level || '未設定'),
    experience: String(userProfile.experience || '未設定'),
    income: String(userProfile.income || '未設定'),
    workStyle: String(userProfile.workStyle || '未設定'),
  }
}

function buildCompanyInsight(company: Record<string, unknown>, index: number) {
  const typedCompany = company as Record<string, any>
  const name = String(company.name || `Company ${index + 1}`)
  const reasonCards = asArray(typedCompany.recommendationReasons?.reasonCards || typedCompany.reasonCards).slice(0, 5)
  const cautionPoints = asArray(typedCompany.caution || typedCompany.cautionPoints).slice(0, 4)
  const comparisonReasons = asArray(typedCompany.comparisonReasons).slice(0, 3)
  const conditionTags = asArray(typedCompany.conditionTags || typedCompany.matchedConditions).slice(0, 6)

  return {
    companyName: name,
    rank: index + 1,
    recommendationTitle: `${name}を推奨する理由`,
    summary: `${name}はモック評価では有望な候補です。`,
    reasonCards,
    cautionPoints: cautionPoints.length > 0 ? cautionPoints : ['モックレスポンスのため、注意点は後続のAI推論で追加します。'],
    conditionTags,
    scoreBreakdown: asArray(typedCompany.scoreBreakdown),
    comparisonTarget: String(typedCompany.comparisonTarget || ''),
    comparisonReasons: comparisonReasons.length > 0 ? comparisonReasons : ['比較対象より総合スコアが高い想定です。'],
    careerPath: typedCompany.careerPath || {
      oneYear: '専門性を深める',
      threeYear: 'リード経験を積む',
      fiveYear: '事業責任を担う',
    },
  }
}

function buildOpenAICompanyInsight(company: Record<string, unknown>, index: number) {
  const name = String(company.companyName || company.name || `Company ${index + 1}`)
  const reasons = asArray(company.reasons).filter((value): value is string => typeof value === 'string').slice(0, 5)
  const risks = asArray(company.risks).filter((value): value is string => typeof value === 'string').slice(0, 4)

  return {
    companyName: name,
    summary: String(company.summary || `${name}は有望な候補です。`),
    reasons: reasons.length > 0 ? reasons : ['候補企業との親和性が高いです。'],
    risks: risks.length > 0 ? risks : ['追加の確認が必要です。'],
  }
}

function buildMockResponse(
  userProfile: Record<string, unknown>,
  topCompanies: unknown[],
  analysisResult: Record<string, unknown>,
  fallbackReason: string,
  responseType: string,
  researchMeta: CompanyResearchMeta
): CareerInsightsResponse {
  const diagnosticSummary =
    fallbackReason === 'invalid_response' || fallbackReason === 'parse_error'
      ? `normalize失敗 (responseType: ${responseType})`
      : ''

  const profileSummary = pickProfileSummary(userProfile)
  const companyStrategyReports = topCompanies.slice(0, 5).map((company, index) => {
    const typedCompany = (company || {}) as Record<string, any>
    const companyName = String(typedCompany.name || `Company ${index + 1}`)
    const fitScore = asSafeNumber(typedCompany.overallFit ?? typedCompany.matchScore, 75, 40, 99)
    return {
      companyName,
      fitScore,
      expectedRole: String(profileSummary.role || 'ポジション未設定'),
      recommendationReason: [
        `${companyName}は現在の経験を活かしやすい業務領域がある可能性があります。`,
        `希望する働き方との整合性を取りやすいと推定されます。`,
      ],
      concernPoints: [`役割期待値が高く、初期の立ち上がり速度が問われる可能性があります。`],
      interviewAppealPoints: [`これまでの成果を数値で示し、再現性のある進め方を説明することが有効です。`],
      preparationActions: [`想定業務に近い実績を3件に絞って、課題・打ち手・成果で整理してください。`],
      estimatedOfferProbability: fitScore >= 85 ? '中〜高（目安）' : '中（目安）',
    }
  })

  return {
    debugVersion: DEBUG_VERSION,
    debugSource: 'mock',
    fallbackReason,
    aiSummary: diagnosticSummary
      ? `${diagnosticSummary} / generateCareerInsights のモックレスポンスです。将来的に OpenAI / Perplexity API へ差し替え可能な形式で返しています。`
      : 'generateCareerInsights のモックレスポンスです。将来的に OpenAI / Perplexity API へ差し替え可能な形式で返しています。',
    companyInsights: topCompanies.map((company, index) => buildCompanyInsight(company as Record<string, unknown>, index)),
    riskAnalysis: [
      '現時点ではモックなので、実際の外部AI推論は行っていません。',
      '本番化時はサーバー側で OpenAI / Perplexity API を呼び出してください。',
    ],
    nextActions: [
      '将来的に環境変数から AI API キーを読み込む',
      'サーバー側でプロンプト整形とレスポンス整形を行う',
      'クライアントはこの Function のみを呼び出す',
    ],
    careerArchetype: {
      type: '実行推進型ストラテジスト',
      summary: '課題を構造化して実行まで落とし込む力が強みで、企画と現場をつなぐ役割で価値を出しやすいタイプです。',
      strengths: ['課題整理', '要件定義', '関係者調整'],
      risks: ['短期成果圧力の強い環境では優先順位の揺れが負荷になりやすいです。'],
    },
    marketValue: {
      score: asSafeNumber(analysisResult.score || analysisResult.rawScore, 72, 30, 99),
      percentile: '上位25%前後（推定）',
      currentEstimatedSalaryRange: '700万〜900万円（目安）',
      threeYearSalaryRange: '850万〜1050万円（目安）',
      fiveYearSalaryRange: '950万〜1250万円（目安）',
      evaluation: '専門性と推進力のバランスが良く、業務改革・DX推進領域で市場価値が伸びる可能性があります。',
      breakdown: {
        skillRarity: 72,
        industryDemand: 74,
        transferability: 78,
        managementPotential: 68,
        growthPotential: 80,
      },
    },
    careerScenarios: [
      {
        title: '業務改革リードシナリオ',
        targetRole: 'DX企画 / 業務改革',
        targetIndustry: 'SaaS / ITコンサル',
        expectedSalaryRange: '850万〜1100万円（目安）',
        timeline: '1〜3年',
        reason: '現職での改善実績を横展開しやすく、再現性ある成果として評価される可能性が高いためです。',
        requiredActions: ['改善実績を定量化する', 'KPI設計と運用経験を補強する'],
      },
      {
        title: '事業企画接続シナリオ',
        targetRole: '事業企画 / PMO',
        targetIndustry: '人材 / メガベンチャー',
        expectedSalaryRange: '800万〜1000万円（目安）',
        timeline: '1〜2年',
        reason: '関係者調整力と施策推進力を活かし、事業KPI改善の文脈で評価されやすいためです。',
        requiredActions: ['事業指標の改善事例を作る', '部署横断プロジェクトの実績を増やす'],
      },
    ],
    companyStrategyReports,
    careerRoadmap: {
      next1Month: ['実績棚卸しを行い、成果を定量化した職務経歴書の素案を作る'],
      next3Months: ['希望職種に合わせた実績の再現性を示すポートフォリオを整備する'],
      next6Months: ['不足スキル領域の学習を実務で検証し、成果事例を追加する'],
      next1Year: ['より上位ポジションに必要なKPI責任範囲を担う'],
      next3Years: ['事業成果責任を持つポジションへの接続を目指す'],
    },
    debug: {
      researchSource: researchMeta.researchSource,
      researchedCompanyCount: researchMeta.researchedCompanyCount,
    },
    userProfileSummary: profileSummary,
    analysisSnapshot: {
      score: analysisResult.score || analysisResult.rawScore || '未設定',
      recommendedCompanies: topCompanies.length,
    },
  }
}

function normalizeCareerArchetype(value: unknown) {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  return {
    type: String(source.type || '実行推進型ストラテジスト'),
    summary: String(source.summary || '意思決定と実行をつなぐ役割で価値を出しやすいタイプです。'),
    strengths: asStringArray(source.strengths, 6),
    risks: asStringArray(source.risks, 6),
  }
}

function normalizeMarketValue(value: unknown, analysisResult: Record<string, unknown>) {
  const source = value && typeof value === 'object' ? (value as Record<string, any>) : {}
  const breakdownSource = source.breakdown && typeof source.breakdown === 'object' ? source.breakdown : {}
  return {
    score: asSafeNumber(source.score, asSafeNumber(analysisResult.score || analysisResult.rawScore, 72, 30, 99), 30, 99),
    percentile: String(source.percentile || '上位30%前後（推定）'),
    currentEstimatedSalaryRange: String(source.currentEstimatedSalaryRange || '700万〜900万円（目安）'),
    threeYearSalaryRange: String(source.threeYearSalaryRange || '850万〜1050万円（目安）'),
    fiveYearSalaryRange: String(source.fiveYearSalaryRange || '950万〜1250万円（目安）'),
    evaluation: String(source.evaluation || '強みの再現性を示せると市場価値が高まりやすいと推定されます。'),
    breakdown: {
      skillRarity: asSafeNumber(breakdownSource.skillRarity, 70),
      industryDemand: asSafeNumber(breakdownSource.industryDemand, 72),
      transferability: asSafeNumber(breakdownSource.transferability, 74),
      managementPotential: asSafeNumber(breakdownSource.managementPotential, 68),
      growthPotential: asSafeNumber(breakdownSource.growthPotential, 78),
    },
  }
}

function normalizeCareerScenarios(value: unknown) {
  return asArray(value)
    .slice(0, 4)
    .map((item, index) => {
      const source = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
      return {
        title: String(source.title || `シナリオ${index + 1}`),
        targetRole: String(source.targetRole || '未設定'),
        targetIndustry: String(source.targetIndustry || '未設定'),
        expectedSalaryRange: String(source.expectedSalaryRange || '未設定（目安）'),
        timeline: String(source.timeline || '1〜3年'),
        reason: String(source.reason || '入力情報に基づく仮説です。'),
        requiredActions: asStringArray(source.requiredActions, 5),
      }
    })
}

function normalizeCompanyStrategyReports(value: unknown, topCompanies: unknown[]) {
  const byName = new Map(
    asArray(value)
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String((item as Record<string, unknown>).companyName || ''), item as Record<string, unknown>])
  )

  return topCompanies.slice(0, 5).map((company, index) => {
    const base = (company || {}) as Record<string, any>
    const name = String(base.name || `Company ${index + 1}`)
    const source = byName.get(name) || {}
    return {
      companyName: name,
      fitScore: asSafeNumber((source as Record<string, unknown>).fitScore ?? base.overallFit ?? base.matchScore, 75, 40, 99),
      expectedRole: String((source as Record<string, unknown>).expectedRole || '想定ポジション未設定'),
      recommendationReason: asStringArray((source as Record<string, unknown>).recommendationReason, 4),
      concernPoints: asStringArray((source as Record<string, unknown>).concernPoints, 4),
      interviewAppealPoints: asStringArray((source as Record<string, unknown>).interviewAppealPoints, 4),
      preparationActions: asStringArray((source as Record<string, unknown>).preparationActions, 4),
      estimatedOfferProbability: String((source as Record<string, unknown>).estimatedOfferProbability || '中（目安）'),
    }
  })
}

function normalizeCareerRoadmap(value: unknown) {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  return {
    next1Month: asStringArray(source.next1Month, 6),
    next3Months: asStringArray(source.next3Months, 6),
    next6Months: asStringArray(source.next6Months, 6),
    next1Year: asStringArray(source.next1Year, 6),
    next3Years: asStringArray(source.next3Years, 6),
  }
}

function extractJsonTextFromOpenAIResponse(payload: any): string {
  const fromMessage = payload?.choices?.[0]?.message?.content
  if (typeof fromMessage === 'string') return fromMessage
  if (Array.isArray(fromMessage)) {
    const textPart = fromMessage.find((part: any) => part?.type === 'text' && typeof part?.text === 'string')
    if (textPart?.text) return textPart.text
  }
  return ''
}

function stripJsonCodeFence(text: string) {
  return text
    .replace(/^\s*```json\s*/i, '')
    .replace(/^\s*```\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()
}

function parseOpenAIJsonText(text: string) {
  try {
    return { parsed: JSON.parse(text), parseError: '' }
  } catch (firstError) {
    const stripped = stripJsonCodeFence(text)
    if (stripped !== text) {
      try {
        return { parsed: JSON.parse(stripped), parseError: '' }
      } catch (secondError) {
        return {
          parsed: null,
          parseError: secondError instanceof Error ? secondError.message : 'unknown_error',
        }
      }
    }

    return {
      parsed: null,
      parseError: firstError instanceof Error ? firstError.message : 'unknown_error',
    }
  }
}

function getResponseType(value: unknown) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function getResponseKeys(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return []
  return Object.keys(value).slice(0, 20)
}

function createOpenAIError(code: OpenAIErrorCode, message: string, responseType?: string): OpenAIError {
  const error = new Error(message) as OpenAIError
  error.code = code
  error.responseType = responseType
  return error
}

async function generateWithOpenAI(
  apiKey: string,
  userProfile: Record<string, unknown>,
  topCompanies: unknown[],
  analysisResult: Record<string, unknown>,
  companyResearch: CompanyResearchItem[],
  researchMeta: CompanyResearchMeta
): Promise<CareerInsightsResponse | null> {
  let promptPayload: any = buildPromptPayload(userProfile, topCompanies, analysisResult, companyResearch)

  const systemPrompt = [
    'あなたは転職意思決定を支援するシニアキャリアコンサルタントです。',
    '必ずJSONだけを返してください。Markdown、説明文、コードブロック、前置き、後置きは一切不要です。',
    '返却JSONは次の形式に厳密に一致させてください。余計なキーは追加しないでください。',
    '{',
    '  "aiSummary": "string",',
    '  "riskAnalysis": ["string"],',
    '  "nextActions": ["string"],',
    '  "companyInsights": [',
    '    {',
    '      "companyName": "string",',
    '      "summary": "string",',
    '      "reasons": ["string"],',
    '      "risks": ["string"]',
    '    }',
    '  ],',
    '  "careerArchetype": {',
    '    "type": "string",',
    '    "summary": "string",',
    '    "strengths": ["string"],',
    '    "risks": ["string"]',
    '  },',
    '  "marketValue": {',
    '    "score": 0,',
    '    "percentile": "string",',
    '    "currentEstimatedSalaryRange": "string",',
    '    "threeYearSalaryRange": "string",',
    '    "fiveYearSalaryRange": "string",',
    '    "evaluation": "string",',
    '    "breakdown": {',
    '      "skillRarity": 0,',
    '      "industryDemand": 0,',
    '      "transferability": 0,',
    '      "managementPotential": 0,',
    '      "growthPotential": 0',
    '    }',
    '  },',
    '  "careerScenarios": [{',
    '    "title": "string",',
    '    "targetRole": "string",',
    '    "targetIndustry": "string",',
    '    "expectedSalaryRange": "string",',
    '    "timeline": "string",',
    '    "reason": "string",',
    '    "requiredActions": ["string"]',
    '  }],',
    '  "companyStrategyReports": [{',
    '    "companyName": "string",',
    '    "fitScore": 0,',
    '    "expectedRole": "string",',
    '    "recommendationReason": ["string"],',
    '    "concernPoints": ["string"],',
    '    "interviewAppealPoints": ["string"],',
    '    "preparationActions": ["string"],',
    '    "estimatedOfferProbability": "string"',
    '  }],',
    '  "careerRoadmap": {',
    '    "next1Month": ["string"],',
    '    "next3Months": ["string"],',
    '    "next6Months": ["string"],',
    '    "next1Year": ["string"],',
    '    "next3Years": ["string"]',
    '  }',
    '}',
    '回答は必ず日本語で作成してください。',
    '単なる要約は禁止です。意思決定に使える具体性で記述してください。',
    'aiSummaryには必ず次の要素を含めてください: 市場価値評価、年収レンジ、キャリア類型、向いている業界、向いている職種、弱み・注意点、キャリアリスク、3年後仮説、5年後仮説、企業比較。',
    'aiSummaryは最低1000文字相当の分量で、根拠と示唆を具体的に書いてください。',
    'companyInsightsの各企業について、reasonsは推薦理由を具体的に、risksは懸念点を具体的に記述してください。',
    'companyStrategyReportsには企業別の推薦理由、懸念点、面接訴求ポイント、準備アクション、内定確率の目安を含めてください。',
    '入力のcompanyResearchを公開情報ベースの根拠として活用し、companyStrategyReportsを具体化してください。',
    '抽象的な一般論は避け、企業ごとに推薦理由・懸念点・面接訴求ポイント・準備アクションを具体的に記述してください。',
    '不確かな情報は断定せず「公開情報ベースでは」「可能性があります」と表現してください。',
    'careerRoadmapには1ヶ月、3ヶ月、6ヶ月、1年、3年のアクションを含めてください。',
    '年収や内定確率は保証ではなく推定・目安として表現し、断定しすぎないでください。',
    '入力情報が少ない場合も、仮説として明示して出力してください。',
    'companyInsightsは入力のtopCompaniesに対応させてください。',
    'riskAnalysisとnextActionsはそれぞれ1件以上返してください。',
  ].join('\n')

  let userPrompt = `入力データ: ${JSON.stringify(promptPayload)}`
  const fixedPromptLength = systemPrompt.length + userPrompt.length
  if (fixedPromptLength > MAX_PROMPT_CHARS) {
    promptPayload = buildPromptPayload(userProfile, topCompanies, analysisResult, companyResearch, true)
    userPrompt = `入力データ: ${JSON.stringify(promptPayload)}`
  }

  let promptLength = systemPrompt.length + userPrompt.length
  while (promptLength > MAX_PROMPT_CHARS && promptPayload.topCompanies.length > 1) {
    promptPayload.topCompanies.pop()
    userPrompt = `入力データ: ${JSON.stringify(promptPayload)}`
    promptLength = systemPrompt.length + userPrompt.length
  }

  if (promptLength > MAX_PROMPT_CHARS) {
    promptPayload = {
      userProfile: {
        role: safeText(userProfile.role, 20),
        level: safeText(userProfile.level, 20),
      },
      topCompanies: promptPayload.topCompanies.slice(0, 1).map((company: any) => ({
        name: safeText(company.name, 40),
        industry: safeText(company.industry, 30),
        matchScore: company.matchScore,
        summary: safeText(company.summary, 60),
        matchedConditions: asArray(company.matchedConditions).slice(0, 2).map((item) => safeText(item, 20)),
        recommendationReasons: asArray(company.recommendationReasons).slice(0, 1).map((item) => safeText(item, 40)),
        concernPoints: asArray(company.concernPoints).slice(0, 1).map((item) => safeText(item, 40)),
      })),
      analysisResult: {
        score: safeText((analysisResult as Record<string, unknown>).score || (analysisResult as Record<string, unknown>).rawScore, 10),
      },
    }
    userPrompt = `入力データ: ${JSON.stringify(promptPayload)}`
    promptLength = systemPrompt.length + userPrompt.length
  }

  if (promptLength > MAX_PROMPT_CHARS) {
    userPrompt = '入力データ: {"userProfile":{},"topCompanies":[],"analysisResult":{}}'
    promptLength = systemPrompt.length + userPrompt.length
  }

  console.log('generateCareerInsights promptLength', { promptLength, maxPromptChars: MAX_PROMPT_CHARS })

  const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!openAIResponse.ok) {
    const errorRaw = await openAIResponse.text()
    let parsedError: any = null
    try {
      parsedError = errorRaw ? JSON.parse(errorRaw) : null
    } catch {
      parsedError = null
    }

    const errorInfo = parsedError?.error || {}
    const errorCode = String(errorInfo?.code || '')
    console.warn('generateCareerInsights OpenAI error response', {
      status: openAIResponse.status,
      errorMessage: String(errorInfo?.message || ''),
      errorType: String(errorInfo?.type || ''),
      errorCode,
      errorParam: String(errorInfo?.param || ''),
    })

    if (errorCode === 'context_length_exceeded') {
      throw createOpenAIError('openai_context_length', 'OpenAI request failed with context_length_exceeded', 'http_error')
    }

    if (openAIResponse.status === 400) {
      throw createOpenAIError('openai_bad_request', 'OpenAI request failed with status 400', 'http_error')
    }

    throw createOpenAIError('openai_error', `OpenAI request failed with status ${openAIResponse.status}`, 'http_error')
  }

  const raw = await openAIResponse.json()
  let rawPreview = ''
  try {
    rawPreview = JSON.stringify(raw).slice(0, 1000)
  } catch {
    rawPreview = String(raw).slice(0, 1000)
  }
  console.log('generateCareerInsights openaiRawPreview', rawPreview)

  const text = extractJsonTextFromOpenAIResponse(raw)
  if (!text) {
    console.warn('generateCareerInsights normalize failed', {
      parseError: 'missing_message_content',
      responseType: getResponseType(raw),
      responseKeys: getResponseKeys(raw),
    })
    throw createOpenAIError('invalid_response', 'OpenAI response message content was empty', getResponseType(raw))
  }

  const parsedResult = parseOpenAIJsonText(text)
  const parsed = parsedResult.parsed
  if (parsedResult.parseError) {
    console.warn('generateCareerInsights normalize failed', {
      parseError: parsedResult.parseError,
      responseType: 'string',
      responseKeys: [],
    })
    throw createOpenAIError('parse_error', parsedResult.parseError, 'string')
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    const responseType = getResponseType(parsed)
    console.warn('generateCareerInsights normalize failed', {
      parseError: '',
      responseType,
      responseKeys: getResponseKeys(parsed),
    })
    throw createOpenAIError('invalid_response', 'Parsed OpenAI response is not an object', responseType)
  }

  const aiSummary = typeof parsed.aiSummary === 'string' ? parsed.aiSummary : ''
  const riskAnalysis = Array.isArray(parsed.riskAnalysis) ? parsed.riskAnalysis.filter((v: unknown) => typeof v === 'string') : []
  const nextActions = Array.isArray(parsed.nextActions) ? parsed.nextActions.filter((v: unknown) => typeof v === 'string') : []
  const companyInsights = Array.isArray(parsed.companyInsights) ? parsed.companyInsights : []

  if (!aiSummary || companyInsights.length === 0) {
    console.warn('generateCareerInsights normalize failed', {
      parseError: '',
      responseType: getResponseType(parsed),
      responseKeys: getResponseKeys(parsed),
    })
    throw createOpenAIError('invalid_response', 'OpenAI response is missing required fields', getResponseType(parsed))
  }

  return {
    debugVersion: DEBUG_VERSION,
    debugSource: 'openai',
    fallbackReason: null,
    aiSummary,
    riskAnalysis: riskAnalysis.length > 0 ? riskAnalysis.slice(0, 5) : ['リスク分析の生成に失敗しました。'],
    nextActions: nextActions.length > 0 ? nextActions.slice(0, 5) : ['次アクションの生成に失敗しました。'],
    companyInsights: companyInsights.map((company: Record<string, unknown>, index: number) => buildOpenAICompanyInsight(company, index)),
    careerArchetype: normalizeCareerArchetype((parsed as Record<string, unknown>).careerArchetype),
    marketValue: normalizeMarketValue((parsed as Record<string, unknown>).marketValue, analysisResult),
    careerScenarios: normalizeCareerScenarios((parsed as Record<string, unknown>).careerScenarios),
    companyStrategyReports: normalizeCompanyStrategyReports((parsed as Record<string, unknown>).companyStrategyReports, topCompanies),
    careerRoadmap: normalizeCareerRoadmap((parsed as Record<string, unknown>).careerRoadmap),
    debug: {
      researchSource: researchMeta.researchSource,
      researchedCompanyCount: researchMeta.researchedCompanyCount,
    },
    userProfileSummary: pickProfileSummary(userProfile),
    analysisSnapshot: {
      score: analysisResult.score || analysisResult.rawScore || '未設定',
      recommendedCompanies: topCompanies.length,
    },
  }
}

export async function handler(event: { body?: string; requestContext?: { http?: { method?: string } } } | CareerInsightsRequest = {}) {
  console.log(`generateCareerInsights handler version: ${DEBUG_VERSION}`)

  const method = 'requestContext' in event ? event.requestContext?.http?.method : undefined

  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        ...CORS_HEADERS,
        'x-debug-version': DEBUG_VERSION,
      },
      body: '',
    }
  }

  try {
    const requestBody = 'body' in event && typeof event.body === 'string' ? JSON.parse(event.body || '{}') : event
    const typedRequestBody = requestBody as CareerInsightsRequest
    const userProfile = (typedRequestBody.userProfile || {}) as Record<string, unknown>
    const topCompanies = asArray(typedRequestBody.topCompanies)
    const analysisResult = (typedRequestBody.analysisResult || {}) as Record<string, unknown>
    const topCompaniesForResearch = topCompanies.slice(0, 5)

    const tavilyApiKey = process.env.TAVILY_API_KEY || ''
    console.log('hasTavilyKey', Boolean(tavilyApiKey))

    let companyResearch: CompanyResearchItem[] = []
    let researchMeta: CompanyResearchMeta = {
      researchSource: 'none',
      researchedCompanyCount: 0,
      researchFallback: true,
    }

    if (tavilyApiKey) {
      const researchResult = await fetchTopCompanyResearch(tavilyApiKey, topCompaniesForResearch)
      companyResearch = researchResult.companyResearch
      researchMeta = researchResult.meta
    } else {
      console.log('companyResearchStart')
      console.log('companyResearchSuccess', 0)
      console.log('companyResearchFailed', topCompaniesForResearch.length)
      console.log('researchFallback', true)
    }

    const apiKey = process.env.OPENAI_API_KEY || ''
    console.log('generateCareerInsights key status', { hasOpenAIKey: Boolean(apiKey) })
    let response: CareerInsightsResponse | null = null
    let fallbackReason: OpenAIErrorCode = 'openai_error'
    let fallbackResponseType = 'unknown'

    if (apiKey) {
      console.log('generateCareerInsights OpenAI call start')
      try {
        response = await generateWithOpenAI(apiKey, userProfile, topCompanies, analysisResult, companyResearch, researchMeta)
        if (response) {
          console.log('generateCareerInsights OpenAI call success')
        }
      } catch (error) {
        const typedError = error as Partial<OpenAIError>
        fallbackReason =
          typedError.code === 'parse_error' ||
          typedError.code === 'invalid_response' ||
          typedError.code === 'openai_bad_request' ||
          typedError.code === 'openai_context_length'
            ? typedError.code
            : 'openai_error'
        fallbackResponseType = typeof typedError.responseType === 'string' ? typedError.responseType : 'unknown'
        console.warn('generateCareerInsights OpenAI call failed', {
          status: fallbackReason,
          message: error instanceof Error ? error.message : 'unknown_error',
        })
      }
    } else {
      fallbackReason = 'openai_error'
      fallbackResponseType = 'missing_openai_api_key'
    }

    if (!response) {
      console.log('generateCareerInsights fallback', { fallbackToMock: true, fallbackReason, responseType: fallbackResponseType })
      response = buildMockResponse(userProfile, topCompanies, analysisResult, fallbackReason, fallbackResponseType, researchMeta)
    }

    console.log('generateCareerInsights responsePreview', {
      debugVersion: response.debugVersion,
      debugSource: response.debugSource,
      fallbackReason: response.fallbackReason || null,
      aiSummaryPreview: String(response.aiSummary || '').slice(0, 100),
    })

    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        'x-debug-version': DEBUG_VERSION,
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(response),
    }
  } catch (error) {
    const errorResponse = {
      debugVersion: DEBUG_VERSION,
      debugSource: 'mock',
      fallbackReason: 'request_parse_error',
      aiSummary: '',
      message: 'Invalid request payload',
      error: error instanceof Error ? error.message : 'unknown_error',
    }

    console.log('generateCareerInsights responsePreview', {
      debugVersion: errorResponse.debugVersion,
      debugSource: errorResponse.debugSource,
      fallbackReason: errorResponse.fallbackReason,
      aiSummaryPreview: '',
    })

    return {
      statusCode: 400,
      headers: {
        ...CORS_HEADERS,
        'x-debug-version': DEBUG_VERSION,
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(errorResponse),
    }
  }
}
