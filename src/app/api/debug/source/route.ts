// Teste para verificar qual fonte de configuração está sendo usada
import { SystemCustomization, defaultCustomization } from '@/lib/config/system-customization'
import { getCustomization } from '@/lib/config/get-customization'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Caminho do arquivo de configuração
const CONFIG_FILE = path.join(process.cwd(), 'data', 'customization.json')

export async function GET() {
  try {
    // Verificar se o arquivo existe
    const fileExists = fs.existsSync(CONFIG_FILE)
    let fileConfig = null
    
    // Ler arquivo se existir
    if (fileExists) {
      try {
        fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
      } catch (error) {
        console.error('Erro ao ler arquivo de configuração:', error)
      }
    }
    
    // Obter configuração usando getCustomization
    const appConfig = await getCustomization()
    
    // Verificar se está usando as mesmas configurações do arquivo
    const isUsingFile = fileConfig && appConfig.contact?.phone === fileConfig.contact?.phone
    const isUsingDefault = !fileConfig || appConfig.contact?.phone === defaultCustomization.contact?.phone
    
    return NextResponse.json({
      success: true,
      fileExists,
      fileConfigData: fileConfig ? {
        contact: fileConfig.contact,
        socialMedia: fileConfig.socialMedia
      } : null,
      appConfigData: {
        contact: appConfig.contact,
        socialMedia: appConfig.socialMedia
      },
      defaultConfigData: {
        contact: defaultCustomization.contact,
        socialMedia: defaultCustomization.socialMedia
      },
      analysis: {
        isUsingFile,
        isUsingDefault,
        source: isUsingFile ? 'file' : (isUsingDefault ? 'default' : 'database')
      }
    })
  } catch (error) {
    console.error('Erro ao verificar configurações:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao verificar configurações',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}