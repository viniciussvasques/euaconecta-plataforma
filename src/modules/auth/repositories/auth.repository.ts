import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';

const prisma = new PrismaClient();

export class AuthRepository {
  async createUser(dto: SignupDto) {
  /**
   * Cria usuário com:
   * - Hash seguro de senha (bcryptjs)
   * - Token de ativação gerado
   * - Validade de ativação de 24h
   * - Campos obrigatórios do modelo User
   * - Pronto para integração de e-mail de ativação
   */
    // Mapeia DTO para UserUncheckedCreateInput
    const now = new Date();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(dto.password, salt);
    const activationToken = crypto.randomUUID();
    const activationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    const userData = {
      id: crypto.randomUUID(),
      email: dto.email,
      password: hashedPassword,
      name: dto.name ?? '',
      createdAt: now,
      updatedAt: now,
      isActive: false,
      role: UserRole.CLIENT,
      activationToken,
      activationTokenExpires,
      canManageCarriers: false,
      canManageConsolidations: false,
      canManagePackages: false,
      canManageSettings: false,
      canManageUsers: false,
      canViewFinancials: false,
      cpf: null,
      lastLogin: null,
      permissions: [],
      suiteNumber: null,
    };
    return prisma.user.create({ data: userData });
  }

  async loginUser(dto: LoginDto) {
    // Busca usuário e valida senha
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    // Validação de senha omitida
    return user;
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    // Gerar token e enviar e-mail (mock)
    // TODO: Implementar integração com serviço de e-mail
    return { success: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Validar token e atualizar senha (mock)
    // TODO: Implementar validação de token e atualização de senha
    return { success: true };
  }

  async resendVerification(dto: ResendVerificationDto) {
    // Reenviar código de verificação (mock)
    // TODO: Implementar reenvio de código
    return { success: true };
  }

  // Outros métodos: refresh, forgotPassword, resetPassword, resendVerification, etc.
}
