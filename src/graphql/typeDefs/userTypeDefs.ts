// src/graphql/typeDefs/userTypeDefs.ts
import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  # Tipos
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    active: Boolean!
    emailVerified: Boolean!
    suiteNumber: String
    createdAt: String!
    updatedAt: String!
  }

  enum UserRole {
    SUPER_ADMIN
    ADMIN
    OPERATOR
    MANAGER
    CLIENT
    SUPPORT
  }

  # Inputs
  input CreateUserInput {
    email: String!
    firstName: String!
    lastName: String!
    password: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    password: String
    active: Boolean
  }

  type DeleteUserResponse {
    success: Boolean!
    message: String
  }

  # Queries
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  # Mutations
  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): DeleteUserResponse!
  }
`;

export default userTypeDefs;
