# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
# ```

# ## 2. **.dockerignore**
# ```
# # dependencies
# node_modules
# npm-debug.log*
# yarn-debug.log*
# yarn-error.log*
# .pnpm-debug.log*

# # next.js
# .next
# out
# dist
# build

# # testing
# coverage

# # misc
# .DS_Store
# *.pem

# # debug
# npm-debug.log*
# yarn-debug.log*
# yarn-error.log*

# # local env files
# .env
# .env*.local
# .env.development
# .env.production

# # vercel
# .vercel

# # typescript
# *.tsbuildinfo
# next-env.d.ts

# # IDE
# .vscode
# .idea
# *.swp
# *.swo

# # git
# .git
# .gitignore
# README.md