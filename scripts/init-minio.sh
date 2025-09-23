#!/bin/bash

# Esperar o MinIO iniciar
echo "Aguardando MinIO iniciar..."
sleep 10

# Instalar cliente MinIO
mc alias set myminio http://minio:9000 "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"

# Criar bucket se não existir
mc mb --ignore-existing myminio/euaconecta-files

# Configurar política de acesso público para o bucket
mc policy set public myminio/euaconecta-files

echo "Inicialização do MinIO concluída!"