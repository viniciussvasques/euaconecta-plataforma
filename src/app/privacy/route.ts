import { NextResponse } from 'next/server'

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Política de Privacidade - EuaConecta</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8">
              <h1 class="text-3xl font-bold text-white">Política de Privacidade</h1>
              <p class="text-green-100 mt-2">Última atualização: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div class="px-6 py-8">
              <div class="prose prose-lg max-w-none">
                <section class="mb-8">
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 class="text-xl font-semibold text-blue-900 mb-3">Nossa Compromisso com sua Privacidade</h2>
                    <p class="text-blue-800">
                      A EuaConecta valoriza sua privacidade e está comprometida em proteger seus dados pessoais.
                      Esta política explica como coletamos, usamos, armazenamos e protegemos suas informações.
                    </p>
                  </div>
                </section>

                <section class="mb-8">
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Informações que Coletamos</h2>
                  <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-800 mb-3">Dados Pessoais</h3>
                      <ul class="space-y-2 text-gray-700">
                        <li>• Nome completo</li>
                        <li>• Endereço de email</li>
                        <li>• Número de telefone</li>
                        <li>• Endereço residencial</li>
                        <li>• CPF/CNPJ</li>
                      </ul>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-6">
                      <h3 class="text-lg font-semibold text-gray-800 mb-3">Dados de Uso</h3>
                      <ul class="space-y-2 text-gray-700">
                        <li>• Histórico de compras</li>
                        <li>• Endereços de entrega</li>
                        <li>• Preferências de comunicação</li>
                        <li>• Dados de navegação</li>
                        <li>• Informações de pagamento</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section class="mb-8">
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Seus Direitos (LGPD)</h2>
                  <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-green-800 mb-4">Você tem o direito de:</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div class="space-y-3">
                        <div class="flex items-start">
                          <div class="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <div>
                            <p class="font-medium text-green-800">Acesso</p>
                            <p class="text-green-700 text-sm">Solicitar informações sobre seus dados</p>
                          </div>
                        </div>
                        <div class="flex items-start">
                          <div class="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <div>
                            <p class="font-medium text-green-800">Correção</p>
                            <p class="text-green-700 text-sm">Corrigir dados incorretos</p>
                          </div>
                        </div>
                      </div>
                      <div class="space-y-3">
                        <div class="flex items-start">
                          <div class="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <div>
                            <p class="font-medium text-green-800">Exclusão</p>
                            <p class="text-green-700 text-sm">Solicitar exclusão de dados</p>
                          </div>
                        </div>
                        <div class="flex items-start">
                          <div class="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <div>
                            <p class="font-medium text-green-800">Portabilidade</p>
                            <p class="text-green-700 text-sm">Transferir dados para outro serviço</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section class="mb-8">
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. Contato e DPO</h2>
                  <div class="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Para questões sobre privacidade:</h3>
                    <div class="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 class="font-medium text-gray-700 mb-2">Encarregado de Dados (DPO)</h4>
                        <p class="text-gray-600 text-sm">Email: dpo@euaconecta.com</p>
                        <p class="text-gray-600 text-sm">Telefone: +1 (407) 953-8380</p>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-700 mb-2">Suporte Geral</h4>
                        <p class="text-gray-600 text-sm">Email: privacidade@euaconecta.com</p>
                        <p class="text-gray-600 text-sm">Chat: Disponível 24/7 na plataforma</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
