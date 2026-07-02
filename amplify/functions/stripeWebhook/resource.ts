import { defineFunction } from '@aws-amplify/backend'

export const stripeWebhook = defineFunction({
  name: 'stripeWebhook',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
})
