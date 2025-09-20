#!/bin/bash

echo "🔧 Corrigindo importações de forma abrangente..."

# Corrigir imports duplicados específicos
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils/utils/utils|@/lib/utils|g' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/email/email/notifications-sse|@/lib/email/notifications-sse|g' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/email/email/email|@/lib/email/email|g' {} \;

# Corrigir imports que não foram atualizados corretamente
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/auth/users|@/lib/auth/users|g' {} \;

# Corrigir imports específicos que ainda estão quebrados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils/utils|@/lib/utils|g' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/email/email|@/lib/email/email|g' {} \;

# Corrigir imports de utils que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils/utils/|@/lib/utils/|g' {} \;

# Corrigir imports de email que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/email/email/|@/lib/email/|g' {} \;

# Corrigir imports de storage que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/storage/storage/|@/lib/storage/|g' {} \;

# Corrigir imports de config que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/config/config/|@/lib/config/|g' {} \;

# Corrigir imports de freight que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/freight/freight/|@/lib/freight/|g' {} \;

# Corrigir imports de payments que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/payments/payments/|@/lib/payments/|g' {} \;

# Corrigir imports de consolidation que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/consolidation/consolidation/|@/lib/consolidation/|g' {} \;

# Corrigir imports de blog que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/blog/blog/|@/lib/blog/|g' {} \;

# Corrigir imports de reports que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/reports/reports/|@/lib/reports/|g' {} \;

# Corrigir imports de database que foram duplicados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/database/database/|@/lib/database/|g' {} \;

echo "✅ Importações corrigidas de forma abrangente!"
