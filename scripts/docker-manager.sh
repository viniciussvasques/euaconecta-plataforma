#!/bin/bash

# 🐳 Docker Manager para EuaConecta
# Script para gerenciar containers facilmente

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar status
show_status() {
    echo -e "${BLUE}📊 Status dos Containers:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
}

# Função para mostrar logs
show_logs() {
    local container=$1
    if [ -z "$container" ]; then
        echo -e "${RED}❌ Especifique um container${NC}"
        echo "Containers disponíveis:"
        docker ps --format "{{.Names}}"
        return 1
    fi

    echo -e "${BLUE}📋 Logs do container: $container${NC}"
    docker logs -f "$container"
}

# Função para reiniciar container
restart_container() {
    local container=$1
    if [ -z "$container" ]; then
        echo -e "${RED}❌ Especifique um container${NC}"
        return 1
    fi

    echo -e "${YELLOW}🔄 Reiniciando container: $container${NC}"
    docker restart "$container"
    echo -e "${GREEN}✅ Container $container reiniciado${NC}"
}

# Função para parar todos os containers
stop_all() {
    echo -e "${YELLOW}🛑 Parando todos os containers...${NC}"
    docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml down
    echo -e "${GREEN}✅ Todos os containers parados${NC}"
}

# Função para iniciar todos os containers
start_all() {
    echo -e "${GREEN}🚀 Iniciando todos os containers...${NC}"
    docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up -d
    echo -e "${GREEN}✅ Todos os containers iniciados${NC}"
}

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}🐳 Docker Manager para EuaConecta${NC}"
    echo ""
    echo "Uso: $0 [comando] [opções]"
    echo ""
    echo "Comandos:"
    echo "  status                    - Mostra status dos containers"
    echo "  logs [container]         - Mostra logs de um container"
    echo "  restart [container]      - Reinicia um container"
    echo "  start                    - Inicia todos os containers"
    echo "  stop                     - Para todos os containers"
    echo "  portainer               - Abre Portainer no navegador"
    echo "  health                   - Verifica saúde dos serviços"
    echo "  clean                    - Limpa containers e volumes não utilizados"
    echo ""
    echo "Exemplos:"
    echo "  $0 status"
    echo "  $0 logs docker-app-1"
    echo "  $0 restart docker-app-1"
    echo "  $0 portainer"
}

# Função para abrir Portainer
open_portainer() {
    echo -e "${BLUE}🌐 Abrindo Portainer...${NC}"
    echo "Portainer está disponível em:"
    echo "  - HTTP:  http://localhost:8000"
    echo "  - HTTPS: https://localhost:9443"
    echo ""
    echo "Acesse no navegador para gerenciar os containers!"
}

# Função para verificar saúde
check_health() {
    echo -e "${BLUE}🏥 Verificando saúde dos serviços...${NC}"

    # Verificar se os containers estão rodando
    if docker ps | grep -q "docker-app-1"; then
        echo -e "${GREEN}✅ App Produção: Rodando${NC}"
    else
        echo -e "${RED}❌ App Produção: Parado${NC}"
    fi

    if docker ps | grep -q "docker-app-dev-1"; then
        echo -e "${GREEN}✅ App Desenvolvimento: Rodando${NC}"
    else
        echo -e "${RED}❌ App Desenvolvimento: Parado${NC}"
    fi

    if docker ps | grep -q "docker-db-1"; then
        echo -e "${GREEN}✅ PostgreSQL: Rodando${NC}"
    else
        echo -e "${RED}❌ PostgreSQL: Parado${NC}"
    fi

    if docker ps | grep -q "docker-redis-1"; then
        echo -e "${GREEN}✅ Redis: Rodando${NC}"
    else
        echo -e "${RED}❌ Redis: Parado${NC}"
    fi

    if docker ps | grep -q "docker-minio-1"; then
        echo -e "${GREEN}✅ MinIO: Rodando${NC}"
    else
        echo -e "${RED}❌ MinIO: Parado${NC}"
    fi

    if docker ps | grep -q "docker-nginx-1"; then
        echo -e "${GREEN}✅ Nginx: Rodando${NC}"
    else
        echo -e "${RED}❌ Nginx: Parado${NC}"
    fi

    if docker ps | grep -q "portainer"; then
        echo -e "${GREEN}✅ Portainer: Rodando${NC}"
    else
        echo -e "${RED}❌ Portainer: Parado${NC}"
    fi
}

# Função para limpeza
clean_docker() {
    echo -e "${YELLOW}🧹 Limpando containers e volumes não utilizados...${NC}"
    docker system prune -f
    docker volume prune -f
    echo -e "${GREEN}✅ Limpeza concluída${NC}"
}

# Main
case "$1" in
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "restart")
        restart_container "$2"
        ;;
    "start")
        start_all
        ;;
    "stop")
        stop_all
        ;;
    "portainer")
        open_portainer
        ;;
    "health")
        check_health
        ;;
    "clean")
        clean_docker
        ;;
    *)
        show_help
        ;;
esac
