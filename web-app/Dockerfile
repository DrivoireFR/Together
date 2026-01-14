# Build stage
FROM node:20-alpine AS build

# Installer timeout
RUN apk add --no-cache coreutils

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with timeout, retry, and no-audit to speed up
RUN npm config set fetch-timeout 300000 && \
    npm config set fetch-retries 3 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    timeout 600 npm ci --maxsockets 1 --prefer-offline --no-audit || \
    (echo "npm ci failed, retrying..." && sleep 10 && timeout 600 npm ci --maxsockets 1 --prefer-offline --no-audit)

# Build arguments for environment variables - MUST be before COPY to invalidate cache
ARG VITE_API_BASE_URL=/api

# Copy source code
COPY . .

# Set env and build with timeout (15 minutes)
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN echo "Building with VITE_API_BASE_URL=$VITE_API_BASE_URL" && \
    timeout 900 npm run build || (echo "Build failed or timed out" && exit 1)

# Production stage
FROM nginx:alpine AS production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
