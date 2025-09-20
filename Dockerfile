# Multi-stage Dockerfile for Next.js (App Router) + Prisma

# 1) Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# 2) Builder
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
# Use dummy DATABASE_URL for build to avoid Prisma errors during static generation
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# Dummy Stripe envs to avoid build errors
ENV STRIPE_SECRET_KEY=sk_test_dummy
ENV STRIPE_WEBHOOK_SECRET=whsec_dummy
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client and build
RUN npx prisma generate
RUN npm run build

# 3) Runner (production)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy runtime assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/data ./data

# Regenerate Prisma client with real database URL at runtime
RUN npx prisma generate

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD wget -qO- http://127.0.0.1:3000/api/health | grep '"status":"ok"' || exit 1
CMD ["npm", "run", "start"]
