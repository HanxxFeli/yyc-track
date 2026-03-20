# ── Frontend Dockerfile ─────────────────────────────────────────────────────
# Two-stage build:
#   Stage 1 (builder) — installs deps and builds the Vite app
#   Stage 2 (serve)   — serves the built static files with nginx
#
# This keeps the final image small (~25MB) since node_modules
# never makes it into the production image.

# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all deps (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source and build
# VITE_ env vars must be passed at build time via --build-arg
# They get baked into the static files during the Vite build
ARG VITE_AZURE_FUNCTIONS_URL
ARG VITE_BACKEND_URL

ENV VITE_AZURE_FUNCTIONS_URL=$VITE_AZURE_FUNCTIONS_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY . .
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy Vite build output to nginx's serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for React Router (handles client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]