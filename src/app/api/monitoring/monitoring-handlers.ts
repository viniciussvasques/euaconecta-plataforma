/**
 * API routes para monitoramento e healthcheck
 */
import { NextRequest } from 'next/server'
import { alertManager } from '@/lib/monitoring/alert-manager'

import { ApiLogger } from '@/lib/logging/api-logger'
import { externalLogger } from '@/lib/logging/external-logger'

export interface ResponseHelper {
  json: (data: unknown) => Response;
  status: (code: number) => {
    json: (data: unknown) => Response;
  };
}

// Interface para métricas detalhadas
interface DetailedMetrics {
  logs: {
    totalLogs: number
    logsByLevel: Record<string, number>
    logsByType: Record<string, number>
    averageResponseTime: number
    errorRate: number
  }
  system: {
    uptime: number
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
  }
  healthChecks: {
    database: boolean
    redis: boolean
    externalServices: boolean
  }
}

// Interface para status de saúde simplificado
interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: {
    [key: string]: {
      status: 'up' | 'down'
      latency?: number
    }
  }
  timestamp: string
}

// Função para verificar database
async function checkDatabase() {
  const { prisma } = await import('@/lib/database/prisma')
  const startTime = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return {
      status: 'up' as const,
      latency: Date.now() - startTime
    }
  } catch (error) {
    return {
      status: 'down' as const,
      latency: Date.now() - startTime
    }
  }
}

// Função para verificar Redis
async function checkRedis() {
  // TODO: Implementar verificação do Redis
  return {
    status: 'up' as const,
    latency: 0
  }
}

// Função para verificar serviços externos
async function checkExternalServices() {
  try {
    // Verificar conexão com Logtail
    await externalLogger.send({ test: 'healthcheck' })
    return {
      status: 'up' as const,
      latency: 0
    }
  } catch (error) {
    return {
      status: 'down' as const,
      latency: 0
    }
  }
}

// Função para verificar estado de saúde geral
async function getHealthStatus(): Promise<HealthStatus> {
  const [database, redis, externalServices] = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkExternalServices()
  ])

  const checks = {
    database,
    redis,
    externalServices
  }

  // Determinar status geral
  const isUnhealthy = Object.values(checks).some(check => check.status === 'down')
  const isDegraded = Object.values(checks).some(check => check.latency && check.latency > 1000)

  return {
    status: isUnhealthy ? 'unhealthy' : isDegraded ? 'degraded' : 'healthy',
    checks,
    timestamp: new Date().toISOString()
  }
}

// Função para coletar métricas detalhadas
async function getDetailedMetrics(): Promise<DetailedMetrics> {
  const loggerInstance = ApiLogger.getInstance()
  
  return {
    logs: loggerInstance.getStats(),
    system: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    },
    healthChecks: {
      database: (await checkDatabase()).status === 'up',
      redis: (await checkRedis()).status === 'up',
      externalServices: (await checkExternalServices()).status === 'up'
    }
  }
}

// Handler para healthcheck
export async function healthHandler(
  req: NextRequest,
  res: ResponseHelper
): Promise<Response> {
  try {
    const health = await getHealthStatus()

    // Definir status HTTP baseado no estado
    const httpStatus = 
      health.status === 'healthy' ? 200 :
      health.status === 'degraded' ? 500 :
      503

    return res.status(httpStatus).json(health)
  } catch (error) {
    return res.status(503).json({
      status: 'unhealthy',
      checks: {},
      timestamp: new Date().toISOString()
    })
  }
}

// Handler para métricas
export async function metricsHandler(
  req: NextRequest,
  res: ResponseHelper
): Promise<Response> {
  try {
    const metrics = await getDetailedMetrics()

    // Verificar métricas e gerar alertas se necessário
    alertManager.checkMetrics(metrics)

    return res.status(200).json(metrics)
  } catch (error) {
    const errorMetrics: DetailedMetrics = {
      logs: {
        totalLogs: 0,
        logsByLevel: {},
        logsByType: {},
        averageResponseTime: 0,
        errorRate: 1
      },
      system: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      },
      healthChecks: {
        database: false,
        redis: false,
        externalServices: false
      }
    }

    alertManager.checkMetrics(errorMetrics)

    return res.status(500).json(errorMetrics)
  }
}