#!/bin/bash

echo "🔧 Corrigindo importações finais..."

# Função para corrigir importações específicas
fix_imports() {
    local file="$1"

    if [ ! -f "$file" ]; then
        return
    fi

    echo "Corrigindo: $file"

    # Corrigir caminhos duplicados primeiro
    sed -i "s|@/lib/utils/utils/utils/|@/lib/utils/|g" "$file"
    sed -i "s|@/lib/consolidation/consolidation/consolidation|@/lib/consolidation/consolidation|g" "$file"
    sed -i "s|@/lib/email/email/email|@/lib/email/email|g" "$file"

    # Corrigir importações específicas
    sed -i "s|@/lib/auth/users|@/lib/auth/users|g" "$file"
    sed -i "s|@/lib/auth/session|@/lib/auth/session|g" "$file"
    sed -i "s|@/lib/auth/jwt|@/lib/auth/jwt|g" "$file"
    sed -i "s|@/lib/database/prisma|@/lib/database/prisma|g" "$file"
    sed -i "s|@/lib/database/audit|@/lib/database/audit|g" "$file"
    sed -i "s|@/lib/email/email|@/lib/email/email|g" "$file"
    sed -i "s|@/lib/email/notifications|@/lib/email/notifications|g" "$file"
    sed -i "s|@/lib/email/notification-service|@/lib/email/notification-service|g" "$file"
    sed -i "s|@/lib/email/notifications-sse|@/lib/email/notifications-sse|g" "$file"
    sed -i "s|@/lib/storage/s3|@/lib/storage/s3|g" "$file"
    sed -i "s|@/lib/storage/image-utils|@/lib/storage/image-utils|g" "$file"
    sed -i "s|@/lib/freight/freight-calculator|@/lib/freight/freight-calculator|g" "$file"
    sed -i "s|@/lib/freight/carriers|@/lib/freight/carriers|g" "$file"
    sed -i "s|@/lib/freight/carrier-integrations/integration-manager|@/lib/freight/carrier-integrations/integration-manager|g" "$file"
    sed -i "s|@/lib/consolidation/consolidation|@/lib/consolidation/consolidation|g" "$file"
    sed -i "s|@/lib/consolidation/consolidation-new|@/lib/consolidation/consolidation-new|g" "$file"
    sed -i "s|@/lib/consolidation/labels|@/lib/consolidation/labels|g" "$file"
    sed -i "s|@/lib/payments/payment-providers|@/lib/payments/payment-providers|g" "$file"
    sed -i "s|@/lib/config/platform-config|@/lib/config/platform-config|g" "$file"
    sed -i "s|@/lib/config/system-customization|@/lib/config/system-customization|g" "$file"
    sed -i "s|@/lib/config/get-customization|@/lib/config/get-customization|g" "$file"
    sed -i "s|@/lib/config/config-service|@/lib/config/config-service|g" "$file"
    sed -i "s|@/lib/blog/blog-service|@/lib/blog/blog-service|g" "$file"
    sed -i "s|@/lib/blog/blog-types|@/lib/blog/blog-types|g" "$file"
    sed -i "s|@/lib/reports/reports|@/lib/reports/reports|g" "$file"
    sed -i "s|@/lib/utils/utils|@/lib/utils/utils|g" "$file"
    sed -i "s|@/lib/utils/design-system|@/lib/utils/design-system|g" "$file"
    sed -i "s|@/lib/utils/events|@/lib/utils/events|g" "$file"
    sed -i "s|@/lib/utils/addresses|@/lib/utils/addresses|g" "$file"
    sed -i "s|@/lib/utils/protection-services|@/lib/utils/protection-services|g" "$file"
    sed -i "s|@/lib/utils/seo-analytics-types|@/lib/utils/seo-analytics-types|g" "$file"
    sed -i "s|@/lib/utils/storage|@/lib/utils/storage|g" "$file"
    sed -i "s|@/lib/utils/suite-manager|@/lib/utils/suite-manager|g" "$file"
}

# Encontrar todos os arquivos TypeScript e TSX
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    fix_imports "$file"
done

echo "✅ Importações corrigidas!"
