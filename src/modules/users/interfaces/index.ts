import { UserRole } from '@prisma/client'

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
  password?: string
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

export interface IUserService {
  getUserById(id: string): Promise<UserWithPermissions | null>
  getUserByEmail(email: string): Promise<UserWithPermissions | null>
  getUsers(options?: { skip?: number; take?: number; role?: UserRole }): Promise<UserWithPermissions[]>
  createUser(data: CreateUserData): Promise<UserWithPermissions>
  updateUser(id: string, data: UpdateUserData): Promise<UserWithPermissions>
  deleteUser(id: string): Promise<void>
  changeUserRole(id: string, role: UserRole): Promise<UserWithPermissions>
  getUsersCount(): Promise<number>
}

export interface IUserRepository {
  findById(id: string): Promise<UserWithPermissions | null>
  findByEmail(email: string): Promise<UserWithPermissions | null>
  findMany(options?: { skip?: number; take?: number; role?: UserRole }): Promise<UserWithPermissions[]>
  create(data: CreateUserData): Promise<UserWithPermissions>
  update(id: string, data: UpdateUserData): Promise<UserWithPermissions>
  delete(id: string): Promise<void>
  count(): Promise<number>
}