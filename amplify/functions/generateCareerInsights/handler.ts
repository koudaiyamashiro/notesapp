declare const process: { env: Record<string, string | undefined> }

const DEBUG_VERSION = '2026-06-19-debug-v1'
const MAX_PROMPT_CHARS = 8000
const TAVILY_PER_COMPANY_TIMEOUT_MS = 3500
const TAVILY_TOTAL_TIMEOUT_MS = 9000
const OPENAI_TIMEOUT_MS = 30000

type CareerInsightsRequest = {
  userProfile?: Record<string, unknown>
  topCompanies?: Array<Record<string, unknown>>
  analysisResult?: Record<string, unknown>
}

type CareerInsightsResponse = {
  debugVersion: string
  debugSource: 'openai' | 'openai_partial' | 'mock'
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
    researchFallback: boolean
    totalProcessingMs: number
  }
  userProfileSummary?: Record<string, unknown>
  analysisSnapshot?: Record<string, unknown>
}

type OpenAIErrorCode =
  | 'invalid_response'
  | 'parse_error'
  | 'partial_openai_response'
  | 'missing_openai_api_key'
  | 'openai_auth_error'
  | 'openai_rate_limit'
  | 'openai_model_error'
  | 'openai_timeout'
  | 'openai_unknown_error'
  | 'research_fallback'

type OpenAIError = Error & {
  code: OpenAIErrorCode
  responseType?: string
  status?: number
  type?: string
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

function buildJsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      'x-debug-version': DEBUG_VERSION,
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  }
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : []
}

function compressResearchText(text: string, minLength = 200, maxLength = 300) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return ''
  if (normalized.length <= maxLength) return normalized
  const clipped = normalized.slice(0, maxLength)
  const lastStop = Math.max(clipped.lastIndexOf('。'), clipped.lastIndexOf('.'))
  if (lastStop >= minLength) return clipped.slice(0, lastStop + 1)
  return clipped
}

async function fetchCompanyResearchFromTavily(apiKey: string, companyName: string) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TAVILY_PER_COMPANY_TIMEOUT_MS)
  const query = [
    `${companyName} 会社概要`,
    `${companyName} 主力プロダクト サービス`,
    `${companyName} 注力領域 採用 求める人物像`,
    `${companyName} 働き方 カルチャー`,
    `${companyName} 直近ニュース プレスリリース`,
    `${companyName} 想定リスク`,
  ].join(' ')

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
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

    return compressResearchText([answer, ...snippets].join(' '), 200, 300)
  } catch {
    return ''
  } finally {
    clearTimeout(timeoutId)
  }
}

