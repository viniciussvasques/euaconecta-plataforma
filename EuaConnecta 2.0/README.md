# 🇧🇷 EuaConnecta 2.0

**Plataforma de Logística Internacional Enterprise-Grade**

> Transformando a experiência de envio internacional com tecnologia de ponta, arquitetura robusta e foco total na satisfação do cliente.

## 🚀 Visão Geral

EuaConnecta 2.0 é uma plataforma completa de logística internacional que conecta clientes com os melhores serviços de transporte global. Nossa arquitetura enterprise-grade garante escalabilidade, segurança e performance excepcional.

### ✨ Características Principais

- **🏗️ Clean Architecture**: Separação clara de responsabilidades
- **🔒 Segurança Enterprise**: Autenticação robusta, criptografia e compliance
- **⚡ Performance**: Otimizado para alta carga e baixa latência
- **🔧 TypeScript Strict**: Código type-safe e manutenível
- **🧪 Testes Abrangentes**: Cobertura >80% com testes unitários e integração
- **📊 Observabilidade**: Logging estruturado e métricas detalhadas
- **🐳 Container Ready**: Docker e Kubernetes preparados
- **📱 API-First**: Design centrado em APIs RESTful

## 🏛️ Arquitetura

### Clean Architecture em Camadas

```
┌─────────────────────────────────────────┐
│           📱 Presentation Layer         │
│   Controllers, DTOs, Middlewares       │
├─────────────────────────────────────────┤
│           🏢 Application Layer          │
│   Use Cases, Commands, Queries         │
├─────────────────────────────────────────┤
│           🎯 Domain Layer               │
│   Entities, Value Objects, Services     │
├─────────────────────────────────────────┤
│           🗄️ Infrastructure Layer       │
│   Repositories, External Services       │
└─────────────────────────────────────────┘
```

### Estrutura de Módulos

```
src/
├── modules/                    # Módulos de negócio
│   ├── auth/                  # Autenticação & Autorização
│   ├── users/                 # Gestão de usuários
│   ├── packages/              # Gestão de pacotes
│   ├── shipments/             # Gestão de envios
│   ├── payments/              # Processamento de pagamentos
│   ├── carriers/              # Transportadoras
│   ├── consolidation/         # Consolidação
│   ├── notifications/         # Notificações
│   ├── storage/               # Armazenamento de arquivos
│   └── dashboard/             # Dashboard & Analytics
├── shared/                    # Infraestrutura compartilhada
│   ├── config/               # Configurações centralizadas
│   ├── middlewares/          # Middlewares HTTP
│   ├── utils/                # Utilitários
│   ├── types/                # Tipos compartilhados
│   └── constants/            # Constantes
├── app/                      # Next.js App Router
│   ├── api/                  # Rotas da API
│   ├── components/           # Componentes React
│   ├── hooks/                # Custom hooks
│   └── layouts/              # Layouts da aplicação
└── types/                    # Definições de tipos globais
```

## 🛠️ Tecnologias

### Core
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript 5.3 (Strict Mode)
- **Banco**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Storage**: MinIO S3-compatible

### Segurança & Autenticação
- **JWT**: Tokens seguros com refresh
- **bcrypt**: Hashing de senhas
- **Helmet**: Headers de segurança HTTP
- **Rate Limiting**: Controle de taxa de requisições
- **CSRF Protection**: Proteção contra ataques CSRF

### Pagamentos
- **Stripe**: Processamento de cartões
- **PayPal**: Integração PayPal
- **PIX**: Pagamentos brasileiros
- **Boleto**: Boletos bancários

### Comunicação
- **Nodemailer**: Envio de emails SMTP
- **WebSockets**: Notificações em tempo real
- **SMS**: Integração com provedores

### Qualidade & Observabilidade
- **Jest**: Testes unitários e integração
- **ESLint**: Linting e formatação
- **Winston**: Logging estruturado
- **Sentry**: Error tracking
- **DataDog**: Métricas e monitoramento

## 🚀 Instalação & Configuração

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- MinIO (ou S3-compatible)
- Docker & Docker Compose

### Instalação

```bash
# Clonar repositório
git clone https://github.com/viniciussvasques/euaconecta-plataforma.git
cd euaconecta-plataforma/EuaConnecta\ 2.0

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Configurar banco de dados
npm run db:push

# Popular banco com dados iniciais
npm run db:seed

# Iniciar aplicação em modo desenvolvimento
npm run dev
```

### Docker

```bash
# Construir e iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Iniciar servidor de produção

# Banco de dados
npm run db:generate      # Gerar cliente Prisma
npm run db:push          # Sincronizar schema com banco
npm run db:migrate       # Executar migrações
npm run db:seed          # Popular banco com dados de teste
npm run db:studio        # Abrir Prisma Studio

# Qualidade de código
npm run lint             # Executar ESLint
npm run lint:fix         # Corrigir problemas de linting
npm run type-check       # Verificar tipos TypeScript

# Testes
npm run test             # Executar todos os testes
npm run test:watch       # Testes em modo watch
npm run test:coverage    # Testes com relatório de cobertura

# Utilitários
npm run clean            # Limpar builds e caches
npm run docker:build     # Construir imagem Docker
npm run docker:run       # Executar container
```

