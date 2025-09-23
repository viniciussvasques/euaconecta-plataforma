// src/api/routes/index.ts
import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { createUserRouter } from './userRoutes';
// Importe outras rotas aqui conforme necessário

/**
 * Configura todas as rotas REST da API
 * @param prisma Instância do Prisma Client
 * @returns Router configurado com todas as rotas
 */
export function configureApiRoutes(prisma: PrismaClient): Router {
  const router = express.Router();

  // Rota de verificação de saúde da API
  router.get('/health', (_: express.Request, res: express.Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Configurar rotas para cada recurso
  router.use('/users', createUserRouter(prisma));
  // Adicione outras rotas conforme necessário:
  // router.use('/auth', createAuthRouter(prisma));
  // router.use('/packages', createPackageRouter(prisma));
  // router.use('/shipments', createShipmentRouter(prisma));
  // etc.

  return router;
}
