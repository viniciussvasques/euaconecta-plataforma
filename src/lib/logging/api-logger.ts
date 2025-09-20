/**
 * Sistema de Logging para APIs
 *
 * Este módulo fornece logging estruturado para todas as APIs,
 * incluindo métricas de performance e auditoria.
 */

import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '../errors/api-error-handler'

// Níveis de log
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

// Tipos de log
export enum LogType {
  REQUEST = 'request',
  RESPONSE = 'response',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  AUDIT = 'audit',
  SECURITY = 'security',
}

// Interface para entrada de log
interface LogEntry {
  level: LogLevel
  type: LogType
  message: string
  timestamp: string
  requestId?: string
  userId?: string
  endpoint?: string
  method?: string
  statusCode?: number
  duration?: number
  metadata?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
    code?: string
  }
}

// Interface para métricas de performance
interface PerformanceMetrics {
  requestId: string
  endpoint: string
  method: string
  duration: number
  statusCode: number
  memoryUsage?: NodeJS.MemoryUsage
  timestamp: string
}

// Interface para auditoria (future use)
/* interface AuditEntry {
  action: string
  resource: string
  resourceId?: string
  userId?: string
  ip?: string
  userAgent?: string
  timestamp: string
  metadata?: Record<string, unknown>
} */

// Classe principal do logger
export class ApiLogger {
  private static instance: ApiLogger
  private logs: LogEntry[] = []
  private maxLogs = 1000 // Máximo de logs em memória

  private constructor() {}

  public static getInstance(): ApiLogger {
    if (!ApiLogger.instance) {
      ApiLogger.instance = new ApiLogger()
    }
    return ApiLogger.instance
  }

  // Log de request
  public logRequest(
    request: NextRequest,
    requestId: string,
    userId?: string
  ): void {
    const logEntry: LogEntry = {
      level: LogLevel.INFO,
      type: LogType.REQUEST,
      message: `Request received: ${request.method} ${request.url}`,
      timestamp: new Date().toISOString(),
      requestId,
      userId,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        contentType: request.headers.get('content-type'),
        contentLength: request.headers.get('content-length'),
      },
    }

