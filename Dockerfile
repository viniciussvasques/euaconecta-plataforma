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
# Use real DATABASE_URL for build
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
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

EXPOSE 3000
CMD ["npm", "run", "start"]
