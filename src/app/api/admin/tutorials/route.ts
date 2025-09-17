import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const TUTORIALS_FILE = path.join(process.cwd(), 'data', 'tutorials.json')

// Garantir que o diretório existe
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Dados iniciais dos tutoriais
const defaultTutorials = [
  {
    id: 'como-comecar',
    title: 'Como começar a importar com a Euaconecta',
    description: 'Guia completo para novos usuários: desde o cadastro até o primeiro envio',
    type: 'video',
    difficulty: 'iniciante',
    duration: 8,
    rating: 4.9,
    views: 12500,
    isHighlighted: true,
    isActive: true,
    order: 1,
    url: 'https://placeholder.com',
    icon: '📦',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'melhores-lojas',
    title: 'Onde comprar nos EUA: Melhores lojas',
    description: 'Lista das melhores lojas americanas com dicas de compra e economia',
    type: 'article',
    difficulty: 'iniciante',
    duration: 12,
    rating: 4.8,
    views: 8900,
    isHighlighted: true,
    isActive: true,
    order: 2,
    url: 'https://placeholder.com',
    icon: '🛍️',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'consolidar-pacotes',
    title: 'Como consolidar seus pacotes',
    description: 'Aprenda a juntar vários pacotes em uma única caixa para economizar no frete',
    type: 'video',
    difficulty: 'intermediario',
    duration: 6,
    rating: 4.7,
    views: 15600,
    isHighlighted: false,
    isActive: true,
    order: 3,
    url: 'https://placeholder.com',
    icon: '📦',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'formas-pagamento',
    title: 'Formas de pagamento aceitas',
    description: 'Conheça todas as opções de pagamento disponíveis na plataforma',
    type: 'article',
    difficulty: 'iniciante',
    duration: 5,
    rating: 4.6,
    views: 7200,
    isHighlighted: false,
    isActive: true,
    order: 4,
    url: 'https://placeholder.com',
    icon: '💳',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rastrear-envios',
    title: 'Como rastrear seus envios',
    description: 'Acompanhe seus pacotes desde a compra até a entrega',
    type: 'video',
    difficulty: 'iniciante',
    duration: 4,
    rating: 4.8,
    views: 9800,
    isHighlighted: false,
    isActive: true,
    order: 5,
    url: 'https://placeholder.com',
    icon: '🚚',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dicas-economizar',
    title: 'Dicas para economizar no frete',
    description: 'Estratégias comprovadas para reduzir custos de envio',
    type: 'article',
    difficulty: 'intermediario',
    duration: 10,
    rating: 4.9,
    views: 11200,
    isHighlighted: true,
    isActive: true,
    order: 6,
    url: 'https://placeholder.com',
    icon: '💰',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'problemas-comuns',
    title: 'Problemas comuns e soluções',
    description: 'Resolução dos problemas mais frequentes na importação',
    type: 'article',
    difficulty: 'intermediario',
    duration: 15,
    rating: 4.5,
    views: 6800,
    isHighlighted: false,
    isActive: true,
    order: 7,
    url: 'https://placeholder.com',
    icon: '🔧',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'seguranca-importacao',
    title: 'Segurança na importação',
    description: 'Como proteger seus produtos e dados durante o processo',
    type: 'video',
    difficulty: 'iniciante',
    duration: 7,
    rating: 4.7,
    views: 5400,
    isHighlighted: false,
    isActive: true,
    order: 8,
    url: 'https://placeholder.com',
    icon: '🛡️',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET() {
  try {
    ensureDataDir()

    let tutorials = defaultTutorials

    // Tentar carregar tutoriais salvos
    if (fs.existsSync(TUTORIALS_FILE)) {
      try {
        const savedTutorials = JSON.parse(fs.readFileSync(TUTORIALS_FILE, 'utf8'))
        tutorials = savedTutorials
      } catch (error) {
        console.error('Erro ao ler arquivo de tutoriais:', error)
      }
    } else {
      // Criar arquivo inicial
      fs.writeFileSync(TUTORIALS_FILE, JSON.stringify(defaultTutorials, null, 2))
    }

    return NextResponse.json({
      success: true,
      data: tutorials
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Erro ao buscar tutoriais:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    ensureDataDir()

    // Carregar tutoriais existentes
    let tutorials = defaultTutorials
    if (fs.existsSync(TUTORIALS_FILE)) {
      tutorials = JSON.parse(fs.readFileSync(TUTORIALS_FILE, 'utf8'))
    }

    // Adicionar novo tutorial
    const newTutorial = {
      id: body.id || `tutorial-${Date.now()}`,
      title: body.title,
      description: body.description,
      type: body.type,
      difficulty: body.difficulty,
      duration: body.duration,
      rating: body.rating || 5,
      views: body.views || 0,
      isHighlighted: body.isHighlighted || false,
      isActive: body.isActive !== false,
      order: body.order || tutorials.length + 1,
      url: body.url,
      icon: body.icon || '📚',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    tutorials.push(newTutorial)

    // Salvar no arquivo
    fs.writeFileSync(TUTORIALS_FILE, JSON.stringify(tutorials, null, 2))

    return NextResponse.json({
      success: true,
      data: newTutorial,
      message: 'Tutorial criado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao criar tutorial:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
