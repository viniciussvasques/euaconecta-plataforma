# Implementações de Segurança - Documentação Técnica

## 1. Proteção CSRF

### 1.1. Visão Geral

A proteção CSRF (Cross-Site Request Forgery) implementada utiliza uma abordagem token-based, combinada com validação de origem e configurações seguras de cookies.

### 1.2. Componentes

- **Geração de Token**: Tokens criptograficamente seguros gerados via `crypto.randomBytes`
- **Cookie com Token**: Cookie HttpOnly, SameSite=Strict, Secure
- **Validação de Token**: Comparação entre token no cookie e token no cabeçalho ou formulário
- **Validação de Origem**: Verificação dos cabeçalhos Origin e Referer
- **Middleware**: Implementação no middleware do Next.js

### 1.3. Fluxo de Funcionamento

1. **Geração do Token**:
   - Durante renderização de página ou em resposta à API GET
   - Token armazenado em cookie e enviado para o frontend

2. **Submissão do Token**:
   - Frontend inclui token em cabeçalho (`X-CSRF-Token`) ou campo de formulário (`_csrf`)

3. **Validação**:
   - Middleware verifica se o token do cookie corresponde ao token da requisição
   - Middleware verifica se a origem da requisição é válida
   - Se inválido, retorna erro 403 Forbidden

### 1.4. Implementação

```typescript
// Trecho da implementação
export function validateCsrfToken(request: NextRequest): boolean {
  // Somente validar métodos protegidos
  if (!CSRF_CONFIG.protectedMethods.includes(request.method)) {
    return true
  }
  
  // Obter o token do cookie
  const cookieToken = getCsrfTokenFromRequest(request)
  if (!cookieToken) {
    return false
  }
  
  // Verificar se o token expirou
  if (new Date() > cookieToken.expiresAt) {
    return false
  }
  
  // Obter o token do cabeçalho ou formulário
  const headerToken = request.headers.get(CSRF_CONFIG.headerName)
  
  // Comparar tokens
  return headerToken === cookieToken.token
}
```

## 2. Validação Avançada

### 2.1. Visão Geral

O sistema implementa validação robusta de entrada usando Zod, com regras específicas para diferentes tipos de dados e validadores reutilizáveis.

### 2.2. Schemas Base

- **Email**: Formato válido
- **Senha**: Mínimo 8 caracteres, com maiúsculas, minúsculas, números e caracteres especiais
- **ID**: String não vazia
- **Números**: Validações para positivos, não negativos, ranges

### 2.3. Schemas Específicos

- **Autenticação**: Login, registro, redefinição de senha
- **Pacotes**: Criação e atualização de pacotes
- **Frete**: Cálculo de frete com ou sem impostos
- **Pagamento**: Criação e atualização de pagamentos
- **Suporte**: Criação de tickets e mensagens

### 2.4. Funções de Validação

- `validateRequest`: Validação de corpo da requisição
- `validateSearchParams`: Validação de parâmetros de URL
- `validateRouteParams`: Validação de parâmetros de rota

### 2.5. Implementação

```typescript
// Validação de senha
password: z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve ter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve ter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'Senha deve ter pelo menos um caractere especial')
```

## 3. Mascaramento de Dados Sensíveis

### 3.1. Visão Geral

O sistema implementa mascaramento avançado de dados sensíveis em logs, com estratégias específicas para diferentes tipos de dados.

### 3.2. Tipos de Dados Mascarados

- **Autenticação**: Senhas, tokens, credenciais
- **Dados Pessoais**: Email, CPF, CNPJ, telefone
- **Dados Financeiros**: Cartão de crédito, CVV, conta bancária
- **Dados de Endereço**: CEP, código postal
- **Dados Biométricos**: Digital, face ID

### 3.3. Estratégias de Mascaramento

- **Completo**: Substitui todo o valor por asteriscos
- **Parcial**: Mantém alguns caracteres visíveis para referência
- **Customizado**: Lógicas específicas para formatos especiais

### 3.4. Implementação

O mascaramento é aplicado automaticamente durante o logging, sem exigir configuração adicional por parte dos desenvolvedores.

