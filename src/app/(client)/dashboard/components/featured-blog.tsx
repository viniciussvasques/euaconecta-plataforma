"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Calendar, Eye, Heart, ExternalLink, TrendingUp } from 'lucide-react'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  featuredImage?: string
  isFeatured: boolean
  views: number
  likes: number
  publishedAt: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

export function FeaturedBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/blog?featured=true&limit=3&t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        const data = await response.json()

        if (response.ok && data.success) {
          setPosts(data.data)
        }
      } catch (error) {
        console.error('Erro ao carregar posts do blog:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Artigos em Destaque</h3>
          <p className="text-gray-500 text-sm mb-4">
            Nenhum artigo disponível no momento
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-500 font-medium text-sm"
          >
            Ver blog completo
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Artigos em Destaque</h3>
            <p className="text-sm text-gray-500">Últimas novidades do blog</p>
          </div>
        </div>
        <Link
          href="/blog"
          className="text-sm text-green-600 hover:text-green-500 font-medium"
        >
          Ver blog
        </Link>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:border-green-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow">
                <FileText className="h-6 w-6 text-green-600" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    <span>{post.views}</span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Heart className="h-3 w-3 fill-red-400 text-red-400" />
                    <span>{post.likes}</span>
                  </div>

                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Ler artigo
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

