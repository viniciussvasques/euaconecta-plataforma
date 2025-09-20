# 📋 Mapeamento de Importações - Antes da Reorganização

## 🎯 **IMPORTAÇÕES EXTERNAS (de outros arquivos para @/lib/)**

### **Arquivos mais importados:**
1. **`@/lib/prisma`** - 50+ importações
2. **`@/lib/users`** - 10+ importações
3. **`@/lib/consolidation`** - 8+ importações
4. **`@/lib/email`** - 8+ importações
5. **`@/lib/jwt`** - 6+ importações
6. **`@/lib/events`** - 6+ importações
7. **`@/lib/payment-providers`** - 4+ importações
8. **`@/lib/utils`** - 4+ importações

### **Arquivos menos importados:**
- **`@/lib/blog-service`** - 1 importação
- **`@/lib/get-customization`** - 1 importação
- **`@/lib/labels`** - 1 importação
- **`@/lib/protection-services`** - 1 importação

## 🔗 **IMPORTAÇÕES INTERNAS (dentro de @/lib/)**

### **Dependências principais:**
- **`./prisma`** - 15+ arquivos dependem
- **`./system-customization`** - 3 arquivos dependem
- **`./notifications`** - 2 arquivos dependem
- **`./jwt`** - 1 arquivo depende

### **Dependências de integração:**
- **`./base-carrier`** - 3 arquivos dependem
- **`./ups-integration`** - 1 arquivo depende
- **`./usps-integration`** - 1 arquivo depende

## 📊 **ESTRUTURA ATUAL vs NOVA ESTRUTURA**

### **ESTRUTURA ATUAL:**
```
src/lib/
├── prisma.ts                    # 50+ importações externas
├── users.ts                     # 10+ importações externas
├── consolidation.ts             # 8+ importações externas
├── email.ts                     # 8+ importações externas
├── jwt.ts                       # 6+ importações externas
├── events.ts                    # 6+ importações externas
├── payment-providers.ts         # 4+ importações externas
├── utils.ts                     # 4+ importações externas
├── platform-config.ts           # 2+ importações externas
├── system-customization.ts      # 2+ importações externas
├── storage.ts                   # 2+ importações externas
├── carriers.ts                  # 2+ importações externas
├── notifications.ts             # 2+ importações externas
├── addresses.ts                 # 1+ importação externa
├── audit.ts                     # 1+ importação externa
├── reports.ts                   # 1+ importação externa
├── s3.ts                        # 1+ importação externa
├── labels.ts                    # 1+ importação externa
├── blog-service.ts              # 1+ importação externa
├── get-customization.ts         # 1+ importação externa
├── protection-services.ts       # 1+ importação externa
├── freight-calculator.ts        # 0 importações externas
├── consolidation-new.ts         # 0 importações externas
├── config-service.ts            # 0 importações externas
├── design-system.ts             # 0 importações externas
├── seo-analytics-types.ts       # 0 importações externas
├── session.ts                   # 0 importações externas
├── suite-manager.ts             # 0 importações externas
├── notification-service.ts       # 0 importações externas
├── notifications-sse.ts         # 0 importações externas
├── image-utils.ts               # 0 importações externas
├── blog-types.ts                # 0 importações externas
├── freight-calculator.ts        # 0 importações externas
└── carrier-integrations/        # Pasta com integrações
    ├── base-carrier.ts
    ├── ups-integration.ts
    ├── usps-integration.ts
    └── integration-manager.ts
```

### **NOVA ESTRUTURA PROPOSTA:**
```
src/lib/
├── 📁 auth/                     # Autenticação e JWT
│   ├── jwt.ts
│   └── session.ts
├── 📁 database/                 # Banco de dados
│   ├── prisma.ts
│   └── audit.ts
├── 📁 email/                    # Email e notificações
│   ├── email.ts
│   ├── notifications.ts
│   ├── notification-service.ts
│   └── notifications-sse.ts
├── 📁 freight/                  # Frete e transportadoras
│   ├── freight-calculator.ts
│   ├── carriers.ts
│   └── carrier-integrations/
├── 📁 storage/                  # Armazenamento
│   ├── s3.ts
│   └── image-utils.ts
├── 📁 payments/                 # Pagamentos
│   └── payment-providers.ts
├── 📁 consolidation/            # Consolidação
│   ├── consolidation.ts
│   ├── consolidation-new.ts
│   └── labels.ts
├── 📁 config/                  # Configurações
│   ├── platform-config.ts
│   ├── system-customization.ts
│   ├── config-service.ts
│   └── get-customization.ts
├── 📁 blog/                     # Blog
│   ├── blog-service.ts
│   └── blog-types.ts
├── 📁 reports/                  # Relatórios
│   └── reports.ts
├── 📁 utils/                    # Utilitários
│   ├── utils.ts
│   ├── design-system.ts
│   ├── seo-analytics-types.ts
│   ├── protection-services.ts
│   ├── addresses.ts
│   ├── storage.ts
│   ├── events.ts
│   ├── users.ts
│   └── suite-manager.ts
└── 📁 services/                 # Serviços externos
    └── freight-calculator.ts
```

## 🎯 **PLANO DE MIGRAÇÃO**

### **PASSO 1: Criar nova estrutura de pastas**
### **PASSO 2: Mover arquivos para novas pastas**
### **PASSO 3: Atualizar importações internas**
### **PASSO 4: Atualizar importações externas**
### **PASSO 5: Testar se tudo funciona**

## ⚠️ **ARQUIVOS CRÍTICOS (muitas dependências)**

1. **`prisma.ts`** - 50+ importações externas
2. **`users.ts`** - 10+ importações externas
3. **`consolidation.ts`** - 8+ importações externas
4. **`email.ts`** - 8+ importações externas
5. **`jwt.ts`** - 6+ importações externas

**Estes arquivos devem ser movidos por último para minimizar quebras.**

## 🔄 **ORDEM DE MIGRAÇÃO RECOMENDADA**

1. **Primeiro**: Arquivos com 0 importações externas
2. **Segundo**: Arquivos com 1-2 importações externas
3. **Terceiro**: Arquivos com 3-5 importações externas
4. **Por último**: Arquivos com 6+ importações externas

---

**✅ MAPEAMENTO COMPLETO!**

*Mapeamento gerado em: 19/09/2025*
