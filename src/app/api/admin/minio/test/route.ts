import { NextResponse } from 'next/server'
import { S3Service } from '@/lib/s3'

export async function POST() {
  try {
    // Testa a conexão com o MinIO
    const isConnected = await S3Service.testConnection()

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Conexão com MinIO estabelecida com sucesso!',
        data: {
          endpoint: process.env.S3_ENDPOINT,
          bucket: process.env.S3_BUCKET,
          region: process.env.S3_REGION
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha na conexão com MinIO'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Erro ao testar MinIO:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro ao testar conexão com MinIO'
    }, { status: 500 })
  }
}
