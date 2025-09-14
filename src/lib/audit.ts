import { prisma } from './prisma'

export interface AuditLogData {
  id: string
  userId?: string
  action: string
  entityType: string
  entityId: string
  oldValues?: string
  newValues?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export interface CreateAuditLogData {
  userId?: string
  action: string
  entityType: string
  entityId: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

export class AuditService {
  // Criar log de auditoria
  async create(data: CreateAuditLogData): Promise<AuditLogData> {
    const auditLog = await prisma.auditLog.create({
      data: {
        ...data,
        oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
        newValues: data.newValues ? JSON.stringify(data.newValues) : null,
      }
    })
    
    return {
      ...auditLog,
      userId: auditLog.userId || undefined,
      oldValues: auditLog.oldValues || undefined,
      newValues: auditLog.newValues || undefined,
      ipAddress: auditLog.ipAddress || undefined,
      userAgent: auditLog.userAgent || undefined,
    }
  }

  // Log de criação
  async logCreate(
    userId: string,
    entityType: string,
    entityId: string,
    newValues: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogData> {
    return this.create({
      userId,
      action: 'CREATE',
      entityType,
      entityId,
      newValues,
      ipAddress,
      userAgent
    })
  }

  // Log de atualização
  async logUpdate(
    userId: string,
    entityType: string,
    entityId: string,
    oldValues: Record<string, unknown>,
    newValues: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogData> {
    return this.create({
      userId,
      action: 'UPDATE',
      entityType,
      entityId,
      oldValues,
      newValues,
      ipAddress,
      userAgent
    })
  }

  // Log de exclusão
  async logDelete(
    userId: string,
    entityType: string,
    entityId: string,
    oldValues: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogData> {
    return this.create({
      userId,
      action: 'DELETE',
      entityType,
      entityId,
      oldValues,
      ipAddress,
      userAgent
    })
  }

  // Log de ação customizada
  async logAction(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    additionalData?: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogData> {
    return this.create({
      userId,
      action,
      entityType,
      entityId,
      newValues: additionalData,
      ipAddress,
      userAgent
    })
  }

  // Buscar logs por usuário
  async getByUserId(userId: string, limit: number = 100): Promise<AuditLogData[]> {
    const logs = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit
    })
    
    return logs.map(log => ({
      ...log,
      userId: log.userId || undefined,
      oldValues: log.oldValues || undefined,
      newValues: log.newValues || undefined,
      ipAddress: log.ipAddress || undefined,
      userAgent: log.userAgent || undefined
    }))
  }

  // Buscar logs por entidade
  async getByEntity(entityType: string, entityId: string): Promise<AuditLogData[]> {
    const logs = await prisma.auditLog.findMany({
      where: { 
        entityType,
        entityId
      },
      orderBy: { timestamp: 'desc' }
    })
    
    return logs.map(log => ({
      ...log,
      userId: log.userId || undefined,
      oldValues: log.oldValues || undefined,
      newValues: log.newValues || undefined,
      ipAddress: log.ipAddress || undefined,
      userAgent: log.userAgent || undefined
    }))
  }

  // Buscar logs por ação
  async getByAction(action: string, limit: number = 100): Promise<AuditLogData[]> {
    const logs = await prisma.auditLog.findMany({
      where: { action },
      orderBy: { timestamp: 'desc' },
      take: limit
    })
    
    return logs.map(log => ({
      ...log,
      userId: log.userId || undefined,
      oldValues: log.oldValues || undefined,
      newValues: log.newValues || undefined,
      ipAddress: log.ipAddress || undefined,
      userAgent: log.userAgent || undefined
    }))
  }

  // Buscar logs por período
  async getByDateRange(
    startDate: Date,
    endDate: Date,
    limit: number = 100
  ): Promise<AuditLogData[]> {
    const logs = await prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    })
    
    return logs.map(log => ({
      ...log,
      userId: log.userId || undefined,
      oldValues: log.oldValues || undefined,
      newValues: log.newValues || undefined,
      ipAddress: log.ipAddress || undefined,
      userAgent: log.userAgent || undefined
    }))
  }

  // Limpar logs antigos
  async cleanupOldLogs(daysOld: number = 90): Promise<void> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)
    
    await prisma.auditLog.deleteMany({
      where: {
        timestamp: { lt: cutoffDate }
      }
    })
  }

  // Buscar histórico de mudanças de uma entidade
  async getEntityHistory(entityType: string, entityId: string): Promise<AuditLogData[]> {
    const logs = await prisma.auditLog.findMany({
      where: { 
        entityType,
        entityId
      },
      orderBy: { timestamp: 'asc' }
    })
    
    return logs.map(log => ({
      ...log,
      userId: log.userId || undefined,
      oldValues: log.oldValues || undefined,
      newValues: log.newValues || undefined,
      ipAddress: log.ipAddress || undefined,
      userAgent: log.userAgent || undefined
    }))
  }

  // Verificar se uma entidade foi modificada por um usuário específico
  async hasUserModifiedEntity(
    userId: string,
    entityType: string,
    entityId: string
  ): Promise<boolean> {
    const count = await prisma.auditLog.count({
      where: {
        userId,
        entityType,
        entityId,
        action: { in: ['CREATE', 'UPDATE', 'DELETE'] }
      }
    })
    
    return count > 0
  }
}

export const auditService = new AuditService()
