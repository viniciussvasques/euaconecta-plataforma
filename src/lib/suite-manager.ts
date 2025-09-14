import { prisma } from './prisma'

export class SuiteManager {
  private static readonly STARTING_SUITE_NUMBER = 2350

  /**
   * Gera o próximo número de suite disponível
   */
  static async getNextSuiteNumber(): Promise<number> {
    try {
      // Buscar o maior número de suite existente
      const lastUser = await prisma.user.findFirst({
        where: {
          suiteNumber: {
            not: null
          }
        },
        orderBy: {
          suiteNumber: 'desc'
        },
        select: {
          suiteNumber: true
        }
      })

      if (!lastUser || !lastUser.suiteNumber) {
        return this.STARTING_SUITE_NUMBER
      }

      return lastUser.suiteNumber + 1
    } catch (error) {
      console.error('Erro ao gerar próximo número de suite:', error)
      return this.STARTING_SUITE_NUMBER
    }
  }

  /**
   * Atribui um número de suite para um usuário
   */
  static async assignSuiteNumber(userId: string): Promise<number> {
    try {
      const nextSuiteNumber = await this.getNextSuiteNumber()
      
      await prisma.user.update({
        where: { id: userId },
        data: { suiteNumber: nextSuiteNumber }
      })

      return nextSuiteNumber
    } catch (error) {
      console.error('Erro ao atribuir número de suite:', error)
      throw new Error('Erro ao atribuir número de suite')
    }
  }

  /**
   * Remove o número de suite de um usuário
   */
  static async removeSuiteNumber(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { suiteNumber: null }
      })
    } catch (error) {
      console.error('Erro ao remover número de suite:', error)
      throw new Error('Erro ao remover número de suite')
    }
  }

  /**
   * Busca usuário por número de suite
   */
  static async getUserBySuiteNumber(suiteNumber: number) {
    try {
      return await prisma.user.findUnique({
        where: { suiteNumber },
        select: {
          id: true,
          name: true,
          email: true,
          suiteNumber: true,
          isActive: true,
          role: true
        }
      })
    } catch (error) {
      console.error('Erro ao buscar usuário por suite:', error)
      return null
    }
  }

  /**
   * Lista todas as suites ocupadas
   */
  static async getOccupiedSuites() {
    try {
      return await prisma.user.findMany({
        where: {
          suiteNumber: {
            not: null
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          suiteNumber: true,
          isActive: true,
          role: true,
          createdAt: true
        },
        orderBy: {
          suiteNumber: 'asc'
        }
      })
    } catch (error) {
      console.error('Erro ao listar suites ocupadas:', error)
      return []
    }
  }

  /**
   * Verifica se um número de suite está disponível
   */
  static async isSuiteNumberAvailable(suiteNumber: number): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { suiteNumber },
        select: { id: true }
      })
      return !user
    } catch (error) {
      console.error('Erro ao verificar disponibilidade da suite:', error)
      return false
    }
  }

  /**
   * Atribui um número de suite específico (apenas para admins)
   */
  static async assignSpecificSuiteNumber(userId: string, suiteNumber: number): Promise<boolean> {
    try {
      // Verificar se o número está disponível
      const isAvailable = await this.isSuiteNumberAvailable(suiteNumber)
      if (!isAvailable) {
        return false
      }

      await prisma.user.update({
        where: { id: userId },
        data: { suiteNumber }
      })

      return true
    } catch (error) {
      console.error('Erro ao atribuir número específico de suite:', error)
      return false
    }
  }
}
