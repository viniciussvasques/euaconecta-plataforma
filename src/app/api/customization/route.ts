import { NextRequest, NextResponse } from 'next/server'
import { defaultCustomization } from '@/lib/system-customization'
import fs from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'data', 'customization.json')

// Garantir que o diretório existe
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export async function GET() {
  try {
    ensureDataDir()

    let config = defaultCustomization

    // Tentar carregar configuração salva
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const savedConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
        config = { ...defaultCustomization, ...savedConfig }
      } catch (error) {
        console.error('Erro ao ler arquivo de configuração:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Erro ao buscar configurações de personalização:', error)
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

    // Salvar configuração no arquivo
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(body, null, 2))

    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso'
    })
  } catch (error) {
    console.error('Erro ao salvar configurações de personalização:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
