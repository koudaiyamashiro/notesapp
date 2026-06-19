const companyCandidates = [
  {
    key: 'accenture',
    name: 'アクセンチュア',
    description: '大規模DX・ITコンサルティングをリードするグローバル企業。',
    score: 92,
    income: 920,
    culture: 'プロフェッショナル',
    growth: '高',
    discretion: '中',
    stability: '高',
  },
  {
    key: 'baycurrent',
    name: 'ベイカレント',
    description: '顧客実装力に強みを持つコンサル型SIer。',
    score: 86,
    income: 880,
    culture: '柔軟',
    growth: '高',
    discretion: '中',
    stability: '高',
  },
  {
    key: 'dirbato',
    name: 'Dirbato',
    description: 'AI戦略とデータ活用推進を加速する成長企業。',
    score: 88,
    income: 840,
    culture: 'イノベーティブ',
    growth: '最高',
    discretion: '高',
    stability: '中',
  },
  {
    key: 'layerx',
    name: 'LayerX',
    description: 'ブロックチェーンやAIに挑戦するプロダクト志向の企業。',
    score: 90,
    income: 860,
    culture: '挑戦的',
    growth: '高',
    discretion: '高',
    stability: '中',
  },
  {
    key: 'smarthr',
    name: 'SmartHR',
    description: 'SaaSプロダクトを軸にHR領域で拡大を続ける企業。',
    score: 91,
    income: 870,
    culture: '柔軟',
    growth: '高',
    discretion: '高',
    stability: '高',
  },
  {
    key: 'cyberagent',
    name: 'サイバーエージェント',
    description: '広告×ITで成長環境が豊富なデジタル企業。',
    score: 89,
    income: 860,
    culture: 'スピード感',
    growth: '高',
    discretion: '中',
    stability: '中',
  },
  {
    key: 'recruit',
    name: 'リクルート',
    description: '人材から事業開発まで幅広いキャリアを設計できる企業。',
    score: 93,
    income: 940,
    culture: 'プロフェッショナル',
    growth: '優良',
    discretion: '高',
    stability: '高',
  },
  {
    key: 'sansan',
    name: 'Sansan',
    description: 'B2B SaaSで顧客価値を追求する成長フェーズ企業。',
    score: 90,
    income: 880,
    culture: 'プロフェッショナル',
    growth: '高',
    discretion: '中',
    stability: '中',
  },
  {
    key: 'freee',
    name: 'freee',
    description: 'クラウド会計・HR SaaSで柔軟なキャリアを築ける。',
    score: 92,
    income: 900,
    culture: 'イノベーティブ',
    growth: '高',
    discretion: '高',
    stability: '高',
  },
  {
    key: 'mercari',
    name: 'メルカリ',
    description: 'CtoCプラットフォームでプロダクト成長を牽引。',
    score: 89,
    income: 880,
    culture: 'スピード感',
    growth: '高',
    discretion: '中',
    stability: '高',
  },
]

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

function buildRadarData(form) {
  const role = normalizeText(form.role)
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const hasData = strengths.some((s) => normalizeText(s).includes('データ') || normalizeText(s).includes('ai'))
  const hasCommunicate = strengths.some((option) => ['プレゼン', '顧客折衝', 'ファシリテーション'].some((k) => normalizeText(option).includes(normalizeText(k))))
  const hasManage = ['主任', '係長', '課長', '部長', '執行役員', '経営層'].includes(form.level)
  return [
    { subject: '専門性', A: Math.min(100, 60 + (role.includes('エンジニア') ? 18 : role.includes('マーケティング') ? 12 : 8) + (hasData ? 6 : 0)), fullMark: 100 },
    { subject: '推進力', A: Math.min(100, 58 + (strengths.includes('新規開拓') ? 12 : includesIn(form.purpose, '裁量') ? 8 : 4)), fullMark: 100 },
    { subject: '分析力', A: Math.min(100, 54 + (hasData ? 18 : strengths.includes('資料作成') ? 8 : 4)), fullMark: 100 },
    { subject: 'コミュニケーション', A: Math.min(100, 56 + (hasCommunicate ? 16 : 6)), fullMark: 100 },
    { subject: 'マネジメント', A: Math.min(100, 50 + (hasManage ? 20 : 6) + (form.level === 'マネージャー' ? 6 : 0)), fullMark: 100 },
    { subject: '成長意欲', A: Math.min(100, 62 + Math.min(Number(form.experience) * 2, 18) + (includesIn(form.purpose, '成長') ? 8 : 0)), fullMark: 100 },
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

function buildCompanyCandidates(form) {
  const desired = Array.isArray(form.desiredIndustry) ? form.desiredIndustry : []
  const hasAI = desired.some((item) => normalizeText(item).includes('ai'))
  const hasSaaS = desired.some((item) => normalizeText(item).includes('saas'))

  const prioritized = companyCandidates.filter((company) => {
    if (hasAI && ['layerx', 'dirbato'].includes(company.key)) return true
    if (hasSaaS && ['smarthr', 'sansan', 'freee'].includes(company.key)) return true
    return ['accenture', 'baycurrent', 'cyberagent', 'recruit', 'mercari'].includes(company.key)
  })

  return prioritized.map((company) => ({
    ...company,
    reason: company.description,
    score: company.score,
  }))
}

function buildComparison(candidates) {
  const compareValues = ['成長環境', '裁量', '安定性', 'カルチャー適合', '総合適性']
  return candidates.map((company) => ({
    name: company.name,
    scores: compareValues.map((metric, index) => ({
      label: metric,
      value: Math.min(100, company.score + (4 - index) * 2 - (metric === '安定性' ? 5 : 0)),
    })),
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

export function analyzeCareerProfile(input = {}) {
  const form = { ...input }
  const { finalScore } = buildAnalytics(form)
  const roles = buildRoleRecommendations(form, Array.isArray(form.strengths) ? form.strengths : [])
  const candidates = buildCompanyCandidates(form)
  const comparison = buildComparison(candidates)

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
    recommendedCompanies: candidates,
    companyCandidates: candidates,
    comparison,
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