## 🔧 Configuração

### Variáveis de Ambiente

Ver arquivo `.env.example` para todas as variáveis necessárias.

### Banco de Dados

O schema do Prisma está localizado em `prisma/schema.prisma` e inclui:

- **Users**: Gestão completa de usuários com roles e permissões
- **Packages**: Controle de pacotes e consolidação
- **Shipments**: Gestão de envios e rastreamento
- **Payments**: Processamento de pagamentos múltiplos
- **Audit Logs**: Logs de auditoria para compliance

### Segurança

- **CORS**: Configurado para origens específicas
- **Helmet**: Headers de segurança automáticos
- **Rate Limiting**: Proteção contra abusos
- **Input Validation**: Zod schemas para validação
- **SQL Injection**: Prevenção via Prisma ORM

## 🧪 Testes

### Estrutura de Testes

```
tests/
├── unit/                    # Testes unitários
│   ├── modules/            # Testes por módulo
│   └── shared/             # Testes de utilitários
├── integration/            # Testes de integração
│   ├── api/               # Testes de endpoints
│   └── database/          # Testes de repositório
└── e2e/                   # Testes end-to-end
    ├── auth/              # Fluxos completos
    └── checkout/          # Jornada do usuário
```

### Executando Testes

```bash
# Todos os testes
npm run test

# Com cobertura
npm run test:coverage

# Testes específicos
npm run test -- src/modules/auth
npm run test -- tests/integration/api

# Modo watch
npm run test:watch
```

## 📊 Monitoramento & Observabilidade

### Logging

- **Estruturado**: JSON format com contexto
- **Níveis**: ERROR, WARN, INFO, DEBUG
- **Rotação**: Arquivos com rotação automática
- **Performance**: Logging assíncrono

### Métricas

- **Response Times**: Latência de endpoints
- **Error Rates**: Taxas de erro por endpoint
- **User Activity**: Ações dos usuários
- **System Health**: CPU, memória, conexões

### Alertas

- **Erros 5xx**: Notificação imediata
- **Performance**: Alertas de latência alta
- **Security**: Tentativas de intrusão
- **Business**: Métricas de negócio

## 🚢 Deploy

### Desenvolvimento

```bash
# Build e deploy local
npm run build
npm run start
```

### Produção

```bash
# Build otimizado
npm run build

# Deploy com PM2
pm2 start ecosystem.config.js

# Ou com Docker
docker build -t euaconecta-2.0 .
docker run -p 3000:3000 euaconecta-2.0
```

### Kubernetes

```bash
# Deploy no cluster
kubectl apply -f k8s/

# Verificar status
kubectl get pods
kubectl logs -f deployment/euaconecta-app
```

## 🤝 Contribuição

### Processo de Desenvolvimento

1. **Fork** o repositório
2. **Criar branch** para feature: `git checkout -b feature/nome-da-feature`
3. **Commits** seguindo conventional commits
4. **Push** para branch: `git push origin feature/nome-da-feature`
5. **Pull Request** com descrição detalhada

### Padrões de Código

- **TypeScript Strict**: Sem `any`, tipos explícitos
- **Clean Code**: Nomes descritivos, funções pequenas
- **SOLID**: Princípios de design orientado a objetos
- **DRY**: Não repetir código
- **TDD**: Testes primeiro quando possível

### Code Review

- ✅ **Aprovado**: Pelo menos 2 revisores
- ✅ **Testes**: Cobertura mantida >80%
- ✅ **Linting**: Sem erros de ESLint
- ✅ **Documentação**: READMEs atualizados

## 📚 Documentação

### API Documentation

- **Swagger/OpenAPI**: `/api/docs`
- **Postman Collection**: `docs/postman/`
- **API Examples**: `docs/api/examples/`

### Architecture Decision Records

- **ADRs**: `docs/architecture/decisions/`
- **Diagrams**: `docs/architecture/diagrams/`
- **Schemas**: `docs/architecture/schemas/`

## 🐛 Suporte & Issues

### Reportando Bugs

1. **Verificar** se já existe issue similar
2. **Criar issue** com template completo
3. **Incluir**: passos para reproduzir, logs, ambiente
4. **Label**: `bug`, `help wanted`, `good first issue`

### Suporte

- **Discord**: [Link do servidor]
- **Email**: suporte@euaconecta.com
- **Docs**: [Link da documentação]

## 📄 Licença

Este projeto está sob a licença MIT. Ver arquivo `LICENSE` para detalhes.

## 🙏 Agradecimentos

- **Comunidade Next.js** pela documentação excepcional
- **Prisma Team** pelo melhor ORM para TypeScript
- **Vercel** pela plataforma de deploy
- **Contribuidores** que ajudam a melhorar o projeto

---

**EuaConnecta 2.0** - Conectando o mundo através da logística inteligente 🇧🇷➡️🌍