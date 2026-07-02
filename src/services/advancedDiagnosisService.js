import { getPlanCapabilities, normalizePlan } from '../lib/planCapabilities.js'

export async function generateAdvancedDiagnosis({ plan, profile }) {
  const capabilities = getPlanCapabilities(normalizePlan(plan))

  if (!capabilities.canUseAdvancedDiagnosis) {
    throw new Error('詳細診断はStandard以上で利用できます。')
  }

  const safeProfile = profile || {}
  const strengths = [safeProfile.strengthExample, safeProfile.quantAchievement].filter(Boolean)
  const risks = [safeProfile.weaknessExample, safeProfile.avoidConditions].filter(Boolean)

  return {
    advancedMarketValue: {
      summary: '市場価値の詳細分析を表示する枠です。',
      scoreBand: safeProfile.desiredSalary ? `希望年収 ${safeProfile.desiredSalary}` : '希望条件をもとに算出',
    },
    skillInventory: {
      strengths: strengths.length > 0 ? strengths : ['実績ベースの強みをここに表示'],
      gaps: ['次フェーズで拡張予定の分析項目'],
    },
    careerRisks: risks.length > 0 ? risks : ['キャリア選択時のリスクをここに表示'],
    companySelectionAxis: ['事業成長性', '裁量の広さ', '働き方の柔軟性'],
    salaryStrategy: ['90日で実施すべきアクション', '年収アップ戦略の仮説'],
    actionPlan90Days: ['第1週: 情報整理', '第2-4週: 企業比較', '第2-3ヶ月: 選考準備'],
    resumeAndInterview: {
      resume: '職務経歴書改善ポイントをここに表示',
      interview: '面接での訴求軸をここに表示',
    },
  }
}
