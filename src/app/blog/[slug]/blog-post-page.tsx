'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Eye,
  Heart,
  Tag,
  ArrowLeft,
  Share2,
  BookOpen,
  User,
  Clock
} from 'lucide-react'
import { BlogPost, BLOG_CATEGORIES } from '@/lib/blog/blog-types'

export function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPost = async (slug: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blog/${slug}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      if (data.success) {
        setPost(data.data)
        setLikesCount(data.data.likes)
        fetchRelatedPosts(data.data.category, data.data.id)
      }
    } catch (error) {
      console.error('Erro ao carregar post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (category: string, currentPostId: string) => {
    try {
      const response = await fetch(`/api/blog?category=${category}&limit=3&t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      if (data.success) {
        // Filtrar o post atual
        const related = data.data.filter((p: BlogPost) => p.id !== currentPostId)
        setRelatedPosts(related.slice(0, 3))
      }
    } catch (error) {
      console.error('Erro ao carregar posts relacionados:', error)
    }
  }

  const getCategoryColor = (categoryId: string) => {
    const category = BLOG_CATEGORIES.find(c => c.id === categoryId)
    return category?.color || 'bg-gray-100 text-gray-800'
  }

  const getCategoryName = (categoryId: string) => {
    const category = BLOG_CATEGORIES.find(c => c.id === categoryId)
    return category?.name || categoryId
  }

  const handleLike = async () => {
    if (!post) return

    try {
      const response = await fetch(`/api/blog/${post.slug}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setLiked(!liked)
        setLikesCount(prev => liked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      console.error('Erro ao curtir post:', error)
    }
  }

  const handleShare = async () => {
    if (!post) return

    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copiar para clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copiado para a área de transferência!')
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
    }
  }

  const formatContent = (content: string) => {
    // Converter markdown básico para HTML
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/^(?!<[h|l])/gim, '<p class="mb-4">')
      .replace(/(<li.*<\/li>)/gim, '<ul class="list-disc ml-6 mb-4">$1</ul>')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
          <p className="text-gray-600 mb-6">O post que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/blog">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Blog
              </Button>
            </Link>
            <Badge className={getCategoryColor(post.category)}>
              {getCategoryName(post.category)}
            </Badge>
            {post.isFeatured && (
              <Badge className="bg-yellow-400 text-yellow-900">
                ⭐ Destaque
              </Badge>
            )}
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <Eye className="h-4 w-4" />
              {post.views} visualizações
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <Heart className="h-4 w-4" />
              {post.likes} curtidas
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <Clock className="h-4 w-4" />
              {Math.ceil(post.content.split(' ').length / 200)} min de leitura
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
              <CardContent className="p-16">
                <div
                  className="prose prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-4xl prose-h1:mb-8 prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 prose-li:text-lg prose-li:mb-2 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg"
                  dangerouslySetInnerHTML={{
                    __html: formatContent(post.content)
                  }}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            {post.tags.length > 0 && (
              <Card className="mt-8 shadow-lg border-0 rounded-xl">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Tag className="h-5 w-5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Share */}
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg rounded-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Gostou do artigo?</h3>
                  <p className="text-gray-600 mb-8 text-lg">Compartilhe com seus amigos e ajude outros a economizarem também!</p>
                  <div className="flex justify-center gap-6">
                    <Button
                      onClick={handleShare}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Compartilhar
                    </Button>
                    <Button
                      onClick={handleLike}
                      variant="outline"
                      className={`border-pink-300 hover:bg-pink-50 px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${liked ? 'text-pink-600 bg-pink-50 border-pink-400' : 'text-pink-600'}`}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${liked ? 'fill-current' : ''}`} />
                      Curtir ({likesCount})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card className="mb-6 shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BookOpen className="h-5 w-5" />
                    Posts Relacionados
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {relatedPosts.map(relatedPost => (
                    <div key={relatedPost.id} className="border-b pb-4 last:border-b-0">
                      <Link href={`/blog/${relatedPost.slug}`} className="block hover:text-blue-600 transition-colors">
                        <h4 className="font-medium text-sm mb-2 line-clamp-2 text-gray-900">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(relatedPost.publishedAt).toLocaleDateString('pt-BR')}
                          <Eye className="h-3 w-3 ml-2" />
                          {relatedPost.views}
                        </div>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                <CardTitle className="text-white">Categorias</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {BLOG_CATEGORIES.map(category => (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                        {category.postCount}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
