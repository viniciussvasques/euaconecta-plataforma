import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const controller = new AuthController(authService);

router.post('/signup', (req, res) => controller.signup(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/refresh', (req, res) => controller.refresh(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));
router.post('/forgot-password', (req, res) => controller.forgotPassword(req, res));
router.post('/reset-password', (req, res) => controller.resetPassword(req, res));
router.post('/resend-verification', (req, res) => controller.resendVerification(req, res));
// Adicionar rotas para refresh, logout, ativação, etc.

export default router;
