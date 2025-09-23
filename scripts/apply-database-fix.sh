#!/bin/bash

# Script para reconstruir e reiniciar a aplicação após as alterações
# Este script aplica as correções de conexão do banco de dados

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar mensagens
show_message() {
  echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] ${1}${NC}"
}

# Função para mostrar erros
show_error() {
  echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERRO: ${1}${NC}"
}

# Função para mostrar sucesso
show_success() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] SUCESSO: ${1}${NC}"
}

# Função para mostrar avisos
show_warning() {
  echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] AVISO: ${1}${NC}"
}

# Verifica se estamos no diretório correto
if [ ! -d "/opt/euaconecta-plataforma" ]; then
  show_error "Este script deve ser executado no diretório do projeto /opt/euaconecta-plataforma"
  exit 1
fi

# Verifica se o docker está rodando
if ! docker ps > /dev/null 2>&1; then
  show_error "Docker não está rodando ou o usuário não tem permissão para usá-lo"
  exit 1
fi

# Vai para o diretório do projeto
cd /opt/euaconecta-plataforma

# Inicio da implantação
show_message "Iniciando processo de implantação da solução definitiva de conexão com o banco de dados"

# Verificando se os arquivos existem
show_message "Verificando arquivos necessários..."
if [ ! -f "src/lib/database/prisma-client.ts" ] || [ ! -f "src/lib/database/middleware.ts" ]; then
  show_error "Arquivos de solução não encontrados. Verifique se os arquivos foram criados corretamente."
  exit 1
fi
show_success "Arquivos verificados com sucesso!"

# Reconstruindo a aplicação
show_message "Reconstruindo a imagem da aplicação..."
if ! docker-compose -f docker/docker-compose.yml build app; then
  show_error "Falha ao reconstruir a imagem da aplicação"
  exit 1
fi
show_success "Imagem reconstruída com sucesso!"

# Parando a aplicação atual
show_message "Parando a aplicação atual..."
if ! docker-compose -f docker/docker-compose.yml stop app; then
  show_warning "Não foi possível parar o container da aplicação, talvez ele já esteja parado"
fi
show_success "Aplicação parada com sucesso!"

# Iniciando a nova versão
show_message "Iniciando a nova versão da aplicação..."
if ! docker-compose -f docker/docker-compose.yml up -d app; then
  show_error "Falha ao iniciar a nova versão da aplicação"
  exit 1
fi
show_success "Nova versão da aplicação iniciada com sucesso!"

# Aguardando a inicialização da aplicação
show_message "Aguardando inicialização da aplicação (10 segundos)..."
sleep 10

# Verificando logs para garantir que a conexão está funcionando
show_message "Verificando logs da aplicação para garantir que a conexão está funcionando..."
if ! docker logs docker-app-1 2>&1 | grep -q "Prisma client successfully connected"; then
  show_warning "Não foi possível confirmar conexão com o banco de dados nos logs"
  show_message "Verificando logs completos para diagnóstico..."
  docker logs docker-app-1 --tail 50
else
  show_success "Conexão com o banco de dados estabelecida com sucesso!"
fi

# Conclusão
show_success "Processo de implantação concluído!"
show_message "A aplicação agora está usando o novo sistema robusto de gerenciamento de conexões"
show_message "Caso ocorra algum problema, verifique os logs com: docker logs docker-app-1"

exit 0