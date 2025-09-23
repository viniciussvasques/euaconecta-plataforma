"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'change-me-refresh';
class TokenService {
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
    }
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
    }
    static async saveRefreshToken(userId, token) {
        try {
            const tokenHash = crypto_1.default.createHash('sha256').update(token).digest('hex');
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            return await prisma.refresh_tokens.create({
                data: {
                    id: token,
                    userId,
                    tokenHash,
                    expiresAt,
                },
            });
        }
        catch (e) {
            return null;
        }
    }
    static async revokeRefreshToken(token) {
        try {
            return await prisma.refresh_tokens.delete({ where: { id: token } });
        }
        catch (e) {
            return null;
        }
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map