import { Amplify } from 'aws-amplify'

let configurePromise = null
let configStatus = {
  ready: false,
  source: 'none',
  error: '',
}

function applyAmplifyOutputs(outputs, source) {
  if (!outputs || typeof outputs !== 'object') return false

  const hasAuth = Boolean(outputs.auth)
  if (!hasAuth) return false

  Amplify.configure(outputs)
  configStatus = {
    ready: true,
    source,
    error: '',
  }
  return true
}

async function loadFromPublicFile(path) {
  const response = await fetch(path, { cache: 'no-store' })
  if (!response.ok) return null

  try {
    return await response.json()
  } catch {
    return null
  }
}

function loadFromBundledOutputs() {
  const modules = import.meta.glob('../../amplify_outputs.json', { eager: true })
  const first = Object.values(modules)[0]
  return first?.default || null
}

export async function ensureAmplifyConfigured() {
  if (configStatus.ready) return configStatus
  if (configurePromise) return configurePromise

  configurePromise = (async () => {
    const windowOutputs =
      (typeof window !== 'undefined' &&
        (window.__AMPLIFY_CUSTOM_OUTPUTS__ || window.amplify_outputs || window.__AMPLIFY_OUTPUTS__)) ||
      null

    if (applyAmplifyOutputs(windowOutputs, 'window')) {
      return configStatus
    }

    try {
      const bundledOutputs = loadFromBundledOutputs()
      if (applyAmplifyOutputs(bundledOutputs, 'bundled-file')) {
        return configStatus
      }

      const outputs = await loadFromPublicFile('/amplify_outputs.json')
      if (applyAmplifyOutputs(outputs, 'public-file')) {
        return configStatus
      }

      const legacyOutputs = await loadFromPublicFile('/amplifyconfiguration.json')
      if (applyAmplifyOutputs(legacyOutputs, 'legacy-public-file')) {
        return configStatus
      }

      configStatus = {
        ready: false,
        source: 'none',
        error:
          'Amplify設定が見つかりません。amplify_outputs.json が未生成の可能性があります。Amplifyバックエンドをデプロイし、Hostingを再デプロイしてください。ローカルでは `npx ampx sandbox` 実行後に再読み込みしてください。',
      }
      configurePromise = null
      return configStatus
    } catch {
      configStatus = {
        ready: false,
        source: 'none',
        error:
          'Amplify設定の読み込みに失敗しました。Hostingのビルド成果物に amplify_outputs.json が含まれているか確認してください。',
      }
      configurePromise = null
      return configStatus
    }
  })()

  return configurePromise
}

export function getAmplifyConfigStatus() {
  return configStatus
}
