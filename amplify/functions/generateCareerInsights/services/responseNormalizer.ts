export type ResearchSource = {
  title: string
  url: string
  snippet: string
  sourceType: 'official' | 'hiring' | 'job' | 'review' | 'news' | 'other'
}

export type CompanyProfile = {
  name: string
  normalizedName: string
  industry: string
  businessSummary: string
  targetRoles: string[]
  requiredSkills: string[]
  salaryRange: string
  workStyle: string
  culture: string
  growthAreas: string[]
  hiringSignals: string[]
  positiveSignals: string[]
  concernSignals: string[]
  sourceSummaries: string[]
  sources: ResearchSource[]
  lastResearchedAt: string
  qualityScore: number
  officialSourceCount: number
}

const NAME_ALIASES: Array<[RegExp, string]> = [
  [/ly\s*corporation|line\s*yahoo|lineヤフー|line yahoo/i, 'LINEヤフー'],
  [/money\s*forward|マネーフォワード/i, 'マネーフォワード'],
  [/recruit|リクルート/i, 'リクルート'],
  [/freee/i, 'freee'],
  [/sansan/i, 'Sansan'],
  [/smarthr/i, 'SmartHR'],
]

export function normalizeCompanyName(name: string): string {
  const trimmed = String(name || '').trim()
  if (!trimmed) return 'Unknown Company'

  for (const [pattern, canonical] of NAME_ALIASES) {
    if (pattern.test(trimmed)) return canonical
  }

  return trimmed
    .replace(/株式会社|有限会社|合同会社/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function toNormalizedKey(name: string): string {
  return normalizeCompanyName(name)
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9fff]/g, '')
}

export function uniqueStrings(values: string[], max = 8): string[] {
  return Array.from(new Set(values.map((v) => String(v || '').trim()).filter(Boolean))).slice(0, max)
}

export function inferIndustry(text: string): string {
  const source = String(text || '').toLowerCase()
  if (/saas|クラウド|b2b/.test(source)) return 'SaaS'
  if (/コンサル|consulting|dx/.test(source)) return 'ITコンサル'
  if (/fintech|金融|決済/.test(source)) return '金融'
  if (/製造|manufacturing|工場/.test(source)) return '製造'
  if (/人材|hr|採用/.test(source)) return '人材'
  if (/広告|adtech|media/.test(source)) return '広告'
  if (/ai|生成ai|機械学習/.test(source)) return 'AI'
  return 'その他'
}

export function inferWorkStyle(text: string): string {
  const source = String(text || '')
  if (/フルリモート|完全リモート|remote/i.test(source)) return 'リモート中心'
  if (/ハイブリッド|週\d+日出社|在宅併用/.test(source)) return 'ハイブリッド'
  if (/出社|オフィス勤務/.test(source)) return '出社中心'
  return '公開情報未確認'
}

export function classifySourceType(url: string, title: string): ResearchSource['sourceType'] {
  const u = String(url || '').toLowerCase()
  const t = String(title || '').toLowerCase()
  if (/\/careers|\/recruit|\/jobs|wantedly|green-japan/.test(u + ' ' + t)) return 'hiring'
  if (/openwork|vorkers|en-hyouban|転職会議/.test(u + ' ' + t)) return 'review'
  if (/news|prtimes|press|note/.test(u + ' ' + t)) return 'news'
  if (/\/company|about|corp|co\.jp|\.com/.test(u + ' ' + t)) return 'official'
  return 'other'
}

export function buildCompanyProfile(params: {
  name: string
  businessSummary: string
  sources: ResearchSource[]
  targetRoles?: string[]
  requiredSkills?: string[]
  salaryRange?: string
  culture?: string
  growthAreas?: string[]
  hiringSignals?: string[]
  positiveSignals?: string[]
  concernSignals?: string[]
}): CompanyProfile {
  const normalizedName = normalizeCompanyName(params.name)
  const sourceText = [params.businessSummary, ...params.sources.map((s) => `${s.title} ${s.snippet}`)].join(' ')
  const officialSourceCount = params.sources.filter((s) => s.sourceType === 'official' || s.sourceType === 'hiring').length

  const sourceSummaries = uniqueStrings(
    params.sources.map((s) => `${s.title}: ${String(s.snippet || '').slice(0, 120)}`),
    6
  )

  const qualityScore = Math.max(
    0,
    Math.min(
      100,
      25 +
        Math.min(30, params.sources.length * 6) +
        Math.min(25, officialSourceCount * 10) +
        (params.businessSummary ? 10 : 0) +
        (params.salaryRange ? 5 : 0) +
        (params.targetRoles && params.targetRoles.length > 0 ? 5 : 0)
    )
  )

  return {
    name: normalizedName,
    normalizedName: toNormalizedKey(normalizedName),
    industry: inferIndustry(sourceText),
    businessSummary: params.businessSummary || '公開情報ベースの要約を作成中です。',
    targetRoles: uniqueStrings(params.targetRoles || ['事業企画', 'プロダクト', 'プロジェクト推進'], 5),
    requiredSkills: uniqueStrings(params.requiredSkills || ['課題整理', '実行推進', '関係者調整'], 6),
    salaryRange: params.salaryRange || '800万〜1000万円（公開情報ベース）',
    workStyle: inferWorkStyle(sourceText),
    culture: params.culture || '公開情報ベースでは実行志向',
    growthAreas: uniqueStrings(params.growthAreas || ['DX', 'AI活用'], 5),
    hiringSignals: uniqueStrings(params.hiringSignals || ['中途採用の継続募集が確認される可能性があります。'], 5),
    positiveSignals: uniqueStrings(params.positiveSignals || ['事業成長と採用継続の兆候があります。'], 5),
    concernSignals: uniqueStrings(params.concernSignals || ['配属先や業務範囲は選考時に確認が必要です。'], 5),
    sourceSummaries,
    sources: params.sources.slice(0, 8),
    lastResearchedAt: new Date().toISOString(),
    qualityScore,
    officialSourceCount,
  }
}
