// src/api/routes/userRoutes.ts
import express, { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../../services/user/userService';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../middlewares/validationMiddleware';
import { createUserSchema, updateUserSchema } from '../../models/userSchema';
import { AppError } from '../../middlewares/errorMiddleware';

export function createUserRouter(prisma: PrismaClient): Router {
  const router = express.Router();
  const userService = new UserService(prisma);

  /**
   * @route GET /api/users
   * @desc Obtém lista de usuários
   * @access Admin
   */
  router.get(
    '/',
    authMiddleware(['ADMIN', 'SUPER_ADMIN']),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const users = await userService.findAllUsers();
        res.status(200).json({ users });
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @route GET /api/users/:id
   * @desc Obtém um usuário pelo ID
   * @access Admin ou próprio usuário
   */
  router.get('/:id', authMiddleware(), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Verifica se é o próprio usuário ou um admin
      if (req.user.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
        throw new AppError('Acesso não autorizado', 403);
      }

      const user = await userService.findUserById(id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @route POST /api/users
   * @desc Cria um novo usuário
   * @access Público
   */
  router.post(
    '/',
    validateRequest(createUserSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userData = req.body;
        const user = await userService.createUser(userData);
        res.status(201).json({ user });
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @route PUT /api/users/:id
   * @desc Atualiza um usuário existente
   * @access Admin ou próprio usuário
   */
  router.put(
    '/:id',
    authMiddleware(),
    validateRequest(updateUserSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const userData = req.body;

        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        // Verifica se é o próprio usuário ou um admin
        if (req.user.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
          throw new AppError('Acesso não autorizado', 403);
        }

        const user = await userService.updateUser(id, userData);
        res.status(200).json({ user });
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @route DELETE /api/users/:id
   * @desc Remove um usuário
   * @access Admin
   */
  router.delete(
    '/:id',
    authMiddleware(['ADMIN', 'SUPER_ADMIN']),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        await userService.deleteUser(id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
