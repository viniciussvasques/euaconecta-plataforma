import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://euaconecta.com'

    // Buscar configurações SEO
    const seo = await prisma.systemCustomization.findUnique({ where: { key: 'seo_config' } })
    const siteUrl = (seo?.value as { siteUrl?: string })?.siteUrl || baseUrl

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
    console.error('Erro ao gerar robots.txt:', error)
    return new NextResponse('Erro ao gerar robots.txt', { status: 500 })
  }
}
