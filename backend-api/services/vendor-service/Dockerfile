# HiLo vendor-service — Cloud Run container.
# Build context is the backend-api/ workspace root:
#   docker build -f services/vendor-service/Dockerfile -t vendor-service .

# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json* ./
COPY shared/package.json ./shared/
COPY services/vendor-service/package.json ./services/vendor-service/
RUN npm ci

COPY . .
RUN npm run build -w @hilo/vendor-service \
  && npm prune --omit=dev

# ─── Runtime stage ───────────────────────────────────────────────────────────
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
USER node

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/services/vendor-service/dist ./dist

ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]
