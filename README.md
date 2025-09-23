# 🚀 Euaconecta Platform

> **Plataforma completa de consolidação e envio de pacotes dos EUA para o Brasil**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql)](https://postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://docker.com/)

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [🚀 Instalação](#-instalação)
- [📊 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔧 Configuração](#-configuração)
- [� Diretrizes de Desenvolvimento](#-diretrizes-de-desenvolvimento)
- [�📚 Documentação da API](#-documentação-da-api)
- [🐳 Deploy com Docker](#-deploy-com-docker)
- [✅ Status do Projeto](#-status-do-projeto)
- [👥 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

## 🎯 Visão Geral

A **Euaconecta Platform** é uma solução completa para empresas que oferecem serviços de consolidação e envio de pacotes dos Estados Unidos para o Brasil. A plataforma oferece:

- **Gestão completa de pacotes** com rastreamento em tempo real
- **Sistema de consolidação inteligente** para otimizar custos de frete
- **Integração com múltiplas transportadoras** (UPS, FedEx, USPS, DHL, Amazon)
- **Processamento de pagamentos** via Stripe, PayPal, PIX e Boleto
- **Dashboard administrativo** completo com relatórios e analytics
- **Sistema de personalização** para branding e identidade visual
- **Suporte ao cliente** integrado com tickets e chat

## ✨ Funcionalidades

### 🔐 **Sistema de Autenticação**
- Login/registro com email e senha
- Ativação de conta por email
- Sistema de permissões por role (Admin, Operador, Cliente)
- Middleware de autenticação para rotas protegidas

### 📦 **Gestão de Pacotes**
- Recebimento e confirmação de pacotes
- Upload de fotos e documentação
- Rastreamento de peso e dimensões
- Status de rastreamento em tempo real
- Histórico completo de movimentações

### 📋 **Sistema de Consolidação**
- Criação de caixas de consolidação
- Adição/remoção de pacotes
- Cálculo automático de peso e dimensões
- Proteções extras (bubble wrap, dupla caixa)
- Fechamento e envio automatizado

### 🚚 **Sistema de Envios**
- Integração com múltiplas transportadoras
- Cálculo automático de frete
- Geração de etiquetas de envio
- Rastreamento de entregas
- Notificações de status

### 💳 **Sistema de Pagamentos**
- **Stripe** - Cartões de crédito/débito
- **PayPal** - Conta PayPal e cartões
- **PIX** - Pagamento instantâneo (Brasil)
- **Boleto** - Boleto bancário (Brasil)
- Webhooks para confirmação automática

### 🎨 **Sistema de Personalização**
- Configuração de cores e branding
- Upload de logos e favicons
- Templates de email personalizáveis
- Configurações por seção (landing, dashboard, admin)
- Preview em tempo real

### 📊 **Relatórios e Analytics**
- Dashboard com métricas em tempo real
- Relatórios em PDF e Excel
- Filtros avançados por período
- Exportação de dados
- Analytics de performance

### 🔔 **Sistema de Notificações**
- Email automático para eventos importantes
- Notificações in-app
- Configurações personalizáveis por usuário
- Templates de notificação editáveis

### 🎫 **Sistema de Suporte**
- Tickets de suporte categorizados
- Chat integrado entre cliente e admin
- Sistema de priorização
- Histórico completo de atendimentos

## 🛠️ Stack Tecnológica

### **Frontend**
- **Next.js 15.5.2** - Framework React com App Router e Turbopack
- **React 19.1.0** - Biblioteca de interface com recursos de concorrência
- **TypeScript 5.9.2** - Tipagem estática avançada
- **Tailwind CSS 4** - Framework CSS utilitário moderno
- **Lucide React** - Biblioteca de ícones
- **React Hook Form** - Gerenciamento de formulários otimizado

### **Backend**
- **Next.js API Routes** - 210+ endpoints API serverless
- **NextAuth.js 4.24.11** - Sistema de autenticação completo
- **Prisma ORM 6.15.0** - 40+ modelos de dados otimizados
- **PostgreSQL 15** - Banco de dados principal com índices

### **Pagamentos & Integrações**
- **Stripe** - Processamento de cartões e PIX
- **PayPal** - Gateway alternativo de pagamentos
- **MinIO S3** - Armazenamento compatível com AWS S3
- **Redis/IORedis** - Cache e sessões
- **Nodemailer** - Sistema de emails transacionais

### **DevOps & Infraestrutura**
- **Docker Multi-stage** - Containerização otimizada
- **Nginx** - Proxy reverso com SSL
- **Winston Logging** - Sistema de logs estruturado
- **Jest** - Framework de testes unitários
- **ESLint** - Análise estática de código

## 🚀 Instalação

### **Pré-requisitos**
- Node.js 18+ (recomendado: 20+)
- PostgreSQL 15+
- Redis (opcional, para cache)
- Docker & Docker Compose (opcional)

### **1. Clone o repositório**
```bash
git clone https://github.com/viniciussvasques/euaconecta-plataforma.git
cd euaconecta-plataforma
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/euaconecta"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@euaconecta.com"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"

# AWS S3
S3_ENDPOINT="https://s3.amazonaws.com"
S3_REGION="us-east-1"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_BUCKET="euaconecta-files"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### **4. Configure o banco de dados**
```bash
# Execute as migrações
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate

# Execute o seed para dados iniciais
npx prisma db seed
```

### **5. Execute os scripts de configuração**
```bash
# Configure transportadoras e dados padrão
node scripts/setup-default-config.js
node scripts/setup-abc-pricing-table.js
node scripts/setup-major-carriers.js

# Configure provedores de pagamento
node scripts/setup-payment-providers.js

# Crie templates de email
node scripts/seed-email-templates.js

# Crie usuários padrão
node scripts/create-users.js
```

### **6. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📊 Estrutura do Projeto

```
euaconecta-platform/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 (admin)/           # Rotas administrativas
│   │   ├── 📁 (client)/          # Rotas do cliente
│   │   ├── 📁 admin/             # Painel administrativo
│   │   ├── 📁 api/               # API Routes
│   │   └── 📁 auth/              # Autenticação
│   ├── 📁 components/            # Componentes reutilizáveis
│   └── 📁 lib/                   # Utilitários e serviços
├── 📁 prisma/                    # Schema e migrações do banco
├── 📁 scripts/                   # Scripts de setup e manutenção
├── 📁 docs/                      # Documentação
└── 📁 docker/                    # Configurações Docker
```

### **Principais Diretórios**

- **`src/app/api/`** - 50+ endpoints da API
- **`src/app/admin/`** - Painel administrativo completo
- **`src/app/(client)/`** - Dashboard do cliente
- **`src/lib/`** - Serviços e utilitários
- **`prisma/`** - Schema do banco com 25 tabelas
- **`scripts/`** - Scripts de configuração e manutenção

## 🔧 Configuração

### **Banco de Dados**
O sistema utiliza PostgreSQL com Prisma ORM. O schema inclui:

- **25 tabelas** com relacionamentos completos
- **Sistema de auditoria** para rastreamento de mudanças
- **Índices otimizados** para performance
- **Migrações versionadas** para controle de schema

### **Autenticação**
- **NextAuth.js** com Prisma Adapter
- **Sistema de roles** (SUPER_ADMIN, ADMIN, OPERATOR, CLIENT)
- **Permissões granulares** por funcionalidade
- **Middleware de proteção** para rotas sensíveis

### **Pagamentos**
- **Stripe** para cartões internacionais
- **PayPal** para pagamentos globais
- **PIX** para pagamentos no Brasil
- **Boleto** para pagamentos tradicionais
- **Webhooks** para confirmação automática

## � Diretrizes de Desenvolvimento

O projeto segue um conjunto rigoroso de diretrizes para garantir qualidade e consistência no código:

- **[DIRETRIZES_DESENVOLVIMENTO.md](/docs/DIRETRIZES_DESENVOLVIMENTO.md)** - Práticas gerais de desenvolvimento
- **[TYPESCRIPT_TIPOS.md](/docs/TYPESCRIPT_TIPOS.md)** - Guia para uso correto de tipos TypeScript
- **[ESLINT_CONFIG_TYPESCRIPT.md](/docs/ESLINT_CONFIG_TYPESCRIPT.md)** - Configuração ESLint recomendada
- **[EXEMPLO_REFATORACAO_TYPES.md](/docs/EXEMPLO_REFATORACAO_TYPES.md)** - Exemplos práticos de refatoração

### Princípios Principais

1. **Type Safety** - Nunca use `any` em código novo; prefira tipos explícitos
2. **Componentização** - Componentes pequenos e reutilizáveis
3. **Testabilidade** - Código facilmente testável com alta cobertura
4. **Documentação** - Código autodocumentado com JSDoc quando necessário
5. **Performance** - Otimização desde o início do desenvolvimento

## �📚 Documentação da API

A API completa está documentada em:
- **`docs/api/API_DOCUMENTATION.md`** - Documentação completa
- **`docs/api/openapi.yaml`** - Especificação OpenAPI
- **`docs/api/API_EXAMPLES.md`** - Exemplos de uso

### **Principais Endpoints**

```bash
# Autenticação
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me

# Pacotes
GET    /api/packages
POST   /api/packages
GET    /api/packages/[id]
PUT    /api/packages/[id]

# Consolidação
GET    /api/consolidation
POST   /api/consolidation
POST   /api/consolidation/[id]/add-package
POST   /api/consolidation/[id]/close

# Envios
GET    /api/shipments
POST   /api/shipments
GET    /api/shipments/[id]

# Transportadoras
GET    /api/carriers
POST   /api/carriers
PUT    /api/carriers/[id]

# Pagamentos
POST   /api/payments/create-intent
POST   /api/payments/confirm
POST   /api/stripe/create-checkout-session
POST   /api/paypal/create-order
```

## � Status do Projeto

> **Status:** ✅ **95% Funcional** - Core features implementadas e funcionais

### **Funcionalidades Implementadas**
- ✅ **Autenticação completa** - Login, registro, recuperação de senha
- ✅ **Gestão de pacotes** - Recebimento, fotos, rastreamento
- ✅ **Sistema de consolidação** - Criação, gerenciamento de caixas
- ✅ **Processamento de pagamentos** - Stripe, PayPal com webhooks
- ✅ **Dashboard administrativo** - Relatórios, métricas, usuários
- ✅ **API completa** - 210+ endpoints implementados
- ✅ **Sistema de endereços** - Múltiplos endereços por usuário
- ✅ **Notificações** - Email, in-app, webhooks

### **Documentação Técnica**
📋 **[Análise Completa do Projeto](docs/analysis/ANALISE_COMPLETA_PROJETO.md)** - Review técnico detalhado
🗺️ **[Plano Estratégico](docs/analysis/PLANO_ACAO_ESTRATEGICO.md)** - Roadmap de implementação
📚 **[Documentação da API](docs/api/API_DOCUMENTATION.md)** - Endpoints e exemplos

### **Próximos Passos (Sprint 1)**
🔧 **Correções críticas** - API 404s, CSP, erros JavaScript
⚡ **Otimizações** - Performance, build, cache
🎨 **Refinamentos UI/UX** - Responsividade, acessibilidade

## �🐳 Deploy com Docker

### **1. Build da imagem**
```bash
docker build -t euaconecta-platform .
```

### **2. Execute com Docker Compose**
```bash
docker-compose up -d
```

### **3. Configure o banco de dados**
```bash
# Execute as migrações
docker exec -it euaconecta-platform npx prisma migrate deploy

# Execute o seed
docker exec -it euaconecta-platform npx prisma db seed
```

## 🚀 Deploy em Produção

### **Vercel (Recomendado)**
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### **Railway/Neon (Banco de Dados)**
1. Crie uma instância PostgreSQL
2. Configure a `DATABASE_URL`
3. Execute as migrações

### **AWS S3 (Storage)**
1. Crie um bucket S3
2. Configure as credenciais
3. Ajuste as permissões

## 👥 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Email**: support@euaconecta.com
- **Documentação**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/viniciussvasques/euaconecta-plataforma/issues)

---

**Desenvolvido com ❤️ para conectar o Brasil aos EUA**