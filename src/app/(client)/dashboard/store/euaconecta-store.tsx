'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ShoppingBag, 
  Gift, 
  Star, 
  Truck, 
  Shield, 
  Clock, 
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react'

export function EuaconectaStore() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const features = [
    {
      icon: <Gift className="h-6 w-6" />,
      title: "Ofertas Exclusivas",
      description: "Descontos especiais apenas para nossos clientes"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Frete Grátis",
      description: "Entrega gratuita para todo o Brasil"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Garantia Total",
      description: "Proteção completa em todas as compras"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Entrega Rápida",
      description: "Receba seus produtos em até 7 dias úteis"
    }
  ]

  const categories = [
    { name: "Eletrônicos", count: "50+ produtos", color: "bg-blue-100 text-blue-800" },
    { name: "Moda", count: "30+ produtos", color: "bg-pink-100 text-pink-800" },
    { name: "Casa & Decoração", count: "25+ produtos", color: "bg-green-100 text-green-800" },
    { name: "Esportes", count: "20+ produtos", color: "bg-orange-100 text-orange-800" },
    { name: "Beleza", count: "15+ produtos", color: "bg-purple-100 text-purple-800" },
    { name: "Livros", count: "40+ produtos", color: "bg-yellow-100 text-yellow-800" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Loja Euaconecta
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Em breve você terá acesso a ofertas exclusivas
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              🚀 Em Construção
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Coming Soon Card */}
            <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-900 flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6" />
                  Em Breve!
                </CardTitle>
                <CardDescription className="text-lg text-blue-700">
                  Estamos preparando algo incrível para você
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Nossa loja está sendo desenvolvida com muito carinho para oferecer 
                  a melhor experiência de compra para nossos clientes.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Previsão de lançamento: Dezembro 2024</span>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">O que você pode esperar</CardTitle>
                <CardDescription>
                  Benefícios exclusivos para clientes Euaconecta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Categorias em Destaque</CardTitle>
                <CardDescription>
                  Uma prévia do que estará disponível
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category, index) => (
                    <div key={index} className="p-4 rounded-lg border-2 border-dashed border-gray-200 text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${category.color}`}>
                        {category.name}
                      </div>
                      <p className="text-sm text-gray-500">{category.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Newsletter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Seja o Primeiro a Saber
                </CardTitle>
                <CardDescription>
                  Receba notificações sobre o lançamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Seu e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSubscribe}
                  className="w-full"
                  disabled={!email || isSubscribed}
                >
                  {isSubscribed ? '✅ Cadastrado!' : 'Quero ser notificado'}
                </Button>
                {isSubscribed && (
                  <p className="text-sm text-green-600 text-center">
                    Obrigado! Você será notificado quando a loja estiver pronta.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Entre em Contato</CardTitle>
                <CardDescription>
                  Dúvidas sobre a loja? Fale conosco!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-sm text-gray-600">loja@euaconecta.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-600">+55 (11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-sm text-gray-600">Miami, FL - EUA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Links Úteis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a 
                  href="/dashboard/support" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Central de Ajuda
                </a>
                <a 
                  href="/dashboard/tutorials" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Tutoriais
                </a>
                <a 
                  href="/dashboard/stores" 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Lojas Parceiras
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
