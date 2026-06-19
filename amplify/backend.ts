import { defineBackend } from '@aws-amplify/backend';
import { FunctionUrlAuthType, HttpMethod } from 'aws-cdk-lib/aws-lambda';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { generateCareerInsights } from './functions/generateCareerInsights/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  generateCareerInsights,
});

const generateCareerInsightsUrl = backend.generateCareerInsights.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowCredentials: false,
    allowedOrigins: ['*'],
    allowedMethods: [HttpMethod.POST],
    allowedHeaders: ['content-type'],
  },
});

backend.addOutput({
  custom: {
    generateCareerInsightsUrl: generateCareerInsightsUrl.url,
  },
});
