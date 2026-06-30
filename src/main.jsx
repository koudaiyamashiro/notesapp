import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import './index.css'
import App from './App.jsx'
import { ensureAmplifyConfigured } from './lib/amplifyClient.js'

const bundledOutputsModules = import.meta.glob('../amplify_outputs.json', { eager: true })
const bundledOutputs = Object.values(bundledOutputsModules)[0]?.default

if (bundledOutputs && typeof bundledOutputs === 'object') {
  Amplify.configure(bundledOutputs)
}

async function bootstrap() {
  await ensureAmplifyConfigured()

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap()
