import { cookies } from 'next/headers'

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

    const sessionData = JSON.parse(sessionCookie.value)
    return sessionData
  } catch (error) {
    console.error('Erro ao obter sessão:', error)
    return null
  }
}

export async function setSession(sessionData: Session) {
  try {
    const cookieStore = await cookies()
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
