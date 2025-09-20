#!/bin/bash

# Script para atualizar todas as importações após reorganização

echo "🔄 Atualizando importações..."

# Atualizar importações de prisma
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/prisma|@/lib/database/prisma|g'

# Atualizar importações de email
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/email|@/lib/email/email|g'

# Atualizar importações de users
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/users|@/lib/utils/users|g'

# Atualizar importações de consolidation
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/consolidation|@/lib/consolidation/consolidation|g'

# Atualizar importações de jwt
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/jwt|@/lib/auth/jwt|g'

# Atualizar importações de events
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/events|@/lib/utils/events|g'

# Atualizar importações de payment-providers
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/payment-providers|@/lib/payments/payment-providers|g'

# Atualizar importações de utils
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/utils|@/lib/utils/utils|g'

# Atualizar importações de platform-config
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/platform-config|@/lib/config/platform-config|g'

# Atualizar importações de system-customization
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/system-customization|@/lib/config/system-customization|g'

# Atualizar importações de storage
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/storage|@/lib/utils/storage|g'

# Atualizar importações de carriers
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/carriers|@/lib/freight/carriers|g'

# Atualizar importações de notifications
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/notifications|@/lib/email/notifications|g'

# Atualizar importações de addresses
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/addresses|@/lib/utils/addresses|g'

# Atualizar importações de audit
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/audit|@/lib/database/audit|g'

# Atualizar importações de reports
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/reports|@/lib/reports/reports|g'

# Atualizar importações de s3
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/s3|@/lib/storage/s3|g'

# Atualizar importações de labels
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/labels|@/lib/consolidation/labels|g'

# Atualizar importações de blog-service
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/blog-service|@/lib/blog/blog-service|g'

# Atualizar importações de get-customization
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/get-customization|@/lib/config/get-customization|g'

# Atualizar importações de protection-services
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/protection-services|@/lib/utils/protection-services|g'

# Atualizar importações de freight-calculator
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/services/freight-calculator|@/lib/services/freight-calculator|g'

# Atualizar importações de blog-types
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/blog-types|@/lib/blog/blog-types|g'

# Atualizar importações de seo-analytics-types
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's|@/lib/seo-analytics-types|@/lib/utils/seo-analytics-types|g'

echo "✅ Importações atualizadas!"
