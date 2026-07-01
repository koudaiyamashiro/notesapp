import { discoverCompanyCandidates } from './companyDiscoveryService'
import { researchCompanies } from './companyResearchService'
import { rankCompanies } from './companyScoringService'
import { CompanyProfile } from './responseNormalizer'

export type DynamicCompanyEngineResult = {
  topCompanies: Array<Record<string, unknown>>
  companyProfiles: CompanyProfile[]
  cacheHitCount: number
  cacheMissCount: number
  researchSource: 'tavily' | 'seed'
}

export async function runDynamicCompanyEngine(params: {
  seedCompanies: Array<Record<string, unknown>>
  userProfile: Record<string, unknown>
  tavilyApiKey?: string
  cacheTableName?: string
}): Promise<DynamicCompanyEngineResult> {
  const discovered = await discoverCompanyCandidates({
    seedCompanies: params.seedCompanies,
    userProfile: params.userProfile,
    tavilyApiKey: params.tavilyApiKey,
    maxCandidates: 18,
  })

  const researched = await researchCompanies({
    candidates: discovered.candidates,
    userProfile: params.userProfile,
    tavilyApiKey: params.tavilyApiKey,
    cacheTableName: params.cacheTableName,
    cacheTtlHours: 24 * 14,
  })

  const ranked = rankCompanies(params.userProfile, researched.profiles)

  return {
    topCompanies: ranked,
    companyProfiles: researched.profiles,
    cacheHitCount: researched.cacheHitCount,
    cacheMissCount: researched.cacheMissCount,
    researchSource: discovered.usedTavily ? 'tavily' : 'seed',
  }
}
