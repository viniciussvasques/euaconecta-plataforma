'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { SEOConfig } from '@/lib/seo-analytics-types'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  article?: {
    publishedTime: string
    modifiedTime: string
    author: string
    section: string
    tags: string[]
  }
}

export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  article
}: SEOHeadProps) {
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSEOConfig()
  }, [])

  const fetchSEOConfig = async () => {
    try {
      const response = await fetch('/api/admin/seo')
      const data = await response.json()
      if (data.success) {
        setSeoConfig(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar configuração SEO:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !seoConfig) {
    return null
  }

  const finalTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle
  const finalDescription = description || seoConfig.defaultDescription
  const finalKeywords = [...(keywords || []), ...seoConfig.defaultKeywords].join(', ')
  const finalImage = image || seoConfig.ogImage
  const finalUrl = url || seoConfig.siteUrl

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content={seoConfig.siteName} />
      <meta name="language" content="pt-BR" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      {seoConfig.twitterHandle && (
        <meta name="twitter:site" content={seoConfig.twitterHandle} />
      )}

      {/* Article specific meta tags */}
      {article && type === 'article' && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.section} />
          {article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Verification tags */}
      {seoConfig.googleSiteVerification && (
        <meta name="google-site-verification" content={seoConfig.googleSiteVerification} />
      )}
      {seoConfig.bingSiteVerification && (
        <meta name="msvalidate.01" content={seoConfig.bingSiteVerification} />
      )}
      {seoConfig.yandexSiteVerification && (
        <meta name="yandex-verification" content={seoConfig.yandexSiteVerification} />
      )}

      {/* Facebook App ID */}
      {seoConfig.facebookAppId && (
        <meta property="fb:app_id" content={seoConfig.facebookAppId} />
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === 'article' ? 'Article' : 'WebSite',
            "name": finalTitle,
            "description": finalDescription,
            "url": finalUrl,
            "image": finalImage,
            "publisher": {
              "@type": "Organization",
              "name": seoConfig.structuredData.organization.name,
              "url": seoConfig.structuredData.organization.url,
              "logo": {
                "@type": "ImageObject",
                "url": seoConfig.structuredData.organization.logo
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": seoConfig.structuredData.organization.contactPoint.telephone,
                "contactType": seoConfig.structuredData.organization.contactPoint.contactType
              },
              "sameAs": seoConfig.structuredData.organization.sameAs
            },
            ...(type === 'article' && article ? {
              "datePublished": article.publishedTime,
              "dateModified": article.modifiedTime,
              "author": {
                "@type": "Person",
                "name": article.author
              },
              "articleSection": article.section,
              "keywords": article.tags.join(', ')
            } : {
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${seoConfig.siteUrl}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          })
        }}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  )
}
