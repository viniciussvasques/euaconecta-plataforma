# Middlewares Compartilhados

Esta pasta contém middlewares transversais que implementam funcionalidades comuns de infraestrutura seguindo princípios de Clean Architecture.

## Arquitetura

```
src/shared/middlewares/
├── index.ts          # Exports e utilitários
├── auth.ts           # Autenticação JWT
├── rate-limit.ts     # Controle de taxa de requisições
├── security.ts       # Headers de segurança HTTP
└── logging.ts        # Logging estruturado e auditoria
```

## Middlewares Disponíveis

### 1. Auth (`auth.ts`)
Middleware de autenticação baseado em JWT.

**Uso:**
```typescript
import { withAuth } from '@/shared/middlewares'

export const GET = withAuth(async (request) => {
  // Handler autenticado
})
```

**Funcionalidades:**
- Validação de tokens JWT
- Extração de dados do usuário
- Tipagem TypeScript forte
- Tratamento de erros padronizado

### 2. Rate Limit (`rate-limit.ts`)
Controle de taxa de requisições para prevenir abusos.

**Configurações disponíveis:**
```typescript
RATE_LIMIT_CONFIGS = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },    // 5 req/15min
  general: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 req/15min
  upload: { maxRequests: 10, windowMs: 60 * 60 * 1000 },   // 10 req/hora
  payment: { maxRequests: 5, windowMs: 60 * 60 * 1000 },   // 5 req/hora
}
```

**Uso:**
```typescript
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/shared/middlewares'

export const POST = withRateLimit(
  async (request) => { /* handler */ },
  RATE_LIMIT_CONFIGS.auth
)
```

### 3. Security (`security.ts`)
Headers de segurança HTTP e proteção CSRF.

**Headers aplicados:**
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` (básica)
- `Strict-Transport-Security`
- E outros...

**Uso:**
```typescript
import { withSecurity } from '@/shared/middlewares'

export const GET = withSecurity(async (request) => {
  // Handler com headers de segurança
})
```

### 4. Logging (`logging.ts`)
Logging estruturado com níveis e auditoria.

**Níveis de log:**
- `ERROR` - Erros críticos
- `WARN` - Avisos
- `INFO` - Informações gerais
- `DEBUG` - Debug (apenas desenvolvimento)

**Uso:**
```typescript
import { logger, withLogging, withAudit } from '@/shared/middlewares'

// Log manual
logger.info('Usuário logado', { userId: '123', ip: '192.168.1.1' })

// Middleware de logging automático
export const POST = withLogging(async (request) => {
  // Todas as requisições são logadas automaticamente
})

// Middleware de auditoria
export const DELETE = withAudit(
  async (request) => { /* handler */ },
  'user-deletion'
)
```

## Pipeline de API

Para rotas críticas, use o `createApiPipeline` que combina múltiplos middlewares:

```typescript
import { createApiPipeline, RATE_LIMIT_CONFIGS } from '@/shared/middlewares'

export const POST = createApiPipeline(
  async (request) => {
    // Handler da API
    return NextResponse.json({ success: true })
  },
  {
    requireAuth: true,
    rateLimit: RATE_LIMIT_CONFIGS.auth,
    enableAudit: true,
    auditAction: 'user-login'
  }
)
```

## Princípios de Design

1. **Clean Architecture**: Middlewares são infraestrutura transversal
2. **SOLID**: Cada middleware tem responsabilidade única
3. **TypeScript First**: Tipagem forte e segura
4. **Composição**: Middlewares podem ser combinados
5. **Configuração**: Middlewares aceitam configurações customizáveis
6. **Testabilidade**: Funções puras e interfaces claras

## Segurança

- **Rate Limiting**: Previne ataques de força bruta e DoS
- **Headers de Segurança**: Protege contra XSS, clickjacking, etc.
- **CSRF Protection**: Tokens para prevenir ataques CSRF
- **Auditoria**: Logs de todas as ações sensíveis
- **JWT Seguro**: Validação robusta de tokens

## Performance

- **Singleton Pattern**: Instâncias únicas onde apropriado
- **Cache Inteligente**: Rate limiting com limpeza automática
- **Lazy Loading**: Imports otimizados
- **Streaming**: Não bloqueia respostas

## Monitoramento

Todos os middlewares incluem logging estruturado para:
- Métricas de performance
- Detecção de anomalias
- Auditoria de segurança
- Debugging em produção