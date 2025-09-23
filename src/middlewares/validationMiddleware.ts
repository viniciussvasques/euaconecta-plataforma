// src/middlewares/validationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { AppError } from './errorMiddleware';

export const validateRequest = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida o corpo da requisição usando o schema Zod
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Formatação amigável dos erros de validação
        const formattedErrors = err.issues.map((zodError) => ({
          path: zodError.path.join('.'),
          message: zodError.message,
        }));

        // Retorna erro 400 (Bad Request) com os detalhes da validação
        const error = new AppError(`Erro de validação: ${JSON.stringify(formattedErrors)}`, 400);
        next(error);
      } else {
        // Outros erros passam para o próximo middleware de erro
        next(err);
      }
    }
  };
};
