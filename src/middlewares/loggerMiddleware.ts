import { Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware que adiciona logs para todas as requisições HTTP
 */
export const loggerMiddleware = (req: import('express').Request, res: Response, next: NextFunction) => {
  // Gera um ID único para a requisição (útil para rastreamento)
  const requestId = uuidv4();
  req.requestId = requestId;

  // Captura o tempo inicial
  const startTime = Date.now();

  // Registra informações básicas da requisição
  logger.info(`Requisição iniciada: ${req.method} ${req.path}`, {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  userId: req.user?.id || 'anônimo',
  });

  // Captura a finalização da resposta
  res.on('finish', () => {
    // Calcula o tempo de processamento
    const responseTime = Date.now() - startTime;

    // Define o nível de log com base no status code
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

    // Registra informações da resposta
    logger[logLevel](`Requisição finalizada: ${req.method} ${req.path} - ${res.statusCode}`, {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    });
  });

  next();
};

// A extensão da interface Request é feita em src/types/express.d.ts
