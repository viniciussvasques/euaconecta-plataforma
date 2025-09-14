require('dotenv').config()
const { S3Client, PutBucketPolicyCommand, GetBucketPolicyCommand } = require('@aws-sdk/client-s3')

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

// Política para permitir acesso público de leitura
const bucketPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'PublicReadGetObject',
      Effect: 'Allow',
      Principal: '*',
      Action: 's3:GetObject',
      Resource: `arn:aws:s3:::${bucketName}/*`,
    },
  ],
}

async function setupBucket() {
  try {
    console.log('Configurando bucket do MinIO...')
    
    // Aplicar política de bucket
    await s3.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy)
    }))
    
    console.log('✅ Bucket configurado com sucesso!')
    console.log(`📁 Bucket: ${bucketName}`)
    console.log(`🌐 Endpoint: ${process.env.S3_ENDPOINT}`)
    console.log('🔓 Acesso público de leitura habilitado')
    
  } catch (error) {
    console.error('❌ Erro ao configurar bucket:', error.message)
  }
}

setupBucket()
