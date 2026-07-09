# syntax=docker/dockerfile:1.7
# Multi-stage Dockerfile for Next.js 15 app
# 1) Install deps
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
# Install all deps (including dev) for building
RUN --mount=type=cache,target=/root/.npm npm ci

# 2) Build
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Accept all NEXT_PUBLIC_* values at build time so Next.js can inline them in the client bundle
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_TIMEOUT
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_ENABLE_DEBUG
ARG NEXT_PUBLIC_KICK_CLIENT_ID
ARG NEXT_PUBLIC_REDIRECT_URI
ARG NEXT_PUBLIC_KICK_OAUTH_URL
ARG NEXT_PUBLIC_KICK_TOKEN_URL
ARG NEXT_PUBLIC_KICK_USER_URL
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ARG NEXT_PUBLIC_KICK_SCOPE

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_API_TIMEOUT=${NEXT_PUBLIC_API_TIMEOUT}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}
ENV NEXT_PUBLIC_ENABLE_DEBUG=${NEXT_PUBLIC_ENABLE_DEBUG}
ENV NEXT_PUBLIC_KICK_CLIENT_ID=${NEXT_PUBLIC_KICK_CLIENT_ID}
ENV NEXT_PUBLIC_REDIRECT_URI=${NEXT_PUBLIC_REDIRECT_URI}
ENV NEXT_PUBLIC_KICK_OAUTH_URL=${NEXT_PUBLIC_KICK_OAUTH_URL}
ENV NEXT_PUBLIC_KICK_TOKEN_URL=${NEXT_PUBLIC_KICK_TOKEN_URL}
ENV NEXT_PUBLIC_KICK_USER_URL=${NEXT_PUBLIC_KICK_USER_URL}
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
ENV NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=${NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
ENV NEXT_PUBLIC_KICK_SCOPE=${NEXT_PUBLIC_KICK_SCOPE}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Production runtime
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Use full node_modules (including dev deps like TypeScript) to allow loading next.config.ts at runtime
COPY --from=deps /app/node_modules ./node_modules
# Copy package metadata for npm start
COPY --from=builder /app/package*.json ./

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Some Next.js configs may be read at runtime (headers/rewrites in server)
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
