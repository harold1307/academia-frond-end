FROM node:18-alpine AS base

ARG DATABASE_URL=${DATABASE_URL}
ARG API_URL=${API_URL}
ARG AZURE_AD_CLIENT_ID=${AZURE_AD_CLIENT_ID}
ARG AZURE_AD_CLIENT_SECRET=${AZURE_AD_CLIENT_SECRET}
ARG NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXTAUTH_URL=${NEXTAUTH_URL}
ARG SKIP_FETCH_PARSE=${SKIP_FETCH_PARSE}
ARG NEXT_PUBLIC_SKIP_FETCH_PARSE=${NEXT_PUBLIC_SKIP_FETCH_PARSE}
ARG NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG NEXT_PUBLIC_MSAL_PUBLIC_CLIENT_ID=${NEXT_PUBLIC_MSAL_PUBLIC_CLIENT_ID}

ENV DATABASE_URL=${DATABASE_URL}
ENV API_URL=${API_URL}
ENV AZURE_AD_CLIENT_ID=${AZURE_AD_CLIENT_ID}
ENV AZURE_AD_CLIENT_SECRET=${AZURE_AD_CLIENT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV SKIP_FETCH_PARSE=${SKIP_FETCH_PARSE}
ENV NEXT_PUBLIC_SKIP_FETCH_PARSE=${NEXT_PUBLIC_SKIP_FETCH_PARSE}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_MSAL_PUBLIC_CLIENT_ID=${NEXT_PUBLIC_MSAL_PUBLIC_CLIENT_ID}

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma/
RUN corepack enable pnpm && pnpm dlx prisma generate
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]