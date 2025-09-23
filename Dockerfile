# Dockerfile otimizado para Next.js (App Router) + Prisma
# Com foco em velocidade de build e reutilização de cache

# 1) Estágio de dependências - apenas package.json e lock files
FROM node:20-alpine AS deps
WORKDIR /app

# Instalar dependências apenas para Alpine
RUN apk add --no-cache libc6-compat

# Copiar apenas os arquivos necessários para instalação de dependências
COPY package.json package-lock.json ./

# Usar --frozen-lockfile para garantir que o lockfile seja respeitado
# e --prefer-offline para usar cache local quando possível
RUN npm ci --frozen-lockfile --prefer-offline

# 2) Estágio de geração do Prisma - isolado para melhorar o cache
FROM node:20-alpine AS prisma-generator
WORKDIR /app

# Copiar apenas os arquivos necessários para geração do Prisma
COPY prisma ./prisma/
COPY --from=deps /app/node_modules ./node_modules

# Gerar cliente Prisma (isolado para reutilização do cache)
RUN npx prisma generate

# 3) Estágio de build - combina o Prisma gerado com código fonte
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Variáveis de ambiente para build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV STRIPE_SECRET_KEY=sk_test_dummy
ENV STRIPE_WEBHOOK_SECRET=whsec_dummy
ENV LOGTAIL_SOURCE_TOKEN=dummy_token
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar node_modules e prisma client já gerados
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma-generator /app/node_modules/.prisma ./node_modules/.prisma

# Copiar código fonte - arquivos menores primeiro para aproveitar o cache
COPY package.json package-lock.json tsconfig.json next.config.ts tailwind.config.js postcss.config.js ./
COPY public ./public
COPY src ./src
COPY data ./data
COPY prisma ./prisma

# Executar build (não precisamos gerar o Prisma novamente)
RUN npm run build

# 4) Estágio final de produção - apenas o necessário para execução
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copiar apenas os arquivos necessários para produção
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/data ./data
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma/client ./node_modules/.prisma/client

# Criar diretórios necessários com permissões corretas
RUN mkdir -p logs && chown nextjs:nodejs logs
RUN mkdir -p uploads && chown nextjs:nodejs uploads

# Usar usuário não-root para segurança
USER nextjs

EXPOSE 3000

# Usar o comando correto para iniciar a aplicação Next.js
CMD ["node", "server.js"]