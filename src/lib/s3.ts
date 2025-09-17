import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Configuração do cliente S3 (MinIO)
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true, // Necessário para MinIO
})

const BUCKET_NAME = process.env.S3_BUCKET || 'euaconecta-files'

export class S3Service {
  /**
   * Upload de arquivo para o S3/MinIO
   */
  static async uploadFile(
    file: Buffer | Uint8Array | string,
    key: string,
    contentType: string = 'application/octet-stream'
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
      })

      await s3Client.send(command)
      
      // Retorna a URL pública do arquivo
      return `${process.env.NEXT_PUBLIC_S3_ENDPOINT}/${BUCKET_NAME}/${key}`
    } catch (error) {
      console.error('Erro ao fazer upload para S3:', error)
      throw new Error('Falha no upload do arquivo')
    }
  }

  /**
   * Upload de imagem com otimização
   */
  static async uploadImage(
    file: Buffer,
    key: string,
    contentType: string = 'image/jpeg'
  ): Promise<string> {
    return this.uploadFile(file, key, contentType)
  }

  /**
   * Gera URL assinada para download privado
   */
  static async getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })

      return await getSignedUrl(s3Client, command, { expiresIn })
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error)
      throw new Error('Falha ao gerar URL de download')
    }
  }

  /**
   * Deleta arquivo do S3/MinIO
   */
  static async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })

      await s3Client.send(command)
    } catch (error) {
      console.error('Erro ao deletar arquivo do S3:', error)
      throw new Error('Falha ao deletar arquivo')
    }
  }

  /**
   * Gera URL pública para arquivo (se o bucket for público)
   */
  static getPublicUrl(key: string): string {
    return `${process.env.NEXT_PUBLIC_S3_ENDPOINT}/${BUCKET_NAME}/${key}`
  }

  /**
   * Verifica se o S3/MinIO está acessível
   */
  static async testConnection(): Promise<boolean> {
    try {
      // Tenta fazer um upload de teste
      const testKey = `test-connection-${Date.now()}.txt`
      await this.uploadFile('test', testKey, 'text/plain')
      
      // Deleta o arquivo de teste
      await this.deleteFile(testKey)
      
      return true
    } catch (error) {
      console.error('Teste de conexão S3 falhou:', error)
      return false
    }
  }
}

export default S3Service




























