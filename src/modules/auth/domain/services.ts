// Domain Services - Regras de negócio puras
// Segue Clean Architecture - Camada de Domain

import {
  User,
  UserRole,
  UserStatus,
  UserPermissions,
  CreateUserRequest,
  UpdateUserRequest,
  AuthenticateRequest,
  AuthenticationResult,
  AuthorizationResult,
  IUserRepository,
  IAuthService,
  IPasswordService,
  IJwtService,
  UserCreatedEvent,
  UserLoggedInEvent,
  LoginFailedEvent
} from './types'

export class UserDomainService {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService
  ) {}

  /**
   * Valida regras de negócio para criação de usuário
   */
  async validateUserCreation(request: CreateUserRequest): Promise<void> {
    // Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(request.email)
    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    // Validar força da senha
    if (request.password.length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres')
    }

    // Validar permissões baseadas no role
    this.validatePermissionsForRole(request.role, request.permissions || {})
  }

  /**
   * Valida regras de negócio para atualização de usuário
   */
  async validateUserUpdate(userId: string, request: UpdateUserRequest): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    // Verificar se email já existe (se está sendo alterado)
    if (request.email && request.email !== user.profile.email) {
      const existingUser = await this.userRepository.findByEmail(request.email)
      if (existingUser) {
        throw new Error('Email já cadastrado')
      }
    }

    // Validar permissões se role está sendo alterado
    if (request.role && request.permissions) {
      this.validatePermissionsForRole(request.role, request.permissions)
    }
  }

  /**
   * Valida se as permissões são compatíveis com o role
   */
  private validatePermissionsForRole(role: UserRole, permissions: Partial<UserPermissions>): void {
    // SUPER_ADMIN tem todas as permissões automaticamente
    if (role === UserRole.SUPER_ADMIN) {
      return
    }

    // ADMIN pode gerenciar usuários e configurações
    if (role === UserRole.ADMIN) {
      const adminPermissions = [
        'canManageUsers',
        'canManageSettings',
        'canViewFinancials'
      ]

      const invalidPermissions = Object.keys(permissions).filter(
        key => !adminPermissions.includes(key) && permissions[key as keyof UserPermissions]
      )

      if (invalidPermissions.length > 0) {
        throw new Error(`Permissões inválidas para role ADMIN: ${invalidPermissions.join(', ')}`)
      }
    }

    // CLIENT não pode ter permissões administrativas
    if (role === UserRole.CLIENT) {
      const adminPermissionKeys: (keyof UserPermissions)[] = [
        'canManageUsers',
        'canManageSettings'
      ]

      const hasAdminPermissions = adminPermissionKeys.some(key => permissions[key])
      if (hasAdminPermissions) {
        throw new Error('Clientes não podem ter permissões administrativas')
      }
    }
  }

  /**
   * Verifica se usuário pode executar uma ação
   */
  canUserPerformAction(user: User, action: string): boolean {
    // SUPER_ADMIN pode tudo
    if (user.role === UserRole.SUPER_ADMIN) {
      return true
    }

    // Verificar permissões específicas
    switch (action) {
      case 'manage-users':
        return user.permissions.canManageUsers
      case 'manage-consolidations':
        return user.permissions.canManageConsolidations
      case 'manage-packages':
        return user.permissions.canManagePackages
      case 'manage-carriers':
        return user.permissions.canManageCarriers
      case 'view-financials':
        return user.permissions.canViewFinancials
      case 'manage-settings':
        return user.permissions.canManageSettings
      default:
        // Verificar permissões customizadas
        return user.permissions.customPermissions.includes(action)
    }
  }
}

export class AuthDomainService {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService,
    private passwordService: IPasswordService,
    private jwtService: IJwtService
  ) {}

  /**
   * Processa autenticação com regras de negócio
   */
  async authenticateUser(request: AuthenticateRequest): Promise<AuthenticationResult> {
    try {
      const user = await this.userRepository.findByEmail(request.email)
      if (!user) {
        return {
          success: false,
          error: 'Credenciais inválidas'
        }
      }

      // Verificar se conta está ativa
      if (user.status !== UserStatus.ACTIVE) {
        return {
          success: false,
          error: 'Conta inativa ou suspensa'
        }
      }

      // Verificar se conta está bloqueada
      if (user.credentials.lockedUntil && user.credentials.lockedUntil > new Date()) {
        return {
          success: false,
          error: 'Conta temporariamente bloqueada devido a tentativas de login excessivas'
        }
      }

      // Verificar senha
      const isPasswordValid = await this.passwordService.verify(
        request.password,
        user.credentials.password
      )

      if (!isPasswordValid) {
        // Incrementar tentativas de login
        await this.userRepository.incrementLoginAttempts(user.profile.id)

        // Bloquear conta se excedeu limite
        if (user.credentials.loginAttempts >= 5) {
          const lockUntil = new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
          await this.userRepository.lockAccount(user.profile.id, lockUntil)
        }

        return {
          success: false,
          error: 'Credenciais inválidas'
        }
      }

      // Resetar tentativas de login em caso de sucesso
      await this.userRepository.resetLoginAttempts(user.profile.id)
      await this.userRepository.updateLastLogin(user.profile.id)

      // Gerar tokens
      const token = await this.jwtService.sign({
        sub: user.profile.id,
        email: user.profile.email,
        name: user.profile.name,
        role: user.role
      })

      const refreshToken = await this.jwtService.sign(
        { sub: user.profile.id, type: 'refresh' },
        '30d'
      )

      return {
        success: true,
        user,
        token,
        refreshToken
      }
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return {
        success: false,
        error: 'Erro interno de autenticação'
      }
    }
  }

  /**
   * Valida token JWT com regras de negócio
   */
  async validateToken(token: string): Promise<AuthorizationResult> {
    try {
      const payload = await this.jwtService.verify(token)

      if (!payload.sub || typeof payload.sub !== 'string') {
        return { authorized: false, error: 'Token inválido' }
      }

      const user = await this.userRepository.findById(payload.sub)
      if (!user || user.status !== UserStatus.ACTIVE) {
        return { authorized: false, error: 'Usuário não encontrado ou inativo' }
      }

      return { authorized: true, user }
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return { authorized: false, error: 'Token expirado ou inválido' }
    }
  }
}

// Event Handlers (para futuro uso com event-driven architecture)
export class AuthEventHandlers {
  static onUserCreated(event: UserCreatedEvent): void {
    // Log de auditoria, notificações, etc.
    console.log(`Usuário criado: ${event.email} (${event.role})`)
  }

  static onUserLoggedIn(event: UserLoggedInEvent): void {
    // Log de segurança, detecção de anomalias, etc.
    console.log(`Login: ${event.userId} de ${event.ip}`)
  }

  static onLoginFailed(event: LoginFailedEvent): void {
    // Alertas de segurança, bloqueio automático, etc.
    console.warn(`Tentativa de login falhou: ${event.email} de ${event.ip} - ${event.reason}`)
  }
}