'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package, CheckCircle, Star, Phone, Mail, MapPin, FileText, TrendingUp, Calendar, Eye, Heart } from 'lucide-react'
import { SystemCustomization } from '@/lib/config/system-customization'

interface LandingPageServerProps {
  customization: SystemCustomization
  partners?: Partner[]
}

interface Partner { id: string; name: string; logo: string; link: string; isActive?: boolean }
interface BlogListItem { id: string; slug: string; title: string; excerpt: string; publishedAt: string; views: number; likes: number; isFeatured?: boolean }

const testimonials = [
  {
    name: 'Maria Silva',
    role: 'Empresária',
    content: 'Economizei mais de 60% no frete consolidando meus pedidos da Nike e Adidas. Serviço excepcional!',
    avatar: '/avatars/maria.svg',
    rating: 5,
  },
  {
    name: 'João Santos',
    role: 'Engenheiro',
    content: 'Comprei um MacBook Pro e economizei R$ 2.000 comparado ao preço no Brasil. Recomendo!',
    avatar: '/avatars/joao.svg',
    rating: 5,
  },
  {
    name: 'Ana Costa',
    role: 'Designer',
    content: 'Recebi meus produtos da Amazon em 15 dias. Rastreamento em tempo real e suporte excelente.',
    avatar: '/avatars/ana.svg',
    rating: 5,
  },
]

export function LandingPageServer({ customization, partners: initialPartners = [] }: LandingPageServerProps) {
  const { landingPage, contact, socialMedia } = customization
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [partnersLoading, setPartnersLoading] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogListItem[]>([])
  const [blogLoading, setBlogLoading] = useState(true)

  // Parceiros já carregados no servidor

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`/api/blog?featured=true&limit=3&t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        const data = await response.json()
        if (data.success) {
          setBlogPosts(data.data)
        }
      } catch (error) {
        console.error('Erro ao carregar posts do blog:', error)
      } finally {
        setBlogLoading(false)
      }
    }
    fetchBlogPosts()
  }, [])

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'EuaConecta',
            url: 'https://app.euaconecta.com',
            logo: 'https://app.euaconecta.com/logo.png',
            description: 'Plataforma de compras internacionais dos EUA para o Brasil',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'BR',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: contact?.phone || '+1-555-123-4567',
              contactType: 'customer service',
            },
            sameAs: [
              socialMedia?.instagram || 'https://www.instagram.com/euaconecta',
              socialMedia?.facebook || 'https://www.facebook.com/euaconecta',
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'EuaConecta',
            url: 'https://app.euaconecta.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://app.euaconecta.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EuaConecta
                </span>
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="#como-funciona" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Como Funciona
                </Link>
                <Link href="#beneficios" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Benefícios
                </Link>
                <Link href="#marcas" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Marcas
                </Link>
                <Link href="#depoimentos" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Depoimentos
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link
                  href={landingPage?.hero?.ctaLink || "/auth/register"}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  {landingPage?.hero?.ctaText || "Começar Agora"}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
                <Star className="w-4 h-4 mr-2" />
                Mais de 10.000 clientes satisfeitos
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                {landingPage?.hero?.title || "Compre nos Estados Unidos e receba no Brasil"}
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                {landingPage?.hero?.subtitle || "Nike, Adidas, Amazon, Best Buy, Apple e muito mais! Receba seus produtos de qualquer loja americana em nosso endereço, consolide múltiplos pacotes em uma única remessa e economize até 70% no frete internacional."}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Link
                  href={landingPage?.hero?.ctaLink || "/auth/register"}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center transform hover:scale-105"
                >
                  {landingPage?.hero?.ctaText || "Começar Gratuitamente"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/auth/login"
                  className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-2xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                >
                  Já tenho conta
                </Link>
              </div>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Sem taxa de cadastro
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Suporte 24/7
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Seguro e confiável
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section id="marcas" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Compre das Melhores Marcas Americanas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Acesse milhares de produtos das principais lojas dos Estados Unidos
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
              {partnersLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando parceiros...</p>
                </div>
              ) : (
                partners.map((partner: Partner) => (
                  <a
                    key={partner.id}
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg transition-all border border-gray-200">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 text-center">
                      {partner.name}
                    </span>
                  </a>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Entre em Contato
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Estamos aqui para ajudar você com suas compras internacionais
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Telefone</h3>
                <p className="text-gray-600">{contact?.phone || "+55 (11) 99999-9999"}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">{contact?.email || "contato@euaconecta.com"}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Endereço</h3>
                <p className="text-gray-600">{contact?.address || "São Paulo, SP - Brasil"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Siga-nos nas Redes Sociais
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Acompanhe nossas novidades e promoções
            </p>
            <div className="flex justify-center space-x-6">
              {socialMedia?.whatsapp && (
                <a
                  href={socialMedia.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors group"
                >
                  <Image
                    src="/icons/whatsapp.svg"
                    alt="WhatsApp"
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </a>
              )}
              {socialMedia?.facebook && (
                <a
                  href={socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors group"
                >
                  <Image
                    src="/icons/facebook.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </a>
              )}
              {socialMedia?.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all group"
                >
                  <Image
                    src="/icons/instagram.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="depoimentos" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                O que nossos clientes dizem
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Mais de 10.000 clientes satisfeitos confiam na EuaConecta
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={`${testimonial.name}-${testimonial.role}`} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-6">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-gray-600">{testimonial.role}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">&quot;{testimonial.content}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Blog EuaConecta
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dicas, guias e novidades sobre importação dos EUA
              </p>
            </div>

            {blogLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando posts...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post: BlogListItem) => (
                  <div key={post.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                    {post.isFeatured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-center text-sm font-medium">
                        ⭐ Artigo em Destaque
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">Blog Euaconecta</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes} curtidas
                        </div>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                      >
                        Ler Artigo Completo
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Ver todos os artigos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">EuaConecta</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Sua ponte para as melhores compras dos Estados Unidos.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Serviços</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Consolidação de Pacotes</li>
                  <li>Frete Internacional</li>
                  <li>Rastreamento</li>
                  <li>Suporte 24/7</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Empresa</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="/about" className="hover:text-white transition-colors">
                      Sobre Nós
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="hover:text-white transition-colors">
                      Contato
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="hover:text-white transition-colors">
                      Termos de Uso
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="hover:text-white transition-colors">
                      Política de Privacidade
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
                <div className="space-y-2 text-gray-400">
                  <p>{contact?.phone || "+55 (11) 99999-9999"}</p>
                  <p>{contact?.email || "contato@euaconecta.com"}</p>
                  <p>{contact?.address || "São Paulo, SP - Brasil"}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 EuaConecta. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
