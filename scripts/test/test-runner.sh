#!/bin/bash

# Script para facilitar o uso dos testes
# Este script ajuda a executar diferentes tipos de testes com comandos simples

# Cores para o terminal
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
BLUE="\e[34m"
MAGENTA="\e[35m"
CYAN="\e[36m"
RESET="\e[0m"

# Funções de formatação
print_header() {
  echo -e "${BLUE}=====================================================${RESET}"
  echo -e "${BLUE}  $1${RESET}"
  echo -e "${BLUE}=====================================================${RESET}"
  echo
}

print_section() {
  echo -e "${CYAN}-----------------------------------------------------${RESET}"
  echo -e "${CYAN}  $1${RESET}"
  echo -e "${CYAN}-----------------------------------------------------${RESET}"
}

print_success() {
  echo -e "${GREEN}✓ $1${RESET}"
}

print_error() {
  echo -e "${RED}✗ $1${RESET}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${RESET}"
}

print_info() {
  echo -e "${MAGENTA}ℹ $1${RESET}"
}

# Exibir ajuda
show_help() {
  print_header "AJUDA DO SCRIPT DE TESTES"
  echo "Este script facilita a execução dos testes na plataforma."
  echo
  echo "Uso: $(basename "$0") [OPÇÃO]"
  echo
  echo "Opções:"
  echo "  run           Executa os testes completos (padrão)"
  echo "  api           Executa apenas os testes de API"
  echo "  lib           Executa apenas os testes de bibliotecas"
  echo "  report        Gera um relatório completo dos testes"
  echo "  help          Exibe esta ajuda"
  echo
  echo "Exemplos:"
  echo "  $(basename "$0") run"
  echo "  $(basename "$0") api"
  echo "  $(basename "$0") report"
  echo
}

# Verificar se o script run-tests.sh existe
check_test_script() {
  if [ ! -f "$(dirname "$0")/run-tests.sh" ]; then
    print_error "Script de testes não encontrado: $(dirname "$0")/run-tests.sh"
    exit 1
  fi
}

# Executar testes completos
run_all_tests() {
  print_header "EXECUTANDO TESTES COMPLETOS"
  
  # Verificar se o script existe
  check_test_script
  
  # Executar o script de testes
  bash "$(dirname "$0")/run-tests.sh" --all --verbose
  
  # Verificar resultado
  if [ $? -eq 0 ]; then
    print_success "Testes concluídos com sucesso!"
  else
    print_error "Falha nos testes!"
  fi
}

# Executar testes de API
run_api_tests() {
  print_header "EXECUTANDO TESTES DE API"
  
  # Verificar se o script existe
  check_test_script
  
  # Executar o script de testes
  bash "$(dirname "$0")/run-tests.sh" --api --verbose
  
  # Verificar resultado
  if [ $? -eq 0 ]; then
    print_success "Testes de API concluídos com sucesso!"
  else
    print_error "Falha nos testes de API!"
  fi
}

# Executar testes de bibliotecas
run_lib_tests() {
  print_header "EXECUTANDO TESTES DE BIBLIOTECAS"
  
  # Verificar se o script existe
  check_test_script
  
  # Executar o script de testes
  bash "$(dirname "$0")/run-tests.sh" --lib --verbose
  
  # Verificar resultado
  if [ $? -eq 0 ]; then
    print_success "Testes de bibliotecas concluídos com sucesso!"
  else
    print_error "Falha nos testes de bibliotecas!"
  fi
}

# Gerar relatório de testes
generate_report() {
  print_header "GERANDO RELATÓRIO DE TESTES"
  
  # Verificar se o script existe
  check_test_script
  
  # Executar o script de testes com relatório
  bash "$(dirname "$0")/run-tests.sh" --all --report
  
  print_info "Relatório gerado em: api-test-report.md"
}

# Função principal
main() {
  # Obter o comando
  local command="${1:-run}"
  
  # Verificar o comando
  case "$command" in
    run)
      run_all_tests
      ;;
    api)
      run_api_tests
      ;;
    lib)
      run_lib_tests
      ;;
    report)
      generate_report
      ;;
    help)
      show_help
      ;;
    *)
      print_error "Comando desconhecido: $command"
      show_help
      exit 1
      ;;
  esac
}

# Executar o script
main "$@"