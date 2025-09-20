require('dotenv').config()
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
})

const bucketName = process.env.S3_BUCKET || 'euaconecta-files'

async function uploadBuffer(key, buffer, contentType) {
  await s3.send(new PutObjectCommand({ 
    Bucket: bucketName, 
    Key: key, 
    Body: buffer, 
    ContentType: contentType 
  }))
  return { 
    key, 
    url: `${process.env.S3_ENDPOINT?.replace(/\/$/, '')}/${bucketName}/${key}` 
  }
}

async function testImageUpload() {
  try {
    console.log('🧪 Testando upload de imagem...')
    
    // Criar uma imagem de teste simples (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixel
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // bit depth, color type, etc.
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, // compressed data
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // pixel data
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
      0xAE, 0x42, 0x60, 0x82
    ])
    
    const fileName = `package-photos/test-${Date.now()}.png`
    
    const result = await uploadBuffer(fileName, testImageBuffer, 'image/png')
    
    console.log('✅ Upload realizado com sucesso!')
    console.log(`📁 Arquivo: ${result.key}`)
    console.log(`🌐 URL: ${result.url}`)
    
    // Testar se a imagem é acessível
    console.log('\n🔍 Testando acesso à imagem...')
    const response = await fetch(result.url)
    if (response.ok) {
      console.log('✅ Imagem acessível publicamente!')
    } else {
      console.log('❌ Erro ao acessar imagem:', response.status)
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
  }
}

testImageUpload()
