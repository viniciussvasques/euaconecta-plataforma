import Link from 'next/link'
import { ArrowRight, Package, Truck, Shield, Globe, Users, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EuaConecta</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Compre nos Estados Unidos e{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                receba no Brasil
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Nike, Adidas, Amazon, Best Buy, Apple e muito mais! Receba seus produtos de qualquer loja americana em nosso endereço, 
              consolide múltiplos pacotes em uma única remessa e economize até 70% no frete internacional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Compre produtos nos Estados Unidos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Das principais marcas americanas e receba na sua casa no Brasil
            </p>
          </div>
          
          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center">
            {/* Nike */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-xl font-bold text-black group-hover:text-gray-700">NIKE</div>
            </div>
            
            {/* Adidas */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-xl font-bold text-black group-hover:text-gray-700">ADIDAS</div>
            </div>
            
            {/* Amazon */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-lg font-bold text-orange-500 group-hover:text-orange-600">amazon</div>
            </div>
            
            {/* Best Buy */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-sm font-bold text-yellow-500 group-hover:text-yellow-600">Best Buy</div>
            </div>
            
            {/* eBay */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-lg font-bold text-blue-600 group-hover:text-blue-700">eBay</div>
            </div>
            
            {/* Apple */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-3xl group-hover:scale-110 transition-transform">🍎</div>
            </div>
            
            {/* Target */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-sm font-bold text-red-600 group-hover:text-red-700">TARGET</div>
            </div>
            
            {/* Walmart */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-sm font-bold text-blue-600 group-hover:text-blue-700">WALMART</div>
            </div>
            
            {/* Costco */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-sm font-bold text-red-600 group-hover:text-red-700">COSTCO</div>
            </div>
            
            {/* Home Depot */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-xs font-bold text-orange-600 group-hover:text-orange-700">Home Depot</div>
            </div>
            
            {/* Macy&apos;s */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-sm font-bold text-red-600 group-hover:text-red-700">MACY&apos;S</div>
            </div>
            
            {/* Sephora */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-sm font-bold text-pink-600 group-hover:text-pink-700">SEPHORA</div>
            </div>
            
            {/* Zara */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-lg font-bold text-black group-hover:text-gray-700">ZARA</div>
            </div>
            
            {/* H&M */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-lg font-bold text-red-600 group-hover:text-red-700">H&M</div>
            </div>
            
            {/* Forever 21 */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-xs font-bold text-pink-600 group-hover:text-pink-700">Forever 21</div>
            </div>
            
            {/* Victoria&apos;s Secret */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-xs font-bold text-pink-600 group-hover:text-pink-700">VS</div>
            </div>
            
            {/* Gap */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-lg font-bold text-blue-600 group-hover:text-blue-700">GAP</div>
            </div>
            
            {/* Old Navy */}
            <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
              <div className="text-xs font-bold text-blue-600 group-hover:text-blue-700">Old Navy</div>
            </div>
          </div>
          
          {/* Additional Brands Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Tecnologia, Eletrônicos e Mais
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center">
              {/* Microsoft */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-sm font-bold text-blue-600 group-hover:text-blue-700">Microsoft</div>
              </div>
              
              {/* Google */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-sm font-bold text-blue-500 group-hover:text-blue-600">Google</div>
              </div>
              
              {/* Samsung */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-sm font-bold text-blue-600 group-hover:text-blue-700">Samsung</div>
              </div>
              
              {/* Sony */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-lg font-bold text-black group-hover:text-gray-700">SONY</div>
              </div>
              
              {/* LG */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-lg font-bold text-red-600 group-hover:text-red-700">LG</div>
              </div>
              
              {/* Dell */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-lg font-bold text-blue-600 group-hover:text-blue-700">DELL</div>
              </div>
              
              {/* HP */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-lg font-bold text-blue-600 group-hover:text-blue-700">HP</div>
              </div>
              
              {/* Lenovo */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-sm font-bold text-red-600 group-hover:text-red-700">Lenovo</div>
              </div>
              
              {/* Asus */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-lg font-bold text-black group-hover:text-gray-700">ASUS</div>
              </div>
              
              {/* Acer */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-lg font-bold text-green-600 group-hover:text-green-700">ACER</div>
              </div>
              
              {/* Razer */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-lg font-bold text-green-600 group-hover:text-green-700">RAZER</div>
              </div>
              
              {/* Corsair */}
              <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-28 h-28 group hover:scale-105">
                <div className="text-sm font-bold text-yellow-600 group-hover:text-yellow-700">Corsair</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              E muitas outras marcas americanas que você ama!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Começar a Comprar
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a EuaConecta?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos a solução mais completa e econômica para suas compras internacionais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Consolidação Inteligente</h3>
              <p className="text-gray-600">
                Combine múltiplos pacotes em uma única remessa e reduza drasticamente os custos de envio.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Frete Otimizado</h3>
              <p className="text-gray-600">
                Compare preços entre diferentes transportadoras e escolha a opção mais econômica.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Segurança Total</h3>
              <p className="text-gray-600">
                Seus pacotes são armazenados com segurança e segurados contra perdas e danos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Endereço Americano</h3>
              <p className="text-gray-600">
                Receba produtos de qualquer loja americana que não entrega no Brasil.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Suporte 24/7</h3>
              <p className="text-gray-600">
                Nossa equipe está sempre disponível para ajudar com qualquer dúvida.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Processamento Rápido</h3>
              <p className="text-gray-600">
                Processamos e enviamos seus pacotes em até 24 horas após a consolidação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Pronto para começar a economizar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de clientes que já economizam com nossos serviços
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Criar Conta Gratuita
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
            >
              Fazer Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EuaConecta</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 EuaConecta. Todos os direitos reservados.</p>
              <p className="text-sm mt-1">Sua ponte para as melhores ofertas americanas</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}