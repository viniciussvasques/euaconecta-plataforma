# 🐳 Docker Manager - EuaConecta

## 📋 Visão Geral

Este sistema inclui o **Portainer** para gerenciamento visual dos containers Docker e um script de linha de comando para facilitar o gerenciamento.

## 🌐 Acesso ao Portainer

O Portainer está disponível em:
- **HTTP**: http://localhost:8000
- **Web UI**: http://localhost:9443

### 🔐 Primeiro Acesso
1. Acesse http://localhost:9443
2. Crie uma senha de administrador
3. Selecione "Docker" como ambiente
4. Clique em "Connect"

## 🛠️ Script de Gerenciamento

### Uso Básico
```bash
./scripts/docker-manager.sh [comando] [opções]
```

### 📊 Comandos Disponíveis

#### `status` - Status dos Containers
```bash
./scripts/docker-manager.sh status
```
Mostra todos os containers rodando com status e portas.

#### `logs [container]` - Logs de Container
```bash
./scripts/docker-manager.sh logs docker-app-1
./scripts/docker-manager.sh logs docker-app-dev-1
```
Mostra logs em tempo real de um container específico.

#### `restart [container]` - Reiniciar Container
```bash
./scripts/docker-manager.sh restart docker-app-1
./scripts/docker-manager.sh restart docker-nginx-1
```
Reinicia um container específico.

#### `start` - Iniciar Todos os Containers
```bash
./scripts/docker-manager.sh start
```
Inicia todos os containers do projeto.

#### `stop` - Parar Todos os Containers
```bash
./scripts/docker-manager.sh stop
```
Para todos os containers do projeto.

#### `health` - Verificar Saúde dos Serviços
```bash
./scripts/docker-manager.sh health
```
Verifica se todos os serviços estão funcionando.

#### `portainer` - Abrir Portainer
```bash
./scripts/docker-manager.sh portainer
```
Mostra informações de acesso ao Portainer.

#### `clean` - Limpeza
```bash
./scripts/docker-manager.sh clean
```
Remove containers e volumes não utilizados.

## 🏗️ Arquitetura dos Containers

### Containers Principais
- **docker-app-1**: Aplicação de produção (porta 3000)
- **docker-app-dev-1**: Aplicação de desenvolvimento (porta 3001)
- **docker-db-1**: PostgreSQL (porta 5432)
- **docker-redis-1**: Redis (porta 6379)
- **docker-minio-1**: MinIO (portas 9000-9001)
- **docker-nginx-1**: Nginx (portas 80-443)
- **portainer**: Portainer (portas 8000-9443)

### 🌐 Acesso às Aplicações
- **Produção**: http://app.euaconecta.com ou http://localhost:3000
- **Desenvolvimento**: http://dev.euaconecta.com ou http://localhost:3001
- **Portainer**: http://localhost:8000

## 🔧 Comandos Docker Compose

### Iniciar Todos os Serviços
```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up -d
```

### Parar Todos os Serviços
```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml down
```

### Ver Logs
```bash
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml logs -f
```

## 🚨 Solução de Problemas

### Container Não Inicia
```bash
./scripts/docker-manager.sh logs [nome-do-container]
```

### Reiniciar Container Específico
```bash
./scripts/docker-manager.sh restart [nome-do-container]
```

### Verificar Saúde Geral
```bash
./scripts/docker-manager.sh health
```

### Limpar Sistema
```bash
./scripts/docker-manager.sh clean
```

## 📱 Recursos do Portainer

- **Dashboard**: Visão geral de todos os containers
- **Logs**: Visualização de logs em tempo real
- **Terminal**: Acesso SSH aos containers
- **Volumes**: Gerenciamento de volumes
- **Networks**: Gerenciamento de redes
- **Images**: Gerenciamento de imagens
- **Stacks**: Gerenciamento de docker-compose

## 🎯 Próximos Passos

1. Acesse o Portainer em http://localhost:8000
2. Configure sua senha de administrador
3. Explore a interface para gerenciar os containers
4. Use o script para comandos rápidos via terminal

## 📞 Suporte

Para problemas ou dúvidas:
- Verifique os logs: `./scripts/docker-manager.sh logs [container]`
- Verifique a saúde: `./scripts/docker-manager.sh health`
- Reinicie o container: `./scripts/docker-manager.sh restart [container]`
