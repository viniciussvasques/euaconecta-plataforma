import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Termos de Uso - EuaConecta',
  description: 'Termos de Uso da plataforma EuaConecta para redirecionamento e consolidação de compras dos EUA para o Brasil.',
  robots: 'index, follow',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Termos de Uso</h1>
            <p className="text-blue-100 mt-2">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="px-6 py-8">
            <div className="prose prose-lg max-w-none">

              {/* Seção 1 - Aceitação dos Termos */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">1</Badge>
                  Aceitação dos Termos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Ao acessar e utilizar a plataforma EuaConecta, você concorda em cumprir e estar vinculado aos presentes Termos de Uso.
                  Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
                </p>
              </section>

              {/* Seção 2 - Definições */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">2</Badge>
                  Definições
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">EuaConecta</h3>
                    <p className="text-gray-700">Refere-se à plataforma de redirecionamento e consolidação de compras dos EUA para o Brasil.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Usuário/Cliente</h3>
                    <p className="text-gray-700">Pessoa física ou jurídica que utiliza os serviços da plataforma.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Pacotes</h3>
                    <p className="text-gray-700">Produtos adquiridos nos EUA e enviados para consolidação no Brasil.</p>
                  </div>
                </div>
              </section>

              {/* Seção 3 - Serviços Oferecidos */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">3</Badge>
                  Serviços Oferecidos
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Redirecionamento de Compras</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">Fornecimento de endereço nos EUA para recebimento de produtos.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Consolidação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">Agrupamento de múltiplos pacotes em um único envio.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cálculo de Frete</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">Cálculo automático de custos de envio e taxas.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Rastreamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">Acompanhamento de pacotes em tempo real.</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Seção 4 - Responsabilidades do Usuário */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">4</Badge>
                  Responsabilidades do Usuário
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Fornecer informações verdadeiras e atualizadas no cadastro</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Utilizar o endereço fornecido exclusivamente para compras pessoais</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Não enviar produtos proibidos ou restritos</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Pagar as taxas e frete dentro dos prazos estabelecidos</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">Comunicar imediatamente qualquer problema ou irregularidade</p>
                  </div>
                </div>
              </section>

              {/* Seção 5 - Produtos Proibidos */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="destructive" className="mr-3">5</Badge>
                  Produtos Proibidos
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Não são aceitos:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-red-700">• Produtos perigosos ou inflamáveis</p>
                      <p className="text-red-700">• Medicamentos sem prescrição</p>
                      <p className="text-red-700">• Armas e munições</p>
                      <p className="text-red-700">• Produtos falsificados</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-red-700">• Alimentos perecíveis</p>
                      <p className="text-red-700">• Produtos com restrições alfandegárias</p>
                      <p className="text-red-700">• Itens de valor superior a US$ 3.000</p>
                      <p className="text-red-700">• Produtos que violem leis locais</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção 6 - Limitações de Responsabilidade */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">6</Badge>
                  Limitações de Responsabilidade
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    A EuaConecta não se responsabiliza por:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Danos causados por produtos defeituosos adquiridos pelo usuário</li>
                    <li>• Atrasos causados por transportadoras terceirizadas</li>
                    <li>• Perdas decorrentes de eventos de força maior</li>
                    <li>• Danos causados por uso inadequado dos produtos</li>
                    <li>• Problemas com fornecedores dos produtos</li>
                  </ul>
                </div>
              </section>

              {/* Seção 7 - Pagamentos e Reembolsos */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">7</Badge>
                  Pagamentos e Reembolsos
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Formas de Pagamento</h3>
                    <p className="text-gray-700">Cartão de crédito, PIX, boleto bancário e PayPal.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Prazos</h3>
                    <p className="text-gray-700">Pagamentos devem ser realizados em até 7 dias após a solicitação de envio.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Reembolsos</h3>
                    <p className="text-gray-700">Reembolsos são processados em até 30 dias úteis, conforme política específica.</p>
                  </div>
                </div>
              </section>

              {/* Seção 8 - Modificações */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">8</Badge>
                  Modificações dos Termos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento.
                  As alterações entrarão em vigor imediatamente após a publicação na plataforma.
                  O uso continuado dos serviços constitui aceitação das modificações.
                </p>
              </section>

              {/* Seção 9 - Contato */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">9</Badge>
                  Contato
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    Para dúvidas sobre estes termos, entre em contato:
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-700"><strong>Email:</strong> legal@euaconecta.com</p>
                    <p className="text-gray-700"><strong>Telefone:</strong> +1 (407)9538380) </p>
                    <p className="text-gray-700"><strong>Endereço:</strong> orlando,  - United states</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
