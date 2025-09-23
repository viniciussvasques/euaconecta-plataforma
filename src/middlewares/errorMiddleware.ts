import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Classe para os erros da aplicação
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para tratamento centralizado de erros
export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'Erro interno no servidor';
  const isOperational = 'isOperational' in err ? err.isOperational : false;

  // Log detalhado para erros não operacionais (bugs, etc.)
  if (!isOperational) {
    logger.error('Erro não operacional', {
      error: err,
      path: req.path,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user,
    });
  } else {
    // Log básico para erros operacionais (validação, auth, etc.)
    logger.warn(`${statusCode} - ${message}`, {
      path: req.path,
      method: req.method,
    });
  }

  // Em desenvolvimento, enviamos mais detalhes
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status: 'error',
      message,
      stack: err.stack,
      ...(isOperational ? {} : { code: 'INTERNAL_SERVER_ERROR' }),
    });
  }

  // Em produção, ocultamos detalhes técnicos
  return res.status(statusCode).json({
    status: 'error',
    message: isOperational
      ? message
      : 'Ocorreu um erro interno. Por favor tente novamente mais tarde.',
  });
};
