// import { prisma } from '@/lib/prisma'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  category: string
  tags: string[]
  views: number
  likes: number
  isFeatured: boolean
}

// Simulação de dados do blog (em produção seria do banco)
const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Como Economizar no Frete Internacional',
    slug: 'como-economizar-frete-internacional',
    excerpt: 'Dicas práticas para reduzir custos de envio dos EUA para o Brasil',
    content: 'Conteúdo completo do artigo...',
    author: 'EuaConecta Team',
    publishedAt: '2024-01-15',
    category: 'Dicas',
    tags: ['frete', 'economia', 'dicas'],
    views: 1250,
    likes: 45,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Guia Completo de Consolidação de Pacotes',
    slug: 'guia-consolidacao-pacotes',
    excerpt: 'Aprenda como consolidar seus pedidos para economizar no frete',
    content: 'Conteúdo completo do artigo...',
    author: 'EuaConecta Team',
    publishedAt: '2024-01-10',
    category: 'Guia',
    tags: ['consolidação', 'guia', 'pacotes'],
    views: 980,
    likes: 32,
    isFeatured: true
  },
  {
    id: '3',
    title: 'Melhores Lojas Americanas para Comprar',
    slug: 'melhores-lojas-americanas',
    excerpt: 'Descubra as melhores lojas dos EUA para suas compras',
    content: 'Conteúdo completo do artigo...',
    author: 'EuaConecta Team',
    publishedAt: '2024-01-05',
    category: 'Lojas',
    tags: ['lojas', 'compras', 'recomendações'],
    views: 750,
    likes: 28,
    isFeatured: false
  }
]

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Em produção, buscar do banco de dados
  // return await prisma.blogPost.findMany({
  //   orderBy: { publishedAt: 'desc' }
  // })

  return BLOG_POSTS.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Em produção, buscar do banco de dados
  // const post = await prisma.blogPost.findUnique({ where: { slug } })

  return BLOG_POSTS.find(post => post.slug === slug) || null
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  // Em produção, buscar do banco de dados
  // return await prisma.blogPost.findMany({
  //   where: { category },
  //   orderBy: { publishedAt: 'desc' }
  // })

  return BLOG_POSTS.filter(post => post.category === category)
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  // Em produção, buscar do banco de dados
  // return await prisma.blogPost.findMany({
  //   where: { isFeatured: true },
  //   orderBy: { publishedAt: 'desc' }
  // })

  return BLOG_POSTS.filter(post => post.isFeatured)
}

export async function updateBlogPostLikes(slug: string, newLikes: number): Promise<void> {
  // Em produção, atualizar no banco de dados
  // await prisma.blogPost.update({
  //   where: { slug },
  //   data: { likes: newLikes }
  // })

  const post = BLOG_POSTS.find(p => p.slug === slug)
  if (post) {
    post.likes = newLikes
  }
}












