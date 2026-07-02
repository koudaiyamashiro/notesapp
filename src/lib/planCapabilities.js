export const PLAN_IDS = {
  FREE: 'free',
  STANDARD: 'standard',
  PRO: 'pro',
}

export const PLAN_STATUS = {
  ACTIVE: 'active',
  TRIALING: 'trialing',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  UNPAID: 'unpaid',
  INCOMPLETE: 'incomplete',
  NONE: 'none',
}

export const planCapabilities = {
  [PLAN_IDS.FREE]: {
    maxDiagnosesPerMonth: 1,
    companyRecommendationLimit: 3,
    canUseDetailedMarketValue: false,
    canUseAdvancedDiagnosis: false,
    advancedDiagnosisLimit: 0,
    canUseCompanyComparison: false,
    aiChatLimit: 0,
    canUseResumeBuilder: false,
    canUseResumeReview: false,
    canUseInterviewPrep: false,
    canUseMotivationLetter: false,
    canUseCareerStrategyReport: false,
  },
  [PLAN_IDS.STANDARD]: {
    maxDiagnosesPerMonth: 5,
    companyRecommendationLimit: 10,
    canUseDetailedMarketValue: true,
    canUseAdvancedDiagnosis: true,
    advancedDiagnosisLimit: 3,
    canUseCompanyComparison: true,
    aiChatLimit: 5,
    canUseResumeBuilder: false,
    canUseResumeReview: false,
    canUseInterviewPrep: false,
    canUseMotivationLetter: false,
    canUseCareerStrategyReport: false,
  },
  [PLAN_IDS.PRO]: {
    maxDiagnosesPerMonth: 'unlimited',
    companyRecommendationLimit: 'unlimited',
    canUseDetailedMarketValue: true,
    canUseAdvancedDiagnosis: true,
    advancedDiagnosisLimit: 'unlimited',
    canUseCompanyComparison: true,
    aiChatLimit: 'unlimited',
    canUseResumeBuilder: true,
    canUseResumeReview: true,
    canUseInterviewPrep: true,
    canUseMotivationLetter: true,
    canUseCareerStrategyReport: true,
  },
}

export function normalizePlan(plan) {
  const raw = String(plan || '').trim().toLowerCase()
  if (raw === PLAN_IDS.STANDARD) return PLAN_IDS.STANDARD
  if (raw === PLAN_IDS.PRO) return PLAN_IDS.PRO
  return PLAN_IDS.FREE
}

export function normalizeStatus(status) {
  const raw = String(status || '').trim().toLowerCase()
  if (Object.values(PLAN_STATUS).includes(raw)) return raw
  return PLAN_STATUS.NONE
}

export function getPlanCapabilities(plan) {
  return planCapabilities[normalizePlan(plan)] || planCapabilities[PLAN_IDS.FREE]
}

export function isPaidPlan(plan) {
  const normalized = normalizePlan(plan)
  return normalized === PLAN_IDS.STANDARD || normalized === PLAN_IDS.PRO
}

export function isSubscriptionActive(status) {
  const normalized = normalizeStatus(status)
  return normalized === PLAN_STATUS.ACTIVE || normalized === PLAN_STATUS.TRIALING
}
