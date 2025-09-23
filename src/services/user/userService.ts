// src/services/user/userService.ts
import { PrismaClient, User, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppError } from '../../middlewares/errorMiddleware';

// Interfaces para o serviço
interface ICreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}

interface IUpdateUserDto {
  name?: string;
  password?: string;
  isActive?: boolean;
  role?: UserRole;
}

// Omitir campos sensíveis da resposta
type UserResponse = Omit<User, 'password'>;

export class UserService {
  constructor(private prisma: PrismaClient) {}

  // Criar um novo usuário
  async createUser(userData: ICreateUserDto): Promise<UserResponse> {
    // Verificar se o e-mail já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new AppError('Usuário com este email já existe', 400);
    }

    // Criptografar a senha
    const password = await bcrypt.hash(userData.password, 10);

    // Criar o usuário
    const userDataPrisma = {
      email: userData.email,
      name: userData.name,
      password,
      role: userData.role || 'CLIENT',
      isActive: false,
      permissions: [],
      canManageUsers: false,
      canManageConsolidations: false,
      canManagePackages: false,
      canManageCarriers: false,
      canViewFinancials: false,
      canManageSettings: false,
  } as unknown as import('@prisma/client').Prisma.UserUncheckedCreateInput;
    const user = await this.prisma.user.create({
      data: userDataPrisma,
    });

    // Remover a senha da resposta
    const { password: _, ...userResponse } = user;
    return userResponse;
  }

  // Buscar todos os usuários
  async findAllUsers(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Remover a senha dos dados de resposta
    return users.map((user: User) => {
      const { password: _, ...userResponse } = user;
      return userResponse;
    });
  }

  // Buscar um usuário pelo ID
  async findUserById(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

  // Remover o hash da senha
  const { password: _, ...userResponse } = user;
  return userResponse;
  }

  // Atualizar um usuário
  async updateUser(id: string, userData: IUpdateUserDto): Promise<UserResponse> {
    // Verificar se o usuário existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError('Usuário não encontrado', 404);
    }

  // Preparar os dados para atualização
  const updateData: Partial<IUpdateUserDto> = { ...userData };

    // Se houver senha, criptografar
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }

    // Atualizar o usuário
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Remover a senha da resposta
    const { password: _, ...userResponse } = updatedUser;
    return userResponse;
  }

  // Excluir um usuário
  async deleteUser(id: string): Promise<void> {
    // Verificar se o usuário existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Excluir o usuário
    await this.prisma.user.delete({
      where: { id },
    });
  }

  // Buscar um usuário pelo e-mail
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Validar credenciais
  async validateCredentials(email: string, password: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      throw new AppError('Conta desativada. Entre em contato com o suporte.', 403);
    }

    // Remover o hash da senha
    const { password: _, ...userResponse } = user;
    return userResponse;
  }
}
