#!/bin/bash

# Script para executar a migração de dados JSON para banco de dados
# Uso: ./run-migration.sh [--force] [--skip-schema]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${2:-$NC}$1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    log "❌ Execute este script a partir da raiz do projeto" $RED
    exit 1
fi

# Verificar se o banco está rodando
log "🔍 Verificando conexão com banco de dados..." $BLUE

# Verificar se as variáveis de ambiente estão configuradas
if [ -z "$DATABASE_URL" ]; then
    log "❌ DATABASE_URL não está configurada" $RED
    log "Configure a variável DATABASE_URL no arquivo .env.local" $YELLOW
    exit 1
fi

# Verificar se o Prisma está configurado
if [ ! -f "prisma/schema.prisma" ]; then
    log "❌ Schema do Prisma não encontrado" $RED
    exit 1
fi

# Verificar se os arquivos JSON existem
if [ ! -f "data/blog.json" ] || [ ! -f "data/partners.json" ] || [ ! -f "data/tutorials.json" ] || [ ! -f "data/customization.json" ]; then
    log "❌ Arquivos JSON não encontrados" $RED
    log "Verifique se os arquivos estão em data/" $YELLOW
    exit 1
fi

# Executar migração do schema se não for pulada
if [[ "$*" != *"--skip-schema"* ]]; then
    log "🔄 Executando migração do schema..." $BLUE

    # Executar SQL para criar tabela blog
    if command -v psql &> /dev/null; then
        log "📝 Criando tabela blog_posts..." $BLUE
        psql "$DATABASE_URL" -f scripts/migration/add-blog-schema.sql
        log "✅ Schema atualizado com sucesso!" $GREEN
    else
        log "⚠️  psql não encontrado. Execute manualmente:" $YELLOW
        log "psql \$DATABASE_URL -f scripts/migration/add-blog-schema.sql" $YELLOW
    fi
fi

# Executar migração dos dados
log "🔄 Executando migração dos dados..." $BLUE

# Verificar se Node.js está disponível
if ! command -v node &> /dev/null; then
    log "❌ Node.js não encontrado" $RED
    exit 1
fi

# Executar script de migração
node scripts/migration/migrate-json-data.js

if [ $? -eq 0 ]; then
    log "🎉 Migração concluída com sucesso!" $GREEN
    log "📊 Dados migrados:" $BLUE
    log "  - Partners: ✅" $GREEN
    log "  - Tutorials: ✅" $GREEN
    log "  - Platform Config: ✅" $GREEN
    log "  - Blog Posts: ✅" $GREEN
else
    log "❌ Erro durante a migração" $RED
    exit 1
fi

log "🚀 Próximos passos:" $BLUE
log "  1. Verifique os dados no banco" $YELLOW
log "  2. Teste as APIs que usam esses dados" $YELLOW
log "  3. Remova os arquivos JSON após confirmação" $YELLOW
