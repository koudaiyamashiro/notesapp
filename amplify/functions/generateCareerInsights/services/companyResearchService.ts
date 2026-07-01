import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import {
  buildCompanyProfile,
  classifySourceType,
  CompanyProfile,
  normalizeCompanyName,
  ResearchSource,
  toNormalizedKey,
  uniqueStrings,
} from './responseNormalizer'

type Candidate = {
  name: string
  normalizedKey: string
  discoverySource: 'seed' | 'tavily'
  query: string
}

type ResearchParams = {
  candidates: Candidate[]
  userProfile: Record<string, unknown>
  tavilyApiKey?: string
  cacheTableName?: string
  cacheTtlHours?: number
}

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

function hashString(value: string): string {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return String(Math.abs(hash))
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0) : []
}

function buildResearchQueryContext(profile: Record<string, unknown>): string {
  const role = String(profile.role || '')
  const industries = asStringArray(profile.desiredIndustry).join(',')
  const strengths = asStringArray(profile.strengths).join(',')
  const workStyle = String(profile.workStyle || '')
  const income = String(profile.income || '')
  return `${role}|${industries}|${strengths}|${workStyle}|${income}`
}

function parseSalaryHint(text: string): string {
  const m = String(text || '').match(/(\d{3,4})\D{1,5}(\d{3,4})\s*万?円?/)
  if (m) return `${m[1]}万〜${m[2]}万円`
  if (/年収/.test(text)) return '公開情報ベースで年収情報あり'
  return ''
}

function inferSkillsFromText(text: string): string[] {
  const source = String(text || '')
  const keywords = ['データ分析', '要件定義', 'PM', 'プロジェクト推進', '顧客折衝', '事業企画', 'SaaS', 'DX', 'AI活用']
  return uniqueStrings(keywords.filter((k) => source.includes(k)), 6)
}

function inferRolesFromText(text: string, fallbackRole: string): string[] {
  const source = String(text || '')
  const roles = ['事業企画', 'プロダクトマネージャー', 'カスタマーサクセス', 'コンサルタント', 'データアナリスト', 'プロジェクトマネージャー']
  const detected = roles.filter((r) => source.includes(r))
  return uniqueStrings(detected.length > 0 ? detected : [fallbackRole || '事業企画'], 5)
}

async function getCachedProfile(tableName: string, id: string, maxAgeHours: number): Promise<CompanyProfile | null> {
  try {
    const item = await ddb.send(new GetCommand({ TableName: tableName, Key: { id } }))
    const cached = item.Item as { profileJson?: string; updatedAt?: string } | undefined
    if (!cached?.profileJson || !cached.updatedAt) return null

    const age = Date.now() - new Date(cached.updatedAt).getTime()
    if (!Number.isFinite(age) || age > maxAgeHours * 60 * 60 * 1000) return null

    return JSON.parse(cached.profileJson) as CompanyProfile
  } catch {
    return null
  }
}

async function putCachedProfile(tableName: string, id: string, profile: CompanyProfile): Promise<void> {
  try {
    await ddb.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id,
          companyName: profile.name,
          normalizedName: profile.normalizedName,
          profileJson: JSON.stringify(profile),
          updatedAt: new Date().toISOString(),
          ttl: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 21,
        },
      })
    )
  } catch {
    // Cache write failure should not break recommendation flow.
  }
}

async function fetchCompanySources(apiKey: string, companyName: string, role: string): Promise<ResearchSource[]> {
  const queries = [
    `${companyName} 公式サイト 会社概要 事業内容`,
    `${companyName} 採用ページ 中途採用 求人`,
    `${companyName} 年収 募集職種`,
    `${companyName} 口コミ 働き方 評判`,
    `${companyName} ニュース プレスリリース`,
    `${companyName} ${role} 採用`,
  ]

  const all: ResearchSource[] = []
  for (const query of queries) {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: 'basic',
          include_answer: true,
          include_raw_content: false,
          max_results: 3,
        }),
      })
      if (!res.ok) continue
      const payload = await res.json()
      const list = Array.isArray(payload?.results) ? payload.results : []
      for (const item of list) {
        const title = String(item?.title || '')
        const url = String(item?.url || '')
        const snippet = String(item?.content || '').slice(0, 220)
        if (!title && !url && !snippet) continue
        all.push({ title, url, snippet, sourceType: classifySourceType(url, title) })
      }
    } catch {
      // Continue even if one query fails.
    }
  }

  return all.slice(0, 14)
}

export async function researchCompanies(params: ResearchParams): Promise<{
  profiles: CompanyProfile[]
  cacheHitCount: number
  cacheMissCount: number
}> {
  const tavilyKey = String(params.tavilyApiKey || '')
  const cacheTable = String(params.cacheTableName || '')
  const ttlHours = Number(params.cacheTtlHours || 24 * 14)
  const role = String(params.userProfile.role || '事業企画')
  const queryContextHash = hashString(buildResearchQueryContext(params.userProfile))

  const profiles: CompanyProfile[] = []
  let cacheHitCount = 0
  let cacheMissCount = 0

  for (const candidate of params.candidates.slice(0, 14)) {
    const canonicalName = normalizeCompanyName(candidate.name)
    const normalized = toNormalizedKey(canonicalName)
    const cacheId = `${normalized}#${queryContextHash}`

    if (cacheTable) {
      const cached = await getCachedProfile(cacheTable, cacheId, ttlHours)
      if (cached) {
        profiles.push(cached)
        cacheHitCount += 1
        continue
      }
    }

    cacheMissCount += 1

    const sources = tavilyKey ? await fetchCompanySources(tavilyKey, canonicalName, role) : []
    const text = sources.map((s) => `${s.title} ${s.snippet}`).join(' ')
    const businessSummary = text.slice(0, 280) || `${canonicalName}の公開情報要約を取得中です。`
    const salaryRange = parseSalaryHint(text)

    const profile = buildCompanyProfile({
      name: canonicalName,
      businessSummary,
      sources,
      targetRoles: inferRolesFromText(text, role),
      requiredSkills: inferSkillsFromText(text),
      salaryRange,
      culture: /プロフェッショナル|成果主義/.test(text) ? 'プロフェッショナル' : '実行志向',
      growthAreas: uniqueStrings(['DX', 'AI活用', 'SaaS']).slice(0, 3),
      hiringSignals: uniqueStrings([
        sources.some((s) => s.sourceType === 'hiring') ? '採用ページ情報を確認できる可能性があります。' : '',
        /中途|キャリア採用/.test(text) ? '中途採用関連情報が確認される可能性があります。' : '',
      ]),
      positiveSignals: uniqueStrings([
        sources.some((s) => s.sourceType === 'official') ? '公式情報を複数確認できる可能性があります。' : '',
        /成長|拡大|新規/.test(text) ? '成長関連の公開情報が確認される可能性があります。' : '',
      ]),
      concernSignals: uniqueStrings([
        sources.some((s) => s.sourceType === 'review') ? '口コミ情報は傾向として扱い、選考時に事実確認が必要です。' : '',
        sources.length < 4 ? '公開情報量が限定的なため追加確認が必要です。' : '',
      ]),
    })

    profiles.push(profile)

    if (cacheTable) {
      await putCachedProfile(cacheTable, cacheId, profile)
    }
  }

  return { profiles, cacheHitCount, cacheMissCount }
}
