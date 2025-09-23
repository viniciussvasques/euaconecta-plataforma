# Imagem base
FROM node:18-alpine AS builder

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Imagem de produção
FROM node:18-alpine AS production

# Definir variável de ambiente
ENV NODE_ENV=production

# Diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Expor porta
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "dist/index.js"]