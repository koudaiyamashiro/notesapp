import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
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
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
