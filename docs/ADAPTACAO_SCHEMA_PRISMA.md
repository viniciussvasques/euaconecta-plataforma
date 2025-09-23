# Adaptação do Schema Prisma

## Visão Geral

Este documento detalha o processo de adaptação do schema do Prisma do projeto original para o novo projeto, garantindo compatibilidade e aproveitando a estrutura de banco de dados existente.

## Processo de Adaptação

### 1. Análise Comparativa

Ao analisar os dois schemas, identificamos diferenças significativas:

#### Projeto Original
- Schema extenso e detalhado (mais de 1000 linhas)
- Mais de 30 modelos de dados
- Relacionamentos complexos
- Configurações específicas para campos

#### Novo Projeto
- Schema mais enxuto e simplificado
- Aproximadamente 10 modelos essenciais
- Relacionamentos básicos implementados
- Estrutura mais limpa e moderna

### 2. Estratégia de Adaptação

Para adaptar o schema do projeto original ao novo projeto, seguiremos estas etapas:

1. **Manter a compatibilidade com tabelas existentes:**
   - Preservar nomes de tabelas e colunas
   - Manter tipos de dados compatíveis
   - Preservar chaves primárias e estrangeiras

2. **Simplificar onde possível:**
   - Eliminar redundâncias
   - Normalizar estruturas complexas
   - Melhorar nomenclatura para maior clareza

3. **Adicionar melhorias:**
   - Incluir índices otimizados
   - Implementar validações em nível de banco
   - Melhorar relacionamentos

4. **Abordagem incremental:**
   - Iniciar com modelos principais (User, Package, Shipment)
   - Expandir para modelos secundários
   - Adicionar funcionalidades especializadas por último

### 3. Exemplos de Adaptações Específicas

#### Modelo User

**Original:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      UserRole @default(CLIENT)
  isActive  Boolean  @default(false)
  activationToken        String?  @unique
  activationTokenExpires DateTime?
  lastLogin DateTime?

  // Diversos campos específicos
  cpf       String?
  phone     String?
  suiteNumber Int?   @unique
  permissions String[]
  canManageUsers Boolean @default(false)
  // Muitos outros campos e relacionamentos...
}
```

**Novo (Adaptado):**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String    // Mantido para compatibilidade
  passwordHash  String    @map("password") // Mapeado para o campo existente
  firstName     String?   // Novo campo, opcional para compatibilidade
  lastName      String?   // Novo campo, opcional para compatibilidade
  role          UserRole  @default(CLIENT)
  active        Boolean   @default(false) @map("isActive") // Mapeado
  emailVerified Boolean   @default(false)
  suiteNumber   String?   @unique
  phone         String?   
  cpf           String?
  lastLogin     DateTime?
  
  // Campos de permissões unificados em JSON
  permissions   Json?     @default("{}")
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relações mantidas do schema original
  addresses     Address[]
  packages      Package[]
  shipments     Shipment[]
  notifications Notification[]
  payments      Payment[]
  // Outras relações necessárias...

  @@index([email])
  @@map("User") // Garantir que use o nome da tabela existente
}
```

#### Outras adaptações:

- **Modelos complexos:** Dividir em modelos mais específicos onde apropriado
- **Enums:** Manter compatibilidade com valores existentes
- **Relacionamentos:** Preservar estrutura mas melhorar nomenclatura
- **Índices:** Adicionar índices para consultas frequentes

### 4. Processo de Migração Segura

1. **Testar em ambiente isolado:**
   - Criar clone do banco em ambiente de desenvolvimento
   - Verificar compatibilidade com `prisma db pull`
   - Testar operações CRUD básicas

2. **Implementar com segurança:**
   - Criar backup completo do banco antes de qualquer alteração
   - Implementar migrações em pequenos incrementos
   - Validar dados após cada migração

3. **Verificações de integridade:**
   - Executar consultas de verificação após migrações
   - Confirmar que todos os relacionamentos estão preservados
   - Validar funcionamento de queries existentes

4. **Procedimentos de rollback:**
   - Manter scripts de rollback prontos
   - Documentar cada alteração para possível reversão
   - Testar procedimentos de recuperação

## Próximos Passos

1. Adaptar o schema completo do Prisma mantendo compatibilidade
2. Gerar cliente Prisma com o novo schema
3. Testar conexão e operações básicas
4. Implementar primeiras APIs usando o schema adaptado