// Domain Types - Regras de negócio e contratos
// Segue Clean Architecture - Camada de Domain

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT',
  SUPPORT = 'SUPPORT'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// Value Objects
export interface UserPermissions {
  canManageUsers: boolean
  canManageConsolidations: boolean
  canManagePackages: boolean
  canManageCarriers: boolean
  canViewFinancials: boolean
  canManageSettings: boolean
  customPermissions: string[]
}

export interface UserProfile {
  id: string
  email: string
  name: string
  cpf?: string
  phone?: string
  suiteNumber?: number
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserCredentials {
  password: string
  passwordChangedAt?: Date
  loginAttempts: number
  lockedUntil?: Date
}

// Aggregate Root - User
export interface User {
  profile: UserProfile
  credentials: UserCredentials
  permissions: UserPermissions
  role: UserRole
  status: UserStatus
}

// Use Cases Contracts
export interface CreateUserRequest {
  email: string
  name: string
  password: string
  role: UserRole
  permissions?: Partial<UserPermissions>
  cpf?: string
  phone?: string
}

export interface UpdateUserRequest {
  id: string
  name?: string
  email?: string
  role?: UserRole
  permissions?: Partial<UserPermissions>
  status?: UserStatus
  cpf?: string
  phone?: string
}

export interface AuthenticateRequest {
  email: string
  password: string
  ip?: string
  userAgent?: string
}

export interface AuthenticationResult {
  success: boolean
  user?: User
  token?: string
  refreshToken?: string
  error?: string
}

export interface AuthorizationResult {
  authorized: boolean
  user?: User
  error?: string
}

// Repository Contracts
export interface IUserRepository {
  create(user: CreateUserRequest): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  update(id: string, updates: UpdateUserRequest): Promise<User | null>
  delete(id: string): Promise<boolean>
  list(filters?: { role?: UserRole; status?: UserStatus }): Promise<User[]>
  updateLastLogin(id: string): Promise<void>
  incrementLoginAttempts(id: string): Promise<void>
  resetLoginAttempts(id: string): Promise<void>
  lockAccount(id: string, until: Date): Promise<void>
}

// Service Contracts
export interface IAuthService {
  authenticate(request: AuthenticateRequest): Promise<AuthenticationResult>
  validateToken(token: string): Promise<AuthorizationResult>
  refreshToken(refreshToken: string): Promise<AuthenticationResult>
  logout(userId: string): Promise<void>
}

export interface IPasswordService {
  hash(password: string): Promise<string>
  verify(password: string, hash: string): Promise<boolean>
  generateResetToken(): string
  validateResetToken(token: string): boolean
}

export interface IJwtService {
  sign(payload: Record<string, unknown>, expiresIn?: string): Promise<string>
  verify(token: string): Promise<Record<string, unknown>>
}

// Events (para futuro event-driven architecture)
export interface UserCreatedEvent {
  userId: string
  email: string
  role: UserRole
  timestamp: Date
}

export interface UserLoggedInEvent {
  userId: string
  ip: string
  userAgent: string
  timestamp: Date
}

export interface LoginFailedEvent {
  email: string
  ip: string
  reason: string
  timestamp: Date
}