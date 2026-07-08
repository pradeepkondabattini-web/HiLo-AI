# HiLo event-service — Cloud Run container.
# Build context is the backend-api/ workspace root:
#   docker build -f services/event-service/Dockerfile -t event-service .
# Multi-stage: install + bundle (shared is inlined by tsup), then a slim runtime.

# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json* ./
COPY shared/package.json ./shared/
COPY services/event-service/package.json ./services/event-service/
RUN npm ci

COPY . .
RUN npm run build -w @hilo/event-service \
  && npm prune --omit=dev

# ─── Runtime stage ───────────────────────────────────────────────────────────
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
USER node

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/services/event-service/dist ./dist

ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]
