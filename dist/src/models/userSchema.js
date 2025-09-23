"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().min(1, 'Email é obrigatório').email('Email inválido'),
        firstName: zod_1.z
            .string().min(1, 'Nome é obrigatório')
            .min(2, 'Nome deve ter pelo menos 2 caracteres')
            .max(50, 'Nome deve ter no máximo 50 caracteres'),
        lastName: zod_1.z
            .string().min(1, 'Sobrenome é obrigatório')
            .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
            .max(50, 'Sobrenome deve ter no máximo 50 caracteres'),
        password: zod_1.z
            .string().min(1, 'Senha é obrigatória')
            .min(8, 'Senha deve ter pelo menos 8 caracteres')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'),
        role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'MANAGER', 'CLIENT', 'SUPPORT']).optional(),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z
            .string()
            .min(2, 'Nome deve ter pelo menos 2 caracteres')
            .max(50, 'Nome deve ter no máximo 50 caracteres')
            .optional(),
        lastName: zod_1.z
            .string()
            .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
            .max(50, 'Sobrenome deve ter no máximo 50 caracteres')
            .optional(),
        password: zod_1.z
            .string()
            .min(8, 'Senha deve ter pelo menos 8 caracteres')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial')
            .optional(),
        active: zod_1.z.boolean().optional(),
        role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'MANAGER', 'CLIENT', 'SUPPORT']).optional(),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'ID do usuário é obrigatório'),
    }),
});
//# sourceMappingURL=userSchema.js.map