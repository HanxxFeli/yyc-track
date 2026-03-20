# ── Backend Dockerfile ──────────────────────────────────────────────────────
# Node.js 20 LTS on Alpine (small image, ~180MB vs ~900MB for full Node image)
# Runs the Express API on port 5000

FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first — Docker caches this layer so node_modules
# only reinstalls when package.json actually changes
COPY package*.json ./

# Install production dependencies only (skip nodemon etc.)
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Expose the port Express listens on
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]