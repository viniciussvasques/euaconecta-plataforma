import express, { Router } from 'express';
import { validate } from '../../../infrastructure/middleware/validationMiddleware';
import {
  createUserSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema,
} from '../application/validation';

/**
 * Rotas para o módulo de usuário com internacionalização
 * @returns {Router} - Rotas configuradas para o módulo de usuário
 */
export const userRoutes = (): Router => {
  const router = express.Router();

  /**
   * @route POST /api/users
   * @description Cria um novo usuário
   * @access Public
   */
  router.post('/', validate(createUserSchema), (req, res) => {
    // TODO: Implementar lógica para criar usuário
    return res.status(201).json({
      message: req.t('user.createSuccess'),
      user: { ...req.body, password: undefined },
    });
  });

  /**
   * @route POST /api/users/login
   * @description Autentica um usuário
   * @access Public
   */
  router.post('/login', validate(loginSchema), (req, res) => {
    // Simulação de erro de autenticação para demonstração de i18n
    return res.status(401).json({
      message: req.t('auth.loginError'),
    });
  });

  /**
   * @route PUT /api/users/:id
   * @description Atualiza informações de um usuário
   * @access Private
   */
  router.put('/:id', validate(updateUserSchema), (req, res) => {
    const { id } = req.params;

    // TODO: Implementar lógica para atualizar usuário
    return res.status(200).json({
      message: req.t('user.updateSuccess'),
      user: { id, ...req.body },
    });
  });

  /**
   * @route PUT /api/users/:id/password
   * @description Altera a senha de um usuário
   * @access Private
   */
  router.put('/:id/password', validate(changePasswordSchema), (req, res) => {
    const { id } = req.params;

    // TODO: Implementar lógica para alterar senha
    return res.status(200).json({
      message: req.t('user.passwordUpdateSuccess'),
    });
  });

  /**
   * @route GET /api/users/:id
   * @description Obtém informações de um usuário específico
   * @access Private
   */
  router.get('/:id', (req, res) => {
    const { id } = req.params;

    // Simulação de erro para demonstração de i18n
    if (id === 'not-found') {
      return res.status(404).json({
        message: req.t('errors.notFound'),
      });
    }

    // TODO: Implementar lógica para obter usuário
    return res.status(200).json({
      user: {
        id,
        name: 'Usuário Teste',
        email: 'teste@example.com',
        role: 'CLIENT',
        preferredLanguage: req.language,
      },
    });
  });

  return router;
};

export default userRoutes;
