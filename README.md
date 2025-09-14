# 🚀 Euaconecta Platform

> Plataforma completa para gerenciamento de pacotes, consolidações e operações logísticas

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql)](https://postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Documentação](#-documentação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Visão Geral

A **Euaconecta Platform** é uma solução completa para gerenciamento de pacotes internacionais, consolidação de envios e operações logísticas. A plataforma permite que usuários recebam pacotes de diferentes lojas em um endereço nos EUA, consolidem os itens e os enviem para o Brasil de forma otimizada.

### 🎯 Objetivos

- **Simplificar** o processo de compras internacionais
- **Reduzir custos** de envio através da consolidação
- **Automatizar** operações logísticas
- **Fornecer transparência** total no processo
- **Garantir segurança** e rastreabilidade

---

## ✨ Funcionalidades

### 👥 Para Usuários (Clientes)
- 📦 **Gerenciamento de Pacotes** - Receba e organize seus pacotes
- 📋 **Consolidação Inteligente** - Combine múltiplos pacotes em um único envio
- 🏠 **Múltiplos Endereços** - Gerencie diferentes endereços de entrega
- 💳 **Pagamentos Integrados** - Stripe e PayPal integrados
- 📊 **Acompanhamento** - Rastreie seus envios em tempo real
- 📱 **Interface Responsiva** - Acesse de qualquer dispositivo

### 👨‍💼 Para Administradores
- 🎛️ **Dashboard Completo** - Visão geral de todas as operações
- 👥 **Gerenciamento de Usuários** - Controle total sobre contas
- 📦 **Gestão de Pacotes** - Monitoramento de todos os pacotes
- 📋 **Controle de Consolidações** - Gerenciamento do processo de consolidação
- 🚚 **Integração com Transportadoras** - UPS, USPS e outras
- 📊 **Relatórios Avançados** - Análises detalhadas e exportação
- ⚙️ **Configurações da Plataforma** - Personalização completa

### 🔧 Funcionalidades Técnicas
- 🔐 **Autenticação Segura** - Sistema de login robusto
- 📧 **Notificações por Email** - Comunicação automática
- 💾 **Upload de Arquivos** - Fotos e documentos
- 🔄 **Webhooks** - Integração com serviços externos
- 📱 **API RESTful** - Integração com sistemas externos
- 🛡️ **Segurança Avançada** - Proteção de dados e transações

---

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário
- **ShadCN/UI** - Componentes de interface
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend
- **Next.js API Routes** - API RESTful
- **Prisma ORM** - Mapeamento objeto-relacional
- **PostgreSQL** - Banco de dados principal
- **NextAuth.js** - Autenticação
- **Zod** - Validação de dados

### Integrações
- **Stripe** - Processamento de pagamentos
- **PayPal** - Gateway de pagamento alternativo
- **AWS S3** - Armazenamento de arquivos
- **Email Service** - Envio de notificações
- **Carrier APIs** - UPS, USPS, FedEx

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Husky** - Git hooks
- **Jest** - Testes unitários
- **Docker** - Containerização

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **PostgreSQL** 15+
- **Git**

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/euaconecta-platform.git
cd euaconecta-platform
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure o Banco de Dados

```bash
# Crie um banco PostgreSQL
createdb euaconecta

# Execute as migrações
npx prisma migrate dev
```

### 4. Configure as Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/euaconecta"

# Autenticação
NEXTAUTH_SECRET="your_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# PayPal
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"

# AWS S3
AWS_ACCESS_KEY_ID="your_aws_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your_bucket_name"
```

### 5. Execute o Projeto

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## ⚙️ Configuração

### Configuração Inicial

1. **Acesse o painel administrativo** em `/admin`
2. **Configure as transportadoras** com suas credenciais
3. **Configure os provedores de pagamento** (Stripe/PayPal)
4. **Defina as políticas de armazenamento**
5. **Configure os templates de email**

### Configurações Avançadas

- **Rate Limiting** - Configure limites de requisições
- **CORS** - Configure origens permitidas
- **Logs** - Configure níveis de log
- **Cache** - Configure cache Redis (opcional)

---

## 📖 Uso

### Para Usuários

1. **Registre-se** na plataforma
2. **Adicione endereços** de entrega
3. **Cadastre pacotes** recebidos
4. **Crie consolidações** para otimizar envios
5. **Faça pagamentos** e acompanhe o processo

### Para Administradores

1. **Acesse o dashboard** administrativo
2. **Gerencie usuários** e permissões
3. **Monitore pacotes** e consolidações
4. **Processe pagamentos** e envios
5. **Gere relatórios** e análises

---

## 📚 Documentação

### 📁 Estrutura da Documentação

```
docs/
├── api/                    # Documentação da API
│   ├── API_DOCUMENTATION.md    # Documentação completa
│   ├── API_EXAMPLES.md         # Exemplos práticos
│   ├── openapi.yaml            # Especificação OpenAPI
│   └── API_README.md           # Guia da documentação
├── user/                   # Documentação do usuário
├── admin/                  # Documentação administrativa
└── development/            # Documentação de desenvolvimento
```

### 🔗 Links Úteis

- **[Documentação da API](./docs/api/API_README.md)** - Guia completo da API
- **[Exemplos Práticos](./docs/api/API_EXAMPLES.md)** - Códigos de exemplo
- **[Especificação OpenAPI](./docs/api/openapi.yaml)** - Swagger/OpenAPI
- **[Documentação Completa](./docs/api/API_DOCUMENTATION.md)** - Referência completa

### 🛠️ Ferramentas de Desenvolvimento

- **Swagger UI** - Visualize a API interativamente
- **Postman** - Teste endpoints facilmente
- **OpenAPI Generator** - Gere clientes SDK automaticamente

---

## 📁 Estrutura do Projeto

```
euaconecta-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Rotas administrativas
│   │   ├── (client)/          # Rotas do cliente
│   │   ├── api/               # API Routes
│   │   └── auth/              # Autenticação
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilitários e serviços
│   └── types/                 # Definições TypeScript
├── prisma/                    # Schema e migrações
├── docs/                      # Documentação
├── public/                    # Arquivos estáticos
└── tests/                     # Testes automatizados
```

### 🏗️ Arquitetura

- **Clean Architecture** - Separação clara de responsabilidades
- **Server Components** - Componentes do servidor por padrão
- **Client Components** - Apenas quando necessário
- **API Routes** - Endpoints RESTful
- **Middleware** - Autenticação e autorização
- **Services** - Lógica de negócio isolada

---

## 🧪 Testes

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:coverage
```

### Tipos de Testes

- **Unitários** - Funções e componentes isolados
- **Integração** - APIs e serviços
- **E2E** - Fluxos completos do usuário
- **Performance** - Testes de carga e stress

---

## 🚀 Deploy

### Deploy em Produção

1. **Configure as variáveis de ambiente** de produção
2. **Execute as migrações** do banco de dados
3. **Configure o servidor web** (Nginx/Apache)
4. **Configure SSL** e certificados
5. **Configure monitoramento** e logs

### Opções de Deploy

- **Vercel** - Deploy automático do Next.js
- **Docker** - Containerização completa
- **VPS** - Servidor virtual privado
- **AWS/GCP/Azure** - Cloud providers

---

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o repositório
2. **Crie uma branch** para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. **Abra um Pull Request**

### Padrões de Código

- **ESLint** - Siga as regras de linting
- **Prettier** - Formatação automática
- **Conventional Commits** - Mensagens de commit padronizadas
- **TypeScript** - Tipagem obrigatória
- **Testes** - Cobertura mínima de 80%

### Reportar Bugs

- Use o sistema de **Issues** do GitHub
- Inclua **logs** e **screenshots**
- Descreva o **comportamento esperado**
- Especifique a **versão** e **ambiente**

---

## 📊 Status do Projeto

### ✅ Funcionalidades Implementadas

- [x] Sistema de autenticação
- [x] Gerenciamento de usuários
- [x] Cadastro de pacotes
- [x] Sistema de consolidação
- [x] Integração com pagamentos
- [x] Dashboard administrativo
- [x] API RESTful completa
- [x] Sistema de notificações
- [x] Upload de arquivos
- [x] Relatórios e análises

### 🚧 Em Desenvolvimento

- [ ] App mobile (React Native)
- [ ] Integração com mais transportadoras
- [ ] Sistema de chat em tempo real
- [ ] Analytics avançados
- [ ] Integração com marketplaces

### 📋 Roadmap

- **Q1 2024** - Melhorias na UX/UI
- **Q2 2024** - App mobile
- **Q3 2024** - Integrações avançadas
- **Q4 2024** - IA para otimização de rotas

---

## 📞 Suporte

### Canais de Suporte

- **Email** - suporte@euaconecta.com
- **Chat** - Sistema integrado na plataforma
- **Tickets** - Sistema de suporte interno
- **Documentação** - Guias e tutoriais

### Horário de Atendimento

- **Segunda a Sexta** - 9h às 18h (Brasil)
- **Sábado** - 9h às 12h (Brasil)
- **Emergências** - 24/7 via chat

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

### Resumo da Licença

- ✅ **Uso comercial** permitido
- ✅ **Modificação** permitida
- ✅ **Distribuição** permitida
- ✅ **Uso privado** permitido
- ❌ **Responsabilidade** não garantida

---

## 🙏 Agradecimentos

- **Next.js Team** - Framework incrível
- **Vercel** - Plataforma de deploy
- **Prisma** - ORM moderno
- **TailwindCSS** - Framework CSS
- **Comunidade Open Source** - Contribuições valiosas

---

## 📈 Métricas

![GitHub stars](https://img.shields.io/github/stars/seu-usuario/euaconecta-platform?style=social)
![GitHub forks](https://img.shields.io/github/forks/seu-usuario/euaconecta-platform?style=social)
![GitHub issues](https://img.shields.io/github/issues/seu-usuario/euaconecta-platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/seu-usuario/euaconecta-platform)

---

**Desenvolvido com ❤️ pela equipe Euaconecta**

*Última atualização: Janeiro 2024*