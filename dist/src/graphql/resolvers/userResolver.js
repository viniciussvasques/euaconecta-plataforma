"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = void 0;
const graphql_1 = require("graphql");
const userService_1 = require("../../services/user/userService");
exports.userResolver = {
    Query: {
        users: async (_, __, { prisma, user }) => {
            if (!user) {
                throw new graphql_1.GraphQLError('Não autenticado', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
                throw new graphql_1.GraphQLError('Não autorizado', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const userService = new userService_1.UserService(prisma);
            return userService.findAllUsers();
        },
        user: async (_, { id }, { prisma, user }) => {
            if (!user) {
                throw new graphql_1.GraphQLError('Não autenticado', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            if (user.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
                throw new graphql_1.GraphQLError('Não autorizado', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const userService = new userService_1.UserService(prisma);
            return userService.findUserById(id);
        },
    },
    Mutation: {
        createUser: async (_, { input }, { prisma }) => {
            const userService = new userService_1.UserService(prisma);
            try {
                return userService.createUser(input);
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message, {
                    extensions: {
                        code: error.statusCode === 400 ? 'BAD_USER_INPUT' : 'INTERNAL_SERVER_ERROR',
                        statusCode: error.statusCode || 500,
                    },
                });
            }
        },
        updateUser: async (_, { id, input }, { prisma, user }) => {
            if (!user) {
                throw new graphql_1.GraphQLError('Não autenticado', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            if (user.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
                throw new graphql_1.GraphQLError('Não autorizado', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const userService = new userService_1.UserService(prisma);
            try {
                return userService.updateUser(id, input);
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message, {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        statusCode: error.statusCode || 500,
                    },
                });
            }
        },
        deleteUser: async (_, { id }, { prisma, user }) => {
            if (!user) {
                throw new graphql_1.GraphQLError('Não autenticado', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }
            if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
                throw new graphql_1.GraphQLError('Não autorizado', {
                    extensions: { code: 'FORBIDDEN' },
                });
            }
            const userService = new userService_1.UserService(prisma);
            try {
                await userService.deleteUser(id);
                return { success: true, message: 'Usuário removido com sucesso' };
            }
            catch (error) {
                throw new graphql_1.GraphQLError(error.message, {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        statusCode: error.statusCode || 500,
                    },
                });
            }
        },
    },
};
//# sourceMappingURL=userResolver.js.map