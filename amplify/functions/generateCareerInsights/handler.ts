type CareerInsightsRequest = {
  userProfile?: Record<string, unknown>
  topCompanies?: Array<Record<string, unknown>>
  analysisResult?: Record<string, unknown>
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

export async function handler(event: { body?: string } | CareerInsightsRequest = {}) {
  const requestBody = 'body' in event && typeof event.body === 'string' ? JSON.parse(event.body || '{}') : event
  const typedRequestBody = requestBody as CareerInsightsRequest
  const userProfile = (typedRequestBody.userProfile || {}) as Record<string, unknown>
  const topCompanies = asArray(typedRequestBody.topCompanies)
  const analysisResult = (typedRequestBody.analysisResult || {}) as Record<string, unknown>

  const response = {
    aiSummary: 'generateCareerInsights のモックレスポンスです。将来的に OpenAI / Perplexity API へ差し替え可能な形式で返しています。',
    companyInsights: topCompanies.map((company, index) => buildCompanyInsight(company, index)),
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

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(response),
  }
}
