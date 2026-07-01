import { defineBackend } from '@aws-amplify/backend';
import { CfnFunction } from 'aws-cdk-lib/aws-lambda';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
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

const cacheTable = backend.data.resources.tables.CompanyResearchCache;
const insightsLambda = backend.generateCareerInsights.resources.lambda;

const insightsLambdaNode = insightsLambda.node.defaultChild as CfnFunction;
insightsLambdaNode.addPropertyOverride('Environment.Variables.COMPANY_RESEARCH_CACHE_TABLE', cacheTable.tableName);
insightsLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['dynamodb:GetItem', 'dynamodb:PutItem'],
    resources: [cacheTable.tableArn],
  })
);

