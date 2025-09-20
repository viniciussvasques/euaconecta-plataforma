export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  featuredImage?: string
  status: 'draft' | 'published' | 'archived'
  isFeatured: boolean
  views: number
  likes: number
  publishedAt: string
  createdAt: string
  updatedAt: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
  postCount: number
}

export interface BlogComment {
  id: string
  postId: string
  author: string
  email: string
  content: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: 'dicas-importacao',
    name: 'Dicas de Importação',
    slug: 'dicas-importacao',
    description: 'Estratégias e dicas para importar com sucesso',
    color: 'bg-blue-100 text-blue-800',
    postCount: 0
  },
  {
    id: 'guias-compras',
    name: 'Guias de Compras',
    slug: 'guias-compras',
    description: 'Como comprar nas melhores lojas americanas',
    color: 'bg-green-100 text-green-800',
    postCount: 0
  },
  {
    id: 'economia-frete',
    name: 'Economia e Frete',
    slug: 'economia-frete',
    description: 'Dicas para economizar no frete internacional',
    color: 'bg-yellow-100 text-yellow-800',
    postCount: 0
  },
  {
    id: 'tendencias-moda',
    name: 'Tendências de Moda',
    slug: 'tendencias-moda',
    description: 'As últimas tendências da moda americana',
    color: 'bg-pink-100 text-pink-800',
    postCount: 0
  },
  {
    id: 'novidades-plataforma',
    name: 'Novidades da Plataforma',
    slug: 'novidades-plataforma',
    description: 'Atualizações e melhorias da Euaconecta',
    color: 'bg-purple-100 text-purple-800',
    postCount: 0
  }
]
