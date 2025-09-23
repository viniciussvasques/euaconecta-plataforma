import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import { logger } from './utils/logger';
import { configureApiRoutes } from './api/routes';
import { schema } from './graphql/schema';
import { configureI18n, useTranslation } from './infrastructure/i18n/i18nConfig';
import { userRoutes } from './modules/user/infrastructure/userRoutes';

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa o Prisma
export const prisma = new PrismaClient();

async function bootstrap() {
  // Inicializa o Express
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Configura middleware de internacionalização
  const i18nMiddleware = await configureI18n();

  // Middlewares essenciais
  app.use(
    helmet({
      // Configuração para permitir o Apollo Sandbox para desenvolvimento
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(cors());
  app.use(json());
  app.use(loggerMiddleware);
  app.use(i18nMiddleware);

  // Rota de health check raiz
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      language: (req as any).language || 'pt',
    });
  });

  // Rota de teste para verificar a internacionalização
  app.get('/api/test-i18n', (req: Request, res: Response) => {
    res.json({
      message: (req as any).t('common.welcome'),
      language: (req as any).language,
      supportedLanguages: ['pt', 'en', 'es'],
    });
  });

  // Inicializa o Apollo Server para GraphQL
  const apolloServer = new ApolloServer({
    schema,
    formatError: (error: any) => {
      logger.error('GraphQL Error', { error });
      return {
        message: error.message,
        path: error.path,
        // Omitimos detalhes internos em produção
        extensions:
          process.env.NODE_ENV === 'production'
            ? { code: error.extensions?.code || 'INTERNAL_SERVER_ERROR' }
            : error.extensions,
      };
    },
    // Habilitar o Apollo Sandbox para desenvolvimento
    introspection: process.env.NODE_ENV !== 'production',
  });

  // Inicia o Apollo Server
  await apolloServer.start();

  // Aplica o middleware do Apollo ao Express
  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }: { req: Request }) => ({
        prisma,
        user: (req as any).user, // Usuário autenticado (se disponível)
      }),
    }),
  );

  // Registra as rotas REST
  app.use('/api', configureApiRoutes(prisma));

  // Rotas de usuário com internacionalização
  app.use('/api/users', userRoutes());

  // Middleware de tratamento de erros (sempre deve ser o último)
  app.use(errorMiddleware);

  // Inicia o servidor
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
    logger.info(`🚀 API REST disponível em http://localhost:${PORT}/api`);
    logger.info(`🚀 GraphQL disponível em http://localhost:${PORT}/graphql`);
    logger.info(`🚀 Internacionalização (i18n) configurada para: PT, EN, ES`);
  });

  // Gerenciamento de processo
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

// Função para desligar o servidor graciosamente
async function shutdown() {
  logger.info('Encerrando servidor...');

  try {
    await prisma.$disconnect();
    logger.info('Conexão com o banco de dados encerrada');

    process.exit(0);
  } catch (error) {
    logger.error('Erro ao encerrar servidor:', error);
    process.exit(1);
  }
}

// Inicia o servidor
bootstrap().catch((error) => {
  logger.error('Erro ao inicializar o servidor:', error);
  process.exit(1);
});
