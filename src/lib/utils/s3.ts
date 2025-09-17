import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const endpoint = process.env.S3_ENDPOINT
const region = process.env.S3_REGION || 'us-east-1'
const bucket = process.env.S3_BUCKET || 'euaconecta-files'
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_KEY
const forcePathStyle = String(process.env.S3_FORCE_PATH_STYLE ?? 'true') === 'true'

export const s3 = new S3Client({
  region,
  endpoint,
  forcePathStyle,
  credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
})

export async function uploadBuffer(key: string, buffer: Buffer, contentType?: string) {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType }))
  return { key, url: `${process.env.NEXT_PUBLIC_S3_ENDPOINT?.replace(/\/$/, '')}/${bucket}/${key}` }
}

export function getPublicUrl(key: string) {
  return `${process.env.NEXT_PUBLIC_S3_ENDPOINT?.replace(/\/$/, '')}/${bucket}/${key}`
}


