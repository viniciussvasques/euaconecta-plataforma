#!/bin/bash

# Script para executar testes de API com código de cores
# Autor: GitHub Copilot
# Data: 2023

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir banner
show_banner() {
  echo -e "${BLUE}"
  echo "============================================="
  echo "    TESTES AUTOMATIZADOS - EUA CONECTA      "
  echo "============================================="
  echo -e "${NC}"
}

# Função para exibir uso
show_usage() {
  echo -e "${YELLOW}Uso: $0 [opções]${NC}"
  echo ""
  echo "Opções:"
  echo "  --all           Executar todos os testes"
  echo "  --api           Executar apenas testes de API"
  echo "  --lib           Executar apenas testes de bibliotecas"
  echo "  --storage       Executar apenas testes de armazenamento"
  echo "  --logging       Executar apenas testes de logging"
  echo "  --report        Gerar relatório após os testes"
  echo "  --verbose       Mostrar detalhes completos"
  echo "  --help          Mostrar esta ajuda"
  echo ""
}

# Verificar se Jest está instalado
check_jest() {
  if ! npx jest --version > /dev/null 2>&1; then
    echo -e "${RED}Erro: Jest não está instalado. Instale com 'npm install --save-dev jest'.${NC}"
    exit 1
  fi
}

# Configurar variáveis de ambiente para testes
setup_test_env() {
  echo -e "${BLUE}Configurando ambiente de teste...${NC}"
  
  # Variáveis de ambiente para testes
  export NODE_ENV=test
  export NEXT_PUBLIC_API_URL=http://localhost:3000
  export S3_ENDPOINT=http://localhost:9000
  export S3_ACCESS_KEY=minioadmin
  export S3_SECRET_KEY=minioadmin
  export S3_REGION=us-east-1
  export S3_BUCKET=test-bucket
}

# Função para executar testes
run_tests() {
  local test_pattern=$1
  local jest_args="${@:2}"
  
  echo -e "${BLUE}Executando testes: ${test_pattern}${NC}"
  
  # Executar Jest com os argumentos fornecidos
  if npx jest ${test_pattern} ${jest_args}; then
    echo -e "${GREEN}✓ Testes concluídos com sucesso!${NC}"
    return 0
  else
    echo -e "${RED}✗ Falha nos testes!${NC}"
    return 1
  fi
}

# Função para gerar relatório
generate_report() {
  echo -e "${BLUE}Gerando relatório de testes...${NC}"
  node scripts/test/generate-test-report.js
  echo -e "${GREEN}Relatório gerado com sucesso!${NC}"
}

# Principal
main() {
  show_banner
  check_jest
  
  # Processar argumentos
  local run_all=false
  local run_api=false
  local run_lib=false
  local run_storage=false
  local run_logging=false
  local generate_report_flag=false
  local verbose=false
  
  if [ $# -eq 0 ]; then
    run_all=true
  fi
  
  for arg in "$@"; do
    case $arg in
      --all)
        run_all=true
        ;;
      --api)
        run_api=true
        ;;
      --lib)
        run_lib=true
        ;;
      --storage)
        run_storage=true
        ;;
      --logging)
        run_logging=true
        ;;
      --report)
        generate_report_flag=true
        ;;
      --verbose)
        verbose=true
        ;;
      --help)
        show_usage
        exit 0
        ;;
      *)
        echo -e "${RED}Opção desconhecida: $arg${NC}"
        show_usage
        exit 1
        ;;
    esac
  done
  
  # Configurar ambiente
  setup_test_env
  
  # Configurar argumentos do Jest
  local jest_args=""
  if [ "$verbose" = true ]; then
    jest_args="--verbose"
  fi
  
  # Contador de resultados
  local tests_passed=0
  local tests_failed=0
  
  # Executar testes
  if [ "$run_all" = true ] || [ "$run_api" = true ]; then
    if run_tests "__tests__/app/api/**/*.test.{js,ts}" $jest_args; then
      ((tests_passed++))
    else
      ((tests_failed++))
    fi
  fi
  
  if [ "$run_all" = true ] || [ "$run_lib" = true ]; then
    if run_tests "__tests__/lib/**/*.test.{js,ts}" $jest_args; then
      ((tests_passed++))
    else
      ((tests_failed++))
    fi
  fi
  
  if [ "$run_all" = true ] || [ "$run_storage" = true ]; then
    if run_tests "__tests__/lib/storage/**/*.test.{js,ts}" $jest_args; then
      ((tests_passed++))
    else
      ((tests_failed++))
    fi
  fi
  
  if [ "$run_all" = true ] || [ "$run_logging" = true ]; then
    if run_tests "__tests__/lib/logging/**/*.test.{js,ts}" $jest_args; then
      ((tests_passed++))
    else
      ((tests_failed++))
    fi
  fi
  
  # Gerar relatório se solicitado
  if [ "$generate_report_flag" = true ]; then
    generate_report
  fi
  
  # Exibir resumo
  echo ""
  echo -e "${BLUE}=============================================${NC}"
  echo -e "${BLUE}              RESUMO DOS TESTES             ${NC}"
  echo -e "${BLUE}=============================================${NC}"
  echo -e "Grupos de teste aprovados: ${GREEN}${tests_passed}${NC}"
  echo -e "Grupos de teste com falha: ${RED}${tests_failed}${NC}"
  echo -e "${BLUE}=============================================${NC}"
  
  # Retornar código de saída apropriado
  if [ $tests_failed -gt 0 ]; then
    exit 1
  else
    exit 0
  fi
}

# Executar script
main "$@"