"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
class AuthRepository {
    async createUser(dto) {
        const now = new Date();
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(dto.password, salt);
        const activationToken = crypto.randomUUID();
        const activationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
        const userData = {
            id: crypto.randomUUID(),
            email: dto.email,
            password: hashedPassword,
            name: dto.name ?? '',
            createdAt: now,
            updatedAt: now,
            isActive: false,
            role: client_1.UserRole.CLIENT,
            activationToken,
            activationTokenExpires,
            canManageCarriers: false,
            canManageConsolidations: false,
            canManagePackages: false,
            canManageSettings: false,
            canManageUsers: false,
            canViewFinancials: false,
            cpf: null,
            lastLogin: null,
            permissions: [],
            suiteNumber: null,
        };
        return prisma.user.create({ data: userData });
    }
    async loginUser(dto) {
        const user = await prisma.user.findUnique({ where: { email: dto.email } });
        return user;
    }
    async findUserById(id) {
        return prisma.user.findUnique({ where: { id } });
    }
    async forgotPassword(dto) {
        return { success: true };
    }
    async resetPassword(dto) {
        return { success: true };
    }
    async resendVerification(dto) {
        return { success: true };
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map