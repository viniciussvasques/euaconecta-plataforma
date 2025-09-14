'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  ExternalLink, 
  Star, 
  ShoppingBag, 
  Truck, 
  Shield,
  Filter,
  Grid,
  List
} from 'lucide-react'

export function PartnerStores() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { id: 'all', name: 'Todas as Categorias' },
    { id: 'electronics', name: 'Eletrônicos' },
    { id: 'fashion', name: 'Moda' },
    { id: 'home', name: 'Casa & Decoração' },
    { id: 'sports', name: 'Esportes' },
    { id: 'beauty', name: 'Beleza' },
    { id: 'books', name: 'Livros' },
    { id: 'automotive', name: 'Automotivo' }
  ]

  const stores = [
    {
      id: 1,
      name: 'Amazon',
      logo: '🛒',
      category: 'electronics',
      description: 'A maior loja online do mundo com milhões de produtos',
      rating: 4.8,
      reviews: 1250000,
      shipping: 'Frete grátis acima de $25',
      warranty: 'Garantia de 30 dias',
      url: 'https://amazon.com',
      featured: true,
      discount: '5% de desconto'
    },
    {
      id: 2,
      name: 'eBay',
      logo: '🏪',
      category: 'electronics',
      description: 'Leilões e compras diretas de produtos novos e usados',
      rating: 4.6,
      reviews: 890000,
      shipping: 'Frete grátis em muitos itens',
      warranty: 'Proteção do comprador',
      url: 'https://ebay.com',
      featured: true,
      discount: '3% de desconto'
    },
    {
      id: 3,
      name: 'Walmart',
      logo: '🏬',
      category: 'home',
      description: 'Supermercado e loja de departamentos com preços baixos',
      rating: 4.5,
      reviews: 750000,
      shipping: 'Frete grátis acima de $35',
      warranty: 'Política de devolução flexível',
      url: 'https://walmart.com',
      featured: false,
      discount: '2% de desconto'
    },
    {
      id: 4,
      name: 'Target',
      logo: '🎯',
      category: 'fashion',
      description: 'Moda, casa e produtos para toda a família',
      rating: 4.4,
      reviews: 420000,
      shipping: 'Frete grátis acima de $35',
      warranty: 'Garantia de satisfação',
      url: 'https://target.com',
      featured: false,
      discount: '4% de desconto'
    },
    {
      id: 5,
      name: 'Best Buy',
      logo: '💻',
      category: 'electronics',
      description: 'Especialista em eletrônicos e tecnologia',
      rating: 4.3,
      reviews: 380000,
      shipping: 'Frete grátis acima de $35',
      warranty: 'Proteção estendida disponível',
      url: 'https://bestbuy.com',
      featured: false,
      discount: '3% de desconto'
    },
    {
      id: 6,
      name: 'Nike',
      logo: '👟',
      category: 'sports',
      description: 'Calçados, roupas e equipamentos esportivos',
      rating: 4.7,
      reviews: 280000,
      shipping: 'Frete grátis em pedidos acima de $50',
      warranty: 'Garantia de qualidade Nike',
      url: 'https://nike.com',
      featured: true,
      discount: '6% de desconto'
    },
    {
      id: 7,
      name: 'Sephora',
      logo: '💄',
      category: 'beauty',
      description: 'Cosméticos, perfumes e produtos de beleza',
      rating: 4.5,
      reviews: 190000,
      shipping: 'Frete grátis acima de $50',
      warranty: 'Política de devolução de 60 dias',
      url: 'https://sephora.com',
      featured: false,
      discount: '4% de desconto'
    },
    {
      id: 8,
      name: 'Barnes & Noble',
      logo: '📚',
      category: 'books',
      description: 'Livros, e-books e produtos educacionais',
      rating: 4.2,
      reviews: 150000,
      shipping: 'Frete grátis acima de $25',
      warranty: 'Garantia de satisfação',
      url: 'https://barnesandnoble.com',
      featured: false,
      discount: '2% de desconto'
    }
  ]

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Lojas Parceiras
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Compre nas melhores lojas com desconto exclusivo
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              💰 Descontos Exclusivos
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar lojas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredStores.length} loja{filteredStores.length !== 1 ? 's' : ''} encontrada{filteredStores.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stores Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredStores.map(store => (
            <Card key={store.id} className={`hover:shadow-lg transition-shadow ${store.featured ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{store.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{store.name}</CardTitle>
                      {store.featured && (
                        <Badge className="mt-1 bg-blue-100 text-blue-800">
                          <Star className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {store.discount}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  {store.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(store.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {store.rating} ({store.reviews.toLocaleString()} avaliações)
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4" />
                    <span>{store.shipping}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>{store.warranty}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  onClick={() => window.open(store.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visitar Loja
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma loja encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
