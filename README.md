# Plataforma EuaConecta

## Estrutura do Projeto

A estrutura do projeto segue princípios de arquitetura limpa e separação de responsabilidades, implementando uma API híbrida que suporta tanto REST quanto GraphQL.

```
/
├── src/                    # Código fonte principal
│   ├── api/                # API REST
│   │   ├── routes/         # Definições de rotas REST
│   │   └── middlewares/    # Middlewares específicos da API REST
│   │
│   ├── graphql/            # API GraphQL
│   │   ├── resolvers/      # Resolvers GraphQL
│   │   └── typeDefs/       # Definições de tipos GraphQL (schemas)
│   │
│   ├── controllers/        # Controladores que integram serviços
│   │   ├── auth/           # Controladores de autenticação
│   │   ├── user/           # Controladores de usuário
│   │   └── ...             # Outros domínios
│   │
│   ├── services/           # Lógica de negócios
│   │   ├── auth/           # Serviços de autenticação
│   │   ├── user/           # Serviços de usuário
│   │   ├── package/        # Serviços de pacotes
│   │   ├── payment/        # Serviços de pagamento
│   │   ├── shipping/       # Serviços de envio
│   │   └── ...             # Outros serviços de domínio
│   │
│   ├── models/             # Modelos e DTOs
│   │
│   ├── middlewares/        # Middlewares compartilhados
│   │
│   ├── config/             # Configurações
│   │   ├── database.ts     # Configuração do banco de dados
│   │   ├── server.ts       # Configuração do servidor
│   │   └── ...             # Outras configurações
│   │
│   ├── utils/              # Utilitários e helpers
│   │
│   ├── types/              # Definições de tipos TypeScript
│   │
│   └── index.ts            # Ponto de entrada da aplicação
│
├── prisma/                 # Configuração do Prisma ORM
│   └── schema.prisma       # Schema do banco de dados
│
├── tests/                  # Testes
│   ├── unit/               # Testes unitários
│   └── integration/        # Testes de integração
│
├── docs/                   # Documentação
│
├── docker/                 # Configurações Docker
│
└── scripts/                # Scripts de automação
```

## Tecnologias Principais

- **Node.js & Express**: Base do servidor
- **Apollo Server**: Para GraphQL
- **Prisma ORM**: Acesso ao banco de dados
- **PostgreSQL**: Banco de dados principal
- **Jest**: Framework de testes
- **TypeScript**: Linguagem principal
- **ESLint & Prettier**: Qualidade de código
- **Docker & Docker Compose**: Containerização
- **JWT**: Autenticação

## Arquitetura Híbrida REST/GraphQL

Este projeto implementa uma arquitetura híbrida, fornecendo tanto APIs REST quanto GraphQL:

- **REST API**: Ideal para integrações tradicionais, operações CRUD simples e sistemas de terceiros.
- **GraphQL API**: Perfeito para consultas complexas, clientes frontend modernos, e quando a flexibilidade na consulta de dados é essencial.

### Benefícios da Abordagem Híbrida:

1. **Flexibilidade**: Os clientes podem escolher a interface que melhor se adapta às suas necessidades.
2. **Compatibilidade**: Mantém compatibilidade com sistemas existentes (via REST) enquanto oferece funcionalidades avançadas (via GraphQL).
3. **Desempenho Otimizado**: Consultas complexas podem usar GraphQL para minimizar o número de requisições.
4. **Migração Gradual**: Permite migrar gradualmente de REST para GraphQL sem interromper funcionalidades existentes.

### Compartilhamento de Lógica:

Tanto as rotas REST quanto os resolvers GraphQL utilizam a mesma camada de serviço, garantindo consistência na lógica de negócios independentemente da interface de API utilizada.

## CI/CD e Qualidade de Código

O projeto utiliza GitHub Actions para automação de CI/CD e garantia de qualidade:

### Fluxos de Trabalho (Workflows)

- **CI (Integração Contínua)**:
  - Executa em cada pull request e push para `main` e `develop`
  - Realiza lint do código
  - Executa testes unitários e de integração
  - Verifica a compilação TypeScript

- **CD (Entrega Contínua)**:
  - Automatiza o deploy para ambientes de staging e produção
  - Constrói e publica imagens Docker
  - Deploy para staging: branch `develop`
  - Deploy para produção: branch `main` ou tags `v*`

- **Segurança**:
  - Análise de vulnerabilidades com CodeQL e Snyk
  - Executa semanalmente e em cada PR
  - Verificação de vulnerabilidades em dependências

- **Dependabot**:
  - Atualização automática de dependências
  - PRs semanais para atualizações npm
  - PRs mensais para atualizações do GitHub Actions

### Hooks Git (Husky)

- **pre-commit**: Executa lint-staged, testes nos arquivos alterados e verifica vulnerabilidades
- **pre-push**: Garante que todos os testes estão passando antes de enviar código

### Configurações de Qualidade

- **ESLint**: Análise estática de código
- **Prettier**: Formatação consistente de código
- **lint-staged**: Executa verificações apenas nos arquivos em staging

## Executando o Projeto

### Pré-requisitos

- Node.js 18 ou superior
- Docker e Docker Compose
- PostgreSQL (ou use o contêiner Docker)

### Instalação e Execução Local

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/viniciussvasques/plataforma-euaconecta.git
   cd plataforma-euaconecta
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações locais
   ```

4. **Inicie o banco de dados com Docker**:
   ```bash
   docker-compose up -d postgres
   ```

5. **Execute as migrações do Prisma**:
   ```bash
   npm run prisma:migrate
   ```

6. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

### Usando Docker para Desenvolvimento

Para executar toda a aplicação em contêineres Docker:

```bash
docker-compose up -d
```

### Comandos Úteis

- **Executar testes**:
  ```bash
  npm test                 # Todos os testes
  npm run test:watch       # Modo watch
  npm run test:coverage    # Com relatório de cobertura
  ```

- **Verificação de código**:
  ```bash
  npm run lint            # Verificar com ESLint
  npm run lint:fix        # Corrigir problemas automaticamente
  npm run format          # Formatar com Prettier
  ```

- **Trabalho com o banco de dados**:
  ```bash
  npm run prisma:generate  # Gerar cliente Prisma
  npm run prisma:migrate   # Executar migrações pendentes
  npm run prisma:studio    # Interface visual para o banco
  ```

## Contribuindo

### Fluxo de Trabalho de Desenvolvimento

1. **Crie uma branch para sua feature ou correção**:
   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```

2. **Desenvolva e teste suas alterações**

3. **Faça commits pequenos e descritivos usando Conventional Commits**:
   ```bash
   git commit -m "feat: adiciona funcionalidade de autenticação com Google"
   # ou
   git commit -m "fix: corrige problema de expiração do token JWT"
   ```

4. **Envie suas alterações e crie um Pull Request**:
   ```bash
   git push origin feature/nome-da-feature
   ```

5. **Aguarde a revisão e os testes automatizados**

### Padrões de Código

- Siga os padrões estabelecidos por ESLint e Prettier
- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes alta
- Siga a estrutura de diretórios existente
- Use Conventional Commits para mensagens de commit claras

### Documentação

- Atualize a documentação quando adicionar/alterar funcionalidades
- Use JSDoc para documentar funções e classes
- Mantenha os exemplos de API atualizados