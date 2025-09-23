import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'change-me-refresh';

export class TokenService {
  static generateAccessToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  static generateRefreshToken(payload: object) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  }

  static async saveRefreshToken(userId: string, token: string) {
    // persistir token no banco - criar tabela se necessário
    try {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      return await prisma.refresh_tokens.create({
        data: {
          id: token,
          userId,
          tokenHash,
          expiresAt,
        },
      });
    } catch (e) {
      return null;
    }
  }

  static async revokeRefreshToken(token: string) {
    try {
      return await prisma.refresh_tokens.delete({ where: { id: token } });
    } catch (e) {
      return null;
    }
  }
}
