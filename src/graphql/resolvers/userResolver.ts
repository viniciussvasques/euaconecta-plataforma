// src/graphql/resolvers/userResolver.ts
import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { UserService } from '../../services/user/userService';

// Contexto para os resolvers
interface IContext {
  prisma: PrismaClient;
  user?: {
    id: string;
    role: string;
  };
}

export const userResolver = {
  Query: {
    // Obtém todos os usuários (requer permissão de admin)
    users: async (_: any, __: any, { prisma, user }: IContext) => {
      // Verificação de autenticação e autorização
      if (!user) {
        throw new GraphQLError('Não autenticado', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        throw new GraphQLError('Não autorizado', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const userService = new UserService(prisma);
      return userService.findAllUsers();
    },

    // Obtém um único usuário pelo ID
    user: async (_: any, { id }: { id: string }, { prisma, user }: IContext) => {
      // Verificação de autenticação
      if (!user) {
        throw new GraphQLError('Não autenticado', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Verifica se é o próprio usuário ou um admin
      if (user.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        throw new GraphQLError('Não autorizado', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const userService = new UserService(prisma);
      return userService.findUserById(id);
    },
  },

  Mutation: {
    // Cria um novo usuário
    createUser: async (_: any, { input }: any, { prisma }: IContext) => {
      const userService = new UserService(prisma);

      try {
        return userService.createUser(input);
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: error.statusCode === 400 ? 'BAD_USER_INPUT' : 'INTERNAL_SERVER_ERROR',
            statusCode: error.statusCode || 500,
          },
        });
      }
    },

    // Atualiza um usuário existente
    updateUser: async (_: any, { id, input }: any, { prisma, user }: IContext) => {
      // Verificação de autenticação
      if (!user) {
        throw new GraphQLError('Não autenticado', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      // Verifica se é o próprio usuário ou um admin
      if (user.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        throw new GraphQLError('Não autorizado', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const userService = new UserService(prisma);

      try {
        return userService.updateUser(id, input);
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: error.statusCode || 500,
          },
        });
      }
    },

    // Remove um usuário (apenas admins)
    deleteUser: async (_: any, { id }: { id: string }, { prisma, user }: IContext) => {
      // Verificação de autenticação e autorização
      if (!user) {
        throw new GraphQLError('Não autenticado', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        throw new GraphQLError('Não autorizado', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const userService = new UserService(prisma);

      try {
        await userService.deleteUser(id);
        return { success: true, message: 'Usuário removido com sucesso' };
      } catch (error: any) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: error.statusCode || 500,
          },
        });
      }
    },
  },
};
