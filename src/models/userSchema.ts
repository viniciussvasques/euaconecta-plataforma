// src/models/userSchema.ts
import { z } from 'zod';

// Schema para criação de usuário
export const createUserSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    firstName: z
      .string().min(1, 'Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(50, 'Nome deve ter no máximo 50 caracteres'),
    lastName: z
      .string().min(1, 'Sobrenome é obrigatório')
      .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
      .max(50, 'Sobrenome deve ter no máximo 50 caracteres'),
    password: z
      .string().min(1, 'Senha é obrigatória')
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
      ),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'MANAGER', 'CLIENT', 'SUPPORT']).optional(),
  }),
  query: z.object({}),
  params: z.object({}),
});

// Schema para atualização de usuário
export const updateUserSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(50, 'Nome deve ter no máximo 50 caracteres')
      .optional(),
    lastName: z
      .string()
      .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
      .max(50, 'Sobrenome deve ter no máximo 50 caracteres')
      .optional(),
    password: z
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
      )
      .optional(),
    active: z.boolean().optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'MANAGER', 'CLIENT', 'SUPPORT']).optional(),
  }),
  query: z.object({}),
  params: z.object({
    id: z.string().min(1, 'ID do usuário é obrigatório'),
  }),
});
