import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { TokenService } from './token.service';

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signup(dto: SignupDto, req: any) {
    // Implementação usando Prisma
    const user = await this.authRepository.createUser(dto);
    return { user, message: req.t('auth.signupSuccess') };
  }

  async login(dto: LoginDto, req: any) {
    // Implementação usando Prisma
    const user = await this.authRepository.loginUser(dto);
    if (!user) {
      throw new Error(req.t('auth.loginError'));
    }
    // Generate tokens
    const accessToken = TokenService.generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = TokenService.generateRefreshToken({ userId: user.id, email: user.email });
    // Save refresh token
    await TokenService.saveRefreshToken(user.id, refreshToken);
    return { user, accessToken, refreshToken, message: req.t('auth.loginSuccess') };
  }

  async refresh(refreshToken: string, req: any) {
    try {
      const payload = TokenService.verifyRefreshToken(refreshToken) as { userId: string; email: string };
      // Optionally check if token exists in DB and not revoked
      const user = await this.authRepository.findUserById(payload.userId);
      if (!user) throw new Error('User not found');
      const newAccessToken = TokenService.generateAccessToken({ userId: user.id, email: user.email, role: user.role });
      const newRefreshToken = TokenService.generateRefreshToken({ userId: user.id, email: user.email });
      // Save new refresh token
      await TokenService.saveRefreshToken(user.id, newRefreshToken);
      return { accessToken: newAccessToken, refreshToken: newRefreshToken, message: req.t('auth.refreshSuccess') };
    } catch (error) {
      throw new Error(req.t('auth.invalidRefreshToken'));
    }
  }

  async logout(refreshToken: string, req: any) {
    await TokenService.revokeRefreshToken(refreshToken);
    return { message: req.t('auth.logoutSuccess') };
  }

  async forgotPassword(dto: ForgotPasswordDto, req: any) {
    // Implementação: gerar token, enviar e-mail
    await this.authRepository.forgotPassword(dto);
    return { message: req.t('auth.forgotPasswordSuccess') };
  }

  async resetPassword(dto: ResetPasswordDto, req: any) {
    // Implementação: validar token, atualizar senha
    await this.authRepository.resetPassword(dto);
    return { message: req.t('auth.resetPasswordSuccess') };
  }

  async resendVerification(dto: ResendVerificationDto, req: any) {
    // Implementação: reenviar código de verificação
    await this.authRepository.resendVerification(dto);
    return { message: req.t('auth.resendVerificationSuccess') };
  }

  // Outros métodos: refresh, forgotPassword, resetPassword, resendVerification, etc.
}
