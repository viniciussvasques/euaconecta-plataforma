// Infrastructure Layer - Implementações concretas
// Segue Clean Architecture - Camada de Infrastructure

import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import {
  User,
  UserStatus,
  CreateUserRequest,
  UpdateUserRequest,
  IUserRepository,
  IPasswordService,
  IJwtService
} from '../domain/types'

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(request: CreateUserRequest): Promise<User> {
    const hashedPassword = await bcrypt.hash(request.password, 12)

    // Gerar suite number para clientes
    let suiteNumber: number | null = null
    if (request.role === UserRole.CLIENT) {
      // Lógica para gerar próximo número de suite
      const lastUser = await this.prisma.user.findFirst({
        where: { role: UserRole.CLIENT },
        orderBy: { suiteNumber: 'desc' }
      })
      suiteNumber = (lastUser?.suiteNumber || 0) + 1
    }

    const user = await this.prisma.user.create({
      data: {
        email: request.email,
        name: request.name,
        password: hashedPassword,
        role: request.role,
        suiteNumber,
        permissions: request.permissions?.customPermissions || [],
        canManageUsers: request.permissions?.canManageUsers || false,
        canManageConsolidations: request.permissions?.canManageConsolidations || false,
        canManagePackages: request.permissions?.canManagePackages || false,
        canManageCarriers: request.permissions?.canManageCarriers || false,
        canViewFinancials: request.permissions?.canViewFinancials || false,
        canManageSettings: request.permissions?.canManageSettings || false,
        cpf: request.cpf,
        phone: request.phone
      }
    })

    return this.mapToDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })
    return user ? this.mapToDomain(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })
    return user ? this.mapToDomain(user) : null
  }

  async update(id: string, updates: UpdateUserRequest): Promise<User | null> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.email && { email: updates.email }),
          ...(updates.role && { role: updates.role }),
          ...(updates.permissions && {
            permissions: updates.permissions.customPermissions,
            canManageUsers: updates.permissions.canManageUsers,
            canManageConsolidations: updates.permissions.canManageConsolidations,
            canManagePackages: updates.permissions.canManagePackages,
            canManageCarriers: updates.permissions.canManageCarriers,
            canViewFinancials: updates.permissions.canViewFinancials,
            canManageSettings: updates.permissions.canManageSettings
          }),
          ...(updates.status && { isActive: updates.status === UserStatus.ACTIVE }),
          ...(updates.cpf && { cpf: updates.cpf }),
          ...(updates.phone && { phone: updates.phone })
        }
      })
      return this.mapToDomain(user)
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id }
      })
      return true
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return false
    }
  }

  async list(filters?: { role?: UserRole; status?: UserStatus }): Promise<User[]> {
    const where: any = {}
    if (filters?.role) where.role = filters.role
    if (filters?.status) where.isActive = filters.status === UserStatus.ACTIVE

    const users = await this.prisma.user.findMany({ where })
    return users.map(this.mapToDomain)
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() }
    })
  }

  async incrementLoginAttempts(_id: string): Promise<void> {
    // TODO: Implementar quando campo loginAttempts for adicionado ao schema
    // Por enquanto, não faz nada
  }

  async resetLoginAttempts(_id: string): Promise<void> {
    // TODO: Implementar quando campo loginAttempts for adicionado ao schema
    // Por enquanto, não faz nada
  }

  async lockAccount(_id: string, _until: Date): Promise<void> {
    // TODO: Implementar quando campo lockedUntil for adicionado ao schema
    // Por enquanto, não faz nada
  }

  private mapToDomain(prismaUser: {
    id: string
    email: string
    name: string
    password: string
    role: UserRole
    isActive: boolean
    cpf: string | null
    phone: string | null
    suiteNumber: number | null
    lastLogin: Date | null
    permissions: string[]
    canManageUsers: boolean
    canManageConsolidations: boolean
    canManagePackages: boolean
    canManageCarriers: boolean
    canViewFinancials: boolean
    canManageSettings: boolean
    createdAt: Date
    updatedAt: Date
  }): User {
    return {
      profile: {
        id: prismaUser.id,
        email: prismaUser.email,
        name: prismaUser.name,
        cpf: prismaUser.cpf || undefined,
        phone: prismaUser.phone || undefined,
        suiteNumber: prismaUser.suiteNumber || undefined,
        lastLogin: prismaUser.lastLogin || undefined,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt
      },
      credentials: {
        password: prismaUser.password,
        passwordChangedAt: undefined, // Campo não existe no schema atual
        loginAttempts: 0, // Campo não existe no schema atual
        lockedUntil: undefined // Campo não existe no schema atual
      },
      permissions: {
        canManageUsers: prismaUser.canManageUsers,
        canManageConsolidations: prismaUser.canManageConsolidations,
        canManagePackages: prismaUser.canManagePackages,
        canManageCarriers: prismaUser.canManageCarriers,
        canViewFinancials: prismaUser.canViewFinancials,
        canManageSettings: prismaUser.canManageSettings,
        customPermissions: prismaUser.permissions
      },
      role: prismaUser.role as UserRole,
      status: prismaUser.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE
    }
  }
}

export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  generateResetToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  validateResetToken(_token: string): boolean {
    // Implementar validação real de token de reset
    return true
  }
}

export class JoseJwtService implements IJwtService {
  private textEncoder = new TextEncoder()

  private getSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres')
    }
    return this.textEncoder.encode(secret)
  }

  async sign(payload: Record<string, unknown>, expiresIn: string = '7d'): Promise<string> {
    const secret = this.getSecret()
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject(payload.sub as string)
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(secret)
  }

  async verify(token: string): Promise<Record<string, unknown>> {
    const secret = this.getSecret()
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
    return payload
  }
}