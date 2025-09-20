import { NextResponse } from 'next/server'

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Termos de Uso - EuaConecta</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
              <h1 class="text-3xl font-bold text-white">Termos de Uso</h1>
              <p class="text-blue-100 mt-2">Última atualização: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            <div class="px-6 py-8">
              <div class="prose prose-lg max-w-none">
                <section class="mb-8">
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
                  <p class="text-gray-700 leading-relaxed">
                    Ao acessar e utilizar a plataforma EuaConecta, você concorda em cumprir e estar vinculado aos presentes Termos de Uso.
                    Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
                  </p>
                </section>

                <section class="mb-8">
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Serviços Oferecidos</h2>
                  <p class="text-gray-700 leading-relaxed">
                    A EuaConecta oferece serviços de redirecionamento e consolidação de compras dos EUA para o Brasil,
                    incluindo cálculo de frete, rastreamento de pacotes e suporte ao cliente.
                  </p>
                </section>

                <section class="mb-8">
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. Responsabilidades do Usuário</h2>
                  <ul class="list-disc list-inside text-gray-700 space-y-2">
                    <li>Fornecer informações verdadeiras e atualizadas</li>
                    <li>Utilizar o endereço fornecido exclusivamente para compras pessoais</li>
                    <li>Não enviar produtos proibidos ou restritos</li>
                    <li>Pagar as taxas e frete dentro dos prazos estabelecidos</li>
                  </ul>
                </section>

                <section class="mb-8">
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Contato</h2>
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p class="text-gray-700 mb-4">
                      Para dúvidas sobre estes termos, entre em contato:
                    </p>
                    <div class="space-y-2">
                      <p class="text-gray-700"><strong>Email:</strong> legal@euaconecta.com</p>
                      <p class="text-gray-700"><strong>Telefone:</strong> +1 (407) 953-8380</p>
                      <p class="text-gray-700"><strong>Endereço:</strong> Orlando, FL - United States</p>
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
