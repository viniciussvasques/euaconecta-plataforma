import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // Buscar estatísticas básicas (tolerante a falhas em build/prerender)
  let userCount = 0
  let packageCount = 0
  let shipmentCount = 0
  let consolidationCount = 0
  type ActivityItem = { type: 'package' | 'shipment' | 'consolidation' | 'user'; message: string; time: Date; icon: 'package' | 'truck' | 'box' | 'user' }
  let recentActivity: ActivityItem[] = []

  try {
    ;[userCount, packageCount, shipmentCount, consolidationCount] = await Promise.all([
      prisma.user.count(),
      prisma.package.count(),
      prisma.shipment.count(),
      prisma.consolidationGroup.count(),
    ])

    // Buscar atividade recente
    const [recentPackages, recentShipments, recentConsolidations, recentUsers] = await Promise.all([
      prisma.package.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.shipment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.consolidationGroup.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { name: true, email: true, createdAt: true }
      })
    ])

    // Combinar e ordenar atividade recente
    recentActivity = [
      ...recentPackages.map((pkg): ActivityItem => ({
        type: 'package',
        message: `Novo pacote recebido`,
        time: pkg.createdAt,
        icon: 'package'
      })),
      ...recentShipments.map((shipment): ActivityItem => ({
        type: 'shipment',
        message: `Envio criado`,
        time: shipment.createdAt,
        icon: 'truck'
      })),
      ...recentConsolidations.map((consolidation): ActivityItem => ({
        type: 'consolidation',
        message: `Consolidação criada`,
        time: consolidation.createdAt,
        icon: 'box'
      })),
      ...recentUsers.map((user): ActivityItem => ({
        type: 'user',
        message: `Novo usuário registrado: ${user.name}`,
        time: user.createdAt,
        icon: 'user'
      }))
    ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10)

  } catch {
    // Sem conexão com DB em build/prerender: usar valores padrão
  }

  const stats = [
    { name: 'Usuários', value: userCount, change: '+12%', changeType: 'increase' },
    { name: 'Pacotes', value: packageCount, change: '+5%', changeType: 'increase' },
    { name: 'Envios', value: shipmentCount, change: '+8%', changeType: 'increase' },
    { name: 'Consolidações', value: consolidationCount, change: '+3%', changeType: 'increase' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="mt-1 sm:mt-2 text-sm text-gray-700">
          Resumo operacional da plataforma Euaconecta
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 sm:px-5 py-2 sm:py-3">
              <div className="text-xs sm:text-sm">
                <span className={`font-medium ${
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change}
                </span>
                <span className="text-gray-500"> desde o último mês</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-4 sm:py-5 sm:p-6">
          <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
            Atividade Recente
          </h3>
          <div className="mt-4 sm:mt-5">
            <div className="flow-root">
              <ul className="-mb-6 sm:-mb-8">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <li key={index}>
                      <div className={`relative ${index < recentActivity.length - 1 ? 'pb-6 sm:pb-8' : ''}`}>
                        {index < recentActivity.length - 1 && (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center ring-4 sm:ring-8 ring-white ${
                              activity.type === 'package' ? 'bg-green-500' :
                              activity.type === 'shipment' ? 'bg-blue-500' :
                              activity.type === 'consolidation' ? 'bg-purple-500' :
                              'bg-yellow-500'
                            }`}>
                              {activity.icon === 'package' && (
                                <svg className="h-3 w-3 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              )}
                              {activity.icon === 'truck' && (
                                <svg className="h-3 w-3 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                              )}
                              {activity.icon === 'box' && (
                                <svg className="h-3 w-3 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              )}
                              {activity.icon === 'user' && (
                                <svg className="h-3 w-3 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1 sm:pt-1.5 flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
                            <div className="flex-1">
                              <p className="text-xs sm:text-sm text-gray-500">
                                {activity.message}
                              </p>
                            </div>
                            <div className="text-left sm:text-right text-xs sm:text-sm whitespace-nowrap text-gray-500 mt-1 sm:mt-0">
                              <time dateTime={activity.time.toISOString()}>
                                {new Date(activity.time).toLocaleString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhuma atividade recente</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
