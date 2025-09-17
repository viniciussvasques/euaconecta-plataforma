import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let config = await prisma.robotsConfig.findFirst()

    if (!config) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://euaconecta.com'
      config = await prisma.robotsConfig.create({
        data: {
          userAgent: '*',
          allow: ['/'],
          disallow: ['/admin/', '/api/', '/dashboard/boxes/payment-success'],
          crawlDelay: 1,
          sitemap: `${baseUrl}/sitemap.xml`,
          customRules: ''
        }
      })
    }

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error('Erro ao buscar configuração do robots:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
