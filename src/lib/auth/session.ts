/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers'
import { verifyAccessToken } from './jwt'

export interface Session {
  userId: string
  email: string
  name: string
  role: string
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return null
    }
    // Tentar JWT primeiro
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      return {
        userId: String(payload.sub || ''),
        email: String((payload as any).email || ''),
        name: String((payload as any).name || ''),
        role: String((payload as any).role || '')
      }
    } catch {
      // Fallback legado (cookie JSON)
      try {
        const legacy = JSON.parse(sessionCookie.value)
        if (legacy?.userId) return legacy as Session
      } catch {}
      return null
    }
  } catch (error) {
    console.error('Erro ao obter sessão:', error)
    return null
  }
}

export async function setSession(sessionData: Session) {
  try {
    const cookieStore = await cookies()
    // Manter compatibilidade de escrita se necessário (uso legado)
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    })
  } catch (error) {
    console.error('Erro ao definir sessão:', error)
  }
}

export async function clearSession() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('session')
  } catch (error) {
    console.error('Erro ao limpar sessão:', error)
  }
}
