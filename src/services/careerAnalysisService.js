import companies from '../data/companies.js'

const companyCandidates = companies.map((company) => ({
  ...company,
  key: company.id,
  score: company.growthScore,
  income: Number(company.salaryRange.split('-')[0]) + 80,
  discretion: company.ownershipScore >= 80 ? '高' : company.ownershipScore >= 65 ? '中' : '低',
  stability: company.stabilityScore >= 85 ? '高' : company.stabilityScore >= 70 ? '中' : '低',
}))

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

  return prioritized.map((company) => {
    const conditions = buildMatchedConditions(form, company)
    const scoreBreakdown = buildScoreBreakdown(form, company)
    const overall = Math.round(scoreBreakdown.reduce((sum, item) => sum + item.value, 0) / scoreBreakdown.length)
    return {
      ...company,
      reason: company.description,
      recommendation: buildRecommendationReason(form, company),
      caution: buildCaution(company),
      matchedConditions: conditions.length > 0 ? conditions : ['年収アップ', 'キャリア成長'],
      scoreBreakdown,
      overallFit: overall,
      careerPath: buildCareerPath(company),
      salaryRange: buildSalaryRange(company),
    }
  })
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

function buildMatchedConditions(form, company) {
  const conditions = []
  const purpose = Array.isArray(form.purpose) ? form.purpose : [form.purpose]
  if (purpose.some((item) => includesIn(item, '年収') || includesIn(item, '報酬') || includesIn(item, '収入'))) conditions.push('年収アップ')
  if (purpose.some((item) => includesIn(item, '裁量'))) conditions.push('裁量拡大')
  if (Array.isArray(form.desiredIndustry) && form.desiredIndustry.some((item) => normalizeText(item).includes('ai'))) conditions.push('AI業界志向')
  if (Array.isArray(form.desiredIndustry) && form.desiredIndustry.some((item) => normalizeText(item).includes('saas'))) conditions.push('SaaS業界志向')
  if (String(form.workStyle || '').includes('リモート')) conditions.push('リモート志向')
  if (String(form.workStyle || '').includes('ハイブリッド')) conditions.push('ハイブリッド志向')
  return Array.from(new Set(conditions)).slice(0, 4)
}

function buildRecommendationReason(form, company) {
  const strengths = Array.isArray(form.strengths) ? form.strengths : []
  const highlighted = strengths.filter((item) => ['課題解決', 'データ分析', '要件定義', 'プロジェクト推進', '顧客折衝', 'AI開発'].some((term) => normalizeText(item).includes(normalizeText(term))))
  const tags = highlighted.length ? highlighted.slice(0, 2) : strengths.slice(0, 2)
  if (tags.length === 0) {
    return `${company.description}の環境で、あなたの経験を活かしたキャリア成長が期待できます。`
  }
  return `あなたの強みである「${tags.join('」「')}」が活かせる環境。`
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

function buildScoreBreakdown(form, company) {
  const score = company.score
  const base = Math.min(100, Math.max(70, score))
  const skill = Math.min(100, base + (company.key === 'dirbato' && Array.isArray(form.strengths) && form.strengths.some((item) => normalizeText(item).includes('データ')) ? 4 : 0))
  const industry = Math.min(100, base + (Array.isArray(form.desiredIndustry) && form.desiredIndustry.some((item) => normalizeText(item).includes(normalizeText(company.key))) ? 5 : 0))
  const work = Math.min(100, base - (String(form.workStyle || '').includes('出社') && company.discretion === '高' ? 8 : 0))
  const orientation = Math.min(100, base + (includesIn(form.purpose, '裁量') && company.discretion === '高' ? 5 : 0))
  return [
    { label: 'スキル適合', value: skill },
    { label: '業界適合', value: industry },
    { label: '働き方適合', value: work },
    { label: 'キャリア志向適合', value: orientation },
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
