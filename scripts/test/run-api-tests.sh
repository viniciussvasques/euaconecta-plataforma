#!/bin/bash

# Script para executar os testes de API

echo "Executando testes de API do EuaConecta..."
echo "----------------------------------------"

# Verificar ambiente
if [ "$NODE_ENV" != "test" ]; then
  echo "⚠️  Aviso: NODE_ENV não está configurado como 'test'"
  echo "   Definindo NODE_ENV=test para execução segura dos testes"
  export NODE_ENV=test
fi

# Definir variáveis para testes
export TEST_DATABASE_URL=${TEST_DATABASE_URL:-"postgresql://test:test@localhost:5432/euaconecta_test"}
export JWT_SECRET=${JWT_SECRET:-"test-jwt-secret"}
export JWT_EXPIRATION=${JWT_EXPIRATION:-"1h"}
export REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET:-"test-refresh-secret"}
export REFRESH_TOKEN_EXPIRATION=${REFRESH_TOKEN_EXPIRATION:-"7d"}

# Verificar se está em modo de watch
WATCH_MODE=""
if [ "$1" == "--watch" ]; then
  WATCH_MODE="--watch"
  echo "🔍 Modo watch ativado"
fi

# Gerar um relatório de cobertura?
COVERAGE=""
if [ "$1" == "--coverage" ] || [ "$2" == "--coverage" ]; then
  COVERAGE="--coverage"
  echo "📊 Gerando relatório de cobertura"
fi

# Executar testes
echo "🧪 Executando testes..."

# Caminho dos testes passados como parâmetro ou padrão
TEST_PATHS=${3:-"__tests__/lib __tests__/app/api"}

npx jest ${TEST_PATHS} ${WATCH_MODE} ${COVERAGE}

# Verificar status de saída
STATUS=$?
if [ $STATUS -eq 0 ]; then
  echo "✅ Todos os testes passaram!"
else
  echo "❌ Alguns testes falharam!"
fi

# Atualizar relatório se solicitado
if [ "$1" == "--report" ] || [ "$2" == "--report" ] || [ "$3" == "--report" ]; then
  echo "📝 Atualizando relatório de testes..."
  node scripts/test/generate-test-report.js
fi

exit $STATUS
