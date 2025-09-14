// Simple MinIO upload test using AWS SDK v3
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

async function main() {
  const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000'
  const region = process.env.S3_REGION || 'us-east-1'
  const bucket = process.env.S3_BUCKET || 'euaconecta-files'
  const accessKeyId = process.env.S3_ACCESS_KEY || 'minioadmin'
  const secretAccessKey = process.env.S3_SECRET_KEY || 'minioadmin'
  const forcePathStyle = (process.env.S3_FORCE_PATH_STYLE || 'true') === 'true'

  const s3 = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle,
  })

  const key = `tests/hello-${Date.now()}.txt`
  const body = Buffer.from('Hello from EuaConecta MinIO test!')

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: 'text/plain',
        ACL: 'public-read',
      })
    )

    const publicUrl = `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`
    console.log(JSON.stringify({ ok: true, key, publicUrl }, null, 2))
  } catch (err) {
    console.error('Upload failed:', err)
    process.exit(1)
  }
}

main()


