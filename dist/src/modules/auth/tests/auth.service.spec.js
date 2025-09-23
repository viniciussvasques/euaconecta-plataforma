"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../services/auth.service");
jest.mock('../repositories/auth.repository');
describe('AuthService', () => {
    let authRepository;
    let authService;
    const mockReq = { t: (key) => key };
    beforeEach(() => {
        authRepository = {
            createUser: jest.fn(),
            loginUser: jest.fn(),
            findUserById: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
            resendVerification: jest.fn(),
        };
        authService = new auth_service_1.AuthService(authRepository);
    });
    it('should signup a user', async () => {
        const dto = { email: 'test@test.com', password: '123456', name: 'Test' };
        const mockUser = { id: '1', email: dto.email };
        authRepository.createUser.mockResolvedValue(mockUser);
        const result = await authService.signup(dto, mockReq);
        expect(authRepository.createUser).toHaveBeenCalledWith(dto);
        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('message', 'auth.signupSuccess');
    });
    it('should login a user', async () => {
        const dto = { email: 'test@test.com', password: '123456' };
        const mockUser = { id: '1', email: dto.email, role: 'CLIENT' };
        authRepository.loginUser.mockResolvedValue(mockUser);
        const result = await authService.login(dto, mockReq);
        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
        expect(result).toHaveProperty('message', 'auth.loginSuccess');
    });
    it('should handle forgot password', async () => {
        const dto = { email: 'test@test.com' };
        const mockResult = { success: true };
        authRepository.forgotPassword.mockResolvedValue(mockResult);
        const result = await authService.forgotPassword(dto, mockReq);
        expect(result).toHaveProperty('message', 'auth.forgotPasswordSuccess');
    });
    it('should handle reset password', async () => {
        const dto = { email: 'test@test.com', token: 'token', newPassword: 'newpass' };
        const mockResult = { success: true };
        authRepository.resetPassword.mockResolvedValue(mockResult);
        const result = await authService.resetPassword(dto, mockReq);
        expect(result).toHaveProperty('message', 'auth.resetPasswordSuccess');
    });
    it('should handle resend verification', async () => {
        const dto = { email: 'test@test.com' };
        const mockResult = { success: true };
        authRepository.resendVerification.mockResolvedValue(mockResult);
        const result = await authService.resendVerification(dto, mockReq);
        expect(result).toHaveProperty('message', 'auth.resendVerificationSuccess');
    });
});
//# sourceMappingURL=auth.service.spec.js.map