async function fetchTopCompanyResearch(tavilyApiKey: string, topCompanies: unknown[]) {
  const companies = topCompanies.slice(0, 3).map((company, index) => {
    const typed = (company || {}) as Record<string, unknown>
    return {
      companyName: String(typed.name || `Company ${index + 1}`),
    }
  })

  console.log('companyResearchStart')

  const companyResearch: CompanyResearchItem[] = []
  let failedCount = 0
  let timedOut = false

  const tasks = companies.map(async (company) => {
    const summary = await fetchCompanyResearchFromTavily(tavilyApiKey, company.companyName)
    if (!summary) {
      failedCount += 1
      return
    }
    companyResearch.push({
      companyName: company.companyName,
      researchSummary: summary,
    })
  })

  await Promise.race([
    Promise.allSettled(tasks),
    new Promise<void>((resolve) => {
      setTimeout(() => {
        timedOut = true
        resolve()
      }, TAVILY_TOTAL_TIMEOUT_MS)
    }),
  ])

  if (timedOut) {
    failedCount = Math.max(failedCount, companies.length - companyResearch.length)
  }
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
      .slice(0, 3)
      .map((item) => ({
        companyName: safeText(item.companyName, 80),
        researchSummary: strict ? safeText(item.researchSummary, 220) : safeText(item.researchSummary, 300),
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
      researchFallback: researchMeta.researchFallback,
      totalProcessingMs: 0,
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

function inferCompanyFocus(companyName: string, researchSummary: string) {
  const lower = `${companyName} ${researchSummary}`.toLowerCase()

  if (lower.includes('abeja')) {
    return {
      focus: 'AI/データ活用',
      caution: 'AI活用の実装速度と品質担保の両立が求められる可能性があります。',
      appeal: 'AI/データ施策を事業KPIへ接続した実績を具体的に示すことが有効です。',
      prep: 'データ活用プロジェクトの成果を、課題・打ち手・効果で1枚に整理してください。',
    }
  }

  if (lower.includes('microsoft')) {
    return {
      focus: 'クラウド/AI/エンタープライズ',
      caution: '大規模顧客を前提とした合意形成と提案品質の水準が高い可能性があります。',
      appeal: 'クラウド導入やAI活用を、業務変革や売上貢献に結び付けた説明が有効です。',
      prep: 'AzureやCopilot関連の活用事例を、顧客課題との対応関係で準備してください。',
    }
  }

  if (lower.includes('ibm')) {
    return {
      focus: 'ハイブリッドクラウド/AI/コンサル',
      caution: '技術理解に加えて、業界文脈を踏まえた提案力が求められる可能性があります。',
      appeal: '複数部門を巻き込んだ変革推進の経験を、意思決定プロセスとともに示すと有効です。',
      prep: 'ハイブリッドクラウドやAI活用の導入効果を、定量指標で説明できるようにしてください。',
    }
  }

  if (lower.includes('dirbato')) {
    return {
      focus: 'ITコンサル/DX支援',
      caution: '短期間での成果創出とクライアント折衝の両立が求められる可能性があります。',
      appeal: 'DXプロジェクトでの課題整理から実行までの推進経験を示すと有効です。',
      prep: '業務改革・システム導入の実績を、再現可能な進め方として整理してください。',
    }
  }

  if (lower.includes('クラウド')) {
    return {
      focus: 'クラウド活用',
      caution: '変化の速い技術領域への継続的なキャッチアップが必要な可能性があります。',
      appeal: 'クラウド基盤の改善を事業成果に変換した経験を示すと有効です。',
      prep: 'クラウド関連の改善施策を、効果指標つきで整理してください。',
    }
  }

  if (lower.includes('コンサル') || lower.includes('dx')) {
    return {
      focus: 'DX推進/コンサルティング',
      caution: '複数ステークホルダーとの調整負荷が高い可能性があります。',
      appeal: '課題特定から実行までの推進力を、具体事例で示すと有効です。',
      prep: '提案資料を、課題・打ち手・効果の構造でテンプレート化してください。',
    }
  }

  return {
    focus: '事業成長に直結する業務推進',
    caution: '立ち上がり初期に期待値調整と優先順位付けが重要になる可能性があります。',
    appeal: '成果創出までのプロセスを定量で示すことが有効です。',
    prep: '実績3件を課題・打ち手・成果で整理し、再現性を説明できるようにしてください。',
  }
}

function normalizeCompanyStrategyReports(value: unknown, topCompanies: unknown[], companyResearch: CompanyResearchItem[], useFallbackDefaults = true) {
  const byName = new Map(
    asArray(value)
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String((item as Record<string, unknown>).companyName || ''), item as Record<string, unknown>])
  )

  const researchByName = new Map(companyResearch.map((item) => [item.companyName, item.researchSummary]))

  return topCompanies.slice(0, 5).map((company, index) => {
    const base = (company || {}) as Record<string, any>
    const name = String(base.name || `Company ${index + 1}`)
    const source = byName.get(name) || {}
    const researchSummary = String(researchByName.get(name) || '')
    const focus = inferCompanyFocus(name, researchSummary)
    const recommendationReason = asStringArray((source as Record<string, unknown>).recommendationReason, 4)
    const concernPoints = asStringArray((source as Record<string, unknown>).concernPoints, 4)
    const interviewAppealPoints = asStringArray((source as Record<string, unknown>).interviewAppealPoints, 4)
    const preparationActions = asStringArray((source as Record<string, unknown>).preparationActions, 4)

    const resolvedRecommendationReason =
      recommendationReason.length > 0
        ? recommendationReason
        : useFallbackDefaults
          ? [
              `${name}は${focus.focus}の文脈で、これまでの経験を活かせる可能性があります。`,
              '公開情報ベースでは、役割期待と経験の接点を作りやすいと考えられます。',
            ]
          : []

    const resolvedConcernPoints = concernPoints.length > 0 ? concernPoints : useFallbackDefaults ? [focus.caution] : []
    const resolvedInterviewAppealPoints = interviewAppealPoints.length > 0 ? interviewAppealPoints : useFallbackDefaults ? [focus.appeal] : []
    const resolvedPreparationActions = preparationActions.length > 0 ? preparationActions : useFallbackDefaults ? [focus.prep] : []

    return {
      companyName: name,
      fitScore: asSafeNumber((source as Record<string, unknown>).fitScore ?? base.overallFit ?? base.matchScore, 75, 40, 99),
      expectedRole: String((source as Record<string, unknown>).expectedRole || (useFallbackDefaults ? '想定ポジション未設定' : '')),
      recommendationReason: resolvedRecommendationReason,
      concernPoints: resolvedConcernPoints,
      interviewAppealPoints: resolvedInterviewAppealPoints,
      preparationActions: resolvedPreparationActions,
      estimatedOfferProbability: String((source as Record<string, unknown>).estimatedOfferProbability || (useFallbackDefaults ? '中（目安）' : '')),
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

function hasRoadmapContent(roadmap: {
  next1Month: string[]
  next3Months: string[]
  next6Months: string[]
  next1Year: string[]
  next3Years: string[]
}) {
  return (
    roadmap.next1Month.length > 0 ||
    roadmap.next3Months.length > 0 ||
    roadmap.next6Months.length > 0 ||
    roadmap.next1Year.length > 0 ||
    roadmap.next3Years.length > 0
  )
}

function buildDefaultOpenAICompanyInsights(topCompanies: unknown[]) {
  return topCompanies.slice(0, 3).map((company, index) => {
    const typed = (company || {}) as Record<string, unknown>
    const companyName = String(typed.name || `Company ${index + 1}`)
    return {
      companyName,
      summary: `${companyName}は公開情報ベースでは、経験との接点を作りやすい可能性があります。`,
      reasons: ['公開情報ベースでは、現在の経験を活かせる業務領域がある可能性があります。'],
      risks: ['役割期待値のすり合わせと初期成果の定義が重要になる可能性があります。'],
    }
  })
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

function createOpenAIError(code: OpenAIErrorCode, message: string, responseType?: string, status?: number, type?: string): OpenAIError {
  const error = new Error(message) as OpenAIError
  error.code = code
  error.responseType = responseType
  error.status = status
  error.type = type
  return error
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
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
    'JSONのみ返してください。Markdownや説明文は不要です。',
    '以下のキーを必ず返してください: aiSummary, riskAnalysis, nextActions, companyInsights, careerArchetype, marketValue, careerScenarios, companyStrategyReports, careerRoadmap。',
    '必須キーは空にせず、最低1件の内容を入れてください。',
    '回答は日本語。簡潔かつ具体的に。',
    '最優先は companyStrategyReports の企業別具体化です。',
    'companyResearch を根拠に、企業ごとに推薦理由・懸念点・面接訴求ポイント・準備アクションを差別化してください。',
    'companyStrategyReports は必須です。各企業について expectedRole, recommendationReason, concernPoints, interviewAppealPoints, preparationActions を必ず返してください。',
    'companyStrategyReports の各配列は最低1件返してください。',
    '抽象表現は禁止です。companyResearch の事実にもとづく企業固有の表現で記述してください。',
    'careerScenarios は最大1件、requiredActions は最大2件にしてください。',
    'careerRoadmap は各期間最大1件で短く記述してください。',
    'aiSummary は300〜500文字程度にしてください。',
    'riskAnalysis と nextActions はそれぞれ1〜3件にしてください。',
    '不確かな情報は断定せず「公開情報ベースでは」「可能性があります」と表現してください。',
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

  let openAIResponse: Response
  try {
    openAIResponse = await fetchWithTimeout(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.3,
          max_tokens: 1800,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      },
      OPENAI_TIMEOUT_MS
    )
  } catch {
    throw createOpenAIError('openai_timeout', 'OpenAI request timed out', 'timeout')
  }

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

    if (openAIResponse.status === 401 || openAIResponse.status === 403) {
      throw createOpenAIError('openai_auth_error', 'OpenAI request failed with auth error', 'http_error', openAIResponse.status, String(errorInfo?.type || ''))
    }

    if (openAIResponse.status === 429) {
      throw createOpenAIError('openai_rate_limit', 'OpenAI request failed with rate limit', 'http_error', openAIResponse.status, String(errorInfo?.type || ''))
    }

    if (openAIResponse.status === 400 || errorCode === 'model_not_found' || errorCode === 'invalid_model' || errorCode === 'context_length_exceeded') {
      throw createOpenAIError('openai_model_error', `OpenAI request failed with model-related error (${openAIResponse.status})`, 'http_error', openAIResponse.status, String(errorInfo?.type || ''))
    }

    throw createOpenAIError('openai_unknown_error', `OpenAI request failed with status ${openAIResponse.status}`, 'http_error', openAIResponse.status, String(errorInfo?.type || ''))
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

  const parsedObject = parsed as Record<string, unknown>
  let isPartial = false
  const missingFields: string[] = []

  const aiSummaryRaw = typeof parsedObject.aiSummary === 'string' ? parsedObject.aiSummary.trim() : ''
  const aiSummary = aiSummaryRaw || '公開情報ベースの仮説として、企業ごとの適性と打ち手を要約します。'
  if (!aiSummaryRaw) {
    isPartial = true
    missingFields.push('aiSummary')
  }

  const riskAnalysisRaw = Array.isArray(parsedObject.riskAnalysis) ? parsedObject.riskAnalysis.filter((v: unknown) => typeof v === 'string') : []
  const riskAnalysis = riskAnalysisRaw.length > 0 ? riskAnalysisRaw.slice(0, 5) : ['公開情報ベースでは、選考ごとに期待値の差分確認が重要です。']
  if (riskAnalysisRaw.length === 0) {
    isPartial = true
    missingFields.push('riskAnalysis')
  }

  const nextActionsRaw = Array.isArray(parsedObject.nextActions) ? parsedObject.nextActions.filter((v: unknown) => typeof v === 'string') : []
  const nextActions = nextActionsRaw.length > 0 ? nextActionsRaw.slice(0, 5) : ['応募企業ごとに実績を1ページで整理し、訴求軸を明確化してください。']
  if (nextActionsRaw.length === 0) {
    isPartial = true
    missingFields.push('nextActions')
  }

  const companyInsightsRaw = Array.isArray(parsedObject.companyInsights) ? parsedObject.companyInsights : []
  const companyInsights =
    companyInsightsRaw.length > 0
      ? companyInsightsRaw.map((company: Record<string, unknown>, index: number) => buildOpenAICompanyInsight(company, index))
      : buildDefaultOpenAICompanyInsights(topCompanies)
  if (companyInsightsRaw.length === 0) {
    isPartial = true
    missingFields.push('companyInsights')
  }

  const careerArchetypeRaw = normalizeCareerArchetype(parsedObject.careerArchetype)
  if (!parsedObject.careerArchetype) {
    isPartial = true
    missingFields.push('careerArchetype')
  }

  const marketValueRaw = normalizeMarketValue(parsedObject.marketValue, analysisResult)
  if (!parsedObject.marketValue) {
    isPartial = true
    missingFields.push('marketValue')
  }

  const careerScenariosRaw = normalizeCareerScenarios(parsedObject.careerScenarios)
  const careerScenarios =
    careerScenariosRaw.length > 0
      ? careerScenariosRaw
      : [
          {
            title: '現職延長での強化シナリオ',
            targetRole: String(userProfile.role || '未設定'),
            targetIndustry: '現職近接領域',
            expectedSalaryRange: '現職水準±10%（目安）',
            timeline: '6〜12ヶ月',
            reason: '公開情報ベースの仮説として、現職実績の再現性を高めると選択肢が広がる可能性があります。',
            requiredActions: ['実績の定量化', '企業別の訴求軸整理'],
          },
        ]
  if (careerScenariosRaw.length === 0) {
    isPartial = true
    missingFields.push('careerScenarios')
  }

  const hasOpenAICompanyStrategyReports = Array.isArray(parsedObject.companyStrategyReports) && asArray(parsedObject.companyStrategyReports).length > 0
  const companyStrategyReportsRaw = hasOpenAICompanyStrategyReports
    ? normalizeCompanyStrategyReports(parsedObject.companyStrategyReports, topCompanies, companyResearch, false)
    : normalizeCompanyStrategyReports(parsedObject.companyStrategyReports, topCompanies, companyResearch, true)
  if (!hasOpenAICompanyStrategyReports) {
    isPartial = true
    missingFields.push('companyStrategyReports')
  }

  if (hasOpenAICompanyStrategyReports && companyStrategyReportsRaw.length > 0) {
    const sample = companyStrategyReportsRaw[0]
    const takeText = (value: unknown) => String(value || '').slice(0, 200)
    const first = (value: unknown) => {
      const list = asArray(value).filter((item): item is string => typeof item === 'string')
      return takeText(list[0] || '')
    }
    console.log('OPENAI_COMPANY_REPORT_SAMPLE', {
      company: takeText(sample.companyName),
      recommendationReason: first(sample.recommendationReason),
      concernPoints: first(sample.concernPoints),
      interviewAppealPoints: first(sample.interviewAppealPoints),
      preparationActions: first(sample.preparationActions),
    })
  }

  const careerRoadmapRaw = normalizeCareerRoadmap(parsedObject.careerRoadmap)
  const careerRoadmap = hasRoadmapContent(careerRoadmapRaw)
    ? careerRoadmapRaw
    : {
        next1Month: ['企業別に職務経歴書を調整する'],
        next3Months: ['面接想定問答と成果事例を更新する'],
        next6Months: ['不足スキルの実務適用を進める'],
        next1Year: ['より高い責任範囲の案件を担う'],
        next3Years: ['専門性と事業成果の両面で市場価値を高める'],
      }
  if (!hasRoadmapContent(careerRoadmapRaw)) {
    isPartial = true
    missingFields.push('careerRoadmap')
  }

  if (missingFields.length > 0) {
    console.warn('MISSING_FIELDS', missingFields)
  }

  return {
    debugVersion: DEBUG_VERSION,
    debugSource: isPartial ? 'openai_partial' : 'openai',
    fallbackReason: isPartial ? 'partial_openai_response' : null,
    aiSummary,
    riskAnalysis,
    nextActions,
    companyInsights,
    careerArchetype: careerArchetypeRaw,
    marketValue: marketValueRaw,
    careerScenarios,
    companyStrategyReports: companyStrategyReportsRaw,
    careerRoadmap,
    debug: {
      researchSource: researchMeta.researchSource,
      researchedCompanyCount: researchMeta.researchedCompanyCount,
      researchFallback: researchMeta.researchFallback,
      totalProcessingMs: 0,
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
  const startedAt = Date.now()

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

  let userProfile: Record<string, unknown> = {}
  let topCompanies: unknown[] = []
  let analysisResult: Record<string, unknown> = {}
  let researchMeta: CompanyResearchMeta = {
    researchSource: 'none',
    researchedCompanyCount: 0,
    researchFallback: true,
  }

  try {
    const requestBody = 'body' in event && typeof event.body === 'string' ? JSON.parse(event.body || '{}') : event
    const typedRequestBody = requestBody as CareerInsightsRequest
    userProfile = (typedRequestBody.userProfile || {}) as Record<string, unknown>
    topCompanies = asArray(typedRequestBody.topCompanies)
    analysisResult = (typedRequestBody.analysisResult || {}) as Record<string, unknown>
    const topCompaniesForResearch = topCompanies.slice(0, 3)

    const tavilyApiKey = process.env.TAVILY_API_KEY || ''
    console.log('hasTavilyKey', Boolean(tavilyApiKey))

    let companyResearch: CompanyResearchItem[] = []

    if (tavilyApiKey) {
      try {
        const researchResult = await fetchTopCompanyResearch(tavilyApiKey, topCompaniesForResearch)
        companyResearch = researchResult.companyResearch
        researchMeta = researchResult.meta
      } catch (error) {
        console.log('companyResearchSuccess', 0)
        console.log('companyResearchFailed', topCompaniesForResearch.length)
        console.log('researchFallback', true)
      }
    } else {
      console.log('companyResearchStart')
      console.log('companyResearchSuccess', 0)
      console.log('companyResearchFailed', topCompaniesForResearch.length)
      console.log('researchFallback', true)
    }

    const apiKey = process.env.OPENAI_API_KEY || ''
    console.log('generateCareerInsights key status', { hasOpenAIKey: Boolean(apiKey) })
    let response: CareerInsightsResponse | null = null
    let fallbackReason: OpenAIErrorCode = 'openai_unknown_error'
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
        const code = typedError.code
        console.error('OPENAI_ERROR_DETAILS', {
          message: typedError?.message,
          status: typedError?.status,
          code: typedError?.code,
          type: typedError?.type,
        })
        fallbackReason =
          code === 'missing_openai_api_key' ||
          code === 'openai_auth_error' ||
          code === 'openai_rate_limit' ||
          code === 'openai_model_error' ||
          code === 'openai_timeout' ||
          code === 'openai_unknown_error'
            ? code
            : 'openai_unknown_error'
        fallbackResponseType = typeof typedError.responseType === 'string' ? typedError.responseType : 'unknown'
        console.warn('generateCareerInsights OpenAI call failed', {
          status: fallbackReason,
          message: error instanceof Error ? error.message : 'unknown_error',
        })
      }
    } else {
      fallbackReason = 'missing_openai_api_key'
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

    if (response.debugSource === 'openai' && researchMeta.researchFallback && !response.fallbackReason) {
      response.fallbackReason = 'research_fallback'
    }

    const totalProcessingMs = Date.now() - startedAt
    response.debug = {
      researchSource: response.debug?.researchSource || researchMeta.researchSource,
      researchedCompanyCount: response.debug?.researchedCompanyCount ?? researchMeta.researchedCompanyCount,
      researchFallback: response.debug?.researchFallback ?? researchMeta.researchFallback,
      totalProcessingMs,
    }

    return buildJsonResponse(200, response)
  } catch (error) {
    const fallbackReason = error instanceof SyntaxError ? 'request_parse_error' : 'handler_unexpected_error'
    const errorResponse = buildMockResponse(userProfile, topCompanies, analysisResult, fallbackReason, 'handler_error', researchMeta)
    console.warn('generateCareerInsights handler error', {
      fallbackReason,
      message: error instanceof Error ? error.message : 'unknown_error',
    })

    console.log('generateCareerInsights responsePreview', {
      debugVersion: errorResponse.debugVersion,
      debugSource: errorResponse.debugSource,
      fallbackReason: errorResponse.fallbackReason,
      aiSummaryPreview: String(errorResponse.aiSummary || '').slice(0, 100),
    })

    const totalProcessingMs = Date.now() - startedAt
    errorResponse.debug = {
      researchSource: errorResponse.debug?.researchSource || researchMeta.researchSource,
      researchedCompanyCount: errorResponse.debug?.researchedCompanyCount ?? researchMeta.researchedCompanyCount,
      researchFallback: errorResponse.debug?.researchFallback ?? researchMeta.researchFallback,
      totalProcessingMs,
    }

    return buildJsonResponse(200, errorResponse)
  }
}
