import { SignJWT, jwtVerify, JWTPayload } from 'jose'

const textEncoder = new TextEncoder()

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long')
  }
  return textEncoder.encode(secret)
}

export interface AccessTokenPayload extends JWTPayload {
  sub: string
  email: string
  role: string
  name?: string
}

export async function signAccessToken(payload: AccessTokenPayload, expiresIn: string = process.env.JWT_EXPIRES_IN || '7d'): Promise<string> {
  const secret = getJwtSecret()
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function verifyAccessToken<T extends JWTPayload = AccessTokenPayload>(token: string): Promise<T> {
  const secret = getJwtSecret()
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
  return payload as T
}
