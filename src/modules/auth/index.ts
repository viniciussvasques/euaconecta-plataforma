// Módulo Auth - Export Centralizado
// Clean Architecture + API Routes

// Domain Layer
export * from './domain/types'
export * from './domain/services'

// Application Layer
export * from './application/use-cases'

// Infrastructure Layer
export * from './infrastructure/repositories'

// Presentation Layer
export * from './presentation/handlers-simple'

// Dependency Injection
export * from './di/container'

// API Routes (para uso no App Router)
export * as activateApi from './api/activate/route'
export * as forgotPasswordApi from './api/forgot-password/route'
export * as loginApi from './api/login/route'
export * as logoutApi from './api/logout/route'
export * as meApi from './api/me/route'
export * as refreshApi from './api/refresh/route'
export * as registerApi from './api/register/route'
export * as resendActivationApi from './api/resend-activation/route'
export * as resetPasswordApi from './api/reset-password/route'

// Utilitários
export { createApiPipeline, RATE_LIMIT_CONFIGS } from '../../../shared/middlewares'