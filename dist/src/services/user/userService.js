"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorMiddleware_1 = require("../../middlewares/errorMiddleware");
class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(userData) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (existingUser) {
            throw new errorMiddleware_1.AppError('Usuário com este email já existe', 400);
        }
        const password = await bcrypt_1.default.hash(userData.password, 10);
        const userDataPrisma = {
            email: userData.email,
            name: userData.name,
            password,
            role: userData.role || 'CLIENT',
            isActive: false,
            permissions: [],
            canManageUsers: false,
            canManageConsolidations: false,
            canManagePackages: false,
            canManageCarriers: false,
            canViewFinancials: false,
            canManageSettings: false,
        };
        const user = await this.prisma.user.create({
            data: userDataPrisma,
        });
        const { password: _, ...userResponse } = user;
        return userResponse;
    }
    async findAllUsers() {
        const users = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return users.map((user) => {
            const { password: _, ...userResponse } = user;
            return userResponse;
        });
    }
    async findUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new errorMiddleware_1.AppError('Usuário não encontrado', 404);
        }
        const { password: _, ...userResponse } = user;
        return userResponse;
    }
    async updateUser(id, userData) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            throw new errorMiddleware_1.AppError('Usuário não encontrado', 404);
        }
        const updateData = { ...userData };
        if (userData.password) {
            updateData.password = await bcrypt_1.default.hash(userData.password, 10);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        const { password: _, ...userResponse } = updatedUser;
        return userResponse;
    }
    async deleteUser(id) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            throw new errorMiddleware_1.AppError('Usuário não encontrado', 404);
        }
        await this.prisma.user.delete({
            where: { id },
        });
    }
    async findUserByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async validateCredentials(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new errorMiddleware_1.AppError('Credenciais inválidas', 401);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new errorMiddleware_1.AppError('Credenciais inválidas', 401);
        }
        if (!user.isActive) {
            throw new errorMiddleware_1.AppError('Conta desativada. Entre em contato com o suporte.', 403);
        }
        const { password: _, ...userResponse } = user;
        return userResponse;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map