// Status HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Mensagens padrão
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login realizado com sucesso',
    REGISTER: 'Usuário criado com sucesso',
    LOGOUT: 'Logout realizado com sucesso',
    UPDATED: 'Atualizado com sucesso',
    DELETED: 'Removido com sucesso',
    CREATED: 'Criado com sucesso',
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Credenciais inválidas',
    USER_NOT_FOUND: 'Usuário não encontrado',
    UNAUTHORIZED: 'Acesso não autorizado',
    FORBIDDEN: 'Acesso proibido',
    VALIDATION_FAILED: 'Dados inválidos',
    INTERNAL_ERROR: 'Erro interno do servidor',
    NOT_FOUND: 'Recurso não encontrado',
    ALREADY_EXISTS: 'Registro já existe',
  },
} as const

// Limites e configurações
export const LIMITS = {
  UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  PAGINATION_MAX_LIMIT: 100,
  PAGINATION_DEFAULT_LIMIT: 10,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const

// Roles do sistema
export const ROLES = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const

// Status de pacotes
export const PACKAGE_STATUS = {
  PENDING: 'PENDING',
  RECEIVED: 'RECEIVED',
  READY_TO_SHIP: 'READY_TO_SHIP',
  SHIPPED: 'SHIPPED',
} as const

// Status de consolidação
export const CONSOLIDATION_STATUS = {
  OPEN: 'OPEN',
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

// Status de envio
export const SHIPMENT_STATUS = {
  DRAFT: 'DRAFT',
  LABEL_CREATED: 'LABEL_CREATED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
} as const

// Categorias de proteção
export const PROTECTION_CATEGORIES = {
  BASIC: 'BASIC_PROTECTION',
  PREMIUM: 'PREMIUM_PROTECTION',
  FRAGILE: 'FRAGILE_ITEMS',
  ELECTRONICS: 'ELECTRONICS',
  CLOTHING: 'CLOTHING',
  CUSTOM: 'CUSTOM',
} as const