// Application Layer - Use Cases
// Segue Clean Architecture - Camada de Application

import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  AuthenticateRequest,
  AuthenticationResult,
  AuthorizationResult,
  IUserRepository,
  IPasswordService,
  IJwtService
} from '../domain/types'
import { UserDomainService, AuthDomainService } from '../domain/services'

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private userDomainService: UserDomainService
  ) {}

  async execute(request: CreateUserRequest): Promise<User> {
    // Validar regras de negócio
    await this.userDomainService.validateUserCreation(request)

    // Criar usuário
    const user = await this.userRepository.create(request)

    // TODO: Disparar evento UserCreatedEvent
    // eventBus.publish(new UserCreatedEvent(user.profile.id, user.profile.email, user.role))

    return user
  }
}

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private userDomainService: UserDomainService
  ) {}

  async execute(userId: string, request: UpdateUserRequest): Promise<User | null> {
    // Validar regras de negócio
    await this.userDomainService.validateUserUpdate(userId, request)

    // Atualizar usuário
    return this.userRepository.update(userId, request)
  }
}

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId)
  }

  async executeByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email)
  }

  async executeList(): Promise<User[]> {
    return this.userRepository.list()
  }
}

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<boolean> {
    return this.userRepository.delete(userId)
  }
}

export class AuthenticateUserUseCase {
  constructor(
    private authDomainService: AuthDomainService
  ) {}

  async execute(request: AuthenticateRequest): Promise<AuthenticationResult> {
    const result = await this.authDomainService.authenticateUser(request)

    // TODO: Disparar eventos baseado no resultado
    // if (result.success && result.user) {
    //   eventBus.publish(new UserLoggedInEvent(result.user.profile.id, request.ip || '', request.userAgent || ''))
    // } else {
    //   eventBus.publish(new LoginFailedEvent(request.email, request.ip || '', result.error || 'Unknown error'))
    // }

    return result
  }
}

export class ValidateTokenUseCase {
  constructor(
    private authDomainService: AuthDomainService
  ) {}

  async execute(token: string): Promise<AuthorizationResult> {
    return this.authDomainService.validateToken(token)
  }
}

export class RefreshTokenUseCase {
  constructor(
    private jwtService: IJwtService,
    private userRepository: IUserRepository
  ) {}

  async execute(refreshToken: string): Promise<AuthenticationResult> {
    try {
      // Validar refresh token
      const payload = await this.jwtService.verify(refreshToken)

      if (!payload.sub || payload.type !== 'refresh') {
        return { success: false, error: 'Token de refresh inválido' }
      }

      // Verificar se usuário ainda existe
      const user = await this.userRepository.findById(payload.sub as string)
      if (!user) {
        return { success: false, error: 'Usuário não encontrado' }
      }

      // Gerar novo access token
      const newToken = await this.jwtService.sign({
        sub: user.profile.id,
        email: user.profile.email,
        name: user.profile.name,
        role: user.role
      })

      const newRefreshToken = await this.jwtService.sign(
        { sub: user.profile.id, type: 'refresh' },
        '30d'
      )

      return {
        success: true,
        user,
        token: newToken,
        refreshToken: newRefreshToken
      }
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return { success: false, error: 'Token de refresh expirado ou inválido' }
    }
  }
}

export class LogoutUserUseCase {
  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<void> {
    // TODO: Implementar blacklist de tokens se necessário
    // Por enquanto, apenas log de auditoria
    console.log(`Logout do usuário: ${userId}`)
  }
}

export class CheckUserPermissionUseCase {
  constructor(
    private userDomainService: UserDomainService
  ) {}

  execute(user: User, action: string): boolean {
    return this.userDomainService.canUserPerformAction(user, action)
  }
}