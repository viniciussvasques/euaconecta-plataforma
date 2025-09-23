import { z } from 'zod'

// Schema de validação para variáveis de ambiente
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Authentication
  JWT_SECRET: z.string().min(32).optional().default('your-super-secret-jwt-key-change-in-production'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).default(12),

  // Redis
  REDIS_URL: z.string().url().optional(),

  // MinIO/S3
  S3_ACCESS_KEY: z.string().optional().default('minioadmin'),
  S3_SECRET_KEY: z.string().optional().default('minioadmin'),
  S3_ENDPOINT: z.string().url().optional().default('http://localhost:9000'),
  S3_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().optional().default('euaconecta'),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // External APIs
  STRIPE_SECRET_KEY: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),

  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().default(3000),
  API_URL: z.string().url().optional(),

  // Security
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW: z.coerce.number().int().default(15), // minutes
  RATE_LIMIT_MAX: z.coerce.number().int().default(100),
})

// Parse e valida variáveis de ambiente
const env = envSchema.parse(process.env)

export { env }