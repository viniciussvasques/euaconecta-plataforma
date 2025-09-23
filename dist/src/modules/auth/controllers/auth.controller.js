"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signup(req, res) {
        const dto = req.body;
        const result = await this.authService.signup(dto, req);
        return res.status(201).json(result);
    }
    async login(req, res) {
        const dto = req.body;
        const result = await this.authService.login(dto, req);
        return res.status(200).json(result);
    }
    async refresh(req, res) {
        const { refreshToken } = req.body;
        const result = await this.authService.refresh(refreshToken, req);
        return res.status(200).json(result);
    }
    async logout(req, res) {
        const { refreshToken } = req.body;
        const result = await this.authService.logout(refreshToken, req);
        return res.status(200).json(result);
    }
    async forgotPassword(req, res) {
        const dto = req.body;
        const result = await this.authService.forgotPassword(dto, req);
        return res.status(200).json(result);
    }
    async resetPassword(req, res) {
        const dto = req.body;
        const result = await this.authService.resetPassword(dto, req);
        return res.status(200).json(result);
    }
    async resendVerification(req, res) {
        const dto = req.body;
        const result = await this.authService.resendVerification(dto, req);
        return res.status(200).json(result);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map