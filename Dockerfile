# Multi-stage Dockerfile for Dockerite
# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY frontend/ .

# Build the frontend
RUN npm run build

# Stage 2: Backend and serve frontend
FROM node:18-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy backend files
COPY backend/package.json backend/package-lock.json* ./

# Install backend dependencies
RUN npm install --omit=dev

# Copy backend source code
COPY backend/src ./src

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose ports
EXPOSE 5000

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start the backend server
CMD ["node", "src/server.js"]
