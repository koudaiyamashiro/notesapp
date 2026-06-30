import { Amplify } from 'aws-amplify'

let isConfigured = false
let configurePromise = null

export async function ensureAmplifyConfigured() {
  if (isConfigured) return true
  if (configurePromise) return configurePromise

  configurePromise = (async () => {
    try {
      const response = await fetch('/amplify_outputs.json', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('amplify_outputs.json is not available')
      }
      const outputs = await response.json()
      Amplify.configure(outputs)
      isConfigured = true
      return true
    } catch (error) {
      console.warn('Amplify configuration was skipped:', error)
      return false
    }
  })()

  return configurePromise
}
