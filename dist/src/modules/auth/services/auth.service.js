"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const token_service_1 = require("./token.service");
class AuthService {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async signup(dto, req) {
        const user = await this.authRepository.createUser(dto);
        return { user, message: req.t('auth.signupSuccess') };
    }
    async login(dto, req) {
        const user = await this.authRepository.loginUser(dto);
        if (!user) {
            throw new Error(req.t('auth.loginError'));
        }
        const accessToken = token_service_1.TokenService.generateAccessToken({ userId: user.id, email: user.email, role: user.role });
        const refreshToken = token_service_1.TokenService.generateRefreshToken({ userId: user.id, email: user.email });
        await token_service_1.TokenService.saveRefreshToken(user.id, refreshToken);
        return { user, accessToken, refreshToken, message: req.t('auth.loginSuccess') };
    }
    async refresh(refreshToken, req) {
        try {
            const payload = token_service_1.TokenService.verifyRefreshToken(refreshToken);
            const user = await this.authRepository.findUserById(payload.userId);
            if (!user)
                throw new Error('User not found');
            const newAccessToken = token_service_1.TokenService.generateAccessToken({ userId: user.id, email: user.email, role: user.role });
            const newRefreshToken = token_service_1.TokenService.generateRefreshToken({ userId: user.id, email: user.email });
            await token_service_1.TokenService.saveRefreshToken(user.id, newRefreshToken);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken, message: req.t('auth.refreshSuccess') };
        }
        catch (error) {
            throw new Error(req.t('auth.invalidRefreshToken'));
        }
    }
    async logout(refreshToken, req) {
        await token_service_1.TokenService.revokeRefreshToken(refreshToken);
        return { message: req.t('auth.logoutSuccess') };
    }
    async forgotPassword(dto, req) {
        await this.authRepository.forgotPassword(dto);
        return { message: req.t('auth.forgotPasswordSuccess') };
    }
    async resetPassword(dto, req) {
        await this.authRepository.resetPassword(dto);
        return { message: req.t('auth.resetPasswordSuccess') };
    }
    async resendVerification(dto, req) {
        await this.authRepository.resendVerification(dto);
        return { message: req.t('auth.resendVerificationSuccess') };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map