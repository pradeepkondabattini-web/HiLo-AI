# HiLo auth-service — Cloud Run container.
# Build context is the backend-api/ workspace root:
#   docker build -f services/auth-service/Dockerfile -t auth-service .
# Multi-stage: install + bundle (shared is inlined by tsup), then a slim runtime.

# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:20-slim AS build
WORKDIR /app

# Install all workspace deps (dev deps needed to build).
COPY package.json package-lock.json* ./
COPY shared/package.json ./shared/
COPY services/auth-service/package.json ./services/auth-service/
RUN npm ci

# Copy sources and bundle the service.
COPY . .
RUN npm run build -w @hilo/auth-service \
  && npm prune --omit=dev

# ─── Runtime stage ───────────────────────────────────────────────────────────
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Non-root user (least privilege).
USER node

# Hoisted production node_modules (express, ...) + the bundled service.
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/services/auth-service/dist ./dist

# Cloud Run injects PORT (default 8080).
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]
