#!/bin/bash

# 🧹 SCRIPT DE LIMPEZA IMEDIATA - Euaconecta Platform
# Este script implementa as correções críticas identificadas na análise

echo "🚀 Iniciando limpeza crítica do projeto Euaconecta Platform..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

echo "📁 Removendo pastas vazias identificadas..."

# Remover pastas vazias em src/app/
if [ -d "src/app/(dashboard)" ] && [ -z "$(ls -A src/app/\(dashboard\))" ]; then
    rm -rf "src/app/(dashboard)"
    echo "✅ Removida: src/app/(dashboard)/"
fi

if [ -d "src/app/(public)" ] && [ -z "$(ls -A src/app/\(public\))" ]; then
    rm -rf "src/app/(public)"
    echo "✅ Removida: src/app/(public)/"
fi

if [ -d "src/app/dashboard" ] && [ -z "$(ls -A src/app/dashboard)" ]; then
    rm -rf "src/app/dashboard"
    echo "✅ Removida: src/app/dashboard/"
fi

# Remover pastas vazias em src/components/
if [ -d "src/components/forms" ] && [ -z "$(ls -A src/components/forms)" ]; then
    rm -rf "src/components/forms"
    echo "✅ Removida: src/components/forms/"
fi

if [ -d "src/components/layout" ] && [ -z "$(ls -A src/components/layout)" ]; then
    rm -rf "src/components/layout"
    echo "✅ Removida: src/components/layout/"
fi

# Remover pastas vazias em src/
if [ -d "src/hooks" ] && [ -z "$(ls -A src/hooks)" ]; then
    rm -rf "src/hooks"
    echo "✅ Removida: src/hooks/"
fi

if [ -d "src/services" ] && [ -z "$(ls -A src/services)" ]; then
    rm -rf "src/services"
    echo "✅ Removida: src/services/"
fi

if [ -d "src/stores" ] && [ -z "$(ls -A src/stores)" ]; then
    rm -rf "src/stores"
    echo "✅ Removida: src/stores/"
fi

if [ -d "src/types" ] && [ -z "$(ls -A src/types)" ]; then
    rm -rf "src/types"
    echo "✅ Removida: src/types/"
fi

echo ""
echo "🔄 Organizando estrutura src/lib/ em subpastas..."

# Criar subpastas na lib/
mkdir -p src/lib/auth
mkdir -p src/lib/database  
mkdir -p src/lib/email
mkdir -p src/lib/freight
mkdir -p src/lib/storage
mkdir -p src/lib/payments
mkdir -p src/lib/consolidation
mkdir -p src/lib/config
mkdir -p src/lib/utils

echo "✅ Subpastas criadas em src/lib/"

echo ""
echo "📝 Criando arquivo README de reorganização..."

cat > REORGANIZATION_STATUS.md << 'EOF'
# 🔄 Status da Reorganização - Euaconecta Platform

## ✅ Limpeza Realizada

### Pastas Vazias Removidas:
- [ ] src/app/(dashboard)/
- [ ] src/app/(public)/  
- [ ] src/app/dashboard/
- [ ] src/components/forms/
- [ ] src/components/layout/
- [ ] src/hooks/
- [ ] src/services/
- [ ] src/stores/
- [ ] src/types/

### Estrutura src/lib/ Organizada:
- [x] src/lib/auth/ - Autenticação (JWT, sessões)
- [x] src/lib/database/ - Database (Prisma, audit)
- [x] src/lib/email/ - Serviços de email
- [x] src/lib/freight/ - Calculadoras de frete
- [x] src/lib/storage/ - S3, uploads
- [x] src/lib/payments/ - Stripe, PayPal
- [x] src/lib/consolidation/ - Serviços consolidação
- [x] src/lib/config/ - Configurações plataforma
- [x] src/lib/utils/ - Utilitários gerais

## 🚧 Próximos Passos (Requer ação manual):

### 1. Mover arquivos para subpastas apropriadas:
```bash
# Exemplo de movimentação (ajustar conforme necessário):
mv src/lib/jwt.ts src/lib/auth/
mv src/lib/session.ts src/lib/auth/
mv src/lib/prisma.ts src/lib/database/
mv src/lib/email.ts src/lib/email/
mv src/lib/freight-calculator.ts src/lib/freight/
mv src/lib/s3.ts src/lib/storage/
mv src/lib/payment-providers.ts src/lib/payments/
mv src/lib/consolidation.ts src/lib/consolidation/
mv src/lib/platform-config.ts src/lib/config/
```

### 2. Remover arquivos duplicados identificados:
- [ ] src/app/login/ (pasta inteira - manter apenas src/app/auth/login/)
- [ ] src/lib/consolidation-new.ts (migrar features únicas para consolidation.ts)
- [ ] src/lib/utils/s3.ts (consolidar com src/lib/s3.ts)

### 3. Corrigir problemas de build:
- [ ] Configurar Google Fonts localmente ou usar fallback
- [ ] Corrigir testes assíncronos em platform-config.test.ts

### 4. Atualizar imports nos arquivos:
- [ ] Atualizar todos os imports após mover arquivos
- [ ] Verificar se build/testes passam após movimentação

---

*Status atualizado em: $(date)*
EOF

echo "✅ Arquivo REORGANIZATION_STATUS.md criado"

echo ""
echo "🎉 Limpeza inicial concluída!"
echo ""
echo "📋 Próximas ações necessárias:"
echo "1. Revisar o arquivo REORGANIZATION_STATUS.md"
echo "2. Mover arquivos manualmente para subpastas apropriadas"
echo "3. Remover arquivos duplicados identificados"
echo "4. Atualizar imports nos arquivos"
echo "5. Executar npm run build para verificar"
echo ""
echo "💡 Dica: Execute uma ação por vez e teste após cada mudança"