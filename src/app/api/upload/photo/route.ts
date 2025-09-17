import { NextRequest, NextResponse } from 'next/server'
import { uploadBuffer } from '@/lib/utils/s3'
import crypto from 'crypto'
import { verifyAccessToken } from '@/lib/jwt'
type MinimalSession = { userId: string; role: string }

export async function POST(request: NextRequest) {
  try {
    // Verificar sessão via cookie
    const sessionCookie = request.cookies.get('session')
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    let session: MinimalSession | null = null
    try {
      const payload = await verifyAccessToken(sessionCookie.value)
      session = { userId: String(payload.sub || ''), role: String((payload as unknown as { role?: string }).role || '') }
    } catch {
      try { session = JSON.parse(sessionCookie.value) as MinimalSession } catch { session = null }
    }
    if (!session || !session.userId || !['ADMIN', 'SUPER_ADMIN', 'OPERATOR'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Apenas imagens são permitidas' }, { status: 400 })
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Arquivo muito grande (máximo 5MB)' }, { status: 400 })
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `package-photos/${crypto.randomUUID()}.${fileExtension}`

    // Converter File para Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload para S3/MinIO
    const result = await uploadBuffer(fileName, buffer, file.type)

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        key: result.key
      }
    })

  } catch (error) {
    console.error('Erro no upload da foto:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
