import { runDynamicCompanyEngine } from './services/careerAnalysisService'

declare const process: { env: Record<string, string | undefined> }

const DEBUG_VERSION = '2026-06-19-debug-v1'
const MAX_PROMPT_CHARS = 16000
const TAVILY_PER_COMPANY_TIMEOUT_MS = 4000
const TAVILY_TOTAL_TIMEOUT_MS = 15000
const OPENAI_TIMEOUT_MS = 30000
const OPENAI_RESPONSE_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'aiSummary',
    'riskAnalysis',
    'nextActions',
    'companyInsights',
    'careerArchetype',
    'marketValue',
    'marketValueAnalysis',
    'salaryProjection',
    'successProbability',
    'careerScenarios',
    'companyRecommendations',
    'companyStrategyReports',
    'careerRoadmap',
  ],
  properties: {
    aiSummary: { type: 'string' },
    riskAnalysis: { type: 'array', minItems: 1, items: { type: 'string' } },
    nextActions: { type: 'array', minItems: 1, items: { type: 'string' } },
    companyInsights: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['companyName', 'summary', 'reasons', 'risks'],
        properties: {
          companyName: { type: 'string' },
          summary: { type: 'string' },
          reasons: { type: 'array', minItems: 1, items: { type: 'string' } },
          risks: { type: 'array', minItems: 1, items: { type: 'string' } },
        },
      },
    },
    careerArchetype: {
      type: 'object',
      additionalProperties: false,
      required: ['type', 'summary', 'strengths', 'risks'],
      properties: {
        type: { type: 'string' },
        summary: { type: 'string' },
        strengths: { type: 'array', minItems: 1, items: { type: 'string' } },
        risks: { type: 'array', minItems: 1, items: { type: 'string' } },
      },
    },
    marketValue: {
      type: 'object',
      additionalProperties: false,
      required: [
        'score',
        'percentile',
        'currentEstimatedSalaryRange',
        'threeYearSalaryRange',
        'fiveYearSalaryRange',
        'evaluation',
        'breakdown',
      ],
      properties: {
        score: { type: 'number' },
        percentile: { type: 'string' },
        currentEstimatedSalaryRange: { type: 'string' },
        threeYearSalaryRange: { type: 'string' },
        fiveYearSalaryRange: { type: 'string' },
        evaluation: { type: 'string' },
        breakdown: {
          type: 'object',
          additionalProperties: false,
          required: ['skillRarity', 'industryDemand', 'transferability', 'managementPotential', 'growthPotential'],
          properties: {
            skillRarity: { type: 'number' },
            industryDemand: { type: 'number' },
            transferability: { type: 'number' },
            managementPotential: { type: 'number' },
            growthPotential: { type: 'number' },
          },
        },
      },
    },
    marketValueAnalysis: {
      type: 'object',
      additionalProperties: false,
      required: [
        'score',
        'deviation',
        'nationalRank',
        'reason',
        'positiveFactors',
        'negativeFactors',
        'improvementActions',
        'breakdown',
      ],
      properties: {
        score: { type: 'number' },
        deviation: { type: 'number' },
        nationalRank: { type: 'string' },
        reason: { type: 'string' },
        positiveFactors: { type: 'array', minItems: 1, items: { type: 'string' } },
        negativeFactors: { type: 'array', minItems: 1, items: { type: 'string' } },
        improvementActions: { type: 'array', minItems: 1, items: { type: 'string' } },
        breakdown: {
          type: 'object',
          additionalProperties: false,
          required: [
            'skillFit',
            'experienceDepth',
            'industryDemand',
            'salaryRealism',
            'careerConsistency',
            'weaknessRisk',
            'growthPotential',
          ],
          properties: {
            skillFit: { $ref: '#/$defs/scoreBreakdownItem' },
            experienceDepth: { $ref: '#/$defs/scoreBreakdownItem' },
            industryDemand: { $ref: '#/$defs/scoreBreakdownItem' },
            salaryRealism: { $ref: '#/$defs/scoreBreakdownItem' },
            careerConsistency: { $ref: '#/$defs/scoreBreakdownItem' },
            weaknessRisk: { $ref: '#/$defs/scoreBreakdownItem' },
            growthPotential: { $ref: '#/$defs/scoreBreakdownItem' },
          },
        },
      },
    },
    salaryProjection: {
      type: 'object',
      additionalProperties: false,
      required: [
        'currentRange',
        'after3YearsRange',
        'after5YearsRange',
        'projectionReason',
        'optimisticScenario',
        'conservativeScenario',
        'requiredActions',
      ],
      properties: {
        currentRange: { type: 'string' },
        after3YearsRange: { type: 'string' },
        after5YearsRange: { type: 'string' },
        projectionReason: { type: 'string' },
        optimisticScenario: { type: 'string' },
        conservativeScenario: { type: 'string' },
        requiredActions: { type: 'array', minItems: 1, items: { type: 'string' } },
      },
    },
    successProbability: {
      type: 'object',
      additionalProperties: false,
      required: ['current', 'after6Months', 'after1Year', 'reason', 'assumptions', 'blockers', 'actionsToImprove'],
      properties: {
        current: { type: 'number' },
        after6Months: { type: 'number' },
        after1Year: { type: 'number' },
        reason: { type: 'string' },
        assumptions: { type: 'array', minItems: 1, items: { type: 'string' } },
        blockers: { type: 'array', minItems: 1, items: { type: 'string' } },
        actionsToImprove: { type: 'array', minItems: 1, items: { type: 'string' } },
      },
    },
    careerScenarios: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'targetRole', 'targetIndustry', 'expectedSalaryRange', 'timeline', 'reason', 'requiredActions'],
        properties: {
          title: { type: 'string' },
          targetRole: { type: 'string' },
          targetIndustry: { type: 'string' },
          expectedSalaryRange: { type: 'string' },
          timeline: { type: 'string' },
          reason: { type: 'string' },
          requiredActions: { type: 'array', minItems: 1, items: { type: 'string' } },
        },
      },
    },
    companyStrategyReports: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'companyName',
          'businessProductFeatures',
          'userConnectionPoints',
          'businessModel',
          'mainProducts',
          'industryTrend',
          'requiredSkills',
          'fitReasons',
          'riskReasons',
          'interviewTopics',
          'preparationChecklist',
          'fitScore',
          'expectedRole',
          'recommendationReason',
          'concernPoints',
          'interviewAppealPoints',
          'preparationActions',
          'estimatedOfferProbability',
        ],
        properties: {
          companyName: { type: 'string' },
          businessProductFeatures: { type: 'array', minItems: 2, items: { type: 'string' } },
          userConnectionPoints: { type: 'array', minItems: 2, items: { type: 'string' } },
          businessModel: { type: 'string' },
          mainProducts: { type: 'array', minItems: 2, items: { type: 'string' } },
          industryTrend: { type: 'string' },
          requiredSkills: { type: 'array', minItems: 2, items: { type: 'string' } },
          fitReasons: { type: 'array', minItems: 2, items: { type: 'string' } },
          riskReasons: { type: 'array', minItems: 2, items: { type: 'string' } },
          interviewTopics: { type: 'array', minItems: 2, items: { type: 'string' } },
          preparationChecklist: { type: 'array', minItems: 2, items: { type: 'string' } },
          fitScore: { type: 'number' },
          expectedRole: { type: 'string' },
          recommendationReason: { type: 'array', minItems: 2, items: { type: 'string' } },
          concernPoints: { type: 'array', minItems: 2, items: { type: 'string' } },
          interviewAppealPoints: { type: 'array', minItems: 2, items: { type: 'string' } },
          preparationActions: { type: 'array', minItems: 2, items: { type: 'string' } },
          estimatedOfferProbability: { type: 'string' },
        },
      },
    },
    companyRecommendations: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'companyName',
          'matchScore',
          'whyRecommended',
          'matchedUserFactors',
          'companyFitReasons',
          'roleFit',
          'salaryFit',
          'cultureFit',
          'workStyleFit',
          'growthFit',
          'concerns',
          'interviewAppealPoints',
          'preparationActions',
          'evidenceSummary',
          'sources',
        ],
        properties: {
          companyName: { type: 'string' },
          matchScore: { type: 'number' },
          whyRecommended: { type: 'string' },
          matchedUserFactors: { type: 'array', minItems: 1, items: { type: 'string' } },
          companyFitReasons: { type: 'array', minItems: 1, items: { type: 'string' } },
          roleFit: { type: 'string' },
          salaryFit: { type: 'string' },
          cultureFit: { type: 'string' },
          workStyleFit: { type: 'string' },
          growthFit: { type: 'string' },
          concerns: { type: 'array', minItems: 1, items: { type: 'string' } },
          interviewAppealPoints: { type: 'array', minItems: 1, items: { type: 'string' } },
          preparationActions: { type: 'array', minItems: 1, items: { type: 'string' } },
          evidenceSummary: { type: 'string' },
          sources: { type: 'array', minItems: 1, items: { type: 'string' } },
        },
      },
    },
    careerRoadmap: {
      type: 'object',
      additionalProperties: false,
      required: ['next1Month', 'next3Months', 'next6Months', 'next1Year', 'next3Years'],
      properties: {
        next1Month: { type: 'array', minItems: 1, items: { type: 'string' } },
        next3Months: { type: 'array', minItems: 1, items: { type: 'string' } },
        next6Months: { type: 'array', minItems: 1, items: { type: 'string' } },
        next1Year: { type: 'array', minItems: 1, items: { type: 'string' } },
        next3Years: { type: 'array', minItems: 1, items: { type: 'string' } },
      },
    },
  },
  $defs: {
    scoreBreakdownItem: {
      type: 'object',
      additionalProperties: false,
      required: ['score', 'reason', 'positiveFactors', 'negativeFactors', 'improvementActions'],
      properties: {
        score: { type: 'number' },
        reason: { type: 'string' },
        positiveFactors: { type: 'array', minItems: 1, items: { type: 'string' } },
        negativeFactors: { type: 'array', minItems: 1, items: { type: 'string' } },
        improvementActions: { type: 'array', minItems: 1, items: { type: 'string' } },
      },
    },
  },
} as const

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
  topCompanies?: Array<Record<string, unknown>>
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
  marketValueAnalysis: {
    score: number
    deviation: number
    nationalRank: string
    reason: string
    positiveFactors: string[]
    negativeFactors: string[]
    improvementActions: string[]
    breakdown: Record<string, {
      score: number
      reason: string
      positiveFactors: string[]
      negativeFactors: string[]
      improvementActions: string[]
    }>
  }
  salaryProjection: {
    currentRange: string
    after3YearsRange: string
    after5YearsRange: string
    projectionReason: string
    optimisticScenario: string
    conservativeScenario: string
    requiredActions: string[]
  }
  successProbability: {
    current: number
    after6Months: number
    after1Year: number
    reason: string
    assumptions: string[]
    blockers: string[]
    actionsToImprove: string[]
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
  companyRecommendations: Array<{
    companyName: string
    matchScore: number
    whyRecommended: string
    matchedUserFactors: string[]
    companyFitReasons: string[]
    roleFit: string
    salaryFit: string
    cultureFit: string
    workStyleFit: string
    growthFit: string
    concerns: string[]
    interviewAppealPoints: string[]
    preparationActions: string[]
    evidenceSummary: string
    sources: string[]
  }>
  companyStrategyReports: Array<{
    companyName: string
    businessProductFeatures: string[]
    userConnectionPoints: string[]
    businessModel: string
    mainProducts: string[]
    industryTrend: string
    requiredSkills: string[]
    fitReasons: string[]
    riskReasons: string[]
    interviewTopics: string[]
    preparationChecklist: string[]
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
  | 'missing_openai_api_key'
  | 'openai_auth_error'
  | 'openai_rate_limit'
  | 'openai_model_error'
  | 'openai_timeout'
  | 'openai_unknown_error'

type OpenAIError = Error & {
  code: OpenAIErrorCode
  responseType?: string
  status?: number
  type?: string
}

type CompanyResearchItem = {
  companyName: string
  researchSummary: string
  researchSections: {
    business: string[]
    products: string[]
    hiring: string[]
    news: string[]
    ir: string[]
    competitors: string[]
    reviews: string[]
  }
}

type CompanyResearchMeta = {
  researchSource: 'tavily' | 'none'
  researchedCompanyCount: number
  researchFallback: boolean
}

type DynamicProfileLike = {
  name: string
  sources?: Array<{ title?: string; url?: string; snippet?: string; sourceType?: string }>
  sourceSummaries?: string[]
  businessSummary?: string
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

function toCompanyResearchFromProfiles(profiles: DynamicProfileLike[]) {
  return profiles.slice(0, 5).map((profile) => {
    const sources = Array.isArray(profile.sources) ? profile.sources : []
    const sections = {
      business: [] as string[],
      products: [] as string[],
      hiring: [] as string[],
      news: [] as string[],
      ir: [] as string[],
      competitors: [] as string[],
      reviews: [] as string[],
    }

    for (const source of sources) {
      const line = [safeText(source.title, 80), safeText(source.snippet, 180), safeText(source.url, 120)]
        .filter(Boolean)
        .join(' | ')
      const sourceType = String(source.sourceType || '')

      if (sourceType === 'official') {
        sections.business.push(line)
      } else if (sourceType === 'hiring' || sourceType === 'job') {
        sections.hiring.push(line)
      } else if (sourceType === 'review') {
        sections.reviews.push(line)
      } else if (sourceType === 'news') {
        sections.news.push(line)
      } else {
        sections.products.push(line)
      }
    }

    const summarySource = [
      safeText(profile.businessSummary, 400),
      ...(Array.isArray(profile.sourceSummaries) ? profile.sourceSummaries.map((v) => safeText(v, 200)) : []),
      ...Object.values(sections).flat(),
    ]
      .filter(Boolean)
      .join(' ')

    return {
      companyName: String(profile.name || 'Unknown Company'),
      researchSummary: compressResearchText(summarySource, 150, 900),
      researchSections: {
        business: sections.business.slice(0, 3),
        products: sections.products.slice(0, 3),
        hiring: sections.hiring.slice(0, 3),
        news: sections.news.slice(0, 3),
        ir: sections.ir.slice(0, 2),
        competitors: sections.competitors.slice(0, 2),
        reviews: sections.reviews.slice(0, 3),
      },
    }
  })
}

async function fetchCompanyResearchFromTavily(apiKey: string, companyName: string) {
  const sectionQueries: Array<[keyof CompanyResearchItem['researchSections'], string]> = [
    ['business', `${companyName} 会社概要 事業内容 主要サービス 成長領域`],
    ['products', `${companyName} 製品 サービス 導入事例 中核プロダクト`],
    ['hiring', `${companyName} 中途採用 キャリア採用 求める人物像 働き方 カルチャー`],
    ['news', `${companyName} ニュース プレスリリース 直近`],
    ['ir', `${companyName} IR 中期経営計画 成長戦略 年収レンジ`],
    ['competitors', `${companyName} 競合 比較 市場ポジション 中途採用`],
    ['reviews', `${companyName} OpenWork 口コミ 評判 年収 働き方 面接`],
  ]

  async function fetchSection(query: string) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TAVILY_PER_COMPANY_TIMEOUT_MS)
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
          max_results: 3,
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
        .slice(0, 3)
        .map((item) => {
          if (!item || typeof item !== 'object') return ''
          const title = safeText((item as Record<string, unknown>).title, 80)
          const content = safeText((item as Record<string, unknown>).content, 180)
          const url = safeText((item as Record<string, unknown>).url, 120)
          return [title, content, url].filter(Boolean).join(' | ')
        })
        .filter(Boolean)

      return compressResearchText([answer, ...snippets].join(' '), 120, 420)
    } catch {
      return ''
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const sectionEntries = await Promise.allSettled(sectionQueries.map(([, query]) => fetchSection(query)))
  const researchSections = sectionQueries.reduce((accumulator, [section], index) => {
    const result = sectionEntries[index]
    const sectionText = result && result.status === 'fulfilled' ? result.value : ''
    accumulator[section] = sectionText ? [sectionText] : []
    return accumulator
  }, {} as CompanyResearchItem['researchSections'])

  const researchSummary = compressResearchText(
    Object.values(researchSections)
      .flat()
      .join(' '),
    200,
    900
  )

  return {
    companyName,
    researchSummary,
    researchSections,
  }
}

async function fetchTopCompanyResearch(tavilyApiKey: string, topCompanies: unknown[]) {
  const companies = topCompanies.slice(0, 5).map((company, index) => {
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
    const researchItem = await fetchCompanyResearchFromTavily(tavilyApiKey, company.companyName)
    if (!researchItem.researchSummary) {
      failedCount += 1
      return
    }
    companyResearch.push(researchItem)
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

function incomeBucketMidpoint(value: unknown) {
  const text = String(value || '')
  if (text === '200未満') return 180
  if (text === '1200以上') return 1250
  const match = text.match(/(\d+)[^\d]+(\d+)/)
  if (!match) return 650
  return Math.round((Number(match[1]) + Number(match[2])) / 2)
}

function toSalaryRange(min: number, max: number) {
  return `${Math.round(min)}万〜${Math.round(max)}万円`
}

function safeProfileArray(value: unknown) {
  return asArray(value).filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function buildBreakdownItem(score: number, reason: string, positiveFactors: string[], negativeFactors: string[], improvementActions: string[]) {
  return {
    score: asSafeNumber(score, 70, 20, 99),
    reason,
    positiveFactors: uniqueStrings(positiveFactors).slice(0, 4),
    negativeFactors: uniqueStrings(negativeFactors).slice(0, 4),
    improvementActions: uniqueStrings(improvementActions).slice(0, 4),
  }
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
    companyType: safeText((company as Record<string, any>).companyType, 40),
    matchScore: Number.isFinite(numericScore) ? Math.round(numericScore) : 0,
    summary: safeText((company as Record<string, any>).summary || (company as Record<string, any>).recommendation, 220),
    salaryRange: safeText((company as Record<string, any>).salaryRange, 40),
    culture: safeText((company as Record<string, any>).culture, 40),
    recommendedRoles: toStringList((company as Record<string, any>).recommendedRoles, 4, 40),
    strengths: toStringList((company as Record<string, any>).strengths, 4, 40),
    risks: toStringList((company as Record<string, any>).risks, 3, 50),
    remoteScore: asSafeNumber((company as Record<string, any>).remoteScore, 55),
    growthScore: asSafeNumber((company as Record<string, any>).growthScore, 75),
    workLifeBalanceScore: asSafeNumber((company as Record<string, any>).workLifeBalanceScore, 60),
    matchedConditions,
    recommendationReasons: recommendationReasons.slice(0, 2),
    concernPoints: concernPoints.slice(0, 1),
  }
}

function sanitizeProfileForPrompt(userProfile: Record<string, unknown>) {
  return {
    age: safeText(userProfile.age, 10),
    role: safeText(userProfile.role, 40),
    level: safeText(userProfile.level, 40),
    experience: safeText(userProfile.experience, 20),
    income: safeText(userProfile.income, 20),
    workStyle: safeText(userProfile.workStyle, 40),
    desiredIndustry: toStringList(userProfile.desiredIndustry, 3, 40),
    purpose: toStringList(userProfile.purpose, 3, 60),
    strengths: toStringList(userProfile.strengths, 3, 40),
    weaknesses: toStringList(userProfile.weaknesses, 3, 40),
    idealFuture: safeText(userProfile.idealFuture, 100),
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
        researchSummary: strict ? safeText(item.researchSummary, 240) : safeText(item.researchSummary, 360),
        researchSections: {
          business: asArray(item.researchSections.business).slice(0, 2).map((entry) => safeText(entry, 180)),
          products: asArray(item.researchSections.products).slice(0, 2).map((entry) => safeText(entry, 180)),
          hiring: asArray(item.researchSections.hiring).slice(0, 2).map((entry) => safeText(entry, 180)),
          news: asArray(item.researchSections.news).slice(0, 2).map((entry) => safeText(entry, 180)),
          ir: asArray(item.researchSections.ir).slice(0, 2).map((entry) => safeText(entry, 180)),
          competitors: asArray(item.researchSections.competitors).slice(0, 2).map((entry) => safeText(entry, 180)),
          reviews: asArray(item.researchSections.reviews).slice(0, 2).map((entry) => safeText(entry, 180)),
        },
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
    summary: `${name}は現在の経験との接点を作りやすい有望候補です。`,
    reasonCards,
    cautionPoints: cautionPoints.length > 0 ? cautionPoints : ['役割期待値とのズレを防ぐため、選考前に業務範囲を確認してください。'],
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

function truncateText(value: unknown, maxLength = 120) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

function collectResearchBullets(sections: Record<string, string[]>, keys: string[], maxItems: number, fallback: string[]) {
  const items = uniqueStrings(
    keys.flatMap((key) => asArray(sections[key] || [])).map((entry) => truncateText(entry, 180))
  )
  if (items.length >= maxItems) return items.slice(0, maxItems)
  return uniqueStrings([...items, ...fallback]).slice(0, maxItems)
}

function extractKeywordSignals(text: string, maxItems: number) {
  const keywords = [
    'AI',
    '生成AI',
    'DX',
    'SaaS',
    'クラウド',
    'データ',
    'コンサルティング',
    '研究開発',
    '製造',
    '医療',
    '教育',
    '営業',
    'プロダクト',
    '業務改革',
    'IR',
    '採用',
    '口コミ',
  ]

  return uniqueStrings(keywords.filter((keyword) => text.includes(keyword))).slice(0, maxItems)
}

function buildResearchBasedFallback(
  companyName: string,
  researchSummary: string,
  researchSections: Record<string, string[]>,
  baseCompany: Record<string, unknown>,
  userProfile: Record<string, unknown>
) {
  const role = String(userProfile.role || '実務担当')
  const fitScore = asSafeNumber((baseCompany as Record<string, any>).overallFit ?? (baseCompany as Record<string, any>).matchScore, 75, 40, 99)
  const researchText = [researchSummary, ...Object.values(researchSections).flat()].join(' ')
  const businessProductFeatures = collectResearchBullets(
    researchSections,
    ['business', 'products', 'news'],
    2,
    [
      truncateText(researchSummary || `${companyName}の公開情報ベースの事業理解を補完しています。`, 180),
      '公開情報ベースの主要サービスを、選考で使える事業理解に変換してください。',
    ]
  )
  const userConnectionPoints = collectResearchBullets(
    researchSections,
    ['hiring', 'business', 'reviews'],
    2,
    [
      `${role}としての課題整理・推進経験を接続しやすい可能性があります。`,
      '定量成果と関係者調整の経験が接点になります。',
    ]
  )
  const mainProducts = collectResearchBullets(
    researchSections,
    ['products', 'business'],
    2,
    ['主要サービスを具体名で整理してください。', '関連プロダクトの差分を把握してください。']
  )
  const requiredSkills = uniqueStrings([
    ...extractKeywordSignals(researchText, 4),
    `${role}としての再現性のある推進力`,
    '業界文脈を踏まえた説明力',
  ]).slice(0, 4)
  const businessModel = truncateText(
    researchSummary || `${companyName}の収益構造や顧客価値は、公開情報をもとに選考前に確認してください。`,
    220
  )
  const industryTrend = truncateText(
    collectResearchBullets(researchSections, ['news', 'ir', 'competitors'], 1, ['業界変化を踏まえた競争環境の確認が必要です。'])[0],
    220
  )
  const fitReasons = uniqueStrings([
    `${companyName}の事業・サービスと、これまでの${role}経験の接点があるためです。`,
    '公開情報ベースでは、課題特定から実行までの経験を活かしやすい可能性があります。',
  ]).slice(0, 2)
  const riskReasons = collectResearchBullets(
    researchSections,
    ['hiring', 'reviews', 'competitors'],
    2,
    ['業界固有の理解を深める必要があります。', '抽象論ではなく、事業指標に紐づけた提案が求められます。']
  )
  const interviewTopics = uniqueStrings([
    `主要サービスをどう理解し、どこに改善余地を見ていますか。`,
    `これまでの${role}経験を、どう再現性ある成果として示せますか。`,
    ...collectResearchBullets(researchSections, ['hiring', 'news'], 1, []),
  ]).slice(0, 3)
  const preparationChecklist = uniqueStrings([
    '会社の主要サービスと業界構造を整理する',
    '自分の実績を課題・施策・KPI・成果で棚卸しする',
    ...collectResearchBullets(researchSections, ['hiring', 'ir', 'reviews'], 1, []),
  ]).slice(0, 3)

  return {
    companyName,
    businessProductFeatures,
    userConnectionPoints,
    businessModel,
    mainProducts,
    industryTrend,
    requiredSkills,
    fitReasons,
    riskReasons,
    interviewTopics,
    preparationChecklist,
    fitScore,
    expectedRole: `${companyName}向けの${role}ポジション`,
    recommendationReason: fitReasons,
    concernPoints: riskReasons,
    interviewAppealPoints: interviewTopics,
    preparationActions: preparationChecklist,
    estimatedOfferProbability: fitScore >= 85 ? '中〜高（目安）' : '中（目安）',
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

function buildAnalyticalInsights(
  userProfile: Record<string, unknown>,
  topCompanies: unknown[],
  analysisResult: Record<string, unknown>,
  companyResearch: CompanyResearchItem[],
  companyStrategyReports: Array<Record<string, unknown>> = []
) {
  const age = Number(userProfile.age || 30)
  const role = String(userProfile.role || '未設定職種')
  const level = String(userProfile.level || '未設定レベル')
  const experienceYears = Number(userProfile.experience || 0)
  const incomeMid = incomeBucketMidpoint(userProfile.income)
  const strengths = safeProfileArray(userProfile.strengths)
  const weaknesses = safeProfileArray(userProfile.weaknesses)
  const purposes = safeProfileArray(userProfile.purpose)
  const desiredIndustry = safeProfileArray(userProfile.desiredIndustry)
  const workStyle = String(userProfile.workStyle || '未設定')
  const idealFuture = String(userProfile.idealFuture || '')
  const topCompany = (topCompanies[0] || {}) as Record<string, any>
  const topCompanySalary = String(topCompany.salaryRange || '')
  const topCompanySalaryMid = incomeBucketMidpoint(topCompanySalary)
  const baseScore = asSafeNumber(analysisResult.score || analysisResult.rawScore, 72, 30, 99)

  const skillFit = buildBreakdownItem(
    60 + strengths.length * 8 + (role.includes('コンサル') || role.includes('PM') ? 6 : 0),
    `${role}経験と得意領域の組み合わせが、希望業界で転用可能かを評価しています。`,
    strengths.map((item) => `${item}が職務の再現性として評価されやすいです。`),
    weaknesses.some((item) => item.includes('分析')) && (role.includes('戦略') || role.includes('企画')) ? ['数値分析への苦手意識は上位企画職で懸念になります。'] : ['強みの見せ方が曖昧だと評価が伸びにくいです。'],
    ['成果を伴う得意領域を3つに絞って説明できるようにする', '得意領域ごとに再現可能な実績を定量化する']
  )
  const experienceDepth = buildBreakdownItem(
    52 + experienceYears * 5 + (level.includes('課長') || level.includes('部長') ? 6 : 0),
    `${experienceYears}年の経験と${level}相当の責任範囲から、即戦力度と役割の深さを見ています。`,
    experienceYears >= 5 ? [`${experienceYears}年の経験があり、短期で立ち上がりやすいです。`] : ['経験年数が浅く、伸びしろが大きいです。'],
    age >= 30 && experienceYears < 5 ? ['年齢に対して責任範囲の拡張が弱く見える可能性があります。'] : ['より上位ロールの実績証拠を増やす余地があります。'],
    ['担当範囲ではなく成果責任の大きさを職務経歴書に明記する', 'リード経験や意思決定経験を具体化する']
  )
  const industryDemand = buildBreakdownItem(
    58 + desiredIndustry.length * 6 + (desiredIndustry.some((item) => /SaaS|AI|DX|IT/.test(item)) ? 10 : 0),
    `希望業界 ${desiredIndustry.join(' / ') || '未設定'} と市場需要の重なりを見ています。`,
    desiredIndustry.map((item) => `${item}領域は現在も採用需要が高い傾向です。`),
    desiredIndustry.length === 0 ? ['希望業界が曖昧だと市場訴求が分散します。'] : ['業界を広げすぎると職務の一貫性が弱く見える場合があります。'],
    ['応募業界を上位2つへ絞る', '各業界ごとの成果接続を用意する']
  )
  const salaryGap = topCompanySalaryMid > 0 ? topCompanySalaryMid - incomeMid : 80
  const salaryRealism = buildBreakdownItem(
    82 - Math.max(0, Math.round(salaryGap / 25)),
    `現年収帯 ${String(userProfile.income || '未設定')} と希望先の想定レンジ差分から、短期の年収実現性を見ています。`,
    salaryGap <= 120 ? ['現年収帯と推薦企業レンジの乖離が比較的小さく、交渉しやすいです。'] : ['高い年収伸長余地があります。'],
    salaryGap > 180 ? ['現年収からのジャンプ幅が大きく、短期では確率を押し下げます。'] : ['年収だけを先行すると役割適合の説明が弱くなります。'],
    ['現年収より先に、担える責任範囲を説明できるようにする', '年収交渉の根拠となる成果指標を用意する']
  )
  const careerConsistency = buildBreakdownItem(
    60 + (idealFuture ? 10 : 0) + (purposes.length > 0 ? 8 : 0) + (desiredIndustry.length > 0 ? 6 : 0),
    `転職目的、希望業界、5年後の理想像が一貫した物語になっているかを評価しています。`,
    idealFuture ? [`5年後の理想像があり、選択理由を語りやすいです。`] : ['将来像の明文化余地があります。'],
    purposes.length > 0 && purposes.some((item) => item.includes('年収')) && purposes.some((item) => item.includes('ワークライフ')) ? ['年収と働き方の優先順位が曖昧だと意思決定がぶれやすいです。'] : ['目的の優先順位を明確にするとさらに強まります。'],
    ['転職目的に優先順位をつける', '5年後理想から逆算した応募理由を整理する']
  )
  const weaknessRisk = buildBreakdownItem(
    85 - weaknesses.length * 7 - (weaknesses.some((item) => item.includes('調整')) && (role.includes('PM') || role.includes('コンサル')) ? 8 : 0),
    `苦手領域が、希望職種で主要要件になるかをリスクとして見ています。`,
    weaknesses.length === 0 ? ['明確な苦手領域が少なく、選択肢を狭めにくいです。'] : ['苦手領域が整理されているため、避けるべきポジションを判断しやすいです。'],
    weaknesses.map((item) => `${item}は一部ポジションで懸念になり得ます。`),
    ['苦手領域を避けるのではなく、補完策を話せるようにする', '応募職種ごとのリスク説明を準備する']
  )
  const growthPotential = buildBreakdownItem(
    62 + (idealFuture ? 8 : 0) + (strengths.some((item) => /AI|データ|企画|推進/.test(item)) ? 10 : 0) + (workStyle.includes('ハイブリッド') || workStyle.includes('リモート') ? 4 : 0),
    `今後1年で成果の再現性を高め、市場価値を伸ばせる余地を評価しています。`,
    ['得意領域の見せ方次第で半年後の通過率改善余地があります。'],
    idealFuture ? [] : ['将来像が曖昧だと成長ストーリーが弱く見えます。'],
    ['成果指標を整理して職務経歴書へ反映する', '希望職種に近い実務・副業・学習実績を追加する']
  )

  const breakdown = { skillFit, experienceDepth, industryDemand, salaryRealism, careerConsistency, weaknessRisk, growthPotential }
  const positiveFactors = uniqueStrings([...skillFit.positiveFactors, ...experienceDepth.positiveFactors, ...industryDemand.positiveFactors]).slice(0, 5)
  const negativeFactors = uniqueStrings([...salaryRealism.negativeFactors, ...careerConsistency.negativeFactors, ...weaknessRisk.negativeFactors]).slice(0, 5)
  const improvementActions = uniqueStrings([...skillFit.improvementActions, ...salaryRealism.improvementActions, ...growthPotential.improvementActions]).slice(0, 5)
  const deviation = asSafeNumber((baseScore - 50) * 0.62 + 50, 55, 35, 78)
  const nationalRank = `約${Math.max(900, Math.round((100 - deviation) * 1700)).toLocaleString()}位 / 120,000人`
  const marketValueAnalysis = {
    score: baseScore,
    deviation,
    nationalRank,
    reason: `${role}としての経験年数 ${experienceYears}年、得意領域 ${strengths.slice(0, 2).join('・') || '未設定'}、希望業界 ${desiredIndustry.join('・') || '未設定'}、希望年収帯との現実性を総合すると、現時点ではこの市場価値水準が妥当です。`,
    positiveFactors,
    negativeFactors,
    improvementActions,
    breakdown,
  }
  const currentMin = Math.max(250, incomeMid - 60)
  const currentMax = incomeMid + 80
  const after3Min = currentMin + Math.max(80, growthPotential.score)
  const after3Max = currentMax + Math.max(120, industryDemand.score)
  const after5Min = after3Min + Math.max(80, experienceDepth.score - 10)
  const after5Max = after3Max + Math.max(120, growthPotential.score)
  const salaryProjection = {
    currentRange: toSalaryRange(currentMin, currentMax),
    after3YearsRange: toSalaryRange(after3Min, after3Max),
    after5YearsRange: toSalaryRange(after5Min, after5Max),
    projectionReason: `${role}の市場需要、${level}相当の役割深度、推薦企業の年収帯 ${topCompanySalary || '未設定'} を踏まえると、このレンジ推移が現実的です。`,
    optimisticScenario: `半年以内に実績の定量化と面接訴求を整え、${desiredIndustry[0] || '希望業界'}での高需要ポジションに寄せられれば上振れ余地があります。`,
    conservativeScenario: `希望年収と役割期待値の差分説明が弱い場合は、まずは同水準から小幅上昇のレンジに収まりやすいです。`,
    requiredActions: ['年収交渉の根拠となる成果を整理する', '推薦企業の年収帯と役割の整合を説明できるようにする', '伸ばしたいスキルの実務証跡を追加する'],
  }
  const currentSuccess = asSafeNumber((baseScore + salaryRealism.score + careerConsistency.score) / 3, 70, 38, 92)
  const after6Months = asSafeNumber(currentSuccess + 7 + Math.round(growthPotential.score / 20), 76, 45, 96)
  const after1Year = asSafeNumber(after6Months + 6 + Math.round(experienceDepth.score / 25), 82, 50, 98)
  const successProbability = {
    current: currentSuccess,
    after6Months,
    after1Year,
    reason: `${role}経験と強みは評価されやすい一方、希望条件の整理と訴求の明確さが現時点の成功確率を左右しています。`,
    assumptions: ['応募企業を上位3〜5社に絞り込むこと', '職務経歴書で成果を数値化して提示すること', '希望年収と役割の妥当性を説明できること'],
    blockers: [...negativeFactors.slice(0, 2), '企業ごとの訴求軸が曖昧だと通過率が伸びにくいです。'].slice(0, 3),
    actionsToImprove: ['半年後までに職務経歴書と面接訴求を役割別に最適化する', '1年後までに追加実績・副業・学習成果など市場価値の上積み要素を作る', '推薦企業ごとの想定課題に対する回答準備を進める'],
  }

  const researchByName = new Map(companyResearch.map((item) => [item.companyName, item]))
  const companyRecommendations = topCompanies.slice(0, 5).map((company, index) => {
    const typedCompany = (company || {}) as Record<string, any>
    const companyName = String(typedCompany.name || `Company ${index + 1}`)
    const strategy = companyStrategyReports.find((item) => String(item.companyName || '') === companyName) || {}
    const researchItem = researchByName.get(companyName)
    const sources = [
      researchItem?.researchSections.business?.[0] ? '公式サイト・事業情報' : '',
      researchItem?.researchSections.hiring?.[0] ? '採用ページ・中途採用情報' : '',
      researchItem?.researchSections.reviews?.[0] ? '公開口コミ傾向・評価情報' : '',
      researchItem?.researchSections.news?.[0] ? 'ニュース・プレスリリース' : '',
    ].filter(Boolean)
    const matchedUserFactors = uniqueStrings([
      strengths[0] ? `得意領域「${strengths[0]}」が接続しやすいです。` : '',
      strengths[1] ? `得意領域「${strengths[1]}」も活かしやすいです。` : '',
      desiredIndustry[0] ? `希望業界「${desiredIndustry[0]}」との一致があります。` : '',
      workStyle ? `希望する働き方「${workStyle}」との整合を見ています。` : '',
      idealFuture ? `5年後の理想像「${idealFuture}」への接続余地があります。` : '',
    ]).slice(0, 4)
    const companyFitReasons = uniqueStrings([...asStringArray((strategy as Record<string, unknown>).fitReasons, 3), ...asStringArray((strategy as Record<string, unknown>).recommendationReason, 2)]).slice(0, 4)
    const concerns = uniqueStrings([...asStringArray((strategy as Record<string, unknown>).riskReasons, 2), ...asStringArray((strategy as Record<string, unknown>).concernPoints, 2)]).slice(0, 4)
    const interviewAppealPoints = uniqueStrings(asStringArray((strategy as Record<string, unknown>).interviewAppealPoints, 3)).slice(0, 3)
    const preparationActions = uniqueStrings(asStringArray((strategy as Record<string, unknown>).preparationActions, 3)).slice(0, 3)
    const matchScore = asSafeNumber(typedCompany.overallFit ?? typedCompany.matchScore ?? (strategy as Record<string, unknown>).fitScore, 75, 40, 99)
    return {
      companyName,
      matchScore,
      whyRecommended: `${companyName}は、${role}経験・得意領域・希望業界・働き方の条件を総合したときに接続点が多い候補です。`,
      matchedUserFactors,
      companyFitReasons: companyFitReasons.length > 0 ? companyFitReasons : [`${companyName}の事業課題に現在の経験を接続しやすいです。`],
      roleFit: `${role}の経験を活かしつつ、${String((strategy as Record<string, unknown>).expectedRole || typedCompany.recommendedRoles?.[0] || '近しい役割')}へ繋げやすいです。`,
      salaryFit: `${String(typedCompany.salaryRange || salaryProjection.currentRange)} と現年収帯の差分は、成果根拠があれば説明可能な範囲です。`,
      cultureFit: `${String(typedCompany.culture || '公開情報未設定')}なカルチャー傾向は、${purposes[0] || '転職目的'}との整合を見込みやすいです。`,
      workStyleFit: `${workStyle}志向に対し、公開情報ベースでは ${asSafeNumber(typedCompany.remoteScore, 55) >= 60 ? '柔軟性が比較的高い' : '出社協働の比重がやや高い'} と見られます。`,
      growthFit: `${String(typedCompany.industry || '対象業界')}の成長領域で、${idealFuture || '中長期の理想像'}へ接続しやすい可能性があります。`,
      concerns: concerns.length > 0 ? concerns : ['公開情報ベースでも、立ち上がりの速さと業界理解が求められます。'],
      interviewAppealPoints: interviewAppealPoints.length > 0 ? interviewAppealPoints : ['成果を数値で示し、再現性ある推進手順を語ることが有効です。'],
      preparationActions: preparationActions.length > 0 ? preparationActions : ['主要事業・職務要件・自分の成果接点を1枚で整理してください。'],
      evidenceSummary: truncateText(researchItem?.researchSummary || `${companyName}の公開情報と採用傾向、口コミ傾向をもとに推薦理由を整理しています。`, 260),
      sources: sources.length > 0 ? sources : ['公開情報ベースの企業情報'],
    }
  })

  return { marketValueAnalysis, salaryProjection, successProbability, companyRecommendations }
}

function normalizeBreakdownItem(value: unknown, fallback: ReturnType<typeof buildBreakdownItem>) {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  return buildBreakdownItem(
    asSafeNumber(source.score, fallback.score, 20, 99),
    String(source.reason || fallback.reason),
    asStringArray(source.positiveFactors, 4).length > 0 ? asStringArray(source.positiveFactors, 4) : fallback.positiveFactors,
    asStringArray(source.negativeFactors, 4).length > 0 ? asStringArray(source.negativeFactors, 4) : fallback.negativeFactors,
    asStringArray(source.improvementActions, 4).length > 0 ? asStringArray(source.improvementActions, 4) : fallback.improvementActions
  )
}

function normalizeMarketValueAnalysis(value: unknown, fallback: ReturnType<typeof buildAnalyticalInsights>['marketValueAnalysis']) {
  const source = value && typeof value === 'object' ? (value as Record<string, any>) : {}
  const breakdownSource = source.breakdown && typeof source.breakdown === 'object' ? source.breakdown : {}
  return {
    score: asSafeNumber(source.score, fallback.score, 30, 99),
    deviation: asSafeNumber(source.deviation, fallback.deviation, 30, 80),
    nationalRank: String(source.nationalRank || fallback.nationalRank),
    reason: String(source.reason || fallback.reason),
    positiveFactors: asStringArray(source.positiveFactors, 5).length > 0 ? asStringArray(source.positiveFactors, 5) : fallback.positiveFactors,
    negativeFactors: asStringArray(source.negativeFactors, 5).length > 0 ? asStringArray(source.negativeFactors, 5) : fallback.negativeFactors,
    improvementActions: asStringArray(source.improvementActions, 5).length > 0 ? asStringArray(source.improvementActions, 5) : fallback.improvementActions,
    breakdown: {
      skillFit: normalizeBreakdownItem(breakdownSource.skillFit, fallback.breakdown.skillFit),
      experienceDepth: normalizeBreakdownItem(breakdownSource.experienceDepth, fallback.breakdown.experienceDepth),
      industryDemand: normalizeBreakdownItem(breakdownSource.industryDemand, fallback.breakdown.industryDemand),
      salaryRealism: normalizeBreakdownItem(breakdownSource.salaryRealism, fallback.breakdown.salaryRealism),
      careerConsistency: normalizeBreakdownItem(breakdownSource.careerConsistency, fallback.breakdown.careerConsistency),
      weaknessRisk: normalizeBreakdownItem(breakdownSource.weaknessRisk, fallback.breakdown.weaknessRisk),
      growthPotential: normalizeBreakdownItem(breakdownSource.growthPotential, fallback.breakdown.growthPotential),
    },
  }
}

function normalizeSalaryProjection(value: unknown, fallback: ReturnType<typeof buildAnalyticalInsights>['salaryProjection']) {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  return {
    currentRange: String(source.currentRange || fallback.currentRange),
    after3YearsRange: String(source.after3YearsRange || fallback.after3YearsRange),
    after5YearsRange: String(source.after5YearsRange || fallback.after5YearsRange),
    projectionReason: String(source.projectionReason || fallback.projectionReason),
    optimisticScenario: String(source.optimisticScenario || fallback.optimisticScenario),
    conservativeScenario: String(source.conservativeScenario || fallback.conservativeScenario),
    requiredActions: asStringArray(source.requiredActions, 5).length > 0 ? asStringArray(source.requiredActions, 5) : fallback.requiredActions,
  }
}

function normalizeSuccessProbability(value: unknown, fallback: ReturnType<typeof buildAnalyticalInsights>['successProbability']) {
  const source = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
  return {
    current: asSafeNumber(source.current, fallback.current, 20, 99),
    after6Months: asSafeNumber(source.after6Months, fallback.after6Months, 25, 99),
    after1Year: asSafeNumber(source.after1Year, fallback.after1Year, 30, 99),
    reason: String(source.reason || fallback.reason),
    assumptions: asStringArray(source.assumptions, 5).length > 0 ? asStringArray(source.assumptions, 5) : fallback.assumptions,
    blockers: asStringArray(source.blockers, 5).length > 0 ? asStringArray(source.blockers, 5) : fallback.blockers,
    actionsToImprove: asStringArray(source.actionsToImprove, 5).length > 0 ? asStringArray(source.actionsToImprove, 5) : fallback.actionsToImprove,
  }
}

function normalizeCompanyRecommendations(value: unknown, fallback: ReturnType<typeof buildAnalyticalInsights>['companyRecommendations']) {
  const byName = new Map(
    asArray(value)
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String((item as Record<string, unknown>).companyName || ''), item as Record<string, unknown>])
  )
  return fallback.map((item) => {
    const source = byName.get(item.companyName) || {}
    return {
      companyName: String(source.companyName || item.companyName),
      matchScore: asSafeNumber(source.matchScore, item.matchScore, 40, 99),
      whyRecommended: String(source.whyRecommended || item.whyRecommended),
      matchedUserFactors: asStringArray(source.matchedUserFactors, 5).length > 0 ? asStringArray(source.matchedUserFactors, 5) : item.matchedUserFactors,
      companyFitReasons: asStringArray(source.companyFitReasons, 5).length > 0 ? asStringArray(source.companyFitReasons, 5) : item.companyFitReasons,
      roleFit: String(source.roleFit || item.roleFit),
      salaryFit: String(source.salaryFit || item.salaryFit),
      cultureFit: String(source.cultureFit || item.cultureFit),
      workStyleFit: String(source.workStyleFit || item.workStyleFit),
      growthFit: String(source.growthFit || item.growthFit),
      concerns: asStringArray(source.concerns, 5).length > 0 ? asStringArray(source.concerns, 5) : item.concerns,
      interviewAppealPoints: asStringArray(source.interviewAppealPoints, 5).length > 0 ? asStringArray(source.interviewAppealPoints, 5) : item.interviewAppealPoints,
      preparationActions: asStringArray(source.preparationActions, 5).length > 0 ? asStringArray(source.preparationActions, 5) : item.preparationActions,
      evidenceSummary: String(source.evidenceSummary || item.evidenceSummary),
      sources: asStringArray(source.sources, 5).length > 0 ? asStringArray(source.sources, 5) : item.sources,
    }
  })
}

function buildMockResponse(
  userProfile: Record<string, unknown>,
  topCompanies: unknown[],
  analysisResult: Record<string, unknown>,
  fallbackReason: string,
  responseType: string,
  researchMeta: CompanyResearchMeta
): CareerInsightsResponse {
  const diagnosticSummary = fallbackReason === 'invalid_response' || fallbackReason === 'parse_error'
    ? '一部の分析結果を補完して返却しています。'
    : ''

  const profileSummary = pickProfileSummary(userProfile)
  const companyStrategyReports = topCompanies.slice(0, 3).map((company, index) => {
    const typedCompany = (company || {}) as Record<string, any>
    const companyName = String(typedCompany.name || `Company ${index + 1}`)
    const fitScore = asSafeNumber(typedCompany.overallFit ?? typedCompany.matchScore, 75, 40, 99)
    return {
      companyName,
      businessProductFeatures: [
        `${companyName}の公開情報をもとに、事業領域と主要サービスを整理しています。`,
        '採用で評価されるのは、事業課題を具体的に解決する視点です。',
      ],
      userConnectionPoints: [
        `${profileSummary.role || '現職'}での改善・推進経験を転用しやすい可能性があります。`,
        '定量成果を伴う課題解決経験が接点になります。',
      ],
      businessModel: `${companyName}の事業モデルは、公開情報をもとに選考前に確認してください。`,
      mainProducts: ['主要サービスを公開情報ベースで整理してください。', '関連プロダクトの差分を把握してください。'],
      industryTrend: '業界構造と競争環境の変化を確認してください。',
      requiredSkills: ['事業理解', '課題整理', '推進力'],
      fitReasons: [
        `${companyName}の事業と現職経験に接点がある可能性があります。`,
        '課題解決と成果再現性を示しやすいです。',
      ],
      riskReasons: [
        '業界固有の理解が必要です。',
        '事業指標に紐づけた説明が求められます。',
      ],
      interviewTopics: [
        '主要サービスの理解と改善余地',
        'これまでの成果をどう再現性ある形で示すか',
      ],
      preparationChecklist: [
        '主要サービスと業界構造を整理する',
        '実績を課題・施策・成果で棚卸しする',
      ],
      fitScore,
      expectedRole: String(profileSummary.role || 'ポジション未設定'),
      recommendationReason: [
        `${companyName}は現在の経験を活かしやすい業務領域がある可能性があります。`,
        '事業・プロダクトの課題に対して、改善提案の再現性を示しやすいです。',
      ],
      concernPoints: [
        '役割期待値が高く、初期の立ち上がり速度が問われる可能性があります。',
        '業界固有の業務理解を前提にした会話が必要です。',
      ],
      interviewAppealPoints: [
        'これまでの成果を数値で示し、再現性のある進め方を説明することが有効です。',
        '課題特定から実行までの推進手順を具体的に語ると強いです。',
      ],
      preparationActions: [
        '想定業務に近い実績を3件に絞って、課題・打ち手・成果で整理してください。',
        '企業の主要サービスと業界構造を1枚にまとめておいてください。',
      ],
      estimatedOfferProbability: fitScore >= 85 ? '中〜高（目安）' : '中（目安）',
    }
  })
  const analyticalInsights = buildAnalyticalInsights(userProfile, topCompanies, analysisResult, [], companyStrategyReports)

  return {
    debugVersion: DEBUG_VERSION,
    debugSource: 'mock',
    fallbackReason,
    aiSummary: diagnosticSummary
      ? `${diagnosticSummary}市場価値・強み・企業適合を総合すると、準備の優先順位を明確にすることで選考通過率の改善が見込めます。`
      : '市場価値・強み・企業適合を総合すると、準備の優先順位を明確にすることで選考通過率の改善が見込めます。',
    companyInsights: topCompanies.map((company, index) => buildCompanyInsight(company as Record<string, unknown>, index)),
    topCompanies: topCompanies.slice(0, 5) as Array<Record<string, unknown>>,
    riskAnalysis: [
      '企業ごとに評価される成果指標が異なるため、訴求ポイントを出し分ける必要があります。',
      '実績の定量化が不足すると、面接で強みの再現性が伝わりにくくなります。',
    ],
    nextActions: [
      '職務経歴書を課題・施策・成果で整理し、成果を数値で提示できる形にする',
      '応募優先企業ごとに訴求軸を2点に絞り、面接回答を統一する',
      '次の2週間で不足スキルの補完計画を立て、実行ログを残す',
    ],
    careerArchetype: {
      type: '実行推進型ストラテジスト',
      summary: '課題を構造化して実行まで落とし込む力が強みで、企画と現場をつなぐ役割で価値を出しやすいタイプです。',
      strengths: ['課題整理', '要件定義', '関係者調整'],
      risks: ['短期成果圧力の強い環境では優先順位の揺れが負荷になりやすいです。'],
    },
    marketValue: {
      score: analyticalInsights.marketValueAnalysis.score,
      percentile: '上位25%前後（推定）',
      currentEstimatedSalaryRange: analyticalInsights.salaryProjection.currentRange,
      threeYearSalaryRange: analyticalInsights.salaryProjection.after3YearsRange,
      fiveYearSalaryRange: analyticalInsights.salaryProjection.after5YearsRange,
      evaluation: analyticalInsights.marketValueAnalysis.reason,
      breakdown: {
        skillRarity: analyticalInsights.marketValueAnalysis.breakdown.skillFit.score,
        industryDemand: analyticalInsights.marketValueAnalysis.breakdown.industryDemand.score,
        transferability: analyticalInsights.marketValueAnalysis.breakdown.careerConsistency.score,
        managementPotential: analyticalInsights.marketValueAnalysis.breakdown.experienceDepth.score,
        growthPotential: analyticalInsights.marketValueAnalysis.breakdown.growthPotential.score,
      },
    },
    marketValueAnalysis: analyticalInsights.marketValueAnalysis,
    salaryProjection: analyticalInsights.salaryProjection,
    successProbability: analyticalInsights.successProbability,
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
    companyRecommendations: analyticalInsights.companyRecommendations,
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

function isLowQualityCompanyReport(report: Record<string, unknown>) {
  const expectedRole = String(report.expectedRole || '').trim()
  const businessProductFeatures = asStringArray(report.businessProductFeatures, 5)
  const userConnectionPoints = asStringArray(report.userConnectionPoints, 5)
  const businessModel = String(report.businessModel || '').trim()
  const mainProducts = asStringArray(report.mainProducts, 5)
  const industryTrend = String(report.industryTrend || '').trim()
  const requiredSkills = asStringArray(report.requiredSkills, 5)
  const fitReasons = asStringArray(report.fitReasons, 5)
  const riskReasons = asStringArray(report.riskReasons, 5)
  const interviewTopics = asStringArray(report.interviewTopics, 5)
  const preparationChecklist = asStringArray(report.preparationChecklist, 5)
  const recommendationReason = asStringArray(report.recommendationReason, 5)
  const concernPoints = asStringArray(report.concernPoints, 5)
  const interviewAppealPoints = asStringArray(report.interviewAppealPoints, 5)
  const preparationActions = asStringArray(report.preparationActions, 5)
  const estimatedOfferProbability = String(report.estimatedOfferProbability || '').trim()

  if (!expectedRole || !estimatedOfferProbability) return true
  if (
    businessProductFeatures.length < 2 ||
    userConnectionPoints.length < 2 ||
    !businessModel ||
    mainProducts.length < 2 ||
    !industryTrend ||
    requiredSkills.length < 2 ||
    fitReasons.length < 2 ||
    riskReasons.length < 2 ||
    interviewTopics.length < 2 ||
    preparationChecklist.length < 2 ||
    recommendationReason.length < 2 ||
    concernPoints.length < 2 ||
    interviewAppealPoints.length < 2 ||
    preparationActions.length < 2
  ) {
    return true
  }

  const genericPatterns = [
    '現在の経験を活かしやすい',
    '希望する働き方との整合性がある',
    '成果期待が高い',
    '面接では成果を数値で示す',
    'star形式で準備する',
  ]
  const combined = [
    expectedRole,
    businessModel,
    industryTrend,
    ...businessProductFeatures,
    ...userConnectionPoints,
    ...mainProducts,
    ...requiredSkills,
    ...fitReasons,
    ...riskReasons,
    ...interviewTopics,
    ...preparationChecklist,
    ...recommendationReason,
    ...concernPoints,
    ...interviewAppealPoints,
    ...preparationActions,
  ].join(' ')
  const normalized = combined.toLowerCase()
  const hasOnlyGeneric = genericPatterns.some((pattern) => combined.includes(pattern))
  const hasCompanySpecificSignal =
    /ai|dx|データ|生成ai|azure|copilot|エンタープライズ|深層学習|医療|製造|クラウド|saas|コンサル|業務改革|kpi|バックオフィス|教育|edtech|学校|生徒|保護者|学習塾|出版|学校ict/.test(normalized)

  return hasOnlyGeneric && !hasCompanySpecificSignal
}

function buildCompanySpecificFallback(
  companyName: string,
  researchSummary: string,
  researchSections: Record<string, string[]>,
  baseCompany: Record<string, unknown>,
  userProfile: Record<string, unknown>
) {
  return buildResearchBasedFallback(companyName, researchSummary, researchSections, baseCompany, userProfile)
}

function enrichCompanyStrategyReport(openAIReport: Record<string, unknown>, fallbackReport: Record<string, unknown>) {
  const businessProductFeatures = asStringArray(openAIReport.businessProductFeatures, 4)
  const userConnectionPoints = asStringArray(openAIReport.userConnectionPoints, 4)
  const businessModel = String(openAIReport.businessModel || '').trim()
  const mainProducts = asStringArray(openAIReport.mainProducts, 4)
  const industryTrend = String(openAIReport.industryTrend || '').trim()
  const requiredSkills = asStringArray(openAIReport.requiredSkills, 4)
  const fitReasons = asStringArray(openAIReport.fitReasons, 4)
  const riskReasons = asStringArray(openAIReport.riskReasons, 4)
  const interviewTopics = asStringArray(openAIReport.interviewTopics, 4)
  const preparationChecklist = asStringArray(openAIReport.preparationChecklist, 4)
  const recommendationReason = asStringArray(openAIReport.recommendationReason, 4)
  const concernPoints = asStringArray(openAIReport.concernPoints, 4)
  const interviewAppealPoints = asStringArray(openAIReport.interviewAppealPoints, 4)
  const preparationActions = asStringArray(openAIReport.preparationActions, 4)
  const expectedRole = String(openAIReport.expectedRole || '').trim()
  const estimatedOfferProbability = String(openAIReport.estimatedOfferProbability || '').trim()

  return {
    ...fallbackReport,
    companyName: String(openAIReport.companyName || fallbackReport.companyName || ''),
    businessProductFeatures: businessProductFeatures.length > 0 ? businessProductFeatures : asStringArray(fallbackReport.businessProductFeatures, 4),
    userConnectionPoints: userConnectionPoints.length > 0 ? userConnectionPoints : asStringArray(fallbackReport.userConnectionPoints, 4),
    businessModel: businessModel || String(fallbackReport.businessModel || ''),
    mainProducts: mainProducts.length > 0 ? mainProducts : asStringArray(fallbackReport.mainProducts, 4),
    industryTrend: industryTrend || String(fallbackReport.industryTrend || ''),
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : asStringArray(fallbackReport.requiredSkills, 4),
    fitReasons: fitReasons.length > 0 ? fitReasons : asStringArray(fallbackReport.fitReasons, 4),
    riskReasons: riskReasons.length > 0 ? riskReasons : asStringArray(fallbackReport.riskReasons, 4),
    interviewTopics: interviewTopics.length > 0 ? interviewTopics : asStringArray(fallbackReport.interviewTopics, 4),
    preparationChecklist:
      preparationChecklist.length > 0 ? preparationChecklist : asStringArray(fallbackReport.preparationChecklist, 4),
    fitScore: asSafeNumber(openAIReport.fitScore, asSafeNumber(fallbackReport.fitScore, 75, 40, 99), 40, 99),
    expectedRole: expectedRole || String(fallbackReport.expectedRole || ''),
    recommendationReason: recommendationReason.length > 0 ? recommendationReason : asStringArray(fallbackReport.recommendationReason, 4),
    concernPoints: concernPoints.length > 0 ? concernPoints : asStringArray(fallbackReport.concernPoints, 4),
    interviewAppealPoints: interviewAppealPoints.length > 0 ? interviewAppealPoints : asStringArray(fallbackReport.interviewAppealPoints, 4),
    preparationActions: preparationActions.length > 0 ? preparationActions : asStringArray(fallbackReport.preparationActions, 4),
    estimatedOfferProbability: estimatedOfferProbability || String(fallbackReport.estimatedOfferProbability || ''),
  }
}

function normalizeCompanyStrategyReports(
  value: unknown,
  topCompanies: unknown[],
  companyResearch: CompanyResearchItem[],
  userProfile: Record<string, unknown>,
  useFallbackDefaults = true
) {
  const byName = new Map(
    asArray(value)
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String((item as Record<string, unknown>).companyName || ''), item as Record<string, unknown>])
  )

  const researchByName = new Map(companyResearch.map((item) => [item.companyName, item]))

  return topCompanies.slice(0, 3).map((company, index) => {
    const base = (company || {}) as Record<string, any>
    const name = String(base.name || `Company ${index + 1}`)
    const source = byName.get(name) || {}
    const researchItem = researchByName.get(name) || {
      companyName: name,
      researchSummary: '',
      researchSections: {
        business: [],
        products: [],
        hiring: [],
        news: [],
        ir: [],
        competitors: [],
        reviews: [],
      },
    }
    const fallbackReport = buildCompanySpecificFallback(name, researchItem.researchSummary, researchItem.researchSections, base, userProfile)
    const enrichedReport = enrichCompanyStrategyReport(source, fallbackReport)
    if (useFallbackDefaults && isLowQualityCompanyReport(enrichedReport)) {
      return fallbackReport
    }
    return enrichedReport
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
  const promptCompanies = topCompanies.slice(0, 5)
  const reportCompanies = topCompanies.slice(0, 3)
  let promptPayload: any = buildPromptPayload(userProfile, promptCompanies, analysisResult, companyResearch)

  const systemPrompt = [
    'あなたは転職意思決定を支援するシニアキャリアコンサルタントです。',
    'JSONのみ返してください。Markdownや説明文は不要です。',
    '以下のキーを必ず返してください: aiSummary, riskAnalysis, nextActions, companyInsights, companyRecommendations, careerArchetype, marketValue, marketValueAnalysis, salaryProjection, successProbability, careerScenarios, companyStrategyReports, careerRoadmap。',
    'companyStrategyReports は topCompanies 上位3社のみを対象に返してください。',
    '必須キーは空にせず、最低1件の内容を入れてください。',
    '回答は日本語。簡潔かつ具体的に。',
    '最優先は companyStrategyReports の企業別具体化です。',
    'companyResearch には事業内容、主要サービス、採用ページ、ニュース、IR、競合、口コミの要約が入っています。必ず参照し、企業ごとに内容を変えてください。',
    '企業名だけでなく、事業モデル、主要プロダクト、競争環境、採用で評価されるスキルを踏まえて、未知の企業でも同品質で分析してください。',
    'companyStrategyReports は companyResearch を根拠に毎回生成し、固定辞書や会社別テンプレートに依存しないでください。',
    '各 companyStrategyReports には businessProductFeatures, userConnectionPoints, businessModel, mainProducts, industryTrend, requiredSkills, fitReasons, riskReasons, interviewTopics, preparationChecklist を含めてください。',
    'companyStrategyReports は必須です。各企業について expectedRole, fitReasons, riskReasons, interviewTopics, preparationChecklist を必ず返してください。',
    'companyStrategyReports の各配列は最低2件返してください。空配列は禁止です。',
    'expectedRole は空文字禁止です。各企業ごとに具体的な役割名を返してください。',
    'fitReasons, riskReasons, interviewTopics, preparationChecklist は各2件以上、抽象表現禁止、企業固有表現で記述してください。',
    'businessModel は事業の収益構造や顧客価値の説明を1文でまとめてください。',
    'mainProducts は主要サービスやプロダクトを具体名で2件以上返してください。',
    'industryTrend は業界構造や直近の変化を踏まえた1文で返してください。',
    'requiredSkills は採用で評価される能力を2件以上返してください。',
    'interviewTopics は面接で深掘りすべき論点を2件以上返してください。',
    'preparationChecklist は選考前に準備する項目を2件以上返してください。',
    'marketValueAnalysis は、年齢・現在職種・職種レベル・経験年数・年収レンジ・得意領域・苦手領域・転職目的・希望働き方・希望業界・5年後理想を使って根拠を返してください。',
    'marketValueAnalysis.breakdown は skillFit, experienceDepth, industryDemand, salaryRealism, careerConsistency, weaknessRisk, growthPotential を必ず含めてください。',
    'salaryProjection は currentRange, after3YearsRange, after5YearsRange と、それぞれの根拠を返してください。',
    'successProbability は current, after6Months, after1Year を返し、半年後と1年後に上がる理由を具体的に書いてください。',
    'companyRecommendations は各企業について、診断入力と企業情報の接続で whyRecommended, matchedUserFactors, companyFitReasons, roleFit, salaryFit, cultureFit, workStyleFit, growthFit, concerns, interviewAppealPoints, preparationActions, evidenceSummary, sources を返してください。',
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
    promptPayload = buildPromptPayload(userProfile, promptCompanies, analysisResult, companyResearch, true)
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
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'career_insights_response',
              strict: true,
              schema: OPENAI_RESPONSE_JSON_SCHEMA,
            },
          },
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
  const aiSummary = typeof parsedObject.aiSummary === 'string' ? parsedObject.aiSummary.trim() : ''
  const riskAnalysis = asStringArray(parsedObject.riskAnalysis, 5)
  const nextActions = asStringArray(parsedObject.nextActions, 5)
  const companyInsights = asArray(parsedObject.companyInsights).map((company: Record<string, unknown>, index: number) => buildOpenAICompanyInsight(company, index))
  const careerArchetypeRaw = normalizeCareerArchetype(parsedObject.careerArchetype)
  const marketValueRaw = normalizeMarketValue(parsedObject.marketValue, analysisResult)
  const careerScenarios = normalizeCareerScenarios(parsedObject.careerScenarios)
  const hasOpenAICompanyStrategyReports = Array.isArray(parsedObject.companyStrategyReports) && asArray(parsedObject.companyStrategyReports).length > 0
  const companyStrategyReportsRaw = normalizeCompanyStrategyReports(parsedObject.companyStrategyReports, reportCompanies, companyResearch, userProfile, true)
  const analyticalInsights = buildAnalyticalInsights(userProfile, topCompanies, analysisResult, companyResearch, companyStrategyReportsRaw)
  const marketValueAnalysis = normalizeMarketValueAnalysis(parsedObject.marketValueAnalysis, analyticalInsights.marketValueAnalysis)
  const salaryProjection = normalizeSalaryProjection(parsedObject.salaryProjection, analyticalInsights.salaryProjection)
  const successProbability = normalizeSuccessProbability(parsedObject.successProbability, analyticalInsights.successProbability)
  const companyRecommendations = normalizeCompanyRecommendations(parsedObject.companyRecommendations, analyticalInsights.companyRecommendations)
  const careerRoadmap = normalizeCareerRoadmap(parsedObject.careerRoadmap)

  if (
    !aiSummary ||
    riskAnalysis.length === 0 ||
    nextActions.length === 0 ||
    companyInsights.length === 0 ||
    companyRecommendations.length === 0 ||
    careerScenarios.length === 0 ||
    !hasOpenAICompanyStrategyReports ||
    companyStrategyReportsRaw.length === 0 ||
    !hasRoadmapContent(careerRoadmap)
  ) {
    throw createOpenAIError('invalid_response', 'Structured OpenAI response did not satisfy required fields', 'json_schema_validation')
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

  return {
    debugVersion: DEBUG_VERSION,
    debugSource: 'openai',
    fallbackReason: null,
    aiSummary,
    riskAnalysis,
    nextActions,
    companyInsights,
    topCompanies: topCompanies.slice(0, 5) as Array<Record<string, unknown>>,
    companyRecommendations,
    careerArchetype: careerArchetypeRaw,
    marketValue: marketValueRaw,
    marketValueAnalysis,
    salaryProjection,
    successProbability,
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
      recommendedCompanies: reportCompanies.length,
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
    const tavilyApiKey = process.env.TAVILY_API_KEY || ''
    const cacheTableName = process.env.COMPANY_RESEARCH_CACHE_TABLE || ''
    console.log('hasTavilyKey', Boolean(tavilyApiKey))

    let companyResearch: CompanyResearchItem[] = []

    try {
      const dynamic = await runDynamicCompanyEngine({
        seedCompanies: asArray(topCompanies).map((item) => (item || {}) as Record<string, unknown>),
        userProfile,
        tavilyApiKey,
        cacheTableName,
      })

      if (dynamic.topCompanies.length > 0) {
        topCompanies = dynamic.topCompanies
      }

      companyResearch = toCompanyResearchFromProfiles(dynamic.companyProfiles as DynamicProfileLike[])
      researchMeta = {
        researchSource: dynamic.researchSource === 'tavily' ? 'tavily' : 'none',
        researchedCompanyCount: dynamic.companyProfiles.length,
        researchFallback: dynamic.companyProfiles.length === 0,
      }

      console.log('companyDiscoveryDynamic', {
        topCompanies: topCompanies.length,
        researchedProfiles: dynamic.companyProfiles.length,
        cacheHitCount: dynamic.cacheHitCount,
        cacheMissCount: dynamic.cacheMissCount,
      })
    } catch (error) {
      const topCompaniesForResearch = topCompanies.slice(0, 3)
      if (tavilyApiKey) {
        try {
          const researchResult = await fetchTopCompanyResearch(tavilyApiKey, topCompaniesForResearch)
          companyResearch = researchResult.companyResearch
          researchMeta = researchResult.meta
        } catch {
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
