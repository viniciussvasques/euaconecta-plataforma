import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://euaconecta.com'
    let siteUrl = baseUrl

    // Buscar configurações SEO apenas se o banco estiver disponível
    try {
      const seo = await prisma.systemCustomization.findUnique({ where: { key: 'seo_config' } })
      siteUrl = (seo?.value as { siteUrl?: string })?.siteUrl || baseUrl
    } catch {
      // Se o banco não estiver disponível, usar URL padrão
      // Usar URL padrão quando banco de dados não estiver disponível
    }

    // Gerar robots.txt
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/boxes/payment-success
Disallow: /auth/reset
Disallow: /auth/activated

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Allow important pages
Allow: /blog/
Allow: /dashboard/
Allow: /auth/login
Allow: /auth/register`

    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    })
  } catch (error) {
    // Erro ao gerar robots.txt, retornar robots.txt padrão
    return new NextResponse('Erro ao gerar robots.txt', { status: 500 })
  }
}
