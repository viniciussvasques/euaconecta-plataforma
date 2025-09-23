import { NextRequest, NextResponse } from 'next/server'
import { checkS3Connection, uploadBuffer, listFiles, deleteFile } from '@/lib/storage/s3'
import { logger } from '@/lib/logging/winston-config'
// Update the import path below to the correct location of api-auth, for example:
import { checkAdminAccess } from '@/lib/auth/api-auth'

export async function GET(request: NextRequest) {
  // Verificar permissões (apenas administradores)
  const accessCheck = await checkAdminAccess(request)
  if (!accessCheck.success) {
    return accessCheck.response
  }

  try {
    // Verificar conexão com MinIO
    const isConnected = await checkS3Connection()
    
    if (!isConnected) {
      return NextResponse.json({ 
        success: false, 
        message: 'Falha ao conectar com o MinIO/S3. Verifique as credenciais e a disponibilidade do serviço.' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Conexão com MinIO estabelecida com sucesso!',
      data: {
        endpoint: process.env.S3_ENDPOINT,
        bucket: process.env.S3_BUCKET,
        region: process.env.S3_REGION
      }
    })
  } catch (error) {
    logger.error('Erro ao testar MinIO', { error })
    return NextResponse.json({
      success: false,
      message: 'Erro ao testar conexão com MinIO',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Verificar permissões (apenas administradores)
  const accessCheck = await checkAdminAccess(request)
  if (!accessCheck.success) {
    return accessCheck.response
  }

  try {
    // Verificar conexão com MinIO
    const isConnected = await checkS3Connection()
    
    if (!isConnected) {
      return NextResponse.json({ 
        success: false, 
        message: 'Falha ao conectar com o MinIO/S3. Verifique as credenciais e a disponibilidade do serviço.' 
      }, { status: 500 })
    }

    // Testar operações básicas: upload, list, delete
    const testKey = `test/minio-test-${Date.now()}.txt`
    const testContent = Buffer.from('Teste de conexão com MinIO - ' + new Date().toISOString())
    
    // Upload de arquivo de teste
    await uploadBuffer(testKey, testContent, 'text/plain')
    
    // Listar arquivos para confirmar que o upload funcionou
    const listing = await listFiles('test/')
    
    // Remover arquivo de teste
    await deleteFile(testKey)

    return NextResponse.json({
      success: true,
      message: 'Teste completo de MinIO/S3 realizado com sucesso!',
      details: {
        filesInTestDir: listing.Contents?.length || 0,
        testFileCreated: true,
        testFileDeleted: true
      }
    })
  } catch (error) {
    logger.error('Erro ao testar MinIO', { error })
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao testar MinIO/S3',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
