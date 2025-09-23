
# Plataforma de Redirecionamento de Encomendas — Blueprint Completo
**Stack sugerida:** Next.js (App Router) + TypeScript + Prisma + PostgreSQL + NextAuth + Zod + Stripe + ShipStation + AWS S3  
**Objetivo:** Lançar rápido um MVP robusto, com base escalável para crescer.

---

## 1) Estrutura do Repositório (Monolito Next.js Full-Stack)

```
/app
  /(public)              # Páginas públicas (landing, pricing, faq, login, register)
    /layout.tsx
    /page.tsx            # Landing Page
    /pricing/page.tsx
    /faq/page.tsx
    /login/page.tsx
    /register/page.tsx
  /(dashboard)           # Área logada
    /layout.tsx
    /page.tsx            # Dashboard: visão geral do cliente
    /address/page.tsx    # Endereço único do cliente
    /packages/page.tsx   # Pacotes recebidos
    /shipments/page.tsx  # Envios e rastreios
    /billing/page.tsx    # Pagamentos e histórico
    /support/page.tsx    # Tickets/suporte
  /(admin)               # Área administrativa (role=ADMIN)
    /layout.tsx
    /page.tsx            # Resumo operacional
    /packages/page.tsx   # Recepção/triagem de pacotes
    /consolidation/page.tsx
    /shipments/page.tsx
    /users/page.tsx
    /settings/page.tsx
    /platform-config/page.tsx  # ⭐ NOVO: Configuração da plataforma
  /api                   # Route Handlers (APIs internas)
    /auth/[...nextauth]/route.ts
    /packages/route.ts
    /packages/[id]/route.ts
    /shipments/route.ts
    /shipments/[id]/route.ts
    /payments/stripe/webhook/route.ts
    /payments/checkout/route.ts
    /users/route.ts
    /users/[id]/route.ts
    /address/route.ts
    /uploads/s3/route.ts
    /support/route.ts
    /platform-config/route.ts  # ⭐ NOVO: API de configuração
/components              # Componentes compartilhados (UI)
/lib                     
  /auth.ts               # Inicialização do NextAuth
  /prisma.ts             # Cliente Prisma singleton
  /validation.ts         # Schemas Zod
  /shipstation.ts        # Client API ShipStation
  /stripe.ts             # Client API Stripe
  /s3.ts                 # S3 client (AWS SDK v3)
  /logger.ts             # Pino logger
  /id.ts                 # Gerador do código de cliente (US###)
  /platform-config.ts    # ⭐ NOVO: Configurações da plataforma
/styles
/public                  # Imagens estáticas, favicons
/prisma
  /schema.prisma
  /migrations
  /seed.ts
/scripts                 # Scripts utilitários (ex.: gerar-ids, import)
/docker                  # ⭐ NOVO: Configurações Docker
  docker-compose.yml
  Dockerfile
  .dockerignore
.env.example
package.json
tsconfig.json
next.config.mjs
README.md
```

---

## 2) Modelagem de Dados (Prisma + PostgreSQL)

### Enums
```prisma
enum Role { CUSTOMER ADMIN }
enum PackageStatus { RECEIVED READY_TO_SHIP SHIPPED }  # ⭐ Simplificado para MVP
enum ShipmentStatus { DRAFT LABEL_CREATED IN_TRANSIT DELIVERED RETURNED CANCELLED }
enum SupportStatus { OPEN IN_PROGRESS RESOLVED CLOSED }
```

