import { normalizeCompanyName, toNormalizedKey } from './responseNormalizer'

type Candidate = {
  name: string
  normalizedKey: string
  discoverySource: 'seed' | 'tavily'
  query: string
}

type DiscoverParams = {
  seedCompanies: Array<Record<string, unknown>>
  userProfile: Record<string, unknown>
  tavilyApiKey?: string
  maxCandidates?: number
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0) : []
}

function buildQueries(profile: Record<string, unknown>): string[] {
  const role = String(profile.role || '')
  const strengths = asStringArray(profile.strengths)
  const industries = asStringArray(profile.desiredIndustry)
  const income = String(profile.income || '')
  const workStyle = String(profile.workStyle || '')
  const future = String(profile.idealFuture || '')

  const base: string[] = []
  if (role && industries[0]) base.push(`${industries[0]} ${role} 中途採用 年収`)
  if (role && strengths[0]) base.push(`${role} ${strengths[0]} 転職 企業 採用`)
  if (strengths[0] && strengths[1]) base.push(`${strengths[0]} ${strengths[1]} プロジェクト推進 転職 企業`)
  if (workStyle) base.push(`${workStyle}勤務 キャリア採用 SaaS 企業`)
  if (income) base.push(`${role} 年収${income} 転職 企業`)
  if (future) base.push(`${future} キャリア 中途採用 企業`)

  return Array.from(new Set(base)).slice(0, 6)
}

function extractCompanyNames(text: string): string[] {
  const source = String(text || '')
  const patterns = [
    /([A-Z][A-Za-z&\-\.]{2,}(?:\s+[A-Z][A-Za-z&\-\.]{2,}){0,2})/g,
    /([\u30a0-\u30ff\u4e00-\u9fffA-Za-z0-9]+(?:株式会社|ホールディングス|カンパニー|コーポレーション|テクノロジーズ))/g,
    /(リクルート|マネーフォワード|LINEヤフー|Sansan|freee|SmartHR|アクセンチュア|ベイカレント)/g,
  ]

  const results: string[] = []
  for (const pattern of patterns) {
    const matches = source.match(pattern) || []
    for (const m of matches) {
      const cleaned = normalizeCompanyName(m)
      if (cleaned.length >= 2) results.push(cleaned)
    }
  }

  return Array.from(new Set(results)).slice(0, 16)
}

async function searchTavily(apiKey: string, query: string): Promise<string[]> {
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
        max_results: 5,
      }),
    })

    if (!res.ok) return []
    const payload = await res.json()
    const answer = typeof payload?.answer === 'string' ? payload.answer : ''
    const snippets = Array.isArray(payload?.results)
        ? payload.results
          .map((item: { title?: string; content?: string }) => `${String(item?.title || '')} ${String(item?.content || '')}`)
          .join(' ')
      : ''

    return extractCompanyNames(`${answer} ${snippets}`)
  } catch {
    return []
  }
}

export async function discoverCompanyCandidates(params: DiscoverParams): Promise<{ candidates: Candidate[]; usedTavily: boolean }> {
  const maxCandidates = params.maxCandidates || 20
  const merged = new Map<string, Candidate>()

  for (const seed of params.seedCompanies || []) {
    const name = normalizeCompanyName(String(seed.name || ''))
    if (!name) continue
    const key = toNormalizedKey(name)
    merged.set(key, {
      name,
      normalizedKey: key,
      discoverySource: 'seed',
      query: 'seed',
    })
  }

  const tavilyKey = String(params.tavilyApiKey || '')
  if (!tavilyKey) {
    return { candidates: Array.from(merged.values()).slice(0, maxCandidates), usedTavily: false }
  }

  const queries = buildQueries(params.userProfile)
  for (const query of queries) {
    const names = await searchTavily(tavilyKey, query)
    for (const name of names) {
      const key = toNormalizedKey(name)
      if (!merged.has(key)) {
        merged.set(key, {
          name,
          normalizedKey: key,
          discoverySource: 'tavily',
          query,
        })
      }
    }
  }

  return {
    candidates: Array.from(merged.values()).slice(0, maxCandidates),
    usedTavily: queries.length > 0,
  }
}
