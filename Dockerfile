# syntax=docker/dockerfile:1

# Etapa base
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Etapa de dependências
FROM base AS deps
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

# Etapa de build
FROM base AS builder
WORKDIR /app

# Copia node_modules e código
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copia o Prisma schema explicitamente (caso não esteja junto no COPY . .)
# COPY prisma ./prisma

# Define variáveis públicas para o build do Next.js
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_GEMINI_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_DATABASE_URL
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG DATABASE_URL

ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
ENV NEXT_PUBLIC_GEMINI_API_KEY=${NEXT_PUBLIC_GEMINI_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
ENV NEXT_PUBLIC_FIREBASE_DATABASE_URL=${NEXT_PUBLIC_FIREBASE_DATABASE_URL}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
ENV NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}
ENV DATABASE_URL=${DATABASE_URL}

# Gera o Prisma Client antes do build
RUN npx prisma generate

# Build da aplicação Next.js
RUN npm run build

# Etapa de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Cria usuário seguro
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copia os arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
