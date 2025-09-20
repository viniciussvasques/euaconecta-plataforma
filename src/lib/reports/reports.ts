import { prisma } from '../database/prisma'

export interface ReportData {
  id: string
  userId: string
  name: string
  type: string
  parameters: string
  status: string
  resultUrl?: string
  errorMessage?: string
  createdAt: Date
  completedAt?: Date
}

export interface CreateReportData {
  userId: string
  name: string
  type: string
  parameters: Record<string, unknown>
}

export class ReportService {
  // Criar novo relatório
  async create(data: CreateReportData): Promise<ReportData> {
    const report = await prisma.report.create({
      data: {
        ...data,
        parameters: JSON.stringify(data.parameters),
        status: 'PENDING'
      }
    })

    return {
      ...report,
      resultUrl: report.resultUrl || undefined,
      errorMessage: report.errorMessage || undefined,
      completedAt: report.completedAt || undefined
    }
  }

  // Buscar relatório por ID
  async getById(id: string): Promise<ReportData | null> {
    const report = await prisma.report.findUnique({
      where: { id }
    })

    if (!report) return null

    return {
      ...report,
      resultUrl: report.resultUrl || undefined,
      errorMessage: report.errorMessage || undefined,
      completedAt: report.completedAt || undefined
    }
  }

  // Buscar relatórios de um usuário
  async getByUserId(userId: string, limit: number = 50): Promise<ReportData[]> {
    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return reports.map(report => ({
      ...report,
      resultUrl: report.resultUrl || undefined,
      errorMessage: report.errorMessage || undefined,
      completedAt: report.completedAt || undefined
    }))
  }

  // Atualizar status do relatório
  async updateStatus(id: string, status: string, resultUrl?: string, errorMessage?: string): Promise<void> {
    await prisma.report.update({
      where: { id },
      data: {
        status,
        resultUrl,
        errorMessage,
        completedAt: status === 'SHIPPED' ? new Date() : null
      }
    })
  }

  // Deletar relatório
  async delete(id: string): Promise<void> {
    await prisma.report.delete({
      where: { id }
    })
  }

  // Gerar relatório de consolidações
  async generateConsolidationReport(
    userId: string,
    startDate: Date,
    endDate: Date,
    status?: string
  ): Promise<ReportData> {
    const parameters = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status,
      type: 'consolidation'
    }

    return this.create({
      userId,
      name: `Relatório de Consolidações - ${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()}`,
      type: 'consolidation',
      parameters
    })
  }

  // Gerar relatório de armazenamento
  async generateStorageReport(
    userId: string,
    startDate: Date,
    endDate: Date,
    includeOverdue: boolean = true
  ): Promise<ReportData> {
    const parameters = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      includeOverdue,
      type: 'storage'
    }

    return this.create({
      userId,
      name: `Relatório de Armazenamento - ${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()}`,
      type: 'storage',
      parameters
    })
  }

  // Gerar relatório financeiro
  async generateFinancialReport(
    userId: string,
    startDate: Date,
    endDate: Date,
    includeTaxes: boolean = true
  ): Promise<ReportData> {
    const parameters = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      includeTaxes,
      type: 'financial'
    }

    return this.create({
      userId,
      name: `Relatório Financeiro - ${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()}`,
      type: 'financial',
      parameters
    })
  }

  // Gerar relatório de pacotes
  async generatePackagesReport(
    userId: string,
    startDate: Date,
    endDate: Date,
    status?: string
  ): Promise<ReportData> {
    const parameters = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status,
      type: 'packages'
    }

    return this.create({
      userId,
      name: `Relatório de Pacotes - ${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()}`,
      type: 'packages',
      parameters
    })
  }

  // Limpar relatórios antigos
  async cleanupOldReports(daysOld: number = 30): Promise<void> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    await prisma.report.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        status: { in: ['SHIPPED', 'FAILED'] }
      }
    })
  }

  // Buscar relatórios por tipo
  async getByType(type: string, limit: number = 50): Promise<ReportData[]> {
    const reports = await prisma.report.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return reports.map(report => ({
      ...report,
      resultUrl: report.resultUrl || undefined,
      errorMessage: report.errorMessage || undefined,
      completedAt: report.completedAt || undefined
    }))
  }

  // Buscar relatórios por status
  async getByStatus(status: string, limit: number = 50): Promise<ReportData[]> {
    const reports = await prisma.report.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return reports.map(report => ({
      ...report,
      resultUrl: report.resultUrl || undefined,
      errorMessage: report.errorMessage || undefined,
      completedAt: report.completedAt || undefined
    }))
  }

  // Estatísticas de relatórios
  async getReportStats(userId?: string): Promise<{
    total: number
    pending: number
    completed: number
    failed: number
  }> {
    const where = userId ? { userId } : {}

    const [total, pending, completed, failed] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.count({ where: { ...where, status: 'PENDING' } }),
      prisma.report.count({ where: { ...where, status: 'SHIPPED' } }),
      prisma.report.count({ where: { ...where, status: 'FAILED' } })
    ])

    return { total, pending, completed, failed }
  }
}

export const reportService = new ReportService()
