declare const process: { env: Record<string, string | undefined> }

type CareerInsightsRequest = {
  userProfile?: Record<string, unknown>
  topCompanies?: Array<Record<string, unknown>>
  analysisResult?: Record<string, unknown>
}

type CareerInsightsResponse = {
  debugSource: 'openai' | 'mock'
  aiSummary: string
  companyInsights: Array<Record<string, unknown>>
  riskAnalysis: string[]
  nextActions: string[]
  userProfileSummary?: Record<string, unknown>
  analysisSnapshot?: Record<string, unknown>
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : []
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

function buildMockResponse(
  userProfile: Record<string, unknown>,
  topCompanies: unknown[],
  analysisResult: Record<string, unknown>
): CareerInsightsResponse {
  return {
    debugSource: 'mock',
    aiSummary: 'generateCareerInsights のモックレスポンスです。将来的に OpenAI / Perplexity API へ差し替え可能な形式で返しています。',
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

async function generateWithOpenAI(
  apiKey: string,
  userProfile: Record<string, unknown>,
  topCompanies: unknown[],
  analysisResult: Record<string, unknown>
): Promise<CareerInsightsResponse | null> {
  const promptPayload = {
    userProfile,
    topCompanies,
    analysisResult,
  }

  const systemPrompt = [
    'あなたはキャリア分析アシスタントです。',
    '必ずJSONのみを返してください。Markdownや説明文は不要です。',
    'JSONフォーマットは次のキーを必須にしてください:',
    'aiSummary: string',
    'riskAnalysis: string[]',
    'nextActions: string[]',
    'companyInsights: Array<{ companyName: string; rank: number; recommendationTitle: string; summary: string; reasonCards: Array<{ title: string; detail: string }>; cautionPoints: string[]; conditionTags: string[]; scoreBreakdown: Array<{ label: string; value: number }>; comparisonTarget: string; comparisonReasons: string[]; careerPath: { oneYear: string; threeYear: string; fiveYear: string } }>',
    'companyInsightsは入力のtopCompaniesに対応させてください。',
    'riskAnalysisとnextActionsはそれぞれ2件以上返してください。',
  ].join('\n')

  const userPrompt = `入力データ: ${JSON.stringify(promptPayload)}`

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
    return null
  }

  const raw = await openAIResponse.json()
  const text = extractJsonTextFromOpenAIResponse(raw)
  if (!text) return null

  const parsed = JSON.parse(text)
  if (!parsed || typeof parsed !== 'object') return null

  const aiSummary = typeof parsed.aiSummary === 'string' ? parsed.aiSummary : ''
  const riskAnalysis = Array.isArray(parsed.riskAnalysis) ? parsed.riskAnalysis.filter((v: unknown) => typeof v === 'string') : []
  const nextActions = Array.isArray(parsed.nextActions) ? parsed.nextActions.filter((v: unknown) => typeof v === 'string') : []
  const companyInsights = Array.isArray(parsed.companyInsights) ? parsed.companyInsights : []

  if (!aiSummary || companyInsights.length === 0) {
    return null
  }

  return {
    debugSource: 'openai',
    aiSummary,
    riskAnalysis: riskAnalysis.length > 0 ? riskAnalysis : ['リスク分析の生成に失敗しました。'],
    nextActions: nextActions.length > 0 ? nextActions : ['次アクションの生成に失敗しました。'],
    companyInsights,
    userProfileSummary: pickProfileSummary(userProfile),
    analysisSnapshot: {
      score: analysisResult.score || analysisResult.rawScore || '未設定',
      recommendedCompanies: topCompanies.length,
    },
  }
}

export async function handler(event: { body?: string; requestContext?: { http?: { method?: string } } } | CareerInsightsRequest = {}) {
  const method = 'requestContext' in event ? event.requestContext?.http?.method : undefined

  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        ...CORS_HEADERS,
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

    if (apiKey) {
      console.log('generateCareerInsights OpenAI call start')
      try {
        response = await generateWithOpenAI(apiKey, userProfile, topCompanies, analysisResult)
        if (response) {
          console.log('generateCareerInsights OpenAI call success')
        } else {
          console.warn('generateCareerInsights OpenAI call failed', {
            status: 'invalid_response',
            message: 'OpenAI response could not be normalized',
          })
        }
      } catch (error) {
        console.warn('generateCareerInsights OpenAI call failed', {
          status: 'exception',
          message: error instanceof Error ? error.message : 'unknown_error',
        })
      }
    }

    if (!response) {
      console.log('generateCareerInsights fallback', { fallbackToMock: true })
      response = buildMockResponse(userProfile, topCompanies, analysisResult)
    }

    return {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        ...CORS_HEADERS,
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        message: 'Invalid request payload',
        error: error instanceof Error ? error.message : 'unknown_error',
      }),
    }
  }
}
