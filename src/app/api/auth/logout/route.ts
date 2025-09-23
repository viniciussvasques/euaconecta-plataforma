import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'
import { ApiError } from '@/lib/errors/api-error-handler'
import { logger } from '@/lib/logging/winston-config'

export async function POST(request: NextRequest) {
  try {
    // Obter userId da sessão atual - requerido para logout
    let userId: string | null = null
    const sessionCookie = request.cookies.get('session')?.value

    if (!sessionCookie) {
      throw new ApiError(401, 'Sessão não encontrada')
    }

    try {
      const { verifyAccessToken } = await import('@/lib/auth/jwt')
      const payload = await verifyAccessToken(sessionCookie)
      userId = String(payload.sub || '')
      
      if (!userId) {
        throw new ApiError(401, 'ID de usuário não encontrado na sessão')
      }
    } catch (error) {
      // Fallback para cookie legado
      try {
        const legacy = JSON.parse(sessionCookie)
        userId = legacy?.userId || null
        
        if (!userId) {
          throw new ApiError(401, 'ID de usuário não encontrado na sessão legada')
        }
      } catch {
        throw new ApiError(401, 'Sessão inválida')
      }
    }

    // Revogar refresh token se existir
    const refresh = request.cookies.get('refresh_token')?.value
    if (!refresh) {
      logger.warn('Tentativa de logout sem token de refresh', { userId })
    }

    if (refresh && userId) {
      // Buscar apenas tokens do usuário atual
      const userTokens = await prisma.refreshToken.findMany({
        where: {
          userId: userId,
          revokedAt: null
        }
      })
      
      // Usar transação para garantir atomicidade e evitar race conditions
      await prisma.$transaction(async (tx) => {
        // Buscar e verificar tokens sequencialmente para evitar race conditions
        for (const token of userTokens) {
          try {
            const isMatch = await bcrypt.compare(refresh, token.tokenHash)
            if (isMatch) {
              await tx.refreshToken.update({
                where: { id: token.id },
                data: { revokedAt: new Date() }
              })
              logger.info('Token de refresh revogado com sucesso', { userId, tokenId: token.id })
            }
          } catch (err) {
            logger.error('Erro ao verificar token de refresh', { userId, tokenId: token.id, error: err })
          }
        }
      })
    }

    // Registrar sucesso da operação
    logger.info('Logout realizado com sucesso', { 
      userId, 
      action: 'logout', 
      success: true 
    })
    
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    })

    // Limpar cookies de sessão e refresh com configurações seguras
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })
    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    // Logging estruturado do erro
    logger.error('Erro ao processar logout', { 
      error: error instanceof Error ? error.message : String(error),
      userId: typeof error === 'object' && error && 'userId' in error ? error.userId : undefined,
      stack: error instanceof Error ? error.stack : undefined 
    })

    // Retornar erro apropriado
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      )
    }

    // Erro genérico
    return NextResponse.json(
      { success: false, message: 'Erro ao realizar logout' },
      { status: 500 }
    )
  }
}
