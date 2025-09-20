/**
 * Sistema de Validação Centralizado para APIs
 *
 * Este módulo fornece validadores reutilizáveis para todas as APIs,
 * garantindo consistência e segurança em toda a aplicação.
 */

import { z } from 'zod'
import { NextRequest } from 'next/server'

// Schemas base
export const BaseSchemas = {
  id: z.string().min(1, 'ID é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Telefone inválido'),
  url: z.string().url('URL inválida'),
  date: z.string().datetime('Data inválida'),
  positiveNumber: z.number().positive('Número deve ser positivo'),
  nonNegativeNumber: z.number().min(0, 'Número não pode ser negativo'),
}

// Schemas específicos para APIs
export const AuthSchemas = {
  login: z.object({
    email: BaseSchemas.email,
    password: BaseSchemas.password,
  }),

  register: z.object({
    name: BaseSchemas.name,
    email: BaseSchemas.email,
    password: BaseSchemas.password,
    turnstileToken: z.string().optional(),
    website: z.string().optional(), // Honeypot
  }),

  forgotPassword: z.object({
    email: BaseSchemas.email,
  }),

  resetPassword: z.object({
    token: BaseSchemas.id,
    password: BaseSchemas.password,
  }),
}

export const PackageSchemas = {
  create: z.object({
    ownerId: BaseSchemas.id,
    description: z.string().min(1, 'Descrição é obrigatória'),
    purchaseDate: BaseSchemas.date.optional(),
    expectedDeliveryDate: BaseSchemas.date.optional(),
    store: z.string().optional(),
    orderNumber: z.string().optional(),
    purchasePrice: BaseSchemas.positiveNumber.optional(),
    weightGrams: BaseSchemas.positiveNumber.optional(),
    notes: z.string().optional(),
    trackingIn: z.string().optional(),
    carrier: z.string().optional(),
    declaredValue: BaseSchemas.positiveNumber.optional(),
    packageType: z.enum(['STANDARD', 'EXPRESS', 'FRAGILE', 'ELECTRONICS']).optional(),
    lengthCm: BaseSchemas.positiveNumber.optional(),
    widthCm: BaseSchemas.positiveNumber.optional(),
    heightCm: BaseSchemas.positiveNumber.optional(),
  }),

  update: z.object({
    description: z.string().min(1, 'Descrição é obrigatória').optional(),
    purchaseDate: BaseSchemas.date.optional(),
    expectedDeliveryDate: BaseSchemas.date.optional(),
    store: z.string().optional(),
    orderNumber: z.string().optional(),
    purchasePrice: BaseSchemas.positiveNumber.optional(),
    weightGrams: BaseSchemas.positiveNumber.optional(),
    notes: z.string().optional(),
    trackingIn: z.string().optional(),
    carrier: z.string().optional(),
    declaredValue: BaseSchemas.positiveNumber.optional(),
    packageType: z.enum(['STANDARD', 'EXPRESS', 'FRAGILE', 'ELECTRONICS']).optional(),
    lengthCm: BaseSchemas.positiveNumber.optional(),
    widthCm: BaseSchemas.positiveNumber.optional(),
    heightCm: BaseSchemas.positiveNumber.optional(),
    status: z.enum(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).optional(),
  }),
}

export const FreightSchemas = {
  calculate: z.object({
    weightGrams: BaseSchemas.positiveNumber,
    serviceType: z.enum(['STANDARD', 'EXPRESS']).optional(),
    carrierId: BaseSchemas.id.optional(),
  }),

  calculateWithTaxes: z.object({
    productValue: BaseSchemas.positiveNumber,
    weightGrams: BaseSchemas.positiveNumber,
    serviceType: z.enum(['STANDARD', 'EXPRESS']).optional(),
    carrierId: BaseSchemas.id.optional(),
  }),
}

export const PaymentSchemas = {
  create: z.object({
    packageId: BaseSchemas.id,
    amount: BaseSchemas.positiveNumber,
    currency: z.enum(['USD', 'BRL']).default('USD'),
    paymentMethod: z.enum(['STRIPE', 'PAYPAL', 'PIX', 'BOLETO']),
    description: z.string().optional(),
  }),

  update: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']),
    transactionId: z.string().optional(),
    notes: z.string().optional(),
  }),
}

export const SupportSchemas = {
  createTicket: z.object({
    subject: z.string().min(1, 'Assunto é obrigatório'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
    category: z.enum(['GENERAL', 'TECHNICAL', 'BILLING', 'SHIPPING']).default('GENERAL'),
  }),

  createMessage: z.object({
    ticketId: BaseSchemas.id,
    content: z.string().min(1, 'Mensagem é obrigatória'),
    isInternal: z.boolean().default(false),
  }),
}

export const UserSchemas = {
  updateProfile: z.object({
    name: BaseSchemas.name.optional(),
    phone: BaseSchemas.phone.optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
  }),

  evaluation: z.object({
    communicationScore: z.number().min(0).max(10),
    punctualityScore: z.number().min(0).max(10),
    packageCareScore: z.number().min(0).max(10),
    cooperationScore: z.number().min(0).max(10),
    problemResolutionScore: z.number().min(0).max(10),
    loyaltyScore: z.number().min(0).max(10),
    strengths: z.string().optional(),
    weaknesses: z.string().optional(),
    recommendations: z.string().optional(),
  }),
}

// Função utilitária para validar dados
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string; status: number }> {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: errorMessage, status: 400 }
    }
    return { success: false, error: 'Erro de validação', status: 400 }
  }
}

// Função para validar parâmetros de URL
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string; status: number } {
  try {
    const params = Object.fromEntries(searchParams.entries())
    const data = schema.parse(params)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: errorMessage, status: 400 }
    }
    return { success: false, error: 'Erro de validação de parâmetros', status: 400 }
  }
}

// Função para validar IDs de rota
export function validateRouteParams<T>(
  params: Record<string, string | string[]>,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string; status: number } {
  try {
    const data = schema.parse(params)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return { success: false, error: errorMessage, status: 400 }
    }
    return { success: false, error: 'Erro de validação de parâmetros de rota', status: 400 }
  }
}

// Schemas para parâmetros de URL comuns
export const CommonQuerySchemas = {
  pagination: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
  }),

  filter: z.object({
    status: z.string().optional(),
    category: z.string().optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  }),

  search: z.object({
    q: z.string().min(1, 'Termo de busca é obrigatório'),
    type: z.string().optional(),
  }),
}

// Função para criar resposta de erro padronizada
export function createErrorResponse(
  error: string,
  details?: unknown
) {
  return {
    success: false,
    error,
    ...(details ? { details } : {}),
    timestamp: new Date().toISOString(),
  }
}

// Função para criar resposta de sucesso padronizada
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: unknown
) {
  return {
    success: true,
    data,
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
    timestamp: new Date().toISOString(),
  }
}
