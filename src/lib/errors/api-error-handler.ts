/**
 * Sistema de Tratamento de Erros Centralizado para APIs
 *
 * Este módulo fornece tratamento de erros consistente e logging
 * para todas as APIs da aplicação.
 */

import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

// Tipos de erro personalizados
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Não autenticado') {
    super(401, message, 'AUTHENTICATION_ERROR')
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Não autorizado') {
    super(403, message, 'AUTHORIZATION_ERROR')
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Recurso') {
    super(404, `${resource} não encontrado`, 'NOT_FOUND_ERROR')
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(409, message, 'CONFLICT_ERROR', details)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Muitas tentativas. Tente novamente mais tarde') {
    super(429, message, 'RATE_LIMIT_ERROR')
    this.name = 'RateLimitError'
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Erro interno do servidor') {
    super(500, message, 'INTERNAL_SERVER_ERROR')
    this.name = 'InternalServerError'
  }
}

// Interface para resposta de erro padronizada
interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: unknown
  timestamp: string
  requestId?: string
}

// Função para criar resposta de erro padronizada
export function createErrorResponse(
  error: ApiError,
  requestId?: string
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    success: false,
    error: error.message,
    code: error.code,
    details: error.details,
    timestamp: new Date().toISOString(),
    ...(requestId && { requestId }),
  }

  return NextResponse.json(response, { status: error.statusCode })
}

// Função para tratar erros do Prisma
export function handlePrismaError(error: unknown): ApiError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new ConflictError('Recurso já existe', {
          field: error.meta?.target,
        })
      case 'P2025':
        return new NotFoundError('Registro')
      case 'P2003':
        return new ValidationError('Referência inválida', {
          field: error.meta?.field_name,
        })
      default:
        return new InternalServerError('Erro no banco de dados')
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError('Dados inválidos para o banco de dados')
  }

  return new InternalServerError('Erro no banco de dados')
}

// Função para tratar erros do Zod
export function handleZodError(error: ZodError): ApiError {
  // Mapeia os detalhes dos erros do Zod para um formato padronizado
  const details = error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }))

  return new ValidationError('Dados inválidos', details)
}

// Função para tratar erros de validação
export function handleValidationError(error: unknown): ApiError {
  if (error instanceof ZodError) {
    return handleZodError(error)
  }

  if (error instanceof ApiError) {
    return error
  }

  return new ValidationError('Dados inválidos')
}

// Função para tratar erros de autenticação
export function handleAuthError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  return new AuthenticationError()
}

// Função para tratar erros de autorização
export function handleAuthorizationError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  return new AuthorizationError()
}

// Função para tratar erros de rate limiting
export function handleRateLimitError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  return new RateLimitError()
}

// Função para tratar erros gerais
export function handleGeneralError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error)
  }

  if (error instanceof ZodError) {
    return handleZodError(error)
  }

  // Log do erro para debugging
  console.error('Erro não tratado:', error)

  return new InternalServerError()
}

// Função para logging de erros
export function logError(
  error: unknown,
  context?: {
    userId?: string
    requestId?: string
    endpoint?: string
    method?: string
  }
) {
  const logData = {
    error: {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack,
      code: (error as ApiError).code,
      details: (error as ApiError).details,
    },
    context,
    timestamp: new Date().toISOString(),
  }

  // Log para console em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', logData)
  }

  // Aqui você pode adicionar logging para serviços externos como Sentry
  // Sentry.captureException(error, { extra: logData })
}

// Função para criar handler de erro genérico
export function createErrorHandler(
  context?: {
    userId?: string
    requestId?: string
    endpoint?: string
    method?: string
  }
) {
  return (error: unknown) => {
    // Log do erro
    logError(error, context)

    // Tratar o erro
    const apiError = handleGeneralError(error)

    // Retornar resposta de erro
    return createErrorResponse(apiError, context?.requestId)
  }
}

// Função para wrapper de API com tratamento de erro
export function withErrorHandler<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      const apiError = handleGeneralError(error)
      throw createErrorResponse(apiError)
    }
  }
}

// Função para validar e tratar erros de entrada
export function validateAndHandle<T>(
  data: unknown,
  validator: (data: unknown) => T
): { success: true; data: T } | { success: false; error: ApiError } {
  try {
    const validatedData = validator(data)
    return { success: true, data: validatedData }
  } catch (error) {
    const apiError = handleValidationError(error)
    return { success: false, error: apiError }
  }
}

// Função para criar middleware de tratamento de erro
export function errorHandlerMiddleware(
  error: unknown,
  request: Request,
  context?: unknown
) {
  const requestId = request.headers.get('x-request-id') || undefined
  const endpoint = new URL(request.url).pathname
  const method = request.method

  const errorContext = {
    requestId,
    endpoint,
    method,
    ...(context as Record<string, unknown>),
  }

  return createErrorHandler(errorContext)(error)
}
