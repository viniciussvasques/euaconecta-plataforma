#!/bin/bash

# Script para limpar arquivos JSON após migração bem-sucedida
# Uso: ./cleanup-json-files.sh [--backup] [--force]

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

# Verificar se a migração foi bem-sucedida
log "🔍 Verificando se a migração foi bem-sucedida..." $BLUE

# Executar verificação
node scripts/migration/verify-migration.js

if [ $? -ne 0 ]; then
    log "❌ Migração não foi bem-sucedida. Não é seguro remover os arquivos JSON." $RED
    exit 1
fi

# Criar backup se solicitado
if [[ "$*" == *"--backup"* ]]; then
    log "📦 Criando backup dos arquivos JSON..." $BLUE

    BACKUP_DIR="backups/json-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"

    cp data/blog.json "$BACKUP_DIR/" 2>/dev/null || true
    cp data/partners.json "$BACKUP_DIR/" 2>/dev/null || true
    cp data/tutorials.json "$BACKUP_DIR/" 2>/dev/null || true
    cp data/customization.json "$BACKUP_DIR/" 2>/dev/null || true

    log "✅ Backup criado em: $BACKUP_DIR" $GREEN
fi

# Confirmar remoção
if [[ "$*" != *"--force"* ]]; then
    log "⚠️  ATENÇÃO: Este script irá remover os arquivos JSON!" $YELLOW
    log "Arquivos que serão removidos:" $YELLOW
    log "  - data/blog.json" $YELLOW
    log "  - data/partners.json" $YELLOW
    log "  - data/tutorials.json" $YELLOW
    log "  - data/customization.json" $YELLOW
    log "" $YELLOW
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log "❌ Operação cancelada" $RED
        exit 1
    fi
fi

# Remover arquivos JSON
log "🗑️  Removendo arquivos JSON..." $BLUE

rm -f data/blog.json
rm -f data/partners.json
rm -f data/tutorials.json
rm -f data/customization.json

# Verificar se foram removidos
if [ ! -f "data/blog.json" ] && [ ! -f "data/partners.json" ] && [ ! -f "data/tutorials.json" ] && [ ! -f "data/customization.json" ]; then
    log "✅ Arquivos JSON removidos com sucesso!" $GREEN
else
    log "❌ Erro ao remover alguns arquivos" $RED
    exit 1
fi

# Atualizar APIs que usam arquivos JSON
log "🔄 Atualizando APIs para usar banco de dados..." $BLUE

# Listar APIs que precisam ser atualizadas
log "📋 APIs que precisam ser atualizadas:" $YELLOW
log "  - /api/blog/route.ts" $YELLOW
log "  - /api/blog/[slug]/route.ts" $YELLOW
log "  - /api/admin/partners/route.ts" $YELLOW
log "  - /api/admin/tutorials/route.ts" $YELLOW
log "  - /api/customization/route.ts" $YELLOW

log "✅ Limpeza concluída!" $GREEN
log "🚀 Próximos passos:" $BLUE
log "  1. Atualize as APIs para usar banco de dados" $YELLOW
log "  2. Teste todas as funcionalidades" $YELLOW
log "  3. Remova referências aos arquivos JSON" $YELLOW
