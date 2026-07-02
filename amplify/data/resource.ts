import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';
import { stripeWebhook } from '../functions/stripeWebhook/resource';

const stripeCreateCheckoutSession = defineFunction({
  name: 'stripeCreateCheckoutSession',
  entry: './stripe-create-checkout/handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
});

const stripeCreateCustomerPortalSession = defineFunction({
  name: 'stripeCreateCustomerPortalSession',
  entry: './stripe-create-customer-portal/handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512,
});

const schema = a.schema({
  PlanType: a.enum(['free', 'standard', 'pro']),
  SubscriptionState: a.enum(['active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'none']),
  BillingSessionResponse: a.customType({
    url: a.string().required(),
    message: a.string(),
  }),
  createCheckoutSession: a
    .mutation()
    .arguments({
      plan: a.string().required(),
    })
    .returns(a.ref('BillingSessionResponse'))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(stripeCreateCheckoutSession)),
  createCustomerPortalSession: a
    .mutation()
    .returns(a.ref('BillingSessionResponse'))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(stripeCreateCustomerPortalSession)),
  DiagnosisHistory: a
    .model({
      userId: a.string().required(),
      userEmail: a.email().required(),
      title: a.string().required(),
      profileJson: a.string().required(),
      topCompaniesJson: a.string().required(),
      aiSummary: a.string().required(),
      marketValueScore: a.integer(),
      successProbability: a.integer(),
    })
    .authorization((allow) => [allow.owner()]),
  SubscriptionStatus: a
    .model({
      userId: a.string().required(),
      userEmail: a.email().required(),
      plan: a.ref('PlanType').required(),
      status: a.ref('SubscriptionState').required(),
      stripeCustomerId: a.string(),
      stripeSubscriptionId: a.string(),
      stripePriceId: a.string(),
      currentPeriodStart: a.datetime(),
      currentPeriodEnd: a.datetime(),
      cancelAtPeriodEnd: a.boolean(),
      canceledAt: a.datetime(),
    })
    .authorization((allow) => [allow.ownerDefinedIn('userId')]),
  CompanyResearchCache: a
    .model({
      companyName: a.string().required(),
      normalizedName: a.string().required(),
      profileJson: a.string().required(),
      updatedAt: a.datetime().required(),
      ttl: a.integer(),
    })
    .authorization((allow) => [allow.authenticated()]),
}).authorization((allow) => [
  allow.resource(stripeCreateCheckoutSession),
  allow.resource(stripeCreateCustomerPortalSession),
  allow.resource(stripeWebhook),
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
