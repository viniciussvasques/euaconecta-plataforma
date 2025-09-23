import { PrismaClient, UserRole } from '@prisma/client'
import { IUserRepository, CreateUserData, UpdateUserData, UserWithPermissions } from '../interfaces'

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<UserWithPermissions | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    return user ? this.mapToUserWithPermissions(user) : null
  }

  async findByEmail(email: string): Promise<UserWithPermissions | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    return user ? this.mapToUserWithPermissions(user) : null
  }

  async findMany(options?: { skip?: number; take?: number; role?: UserRole }): Promise<UserWithPermissions[]> {
    const users = await this.prisma.user.findMany({
      skip: options?.skip,
      take: options?.take,
      where: options?.role ? { role: options.role } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return users.map(user => this.mapToUserWithPermissions(user))
  }

  async create(data: CreateUserData): Promise<UserWithPermissions> {
    const user = await this.prisma.user.create({
      data,
    })

    return this.mapToUserWithPermissions(user)
  }

  async update(id: string, data: UpdateUserData): Promise<UserWithPermissions> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    })

    return this.mapToUserWithPermissions(user)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }

  async count(): Promise<number> {
    return this.prisma.user.count()
  }

  private mapToUserWithPermissions(user: any): UserWithPermissions {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      suiteNumber: user.suiteNumber,
      cpf: user.cpf,
      phone: user.phone,
      lastLogin: user.lastLogin,
      permissions: user.permissions || [],
      canManageUsers: user.canManageUsers,
      canManageConsolidations: user.canManageConsolidations,
      canManagePackages: user.canManagePackages,
      canManageCarriers: user.canManageCarriers,
      canViewFinancials: user.canViewFinancials,
      canManageSettings: user.canManageSettings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}