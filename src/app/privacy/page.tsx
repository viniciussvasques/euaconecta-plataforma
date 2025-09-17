import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Política de Privacidade - EuaConecta',
  description: 'Política de Privacidade da plataforma EuaConecta - como coletamos, usamos e protegemos seus dados pessoais.',
  robots: 'index, follow',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Política de Privacidade</h1>
            <p className="text-green-100 mt-2">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="px-6 py-8">
            <div className="prose prose-lg max-w-none">

              {/* Introdução */}
              <section className="mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-blue-900 mb-3">Nossa Compromisso com sua Privacidade</h2>
                  <p className="text-blue-800">
                    A EuaConecta valoriza sua privacidade e está comprometida em proteger seus dados pessoais.
                    Esta política explica como coletamos, usamos, armazenamos e protegemos suas informações.
                  </p>
                </div>
              </section>

              {/* Seção 1 - Informações que Coletamos */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">1</Badge>
                  Informações que Coletamos
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-600">Dados Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Nome completo</li>
                        <li>• Endereço de email</li>
                        <li>• Número de telefone</li>
                        <li>• Endereço residencial</li>
                        <li>• CPF/CNPJ</li>
                        <li>• Data de nascimento</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">Dados de Uso</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Histórico de compras</li>
                        <li>• Endereços de entrega</li>
                        <li>• Preferências de comunicação</li>
                        <li>• Dados de navegação</li>
                        <li>• Informações de pagamento</li>
                        <li>• Logs de acesso</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Seção 2 - Como Usamos suas Informações */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">2</Badge>
                  Como Usamos suas Informações
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Prestação de Serviços</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Processar e gerenciar seus pedidos</li>
                      <li>• Calcular custos de frete e taxas</li>
                      <li>• Fornecer suporte ao cliente</li>
                      <li>• Enviar atualizações sobre seus pacotes</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Comunicação</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Enviar notificações importantes</li>
                      <li>• Responder a suas solicitações</li>
                      <li>• Informar sobre promoções e novidades</li>
                      <li>• Enviar lembretes de pagamento</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Melhoria dos Serviços</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Analisar padrões de uso</li>
                      <li>• Desenvolver novos recursos</li>
                      <li>• Personalizar sua experiência</li>
                      <li>• Otimizar a plataforma</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Seção 3 - Compartilhamento de Informações */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">3</Badge>
                  Compartilhamento de Informações
                </h2>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4">Compartilhamos seus dados apenas com:</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-yellow-800">Transportadoras</h4>
                      <p className="text-yellow-700">Para entrega dos seus pacotes (nome, endereço, telefone)</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-yellow-800">Processadores de Pagamento</h4>
                      <p className="text-yellow-700">Para processar transações financeiras (Stripe, PayPal)</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-yellow-800">Prestadores de Serviço</h4>
                      <p className="text-yellow-700">Para operação da plataforma (hospedagem, email, analytics)</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-yellow-800">Autoridades Legais</h4>
                      <p className="text-yellow-700">Quando exigido por lei ou ordem judicial</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção 4 - Segurança dos Dados */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">4</Badge>
                  Segurança dos Dados
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">Medidas Técnicas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Criptografia SSL/TLS</li>
                        <li>• Senhas criptografadas</li>
                        <li>• Firewalls e monitoramento</li>
                        <li>• Backup seguro</li>
                        <li>• Acesso restrito</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-600">Medidas Organizacionais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Treinamento da equipe</li>
                        <li>• Políticas de acesso</li>
                        <li>• Auditorias regulares</li>
                        <li>• Contratos de confidencialidade</li>
                        <li>• Procedimentos de incidentes</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Seção 5 - Seus Direitos */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">5</Badge>
                  Seus Direitos (LGPD)
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Você tem o direito de:</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-green-800">Acesso</p>
                          <p className="text-green-700 text-sm">Solicitar informações sobre seus dados</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-green-800">Correção</p>
                          <p className="text-green-700 text-sm">Corrigir dados incorretos</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-green-800">Exclusão</p>
                          <p className="text-green-700 text-sm">Solicitar exclusão de dados</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-green-800">Portabilidade</p>
                          <p className="text-green-700 text-sm">Transferir dados para outro serviço</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-green-800">Oposição</p>
                          <p className="text-green-700 text-sm">Opor-se ao tratamento de dados</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-green-800">Informação</p>
                          <p className="text-green-700 text-sm">Saber como usamos seus dados</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção 6 - Cookies e Tecnologias */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">6</Badge>
                  Cookies e Tecnologias
                </h2>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Tipos de Cookies</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700">Essenciais</h4>
                        <p className="text-sm text-gray-600">Necessários para funcionamento da plataforma</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Analíticos</h4>
                        <p className="text-sm text-gray-600">Para melhorar a experiência do usuário</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700">Marketing</h4>
                        <p className="text-sm text-gray-600">Para personalizar conteúdo e anúncios</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Seção 7 - Retenção de Dados */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">7</Badge>
                  Retenção de Dados
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Dados de conta:</strong> Enquanto sua conta estiver ativa + 5 anos</li>
                    <li>• <strong>Dados de transação:</strong> 10 anos (conforme legislação fiscal)</li>
                    <li>• <strong>Dados de marketing:</strong> Até você cancelar o consentimento</li>
                    <li>• <strong>Logs de sistema:</strong> 2 anos para fins de segurança</li>
                  </ul>
                </div>
              </section>

              {/* Seção 8 - Menores de Idade */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">8</Badge>
                  Menores de Idade
                </h2>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-800 font-medium mb-2">⚠️ Importante</p>
                  <p className="text-red-700">
                    Nossos serviços são destinados a pessoas maiores de 18 anos.
                    Não coletamos intencionalmente dados de menores de idade.
                    Se descobrirmos que coletamos dados de menores, os excluiremos imediatamente.
                  </p>
                </div>
              </section>

              {/* Seção 9 - Alterações na Política */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">9</Badge>
                  Alterações na Política
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  Podemos atualizar esta política de privacidade periodicamente.
                  Quando houver mudanças significativas, notificaremos você por email ou através da plataforma.
                  Recomendamos que revise esta política regularmente.
                </p>
              </section>

              {/* Seção 10 - Contato */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Badge variant="outline" className="mr-3">10</Badge>
                  Contato e DPO
                </h2>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Para questões sobre privacidade:</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Encarregado de Dados (DPO)</h4>
                      <p className="text-gray-600 text-sm">Email: dpo@euaconecta.com</p>
                      <p className="text-gray-600 text-sm">Telefone: +55 (11) 99999-9999</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Suporte Geral</h4>
                      <p className="text-gray-600 text-sm">Email: privacidade@euaconecta.com</p>
                      <p className="text-gray-600 text-sm">Chat: Disponível 24/7 na plataforma</p>
                    </div>
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
