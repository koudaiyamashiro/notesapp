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
  userProfileSummary?: Record<string, unknown>
  analysisSnapshot?: Record<string, unknown>
}

type OpenAIErrorCode = 'invalid_response' | 'parse_error' | 'openai_error' | 'openai_bad_request' | 'openai_context_length'

type OpenAIError = Error & {
  code: OpenAIErrorCode
  responseType?: string
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : []
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
  responseType: string
): CareerInsightsResponse {
  const diagnosticSummary =
    fallbackReason === 'invalid_response' || fallbackReason === 'parse_error'
      ? `normalize失敗 (responseType: ${responseType})`
      : ''

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
    userProfileSummary: pickProfileSummary(userProfile),
    analysisSnapshot: {
      score: analysisResult.score || analysisResult.rawScore || '未設定',
      recommendedCompanies: topCompanies.length,
    },
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
  analysisResult: Record<string, unknown>
): Promise<CareerInsightsResponse | null> {
  let promptPayload: any = buildPromptPayload(userProfile, topCompanies, analysisResult)

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
    '  ]',
    '}',
    '回答は必ず日本語で作成してください。',
    '単なる要約は禁止です。意思決定に使える具体性で記述してください。',
    'aiSummaryには必ず次の要素を含めてください: 市場価値評価、現在の強み、弱み・注意点、キャリアリスク、3年後のキャリア仮説、5年後のキャリア仮説、企業比較。',
    'aiSummaryは最低1000文字相当の分量で、根拠と示唆を具体的に書いてください。',
    'companyInsightsの各企業について、reasonsは推薦理由を具体的に、risksは懸念点を具体的に記述してください。',
    'nextActionsには今後90日で実行するアクションを時系列で記述してください。',
    'companyInsightsは入力のtopCompaniesに対応させてください。',
    'riskAnalysisとnextActionsはそれぞれ1件以上返してください。',
  ].join('\n')

  let userPrompt = `入力データ: ${JSON.stringify(promptPayload)}`
  const fixedPromptLength = systemPrompt.length + userPrompt.length
  if (fixedPromptLength > MAX_PROMPT_CHARS) {
    promptPayload = buildPromptPayload(userProfile, topCompanies, analysisResult, true)
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

    const apiKey = process.env.OPENAI_API_KEY || ''
    console.log('generateCareerInsights key status', { hasOpenAIKey: Boolean(apiKey) })
    let response: CareerInsightsResponse | null = null
    let fallbackReason: OpenAIErrorCode = 'openai_error'
    let fallbackResponseType = 'unknown'

    if (apiKey) {
      console.log('generateCareerInsights OpenAI call start')
      try {
        response = await generateWithOpenAI(apiKey, userProfile, topCompanies, analysisResult)
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
      response = buildMockResponse(userProfile, topCompanies, analysisResult, fallbackReason, fallbackResponseType)
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
