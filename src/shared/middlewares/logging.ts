import { NextRequest } from 'next/server'

// Níveis de log
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// Interface para log estruturado
export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  userId?: string
  ip?: string
  userAgent?: string
  method?: string
  url?: string
  statusCode?: number
  duration?: number
  action?: string
  error?: {
    name: string
    message: string
    stack?: string
  }
  metadata?: Record<string, unknown>
}

// Logger estruturado
export class StructuredLogger {
  private static instance: StructuredLogger
  private isDevelopment = process.env.NODE_ENV === 'development'

  static getInstance(): StructuredLogger {
    if (!StructuredLogger.instance) {
      StructuredLogger.instance = new StructuredLogger()
    }
    return StructuredLogger.instance
  }

  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      return JSON.stringify(entry, null, 2)
    }
    return JSON.stringify(entry)
  }

  private writeLog(level: LogLevel, entry: LogEntry): void {
    const formatted = this.formatLog(entry)

    switch (level) {
      case LogLevel.ERROR:
        console.error(formatted)
        break
      case LogLevel.WARN:
        console.warn(formatted)
        break
      case LogLevel.INFO:
        console.info(formatted)
        break
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formatted)
        }
        break
    }
  }

  error(message: string, metadata?: Partial<LogEntry>): void {
    this.writeLog(LogLevel.ERROR, {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      ...metadata
    })
  }

  warn(message: string, metadata?: Partial<LogEntry>): void {
    this.writeLog(LogLevel.WARN, {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      ...metadata
    })
  }

  info(message: string, metadata?: Partial<LogEntry>): void {
    this.writeLog(LogLevel.INFO, {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      ...metadata
    })
  }

  debug(message: string, metadata?: Partial<LogEntry>): void {
    this.writeLog(LogLevel.DEBUG, {
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      ...metadata
    })
  }
}

// Instância global do logger
export const logger = StructuredLogger.getInstance()

// Middleware de logging
export function withLogging(
  handler: (request: NextRequest) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const startTime = Date.now()
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Log da requisição
    logger.info('Request received', {
      ip,
      userAgent,
      method: request.method,
      url: request.url
    })

    try {
      const response = await handler(request)
      const duration = Date.now() - startTime

      // Log da resposta bem-sucedida
      logger.info('Request completed', {
        ip,
        method: request.method,
        url: request.url,
        statusCode: response.status,
        duration
      })

      return response
    } catch (_error) {
      const duration = Date.now() - startTime

      // Log do erro
      logger.error('Request failed', {
        ip,
        userAgent,
        method: request.method,
        url: request.url,
        duration,
        error: {
          name: 'UnknownError',
          message: 'Request failed'
        }
      })

      // Re-throw para que o handler de erro global pegue
      throw _error
    }
  }
}

// Middleware de auditoria para ações sensíveis
export function withAudit(
  handler: (request: NextRequest) => Promise<Response>,
  action: string
) {
  return async (request: NextRequest): Promise<Response> => {
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Extrair userId do token JWT se disponível
    let userId: string | undefined
    try {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        // Nota: em produção, validar o token aqui
        // userId = decodedToken.userId
      }
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Ignorar erro de validação de token para auditoria
    }

    logger.info(`Audit: ${action}`, {
      userId,
      ip,
      method: request.method,
      url: request.url,
      action
    })

    return handler(request)
  }
}