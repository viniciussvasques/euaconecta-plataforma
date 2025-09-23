# Módulo Auth - Clean Architecture

Refatoração completa do módulo de autenticação seguindo princípios de Clean Architecture, SOLID e Domain-Driven Design.

## 🏗️ Arquitetura

```
src/modules/auth/
├── domain/                 # Regras de negócio (Domain Layer)
│   ├── types.ts           # Entidades, Value Objects, Interfaces
│   └── services.ts        # Domain Services (regras puras)
├── application/           # Casos de uso (Application Layer)
│   └── use-cases.ts       # Use Cases (orquestração)
├── infrastructure/        # Adaptadores externos (Infrastructure Layer)
│   └── repositories.ts    # Repositories, Services externos
├── di/                    # Dependency Injection
│   └── container.ts       # Container de dependências
├── presentation/          # API Routes (Presentation Layer)
│   └── handlers-simple.ts # Handlers Next.js
└── README.md              # Esta documentação
```

## 🎯 Princípios Implementados

### Clean Architecture
- **Domain Layer**: Regras de negócio puras, independentes de frameworks
- **Application Layer**: Casos de uso que orquestram as regras de negócio
- **Infrastructure Layer**: Adaptadores para bancos, APIs externas, etc.
- **Presentation Layer**: Controllers/API routes específicos do framework

### SOLID Principles
- **Single Responsibility**: Cada classe tem uma responsabilidade única
- **Open/Closed**: Extensível sem modificar código existente
- **Liskov Substitution**: Subtipos podem substituir seus tipos base
- **Interface Segregation**: Interfaces específicas para cada cliente
- **Dependency Inversion**: Dependências invertidas para abstrações

### Domain-Driven Design
- **Entities**: User como aggregate root
- **Value Objects**: UserPermissions, UserProfile, UserCredentials
- **Domain Services**: UserDomainService, AuthDomainService
- **Repository Pattern**: Abstração de persistência
- **Use Cases**: Aplicação das regras de negócio

## 🔧 Funcionalidades

### ✅ Implementadas
- **Registro de usuários** com validação e criptografia
- **Login com JWT** e refresh tokens
- **Listagem de usuários** com filtros
- **Rate limiting** integrado
- **Auditoria e logging** estruturado
- **Validação de dados** com Zod
- **Clean Architecture** completa

### 🚧 Em Desenvolvimento
- Controle de tentativas de login
- Bloqueio automático de contas
- Refresh token rotation
- Invalidação de tokens
- Gestão de permissões granulares

### 📋 Planejadas
- Autenticação 2FA
- OAuth social login
- Controle de sessão
- Reset de senha
- Verificação de email

## 🚀 Como Usar

### Registro de Usuário
```typescript
POST /api/auth/register
{
  "email": "user@example.com",
  "name": "João Silva",
  "password": "senha123456",
  "role": "CLIENT"
}
```

### Login
```typescript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "senha123456"
}
```

### Listar Usuários (Autenticado)
```typescript
GET /api/users
Authorization: Bearer <token>
```

## 🔒 Segurança

### Rate Limiting
- **Auth endpoints**: 5 requests/15min
- **General endpoints**: 100 requests/15min
- **Upload endpoints**: 10 requests/hora
- **Payment endpoints**: 5 requests/hora

### Headers de Segurança
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` básica
- `Strict-Transport-Security`

### JWT Seguro
- Tokens HTTP-only cookies
- Refresh token rotation
- Expiração configurável
- Secret forte (32+ caracteres)

### Validação
- Schemas Zod para entrada/saída
- Sanitização automática
- Tipagem TypeScript strict
- Tratamento de erros padronizado

## 📊 Logs e Auditoria

### Níveis de Log
- **ERROR**: Erros críticos
- **WARN**: Avisos importantes
- **INFO**: Informações gerais
- **DEBUG**: Debug (desenvolvimento)

### Eventos Auditados
- Registro de usuários
- Tentativas de login
- Acesso a recursos sensíveis
- Modificações de dados

### Formato Estruturado
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "User logged in",
  "userId": "user123",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

## 🧪 Testes

### Unitários
```bash
npm test src/modules/auth/domain/
npm test src/modules/auth/application/
```

### Integração
```bash
npm test src/modules/auth/infrastructure/
```

### E2E
```bash
npm test src/modules/auth/presentation/
```

## 🔄 Migração

O módulo foi completamente reescrito seguindo Clean Architecture. Para migrar:

1. **Atualizar imports**: Use os novos handlers da presentation layer
2. **Adaptar middlewares**: Use `createApiPipeline` ao invés de middlewares antigos
3. **Atualizar tipos**: Use tipos do domain layer
4. **Testar endpoints**: Verificar compatibilidade com APIs existentes

## 📈 Benefícios

### Manutenibilidade
- Código organizado por responsabilidades
- Interfaces claras e testáveis
- Facilita mudanças e evoluções

### Escalabilidade
- Separação de camadas permite escalar independentemente
- Dependency injection facilita mocking e testes
- Domain rules podem ser reutilizadas

### Segurança
- Rate limiting integrado
- Headers de segurança automáticos
- Validação rigorosa de entrada
- Auditoria completa

### Desenvolvimento
- TypeScript strict previne bugs
- Clean code facilita onboarding
- Testes automatizados garantem qualidade
- Documentação integrada ao código

## 🎯 Roadmap

### Fase 2: Segurança Avançada
- [ ] Controle de tentativas de login
- [ ] Bloqueio automático de contas
- [ ] Refresh token rotation
- [ ] Invalidação de tokens

### Fase 3: Funcionalidades Avançadas
- [ ] Autenticação 2FA
- [ ] OAuth social login
- [ ] Controle de sessão
- [ ] Reset de senha por email

### Fase 4: Otimização
- [ ] Cache Redis para sessões
- [ ] Otimização de queries
- [ ] Monitoramento de performance
- [ ] Load testing

Esta refatoração transforma o módulo auth de código legado em uma arquitetura profissional, segura e manutenível.