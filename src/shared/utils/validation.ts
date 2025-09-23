import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

// Schemas de validação comuns
export const emailSchema = z.string().email('Email inválido')
export const passwordSchema = z.string().min(8, 'Senha deve ter pelo menos 8 caracteres')
export const nameSchema = z.string().min(2, 'Nome deve ter pelo menos 2 caracteres')
export const cpfSchema = z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')
export const phoneSchema = z.string().regex(/^\d{10,11}$/, 'Telefone deve ter 10-11 dígitos')
export const idSchema = z.string().cuid('ID inválido')

// Schema para paginação
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Schema para login
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

// Schema para registro
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['CLIENT', 'ADMIN', 'SUPER_ADMIN', 'OPERATOR', 'MANAGER', 'SUPPORT']),
  cpf: cpfSchema.optional(),
  phone: phoneSchema.optional(),
})

// Tipos inferidos
export type LoginDto = z.infer<typeof loginSchema>
export type RegisterDto = z.infer<typeof registerSchema>

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Função para criar resposta de sucesso
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  pagination?: ApiResponse['pagination']
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    pagination,
  }
}

// Função para criar resposta de erro
export function createErrorResponse(
  message: string,
  errors?: string[]
): ApiResponse {
  return {
    success: false,
    message,
    errors,
  }
}

// Função para validar dados
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    errors: result.error.issues.map((issue) => issue.message)
  }
}

// Middleware de validação para APIs
export function withValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (request: NextRequest & { validatedData: T }) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    try {
      const body = await request.json()
      const validation = validateData(schema, body)

      if (!validation.success) {
        return NextResponse.json(
          createErrorResponse('Dados inválidos', validation.errors),
          { status: 400 }
        )
      }

      // Adicionar dados validados ao request
      const validatedRequest = Object.assign(request, { validatedData: validation.data })

      return handler(validatedRequest)
    } catch (_error) {
      return NextResponse.json(
        createErrorResponse('Erro interno do servidor'),
        { status: 500 }
      )
    }
  }
}

// Função para lidar com erros da API
export function handleApiError(error: any): NextResponse<ApiResponse> {
  console.error('API Error:', error)

  // Erros do Prisma
  if (error.code === 'P2002') {
    return NextResponse.json(
      createErrorResponse('Registro já existe', ['Este registro já está cadastrado']),
      { status: 409 }
    )
  }

  if (error.code === 'P2025') {
    return NextResponse.json(
      createErrorResponse('Registro não encontrado'),
      { status: 404 }
    )
  }

  // Erros de validação
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      createErrorResponse('Dados inválidos', error.issues.map(issue => issue.message)),
      { status: 400 }
    )
  }

  // Erro genérico
  return NextResponse.json(
    createErrorResponse('Erro interno do servidor'),
    { status: 500 }
  )
}