```typescript
// Mascaramento de email
if (value.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { 
  const [local, domain] = value.split('@')
  if (local.length <= 2) {
    return `${'*'.repeat(local.length)}@${domain}`
  }
  return `${local.charAt(0)}${'*'.repeat(local.length - 2)}${local.charAt(local.length - 1)}@${domain}`
}
```

## 4. Rate Limiting

### 4.1. Visão Geral

O sistema implementa rate limiting para proteger APIs contra abusos, com configurações específicas para diferentes tipos de endpoints.

### 4.2. Configurações

- **Autenticação**: 5 tentativas/15 minutos
- **APIs Gerais**: 100 requests/15 minutos
- **Upload**: 10 uploads/hora
- **Pagamento**: 5 tentativas/hora
- **Suporte**: 20 tickets/hora

### 4.3. Componentes

- **Store**: Armazenamento em memória (em produção, recomendado Redis)
- **Geração de Chave**: Baseada em IP, usuário ou combinação
- **Middleware**: Verificação e aplicação de limites
- **Headers**: Informação ao cliente sobre status do rate limiting

### 4.4. Implementação

```typescript
// Verificação de rate limit
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const key = config.keyGenerator
    ? config.keyGenerator(request)
    : getCompositeKey(request)

  const entry = store.increment(key, config.windowMs)

  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  }
}
```

## 5. Headers de Segurança

### 5.1. Visão Geral

O sistema implementa headers de segurança para proteger contra ataques comuns da web.

### 5.2. Headers Implementados

- **X-Frame-Options**: Previne clickjacking
- **X-Content-Type-Options**: Previne MIME type sniffing
- **Referrer-Policy**: Controla informação de referrer
- **Permissions-Policy**: Limita acesso a recursos sensíveis
- **Content-Security-Policy**: Controla quais recursos podem ser carregados

### 5.3. Implementação

```typescript
// Headers de segurança no middleware
response.headers.set('X-Frame-Options', 'DENY')
response.headers.set('X-Content-Type-Options', 'nosniff')
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
```

## 6. Auditoria

### 6.1. Visão Geral

O sistema implementa auditoria abrangente para monitorar e registrar ações críticas no sistema.

### 6.2. Eventos Auditados

- **Criação**: Registro de novas entidades
- **Atualização**: Alterações em entidades existentes
- **Exclusão**: Remoção de entidades
- **Ações Personalizadas**: Eventos específicos do negócio

### 6.3. Dados Registrados

- **Usuário**: Quem realizou a ação
- **Ação**: O que foi feito
- **Entidade**: Tipo e ID da entidade afetada
- **Valores**: Estado anterior e atual (mascarados)
- **Contexto**: IP, user agent, timestamp

### 6.4. Implementação

```typescript
// Log de atualização
async logUpdate(
  userId: string,
  entityType: string,
  entityId: string,
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>,
  ipAddress?: string,
  userAgent?: string
): Promise<AuditLogData> {
  return this.create({
    userId,
    action: 'UPDATE',
    entityType,
    entityId,
    oldValues,
    newValues,
    ipAddress,
    userAgent
  })
}
```

## 7. Verificação de Dependências

### 7.1. Visão Geral

O sistema implementa verificação automática de vulnerabilidades em dependências usando Dependabot.

### 7.2. Configurações

- **Frequência**: Verificação semanal
- **Ecossistemas**: npm, GitHub Actions
- **Limites**: Máximo de 5 PRs abertos simultaneamente
- **Atribuição**: Equipe de segurança
- **Labels**: dependencies, security

### 7.3. Implementação

```yaml
# Configuração do Dependabot
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    security-updates-only: false
```

## 8. Testes de Segurança

### 8.1. Tipos de Testes

- **Testes Unitários**: Validação, autenticação, autorização
- **Testes de Integração**: APIs, fluxos sensíveis
- **Testes de Penetração**: Simulação de ataques

### 8.2. Ferramentas Recomendadas

- **OWASP ZAP**: Scan de vulnerabilidades
- **Burp Suite**: Testes de penetração
- **npm audit**: Verificação de dependências
- **SonarQube**: Análise estática de código