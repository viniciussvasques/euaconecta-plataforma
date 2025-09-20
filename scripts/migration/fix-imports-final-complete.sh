#!/bin/bash

echo "🔧 Corrigindo TODOS os imports restantes..."

# Corrigir imports específicos que ainda estão quebrados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils/s3|@/lib/storage/s3|g' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils/storage|@/lib/storage/storage|g' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils/storage/image-utils|@/lib/storage/image-utils|g' {} \;

# Corrigir imports internos nos arquivos movidos
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|from '\''./suite-manager'\''|from '\''../utils/suite-manager'\''|g' {} \;

# Corrigir imports que ainda estão apontando para utils quando deveriam apontar para storage
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils/storage/s3|@/lib/storage/s3|g' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils/storage/storage|@/lib/storage/storage|g' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/utils/storage/image-utils|@/lib/storage/image-utils|g' {} \;

# Corrigir imports duplicados que podem ter sido criados
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/storage/storage/storage|@/lib/storage/storage|g' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/storage/storage/s3|@/lib/storage/s3|g' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|@/lib/storage/storage/image-utils|@/lib/storage/image-utils|g' {} \;

echo "✅ Todos os imports corrigidos!"
