'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Play, 
  BookOpen, 
  ShoppingBag, 
  Package, 
  Truck, 
  CreditCard,
  Shield,
  HelpCircle,
  ExternalLink,
  Clock,
  Star,
  Filter,
  Grid,
  List
} from 'lucide-react'

export function TutorialsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { id: 'all', name: 'Todos os Tutoriais' },
    { id: 'getting-started', name: 'Primeiros Passos' },
    { id: 'shopping', name: 'Como Comprar' },
    { id: 'shipping', name: 'Envio e Entrega' },
    { id: 'payments', name: 'Pagamentos' },
    { id: 'troubleshooting', name: 'Solução de Problemas' },
    { id: 'tips', name: 'Dicas e Truques' }
  ]

  const tutorials = [
    {
      id: 1,
      title: 'Como começar a importar com a Euaconecta',
      description: 'Guia completo para novos usuários: desde o cadastro até o primeiro envio',
      category: 'getting-started',
      type: 'video',
      duration: '8 min',
      difficulty: 'Iniciante',
      rating: 4.9,
      views: 12500,
      featured: true,
      thumbnail: '🎬',
      content: 'Aprenda os passos básicos para começar a importar produtos dos EUA com segurança e economia.'
    },
    {
      id: 2,
      title: 'Onde comprar nos EUA: Melhores lojas',
      description: 'Lista das melhores lojas americanas com dicas de compra e economia',
      category: 'shopping',
      type: 'article',
      duration: '12 min',
      difficulty: 'Iniciante',
      rating: 4.8,
      views: 8900,
      featured: true,
      thumbnail: '🛍️',
      content: 'Descubra as melhores lojas americanas para comprar produtos com qualidade e preços competitivos.'
    },
    {
      id: 3,
      title: 'Como consolidar seus pacotes',
      description: 'Aprenda a juntar vários pacotes em uma única caixa para economizar no frete',
      category: 'shipping',
      type: 'video',
      duration: '6 min',
      difficulty: 'Intermediário',
      rating: 4.7,
      views: 15600,
      featured: false,
      thumbnail: '📦',
      content: 'Técnicas avançadas para consolidar pacotes e reduzir custos de envio.'
    },
    {
      id: 4,
      title: 'Formas de pagamento aceitas',
      description: 'Conheça todas as opções de pagamento disponíveis na plataforma',
      category: 'payments',
      type: 'article',
      duration: '5 min',
      difficulty: 'Iniciante',
      rating: 4.6,
      views: 7200,
      featured: false,
      thumbnail: '💳',
      content: 'Informações completas sobre métodos de pagamento, taxas e prazos.'
    },
    {
      id: 5,
      title: 'Como rastrear seus envios',
      description: 'Acompanhe seus pacotes desde a compra até a entrega',
      category: 'shipping',
      type: 'video',
      duration: '4 min',
      difficulty: 'Iniciante',
      rating: 4.8,
      views: 9800,
      featured: false,
      thumbnail: '🚚',
      content: 'Aprenda a usar o sistema de rastreamento para acompanhar seus envios em tempo real.'
    },
    {
      id: 6,
      title: 'Dicas para economizar no frete',
      description: 'Estratégias comprovadas para reduzir custos de envio',
      category: 'tips',
      type: 'article',
      duration: '10 min',
      difficulty: 'Intermediário',
      rating: 4.9,
      views: 11200,
      featured: true,
      thumbnail: '💰',
      content: 'Dicas valiosas para economizar dinheiro nos custos de envio e importação.'
    },
    {
      id: 7,
      title: 'Problemas comuns e soluções',
      description: 'Resolução dos problemas mais frequentes na importação',
      category: 'troubleshooting',
      type: 'article',
      duration: '15 min',
      difficulty: 'Intermediário',
      rating: 4.5,
      views: 6800,
      featured: false,
      thumbnail: '🔧',
      content: 'Soluções para os problemas mais comuns que podem ocorrer durante o processo de importação.'
    },
    {
      id: 8,
      title: 'Segurança na importação',
      description: 'Como proteger seus produtos e dados durante o processo',
      category: 'tips',
      type: 'video',
      duration: '7 min',
      difficulty: 'Iniciante',
      rating: 4.7,
      views: 5400,
      featured: false,
      thumbnail: '🛡️',
      content: 'Medidas de segurança essenciais para proteger seus produtos e informações pessoais.'
    }
  ]

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800'
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800'
      case 'Avançado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'video' ? <Play className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Tutoriais e Dicas
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Aprenda a importar com segurança e economia
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              📚 Centro de Aprendizado
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {tutorials.length}
              </div>
              <div className="text-sm text-gray-600">Tutoriais Disponíveis</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                4.8
              </div>
              <div className="text-sm text-gray-600">Avaliação Média</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                85K+
              </div>
              <div className="text-sm text-gray-600">Visualizações</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-600">Suporte</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar tutoriais..."
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
            {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 'is' : ''} encontrado{filteredTutorials.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Tutorials Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredTutorials.map(tutorial => (
            <Card key={tutorial.id} className={`hover:shadow-lg transition-shadow ${tutorial.featured ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{tutorial.thumbnail}</div>
                    <div>
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      {tutorial.featured && (
                        <Badge className="mt-1 bg-blue-100 text-blue-800">
                          <Star className="h-3 w-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    {getTypeIcon(tutorial.type)}
                    <span className="text-sm">{tutorial.type === 'video' ? 'Vídeo' : 'Artigo'}</span>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {tutorial.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{tutorial.duration}</span>
                  </div>
                  <Badge className={getDifficultyColor(tutorial.difficulty)}>
                    {tutorial.difficulty}
                  </Badge>
                </div>

                {/* Rating and Views */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-600">{tutorial.rating}</span>
                  </div>
                  <span className="text-gray-500">{tutorial.views.toLocaleString()} visualizações</span>
                </div>

                {/* Action Button */}
                <Button className="w-full">
                  {tutorial.type === 'video' ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Assistir Tutorial
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ler Artigo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum tutorial encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Precisa de mais ajuda?
          </h3>
          <p className="text-gray-600 mb-6">
            Nossa equipe de suporte está sempre pronta para ajudar você
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => window.open('/dashboard/support', '_self')}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Central de Ajuda
            </Button>
            <Button onClick={() => window.open('/dashboard/stores', '_self')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Lojas Parceiras
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
