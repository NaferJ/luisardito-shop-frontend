# Multi-stage Dockerfile for Next.js 15 app
# 1) Install deps
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
# Install all deps (including dev) for building
RUN npm ci

# 2) Build
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Production runtime
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Some Next.js configs may be read at runtime (headers/rewrites in server)
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
