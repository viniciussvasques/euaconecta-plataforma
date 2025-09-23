// Dependency Injection Container
// Centraliza a criação e injeção de dependências

import { prisma } from '../../../shared/config/database'
import {
  IUserRepository,
  IPasswordService,
  IJwtService
} from '../domain/types'
import { UserDomainService, AuthDomainService } from '../domain/services'
import {
  PrismaUserRepository,
  BcryptPasswordService,
  JoseJwtService
} from '../infrastructure/repositories'
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  GetUserUseCase,
  DeleteUserUseCase,
  AuthenticateUserUseCase,
  ValidateTokenUseCase,
  RefreshTokenUseCase,
  LogoutUserUseCase,
  CheckUserPermissionUseCase
} from '../application/use-cases'

// Singleton instances
let userRepository: IUserRepository
let passwordService: IPasswordService
let jwtService: IJwtService
let userDomainService: UserDomainService
let authDomainService: AuthDomainService

// Use Cases
let createUserUseCase: CreateUserUseCase
let updateUserUseCase: UpdateUserUseCase
let getUserUseCase: GetUserUseCase
let deleteUserUseCase: DeleteUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let validateTokenUseCase: ValidateTokenUseCase
let refreshTokenUseCase: RefreshTokenUseCase
let logoutUserUseCase: LogoutUserUseCase
let checkUserPermissionUseCase: CheckUserPermissionUseCase

function initializeDependencies() {
  if (!userRepository) {
    // Infrastructure Layer
    const prismaClient = prisma
    userRepository = new PrismaUserRepository(prismaClient)
    passwordService = new BcryptPasswordService()
    jwtService = new JoseJwtService()

    // Domain Services
    userDomainService = new UserDomainService(userRepository, passwordService)
    authDomainService = new AuthDomainService(
      userRepository,
      undefined, // TODO: Implementar IAuthService se necessário
      passwordService,
      jwtService
    )

    // Application Layer (Use Cases)
    createUserUseCase = new CreateUserUseCase(userRepository, passwordService, userDomainService)
    updateUserUseCase = new UpdateUserUseCase(userRepository, userDomainService)
    getUserUseCase = new GetUserUseCase(userRepository)
    deleteUserUseCase = new DeleteUserUseCase(userRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(authDomainService)
    validateTokenUseCase = new ValidateTokenUseCase(authDomainService)
    refreshTokenUseCase = new RefreshTokenUseCase(jwtService, userRepository)
    logoutUserUseCase = new LogoutUserUseCase(userRepository)
    checkUserPermissionUseCase = new CheckUserPermissionUseCase(userDomainService)
  }
}

// Getters para as dependências
export function getUserRepository(): IUserRepository {
  initializeDependencies()
  return userRepository
}

export function getPasswordService(): IPasswordService {
  initializeDependencies()
  return passwordService
}

export function getJwtService(): IJwtService {
  initializeDependencies()
  return jwtService
}

export function getUserDomainService(): UserDomainService {
  initializeDependencies()
  return userDomainService
}

export function getAuthDomainService(): AuthDomainService {
  initializeDependencies()
  return authDomainService
}

// Use Cases
export function getCreateUserUseCase(): CreateUserUseCase {
  initializeDependencies()
  return createUserUseCase
}

export function getUpdateUserUseCase(): UpdateUserUseCase {
  initializeDependencies()
  return updateUserUseCase
}

export function getGetUserUseCase(): GetUserUseCase {
  initializeDependencies()
  return getUserUseCase
}

export function getDeleteUserUseCase(): DeleteUserUseCase {
  initializeDependencies()
  return deleteUserUseCase
}

export function getAuthenticateUserUseCase(): AuthenticateUserUseCase {
  initializeDependencies()
  return authenticateUserUseCase
}

export function getValidateTokenUseCase(): ValidateTokenUseCase {
  initializeDependencies()
  return validateTokenUseCase
}

export function getRefreshTokenUseCase(): RefreshTokenUseCase {
  initializeDependencies()
  return refreshTokenUseCase
}

export function getLogoutUserUseCase(): LogoutUserUseCase {
  initializeDependencies()
  return logoutUserUseCase
}

export function getCheckUserPermissionUseCase(): CheckUserPermissionUseCase {
  initializeDependencies()
  return checkUserPermissionUseCase
}