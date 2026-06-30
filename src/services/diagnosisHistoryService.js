import { generateClient } from 'aws-amplify/data'

const client = generateClient()

function safeParseJson(value, fallback = null) {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function normalizeHistoryItem(item) {
  return {
    ...item,
    profile: safeParseJson(item.profileJson, {}),
    result: safeParseJson(item.resultJson, {}),
    topCompanies: safeParseJson(item.topCompaniesJson, []),
    aiSummary: safeParseJson(item.aiSummaryJson, {}),
  }
}

export async function createDiagnosisHistory(input) {
  const { data, errors } = await client.models.DiagnosisHistory.create(input)
  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join('\n'))
  }
  return data
}

export async function listDiagnosisHistory() {
  const { data, errors } = await client.models.DiagnosisHistory.list({
    limit: 100,
    authMode: 'userPool',
  })
  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join('\n'))
  }

  return (data || [])
    .map(normalizeHistoryItem)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
}

export async function deleteDiagnosisHistory(id) {
  const { errors } = await client.models.DiagnosisHistory.delete({ id }, { authMode: 'userPool' })
  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join('\n'))
  }
}
