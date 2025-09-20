import { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { SuiteManager } from './suite-manager'
import { prisma } from '../database/prisma'

export interface CreateUserData {
  email: string
  name: string
  password: string
  role: UserRole
  permissions?: string[]
  canManageUsers?: boolean
  canManageConsolidations?: boolean
  canManagePackages?: boolean
  canManageCarriers?: boolean
  canViewFinancials?: boolean
  canManageSettings?: boolean
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: UserRole
  permissions?: string[]
  canManageUsers?: boolean
  canManageConsolidations?: boolean
  canManagePackages?: boolean
  canManageCarriers?: boolean
  canViewFinancials?: boolean
  canManageSettings?: boolean
  isActive?: boolean
  cpf?: string
  phone?: string
}

export interface UserWithPermissions {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  suiteNumber: number | null
  cpf: string | null
  phone: string | null
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
}

export class UserService {
  /**
   * Criar um novo usuário
   */
  static async createUser(userData: CreateUserData): Promise<UserWithPermissions> {
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Gerar número de suite automaticamente para clientes
    let suiteNumber: number | null = null
    if (userData.role === 'CLIENT') {
      suiteNumber = await SuiteManager.getNextSuiteNumber()
    }

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        role: userData.role,
        suiteNumber,
        permissions: userData.permissions || [],
        canManageUsers: userData.canManageUsers || false,
        canManageConsolidations: userData.canManageConsolidations || false,
        canManagePackages: userData.canManagePackages || false,
        canManageCarriers: userData.canManageCarriers || false,
        canViewFinancials: userData.canViewFinancials || false,
        canManageSettings: userData.canManageSettings || false
      }
    })

    return this.mapToUserWithPermissions(user)
  }

  /**
   * Buscar usuário por ID
   */
  static async getUserById(id: string): Promise<UserWithPermissions | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) return null

    return this.mapToUserWithPermissions(user)
  }

  /**
   * Buscar usuário por email
   */
  static async getUserByEmail(email: string): Promise<UserWithPermissions | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) return null

    return this.mapToUserWithPermissions(user)
  }

  /**
   * Atualizar usuário
   */
  static async updateUser(id: string, updateData: UpdateUserData): Promise<UserWithPermissions> {
    const updatePayload: Record<string, unknown> = { ...updateData }

    // Sanitizar CPF e telefone (somente dígitos)
    if (typeof updatePayload.cpf === 'string') {
      const digits = (updatePayload.cpf as string).replace(/[^\d]/g, '')
      updatePayload.cpf = digits || null
    }
    if (typeof updatePayload.phone === 'string') {
      const digits = (updatePayload.phone as string).replace(/[^\d]/g, '')
      updatePayload.phone = digits || null
    }

    // Gerenciar suite number baseado no role
    if (updateData.role === UserRole.CLIENT) {
      // Se mudando para CLIENT e não tem suite, gerar uma
      const currentUser = await prisma.user.findUnique({ where: { id } })
      if (currentUser && !currentUser.suiteNumber) {
        updatePayload.suiteNumber = await SuiteManager.getNextSuiteNumber()
      }
    } else if (updateData.role && (updateData.role as string) !== 'CLIENT') {
      // Se mudando para não-CLIENT, remover suite
      updatePayload.suiteNumber = null
    }

    // Remover campos undefined
    Object.keys(updatePayload).forEach(key => {
      if (updatePayload[key] === undefined) {
        delete updatePayload[key]
      }
    })

    const user = await prisma.user.update({
      where: { id },
      data: updatePayload
    })

    return this.mapToUserWithPermissions(user)
  }

  /**
   * Atualizar senha do usuário
   */
  static async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    })
  }

  /**
   * Gerar nova suite para um cliente
   */
  static async generateSuiteForClient(id: string): Promise<UserWithPermissions> {
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    if (user.role !== 'CLIENT') {
      throw new Error('Apenas clientes podem ter suites')
    }

    const newSuiteNumber = await SuiteManager.getNextSuiteNumber()

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { suiteNumber: newSuiteNumber }
    })

    return this.mapToUserWithPermissions(updatedUser)
  }

  /**
   * Atualizar último login
   */
  static async updateLastLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() }
    })
  }

  /**
   * Listar todos os usuários
   */
  static async getAllUsers(): Promise<UserWithPermissions[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return users.map(user => this.mapToUserWithPermissions(user))
  }

  /**
   * Listar usuários por role
   */
  static async getUsersByRole(role: UserRole): Promise<UserWithPermissions[]> {
    const users = await prisma.user.findMany({
      where: { role },
      orderBy: { createdAt: 'desc' }
    })

    return users.map(user => this.mapToUserWithPermissions(user))
  }

  /**
   * Verificar se usuário tem permissão específica
   */
  static hasPermission(user: UserWithPermissions, permission: string): boolean {
    // SUPER_ADMIN tem todas as permissões
    if (user.role === UserRole.SUPER_ADMIN) {
      return true
    }

    // Verificar permissões específicas
    return user.permissions.includes(permission)
  }

  /**
   * Verificar se usuário pode gerenciar usuários
   */
  static canManageUsers(user: UserWithPermissions): boolean {
    return user.role === UserRole.SUPER_ADMIN || user.canManageUsers
  }

  /**
   * Verificar se usuário pode gerenciar consolidações
   */
  static canManageConsolidations(user: UserWithPermissions): boolean {
    return user.role === UserRole.SUPER_ADMIN || user.canManageConsolidations
  }

  /**
   * Verificar se usuário pode gerenciar pacotes
   */
  static canManagePackages(user: UserWithPermissions): boolean {
    return user.role === UserRole.SUPER_ADMIN || user.canManagePackages
  }

  /**
   * Verificar se usuário pode gerenciar transportadoras
   */
  static canManageCarriers(user: UserWithPermissions): boolean {
    return user.role === UserRole.SUPER_ADMIN || user.canManageCarriers
  }

  /**
   * Verificar se usuário pode ver dados financeiros
   */
  static canViewFinancials(user: UserWithPermissions): boolean {
    return user.role === UserRole.SUPER_ADMIN || user.canViewFinancials
  }

  /**
   * Verificar se usuário pode gerenciar configurações
   */
  static canManageSettings(user: UserWithPermissions): boolean {
    return user.role === UserRole.SUPER_ADMIN || user.canManageSettings
  }

  /**
   * Desativar usuário
   */
  static async deactivateUser(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    })
  }

  /**
   * Reativar usuário
   */
  static async reactivateUser(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isActive: true }
    })
  }

  /**
   * Deletar usuário
   */
  static async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    })
  }

  /**
   * Buscar usuários por query (nome, email ou ID)
   */
  static async searchUsers(query: string, role?: string): Promise<UserWithPermissions[]> {
    const where: Record<string, unknown> = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { id: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (role) {
      where.role = role
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        permissions: true,
        canManageUsers: true,
        canManageConsolidations: true,
        canManagePackages: true,
        canManageCarriers: true,
        canViewFinancials: true,
        canManageSettings: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { name: 'asc' },
      take: 20 // Limitar resultados
    })

    return users.map(this.mapToUserWithPermissions)
  }

  /**
   * Mapear usuário do Prisma para interface UserWithPermissions
   */
  private static mapToUserWithPermissions(user: Record<string, unknown>): UserWithPermissions {
    return {
      id: user.id as string,
      email: user.email as string,
      name: user.name as string,
      role: user.role as UserRole,
      isActive: user.isActive as boolean,
      suiteNumber: user.suiteNumber as number | null,
      cpf: (user.cpf as string) || null,
      phone: (user.phone as string) || null,
      lastLogin: user.lastLogin as Date | null,
      permissions: (user.permissions as string[]) || [],
      canManageUsers: (user.canManageUsers as boolean) || false,
      canManageConsolidations: (user.canManageConsolidations as boolean) || false,
      canManagePackages: (user.canManagePackages as boolean) || false,
      canManageCarriers: (user.canManageCarriers as boolean) || false,
      canViewFinancials: (user.canViewFinancials as boolean) || false,
      canManageSettings: (user.canManageSettings as boolean) || false,
      createdAt: user.createdAt as Date,
      updatedAt: user.updatedAt as Date
    }
  }
}

export { UserRole }
