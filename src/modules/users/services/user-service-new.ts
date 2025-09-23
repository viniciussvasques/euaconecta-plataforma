import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'
import { IUserService, CreateUserData, UpdateUserData, UserWithPermissions } from '../interfaces'
import { IUserRepository } from '../interfaces'
import { SuiteManager } from '../../../lib/utils/suite-manager'

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getUserById(id: string): Promise<UserWithPermissions | null> {
    return this.userRepository.findById(id)
  }

  async getUserByEmail(email: string): Promise<UserWithPermissions | null> {
    return this.userRepository.findByEmail(email)
  }

  async getUsers(options?: { skip?: number; take?: number; role?: UserRole }): Promise<UserWithPermissions[]> {
    return this.userRepository.findMany(options)
  }

  async createUser(userData: CreateUserData): Promise<UserWithPermissions> {
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Gerar número de suite automaticamente para clientes
    let suiteNumber: number | null = null
    if (userData.role === 'CLIENT') {
      suiteNumber = await SuiteManager.getNextSuiteNumber()
    }

    const data = {
      ...userData,
      password: hashedPassword,
      suiteNumber,
    }

    return this.userRepository.create(data)
  }

  async updateUser(id: string, data: UpdateUserData): Promise<UserWithPermissions> {
    // Se estiver atualizando a senha, fazer hash
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12)
    }

    return this.userRepository.update(id, data)
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id)
  }

  async changeUserRole(id: string, role: UserRole): Promise<UserWithPermissions> {
    return this.userRepository.update(id, { role })
  }

  async getUsersCount(): Promise<number> {
    return this.userRepository.count()
  }

  // Método legado para compatibilidade
  static async createUser(userData: CreateUserData): Promise<UserWithPermissions> {
    const { UserRepository } = await import('../repositories/user-repository')
    const { prisma } = await import('../../../lib/database/prisma')

    const repository = new UserRepository(prisma)
    const service = new UserService(repository)

    return service.createUser(userData)
  }

  static async getUserById(id: string): Promise<UserWithPermissions | null> {
    const { UserRepository } = await import('../repositories/user-repository')
    const { prisma } = await import('../../../lib/database/prisma')

    const repository = new UserRepository(prisma)
    const service = new UserService(repository)

    return service.getUserById(id)
  }

  static async getUserByEmail(email: string): Promise<UserWithPermissions | null> {
    const { UserRepository } = await import('../repositories/user-repository')
    const { prisma } = await import('../../../lib/database/prisma')

    const repository = new UserRepository(prisma)
    const service = new UserService(repository)

    return service.getUserByEmail(email)
  }
}