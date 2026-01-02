# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Build arguments for environment variables - MUST be before COPY to invalidate cache
ARG VITE_API_BASE_URL=/api

# Copy source code
COPY . .

# Set env and build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN echo "Building with VITE_API_BASE_URL=$VITE_API_BASE_URL" && npm run build

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
