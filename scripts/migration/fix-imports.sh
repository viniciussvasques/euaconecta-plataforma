#!/bin/bash

echo "🔧 Corrigindo todas as importações..."

# Função para atualizar importações em um arquivo
update_imports_in_file() {
    local file="$1"

    if [ ! -f "$file" ]; then
        return
    fi

    echo "Atualizando: $file"

    # Atualizar importações específicas que estão causando problemas
    sed -i "s|@/lib/carrier-integrations/integration-manager|@/lib/freight/carrier-integrations/integration-manager|g" "$file"
    sed -i "s|@/lib/config-service|@/lib/config/config-service|g" "$file"
    sed -i "s|@/lib/email/email/email|@/lib/email/email|g" "$file"
    sed -i "s|@/lib/image-utils|@/lib/storage/image-utils|g" "$file"
    sed -i "s|@/lib/session|@/lib/auth/session|g" "$file"
    sed -i "s|@/lib/utils/utils/users|@/lib/auth/users|g" "$file"
    sed -i "s|@/lib/suite-manager|@/lib/utils/suite-manager|g" "$file"
    sed -i "s|@/lib/consolidation|@/lib/consolidation/consolidation|g" "$file"
    sed -i "s|@/lib/labels|@/lib/consolidation/labels|g" "$file"
    sed -i "s|@/lib/s3|@/lib/storage/s3|g" "$file"
    sed -i "s|@/lib/payment-providers|@/lib/payments/payment-providers|g" "$file"
    sed -i "s|@/lib/notifications|@/lib/email/notifications|g" "$file"
    sed -i "s|@/lib/notification-service|@/lib/email/notification-service|g" "$file"
    sed -i "s|@/lib/notifications-sse|@/lib/email/notifications-sse|g" "$file"
    sed -i "s|@/lib/freight-calculator|@/lib/freight/freight-calculator|g" "$file"
    sed -i "s|@/lib/carriers|@/lib/freight/carriers|g" "$file"
    sed -i "s|@/lib/platform-config|@/lib/config/platform-config|g" "$file"
    sed -i "s|@/lib/system-customization|@/lib/config/system-customization|g" "$file"
    sed -i "s|@/lib/get-customization|@/lib/config/get-customization|g" "$file"
    sed -i "s|@/lib/blog-service|@/lib/blog/blog-service|g" "$file"
    sed -i "s|@/lib/blog-types|@/lib/blog/blog-types|g" "$file"
    sed -i "s|@/lib/reports|@/lib/reports/reports|g" "$file"
    sed -i "s|@/lib/utils|@/lib/utils/utils|g" "$file"
    sed -i "s|@/lib/design-system|@/lib/utils/design-system|g" "$file"
    sed -i "s|@/lib/events|@/lib/utils/events|g" "$file"
    sed -i "s|@/lib/addresses|@/lib/utils/addresses|g" "$file"
    sed -i "s|@/lib/protection-services|@/lib/utils/protection-services|g" "$file"
    sed -i "s|@/lib/seo-analytics-types|@/lib/utils/seo-analytics-types|g" "$file"
    sed -i "s|@/lib/storage|@/lib/utils/storage|g" "$file"
    sed -i "s|@/lib/users|@/lib/auth/users|g" "$file"
    sed -i "s|@/lib/jwt|@/lib/auth/jwt|g" "$file"
    sed -i "s|@/lib/prisma|@/lib/database/prisma|g" "$file"
    sed -i "s|@/lib/audit|@/lib/database/audit|g" "$file"
    sed -i "s|@/lib/email|@/lib/email/email|g" "$file"
    sed -i "s|@/lib/consolidation-new|@/lib/consolidation/consolidation-new|g" "$file"
}

# Encontrar todos os arquivos TypeScript e TSX
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    update_imports_in_file "$file"
done

echo "✅ Importações corrigidas!"
