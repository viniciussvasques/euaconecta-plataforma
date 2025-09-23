"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
const auth_service_1 = require("../services/auth.service");
const auth_repository_1 = require("../repositories/auth.repository");
const authRepository = new auth_repository_1.AuthRepository();
const authService = new auth_service_1.AuthService(authRepository);
const controller = new auth_controller_1.AuthController(authService);
router.post('/signup', (req, res) => controller.signup(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/refresh', (req, res) => controller.refresh(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));
router.post('/forgot-password', (req, res) => controller.forgotPassword(req, res));
router.post('/reset-password', (req, res) => controller.resetPassword(req, res));
router.post('/resend-verification', (req, res) => controller.resendVerification(req, res));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map