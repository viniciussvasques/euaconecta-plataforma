import jwt from 'jsonwebtoken';
export declare class TokenService {
    static generateAccessToken(payload: object): string;
    static generateRefreshToken(payload: object): string;
    static verifyAccessToken(token: string): string | jwt.JwtPayload;
    static verifyRefreshToken(token: string): string | jwt.JwtPayload;
    static saveRefreshToken(userId: string, token: string): Promise<{
        id: string;
        createdAt: Date;
        tokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string;
    } | null>;
    static revokeRefreshToken(token: string): Promise<{
        id: string;
        createdAt: Date;
        tokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string;
    } | null>;
}
