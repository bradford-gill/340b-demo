# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY project/package.json project/package-lock.json ./
RUN npm ci
COPY project/ .
RUN npm run build

# ── Serve stage ──────────────────────────────────────────────
FROM caddy:2-alpine
COPY --from=builder /app/dist /srv
COPY project/Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
