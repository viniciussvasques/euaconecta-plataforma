import { NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

export async function GET() {
  try {
    const config = await configService.getSystemConfig()
    const customCSS = configService.generateCustomCSS(config)

    return new NextResponse(customCSS, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=300', // Cache por 5 minutos
      },
    })
  } catch (error) {
    console.error('Erro ao gerar CSS customizado:', error)
    return new NextResponse('/* Erro ao carregar estilos customizados */', {
      status: 500,
      headers: {
        'Content-Type': 'text/css',
      },
    })
  }
}
