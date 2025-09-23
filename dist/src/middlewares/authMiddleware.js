"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorMiddleware_1 = require("./errorMiddleware");
function authMiddleware(allowedRoles) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new errorMiddleware_1.AppError('Token não fornecido', 401));
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return next(new errorMiddleware_1.AppError('Formato do token inválido', 401));
        }
        const [scheme, token] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return next(new errorMiddleware_1.AppError('Formato do token inválido', 401));
        }
        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return next(new errorMiddleware_1.AppError('Configuração JWT ausente', 500));
            }
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return next(new errorMiddleware_1.AppError('Acesso não autorizado', 403));
            }
            req.user = {
                id: decoded.id,
                role: decoded.role,
            };
            return next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return next(new errorMiddleware_1.AppError('Token expirado', 401));
            }
            return next(new errorMiddleware_1.AppError('Token inválido', 401));
        }
    };
}
//# sourceMappingURL=authMiddleware.js.map