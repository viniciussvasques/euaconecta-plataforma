// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorMiddleware';

// Interface para dados do token
interface ITokenPayload {
  id: string;
  role: string;
}

// Função para verificar o token e extrair os dados do usuário
export function authMiddleware(allowedRoles?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Obter o token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AppError('Token não fornecido', 401));
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return next(new AppError('Formato do token inválido', 401));
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return next(new AppError('Formato do token inválido', 401));
    }

    // Verificar e decodificar o token
    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        return next(new AppError('Configuração JWT ausente', 500));
      }

      const decoded = jwt.verify(token, jwtSecret) as ITokenPayload;

      // Se foram especificados roles permitidos, verificar se o usuário tem permissão
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return next(new AppError('Acesso não autorizado', 403));
      }

      // Adicionar dados do usuário ao objeto de requisição
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new AppError('Token expirado', 401));
      }

      return next(new AppError('Token inválido', 401));
    }
  };
}

// A extensão da interface Request é feita em src/types/express.d.ts