### Models
```prisma
// ⭐ NOVO: Configuração da Plataforma
model PlatformConfig {
  id                    String   @id @default(cuid())
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  // Endereço da empresa
  companyName          String
  addressLine1         String
  addressLine2         String?
  city                 String
  state                String
  postalCode           String
  country              String   @default("US")
  phone                String
  email                String
  
  // Configurações de negócio
  taxRate              Decimal  @default(0) @db.Decimal(5,4)  // 0.0825 = 8.25%
  handlingFee          Decimal  @default(0) @db.Decimal(10,2) // Taxa de manuseio
  storageFeePerDay     Decimal  @default(0) @db.Decimal(10,2) // Taxa de armazenamento por dia
  maxStorageDays       Int      @default(30)                  // Dias máximos de armazenamento
  
  // Configurações de envio
  defaultCarrier       String   @default("USPS")
  defaultService       String   @default("Priority")
  insuranceRequired    Boolean  @default(false)
  minInsuranceAmount   Decimal  @default(0) @db.Decimal(10,2)
  
  // Configurações de pagamento
  stripeEnabled        Boolean  @default(false)
  paypalEnabled        Boolean  @default(false)
  autoInvoice          Boolean  @default(true)
  
  // Configurações de notificação
  emailNotifications   Boolean  @default(true)
  smsNotifications     Boolean  @default(false)
  webhookUrl           String?
  
  // Configurações de integração
  shipstationEnabled   Boolean  @default(false)
  shipstationApiKey    String?
  shipstationApiSecret String?
  
  // Configurações de upload
  s3Enabled            Boolean  @default(false)
  s3BucketName         String?
  s3Region             String?
  maxFileSize          Int      @default(10485760) // 10MB
  
  // Configurações de segurança
  maxLoginAttempts     Int      @default(5)
  sessionTimeout       Int      @default(3600)    // 1 hora
  require2FA           Boolean  @default(false)
  
  // Configurações de suporte
  supportEmail         String?
  supportPhone         String?
  businessHours        String?
  timezone             String   @default("America/New_York")
}

model User {
  id               String   @id @default(cuid())
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  email            String   @unique
  emailVerified    DateTime?
  name             String?
  passwordHash     String?   // se usar credenciais; se usar só OAuth, pode ser null
  role             Role      @default(CUSTOMER)
  customerCode     String    @unique // ex.: US045
  phone            String?
  address          Address?
  packages         Package[]
  shipments        Shipment[]
  paymentMethods   PaymentMethod[]
  invoices         Invoice[]
  supportTickets   SupportTicket[]
}

model Address {
  id         String   @id @default(cuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id])
  line1      String
  line2      String?
  city       String
  state      String
  postalCode String
  country    String   @default("US")
}

model Package {
  id             String         @id @default(cuid())
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  ownerId        String
  owner          User           @relation(fields: [ownerId], references: [id])
  carrier        String?        // quem entregou até sua casa (UPS/FedEx/USPS)
  trackingIn     String?        // tracking de entrada (até seu endereço)
  trackingPhoto  String?        // URL foto no S3
  description    String?
  declaredValue  Decimal?       @db.Decimal(10,2)
  weightGrams    Int?
  lengthCm       Int?
  widthCm        Int?
  heightCm       Int?
  status         PackageStatus  @default(RECEIVED)
  notes          String?
  shipmentId     String?
  shipment       Shipment?      @relation(fields: [shipmentId], references: [id])
}

model Shipment {
  id              String          @id @default(cuid())
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  ownerId         String
  owner           User            @relation(fields: [ownerId], references: [id])
  packages        Package[]
  status          ShipmentStatus  @default(DRAFT)
  outboundCarrier String?         // USPS/UPS/FedEx
  outboundService String?         // Priority, Express, etc.
  outboundLabel   String?         // URL do PDF no S3
  trackingOut     String?
  totalWeightGrams Int?
  insuranceUsd    Decimal?        @db.Decimal(10,2)
  customsInfoId   String?
  customsInfo     CustomsInfo?    @relation(fields: [customsInfoId], references: [id])
  toAddressId     String?
  toAddress       ExternalAddress? @relation(fields: [toAddressId], references: [id])
  paymentId       String?
  payment         Payment?        @relation(fields: [paymentId], references: [id])
}

model CustomsInfo {
  id         String   @id @default(cuid())
  contents   String?  // descrição geral
  valueUsd   Decimal? @db.Decimal(10,2)
  incoterm   String?  // DDU/DDP
  items      CustomsItem[]
}

model CustomsItem {
  id            String   @id @default(cuid())
  customsInfoId String
  customsInfo   CustomsInfo @relation(fields: [customsInfoId], references: [id])
  description   String
  hsCode        String?
  quantity      Int
  valueUsd      Decimal   @db.Decimal(10,2)
}

model ExternalAddress {
  id         String   @id @default(cuid())
  name       String
  line1      String
  line2      String?
  city       String
  state      String?
  postalCode String
  country    String
  phone      String?
  email      String?
  ownerId    String?
  owner      User?     @relation(fields: [ownerId], references: [id])
}

model Payment {
  id           String   @id @default(cuid())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  provider     String   // stripe/paypal
  intentId     String   // id do PaymentIntent (Stripe)
  currency     String   @default("USD")
  amountCents  Int
  status       String   // succeeded, pending, failed
  receiptUrl   String?
  shipment     Shipment?
}

model Invoice {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  number      String   @unique
  currency    String   @default("USD")
  amountCents Int
  pdfUrl      String?
  status      String   // paid, open, uncollectible, void
}

model PaymentMethod {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  provider  String   // stripe
  ref       String   // payment_method id
  brand     String?
  last4     String?
  expMonth  Int?
  expYear   Int?
  default   Boolean  @default(false)
}

model SupportTicket {
  id         String        @id @default(cuid())
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
  userId     String
  user       User          @relation(fields: [userId], references: [id])
  subject    String
  message    String
  status     SupportStatus @default(OPEN)
  replies    SupportReply[]
}

model SupportReply {
  id         String   @id @default(cuid())
  ticketId   String
  ticket     SupportTicket @relation(fields: [ticketId], references: [id])
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  message    String
  createdAt  DateTime @default(now())
}
```

---

## 3) Geração do Código de Cliente (US###)

```ts
// /lib/id.ts
export async function generateCustomerCode(prisma) {
  const last = await prisma.user.findFirst({
    where: { customerCode: { startsWith: "US" } },
    orderBy: { customerCode: "desc" },
    select: { customerCode: true },
  });
  const next = (last ? parseInt(last.customerCode.slice(2)) + 1 : 1);
  return `US${next.toString().padStart(3, "0")}`;
}
```

---