    this.addLog(logEntry)
  }

  // Log de response
  public logResponse(
    request: NextRequest,
    response: NextResponse,
    requestId: string,
    duration: number,
    userId?: string
  ): void {
    const logEntry: LogEntry = {
      level: LogLevel.INFO,
      type: LogType.RESPONSE,
      message: `Response sent: ${response.status}`,
      timestamp: new Date().toISOString(),
      requestId,
      userId,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      statusCode: response.status,
      duration,
      metadata: {
        contentLength: response.headers.get('content-length'),
        contentType: response.headers.get('content-type'),
      },
    }

    this.addLog(logEntry)
  }

  // Log de erro
  public logError(
    error: ApiError | Error,
    request: NextRequest,
    requestId: string,
    userId?: string
  ): void {
    const logEntry: LogEntry = {
      level: LogLevel.ERROR,
      type: LogType.ERROR,
      message: `Error occurred: ${error.message}`,
      timestamp: new Date().toISOString(),
      requestId,
      userId,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error instanceof ApiError && { code: error.code }),
      },
    }

    this.addLog(logEntry)
  }

  // Log de performance
  public logPerformance(
    metrics: PerformanceMetrics
  ): void {
    const logEntry: LogEntry = {
      level: LogLevel.INFO,
      type: LogType.PERFORMANCE,
      message: `Performance metrics: ${metrics.duration}ms`,
      timestamp: metrics.timestamp,
      requestId: metrics.requestId,
      endpoint: metrics.endpoint,
      method: metrics.method,
      statusCode: metrics.statusCode,
      duration: metrics.duration,
      metadata: {
        memoryUsage: metrics.memoryUsage,
      },
    }

    this.addLog(logEntry)
  }

  // Log de auditoria
  public logAudit(
    action: string,
    resource: string,
    resourceId?: string,
    userId?: string,
    request?: NextRequest,
    metadata?: Record<string, unknown>
  ): void {
    const logEntry: LogEntry = {
      level: LogLevel.INFO,
      type: LogType.AUDIT,
      message: `Audit: ${action} on ${resource}`,
      timestamp: new Date().toISOString(),
      userId,
      metadata: {
        action,
        resource,
        resourceId,
        ip: request?.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request?.headers.get('user-agent'),
        ...metadata,
      },
    }

    this.addLog(logEntry)
  }

  // Log de segurança
  public logSecurity(
    event: string,
    request: NextRequest,
    userId?: string,
    metadata?: Record<string, unknown>
  ): void {
    const logEntry: LogEntry = {
      level: LogLevel.WARN,
      type: LogType.SECURITY,
      message: `Security event: ${event}`,
      timestamp: new Date().toISOString(),
      userId,
      endpoint: new URL(request.url).pathname,
      method: request.method,
      metadata: {
        event,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent'),
        ...metadata,
      },
    }

    this.addLog(logEntry)
  }

  // Adicionar log
  private addLog(logEntry: LogEntry): void {
    this.logs.push(logEntry)

    // Manter apenas os logs mais recentes
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Em desenvolvimento, log para console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`, logEntry)
    }

    // Em produção, enviar para serviço de logging
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(logEntry)
    }
  }

  // Enviar para serviço externo (Sentry, Logtail, etc.)
  private sendToExternalService(_logEntry: LogEntry): void {
    // Implementar envio para serviço de logging
    // Por exemplo: Sentry, Logtail, CloudWatch, etc.
  }

  // Obter logs
  public getLogs(
    level?: LogLevel,
    type?: LogType,
    limit?: number
  ): LogEntry[] {
    let filteredLogs = this.logs

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level)
    }

    if (type) {
      filteredLogs = filteredLogs.filter(log => log.type === type)
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit)
    }

    return filteredLogs
  }

  // Obter estatísticas
  public getStats(): {
    totalLogs: number
    logsByLevel: Record<LogLevel, number>
    logsByType: Record<LogType, number>
    averageResponseTime: number
    errorRate: number
  } {
    const totalLogs = this.logs.length
    const logsByLevel = {} as Record<LogLevel, number>
    const logsByType = {} as Record<LogType, number>
    let totalResponseTime = 0
    let responseCount = 0
    let errorCount = 0

    for (const log of this.logs) {
      // Contar por nível
      logsByLevel[log.level] = (logsByLevel[log.level] || 0) + 1

      // Contar por tipo
      logsByType[log.type] = (logsByType[log.type] || 0) + 1

      // Calcular tempo de resposta
      if (log.type === LogType.RESPONSE && log.duration) {
        totalResponseTime += log.duration
        responseCount++
      }

      // Contar erros
      if (log.level === LogLevel.ERROR) {
        errorCount++
      }
    }

    return {
      totalLogs,
      logsByLevel,
      logsByType,
      averageResponseTime: responseCount > 0 ? totalResponseTime / responseCount : 0,
      errorRate: totalLogs > 0 ? errorCount / totalLogs : 0,
    }
  }

  // Limpar logs
  public clearLogs(): void {
    this.logs = []
  }
}

// Instância global do logger
export const logger = ApiLogger.getInstance()

// Função para criar middleware de logging
export function createLoggingMiddleware() {
  return (request: NextRequest, requestId: string, userId?: string) => {
    logger.logRequest(request, requestId, userId)
  }
}

// Função para criar wrapper de API com logging
export function withLogging<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>,
  endpoint: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now()
    const requestId = Math.random().toString(36).substring(7)

    try {
      const result = await handler(...args)
      const duration = Date.now() - startTime

      // Log de performance
      logger.logPerformance({
        requestId,
        endpoint,
        method: 'POST', // Assumindo POST para APIs
        duration,
        statusCode: 200,
        timestamp: new Date().toISOString(),
      })

      return result
    } catch (error) {
      const _duration = Date.now() - startTime

      // Log de erro
      if (error instanceof ApiError) {
        logger.logError(error, args[0] as NextRequest, requestId)
      }

      throw error
    }
  }
}

// Função para criar auditoria
export function createAuditLogger(
  action: string,
  resource: string,
  resourceId?: string
) {
  return (userId?: string, request?: NextRequest, metadata?: Record<string, unknown>) => {
    logger.logAudit(action, resource, resourceId, userId, request, metadata)
  }
}

// Função para criar logger de segurança
export function createSecurityLogger(event: string) {
  return (request: NextRequest, userId?: string, metadata?: Record<string, unknown>) => {
    logger.logSecurity(event, request, userId, metadata)
  }
}
