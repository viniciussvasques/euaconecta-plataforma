#!/bin/bash

# Script para executar refatoração das APIs
# Uso: ./run-refactor.sh [--analyze-only] [--apply-changes]

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

# Verificar se Node.js está disponível
if ! command -v node &> /dev/null; then
    log "❌ Node.js não encontrado" $RED
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    log "📦 Instalando dependências..." $BLUE
    npm install
fi

# Verificar se o script de refatoração existe
if [ ! -f "scripts/refactor/refactor-apis.js" ]; then
    log "❌ Script de refatoração não encontrado" $RED
    exit 1
fi

# Executar análise
log "🔍 Executando análise das APIs..." $BLUE
node scripts/refactor/refactor-apis.js

if [ $? -ne 0 ]; then
    log "❌ Erro durante a análise" $RED
    exit 1
fi

# Verificar se apenas análise foi solicitada
if [[ "$*" == *"--analyze-only"* ]]; then
    log "✅ Análise concluída. Use --apply-changes para aplicar as mudanças." $GREEN
    exit 0
fi

# Aplicar mudanças se solicitado
if [[ "$*" == *"--apply-changes"* ]]; then
    log "🔧 Aplicando mudanças nas APIs..." $BLUE

    # Encontrar arquivos refatorados
    REFACTORED_FILES=$(find . -name "*.ts.refactored" -type f)

    if [ -z "$REFACTORED_FILES" ]; then
        log "⚠️  Nenhum arquivo refatorado encontrado" $YELLOW
        exit 0
    fi

    # Aplicar mudanças
    for file in $REFACTORED_FILES; do
        original_file="${file%.refactored}"
        backup_file="${original_file}.backup"

        log "📝 Aplicando mudanças em: $original_file" $BLUE

        # Criar backup se não existir
        if [ ! -f "$backup_file" ]; then
            cp "$original_file" "$backup_file"
            log "  📦 Backup criado: $backup_file" $GREEN
        fi

        # Aplicar mudanças
        cp "$file" "$original_file"
        log "  ✅ Mudanças aplicadas" $GREEN

        # Remover arquivo temporário
        rm "$file"
        log "  🗑️  Arquivo temporário removido" $GREEN
    done

    log "🎉 Mudanças aplicadas com sucesso!" $GREEN
    log "📁 Backups criados com extensão .backup" $BLUE
    log "🚀 Próximos passos:" $BLUE
    log "  1. Testar as APIs refatoradas" $YELLOW
    log "  2. Verificar se tudo funciona corretamente" $YELLOW
    log "  3. Remover backups após confirmação" $YELLOW
else
    log "⚠️  Use --apply-changes para aplicar as mudanças" $YELLOW
    log "📋 Arquivos refatorados disponíveis:" $BLUE
    find . -name "*.ts.refactored" -type f | while read file; do
        log "  - $file" $CYAN
    done
fi

log "✅ Refatoração concluída!" $GREEN
