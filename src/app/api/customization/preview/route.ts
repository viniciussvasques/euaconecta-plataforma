import { NextRequest, NextResponse } from 'next/server'
import { configService } from '@/lib/config-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customization, previewType } = body

    // Validar tipo de pré-visualização
    const validTypes = ['landing', 'client-dashboard', 'admin-dashboard']
    if (!validTypes.includes(previewType)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de pré-visualização inválido' },
        { status: 400 }
      )
    }

    // Gerar CSS customizado usando o serviço
    const customCSS = configService.generateCustomCSS(customization)

    // Gerar dados de pré-visualização
    const previewData = generatePreviewData(customization, previewType)

    return NextResponse.json({
      success: true,
      data: {
        css: customCSS,
        previewData,
        previewType
      }
    })
  } catch (error) {
    console.error('Erro ao gerar pré-visualização:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function generatePreviewData(customization: any, previewType: string) {
  switch (previewType) {
    case 'landing':
      return {
        heroTitle: customization.landingPage.heroTitle,
        heroSubtitle: customization.landingPage.heroSubtitle,
        features: customization.landingPage.features,
        ctaText: customization.landingPage.ctaText
      }
    
    case 'client-dashboard':
      return {
        welcomeMessage: customization.clientDashboard.welcomeMessage,
        quickActions: customization.clientDashboard.quickActions,
        recentActivity: customization.clientDashboard.recentActivity,
        statsCards: customization.clientDashboard.statsCards
      }
    
    case 'admin-dashboard':
      return {
        theme: customization.adminDashboard.theme,
        sidebarCollapsed: customization.adminDashboard.sidebarCollapsed,
        quickStats: customization.adminDashboard.quickStats
      }
    
    default:
      return {}
  }
}
