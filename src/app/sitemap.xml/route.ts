import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/prisma'

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
      console.log('Usando URL padrão para sitemap (banco não disponível)')
    }

    // Páginas estáticas
    const staticPages = [
      { url: '/', priority: 1.0, changeFreq: 'daily' },
      { url: '/auth/login', priority: 0.8, changeFreq: 'monthly' },
      { url: '/auth/register', priority: 0.8, changeFreq: 'monthly' },
      { url: '/dashboard', priority: 0.9, changeFreq: 'daily' },
      { url: '/blog', priority: 0.8, changeFreq: 'weekly' },
      { url: '/dashboard/packages', priority: 0.7, changeFreq: 'daily' },
      { url: '/dashboard/boxes', priority: 0.7, changeFreq: 'daily' },
      { url: '/dashboard/stores', priority: 0.6, changeFreq: 'weekly' },
      { url: '/dashboard/tutorials', priority: 0.6, changeFreq: 'weekly' }
    ]

    // Posts do blog
    const blogPosts: Array<{ slug: string; updatedAt: string }> = []

    const blogPages = blogPosts.map(post => ({
      url: `/blog/${post.slug}`,
      priority: 0.7,
      changeFreq: 'monthly',
      lastModified: post.updatedAt
    }))

    // Gerar XML do sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${blogPages.map(page => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${new Date(page.lastModified).toISOString()}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return new NextResponse('Erro ao gerar sitemap', { status: 500 })
  }
}
