// src/graphql/schema.ts
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import userTypeDefs from './typeDefs/userTypeDefs';
import { userResolver } from './resolvers/userResolver';
// Importe outros typeDefs e resolvers conforme necessário

/**
 * Schema consolidado do GraphQL, combinando todos os tipos e resolvers
 */
export const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([
    userTypeDefs,
    // Adicione outros typeDefs aqui
  ]),
  resolvers: mergeResolvers([
    userResolver,
    // Adicione outros resolvers aqui
  ]),
});