## 4) Autenticação (NextAuth)
- Providers: Credentials + Google (opcional)
- RBAC via campo `role`

---

## 5) Uploads (S3) com Signed URL
Endpoint: `POST /api/uploads/s3`

---

## 6) Integrações
- **Stripe**: checkout + webhook
- **ShipStation**: cotação, criação de etiqueta, tracking

---

## 7) APIs (resumo de rotas)
- `/api/packages` (GET/POST/PATCH/DELETE)
- `/api/shipments` (GET/POST/PATCH)
- `/api/shipments/:id/quote` e `/label`
- `/api/address` (GET/POST/PATCH/DELETE)
- `/api/payments/checkout` e `/payments/stripe/webhook`
- `/api/support`

---

## 8) Páginas (conteúdo)
- **Landing, Pricing, FAQ, Login, Register**
- **Dashboard**: Address, Packages, Shipments, Billing, Support
- **Admin**: Overview, Packages, Consolidation, Shipments, Users, Settings

---

## 9) Segurança
- NextAuth + CSRF
- Zod validation em todas as entradas
- Rate limit em `/api/*`
- Logs com Pino

---

## 10) Deploy
- Vercel (app)
- Neon/Railway (Postgres)
- AWS S3 (uploads)
- Cloudflare (DNS/SSL)

---

## 11) .env.example (principais)
```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SHIPSTATION_API_KEY=
SHIPSTATION_API_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=
APP_BASE_ADDRESS_LINE1=
APP_BASE_ADDRESS_LINE2=Suite #
APP_BASE_ADDRESS_CITY=Orlando
APP_BASE_ADDRESS_STATE=FL
APP_BASE_ADDRESS_ZIP=32801
APP_BASE_PHONE=
```

---

## 12) Roadmap MVP Revisado (4 semanas com testes incrementais)

### **Semana 1: Fundação + Testes Básicos**
- [ ] Setup Next.js + TypeScript + Prisma
- [ ] Docker local (Windows)
- [ ] Autenticação básica (NextAuth)
- [ ] Schema básico (User, Package, Address, PlatformConfig)
- [ ] CRUD simples de pacotes
- [ ] **Testes**: Setup Jest + Testing Library, testes básicos de componentes

### **Semana 2: Funcionalidades Core + Testes de Integração**
- [ ] Dashboard cliente
- [ ] Upload de fotos (S3 local)
- [ ] Gestão de endereços
- [ ] Configuração da plataforma (admin)
- [ ] **Testes**: Testes de API, testes de integração com banco

### **Semana 3: Integrações + Testes E2E**
- [ ] Stripe checkout
- [ ] Webhooks básicos
- [ ] Integração ShipStation (cotação)
- [ ] **Testes**: Testes E2E com Playwright, testes de webhooks

### **Semana 4: Refinamento + Deploy Local**
- [ ] UI/UX polida
- [ ] Performance e SEO
- [ ] Deploy Docker local
- [ ] **Testes**: Testes de performance, testes de segurança

---

## 4) Configuração Docker Local (Windows)

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/euaconecta
      - NODE_ENV=development
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=euaconecta
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 5) Estratégia de Testes

### **Testes Unitários (Jest + Testing Library)**
```typescript
// Exemplo de teste para PlatformConfig
describe('PlatformConfig', () => {
  it('should calculate tax correctly', () => {
    const config = new PlatformConfig({
      taxRate: 0.0825,
      handlingFee: 5.00
    });
    
    expect(config.calculateTax(100)).toBe(8.25);
    expect(config.calculateTotal(100)).toBe(113.25);
  });
});
```

### **Testes de Integração (API Routes)**
```typescript
// Testes para /api/platform-config
describe('Platform Config API', () => {
  it('should create platform config', async () => {
    const response = await request(app)
      .post('/api/platform-config')
      .send(validConfigData);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

### **Testes E2E (Playwright)**
```typescript
// Teste completo do fluxo de configuração
test('admin can configure platform settings', async ({ page }) => {
  await page.goto('/admin/platform-config');
  await page.fill('[data-testid="company-name"]', 'Euaconecta LTDA');
  await page.fill('[data-testid="tax-rate"]', '0.0825');
  await page.click('[data-testid="save-config"]');
  
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

---

## 6) Checklist de Implementação

### **Setup Inicial**
- [ ] Repositório Git configurado
- [ ] Docker Desktop instalado no Windows
- [ ] Node.js 18+ instalado
- [ ] VS Code com extensões recomendadas

### **Desenvolvimento**
- [ ] Cada funcionalidade implementada com testes
- [ ] Code review antes de cada merge
- [ ] Testes passando antes de prosseguir
- [ ] Documentação atualizada

### **Qualidade**
- [ ] ESLint + Prettier configurado
- [ ] Husky para pre-commit hooks
- [ ] Coverage de testes > 80%
- [ ] Performance benchmarks

---

## 7) Próximos Passos

1. **Criar estrutura do projeto**
2. **Setup Docker local**
3. **Implementar schema básico**
4. **Criar área de configuração da plataforma**
5. **Implementar testes incrementais**

**Vamos começar? Qual parte você gostaria de implementar primeiro?**
