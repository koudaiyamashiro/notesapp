import { defineFunction } from '@aws-amplify/backend';

export const generateCareerInsights = defineFunction({
  name: 'generateCareerInsights',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
});
