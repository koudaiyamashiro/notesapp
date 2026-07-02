import { defineBackend } from '@aws-amplify/backend';
import { CfnFunction, CfnPermission, CfnUrl } from 'aws-cdk-lib/aws-lambda';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { generateCareerInsights } from './functions/generateCareerInsights/resource';
import { stripeWebhook } from './functions/stripeWebhook/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  generateCareerInsights,
  stripeWebhook,
});

const cacheTable = backend.data.resources.tables.CompanyResearchCache;
const subscriptionStatusTable = backend.data.resources.tables.SubscriptionStatus;
const insightsLambda = backend.generateCareerInsights.resources.lambda;
const stripeWebhookLambda = backend.stripeWebhook.resources.lambda;

const insightsLambdaNode = insightsLambda.node.defaultChild as CfnFunction;
insightsLambdaNode.addPropertyOverride('Environment.Variables.COMPANY_RESEARCH_CACHE_TABLE', cacheTable.tableName);
insightsLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['dynamodb:GetItem', 'dynamodb:PutItem'],
    resources: [cacheTable.tableArn],
  })
);

const stripeWebhookLambdaNode = stripeWebhookLambda.node.defaultChild as CfnFunction;
stripeWebhookLambdaNode.addPropertyOverride('Environment.Variables.SUBSCRIPTION_STATUS_TABLE', subscriptionStatusTable.tableName);

stripeWebhookLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:Query', 'dynamodb:Scan'],
    resources: [subscriptionStatusTable.tableArn],
  })
);

const stripeWebhookFunctionUrl = new CfnUrl(stripeWebhookLambda, 'StripeWebhookFunctionUrl', {
  authType: 'NONE',
  targetFunctionArn: stripeWebhookLambda.functionArn,
  invokeMode: 'BUFFERED',
});

new CfnPermission(stripeWebhookLambda, 'StripeWebhookFunctionUrlPermission', {
  action: 'lambda:InvokeFunctionUrl',
  functionName: stripeWebhookLambda.functionName,
  principal: '*',
  functionUrlAuthType: 'NONE',
});

backend.addOutput({
  custom: {
    stripeWebhookUrl: stripeWebhookFunctionUrl.attrFunctionUrl,
  },
});

