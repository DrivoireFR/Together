# Dockerfile pour l'API NestJS - Together

# Stage de développement
FROM node:20-alpine AS development

# Installer dumb-init et timeout
RUN apk add --no-cache dumb-init coreutils

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances avec timeout et retry
RUN npm config set fetch-timeout 300000 && \
    npm config set fetch-retries 3 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    timeout 600 npm ci --maxsockets 1 --prefer-offline --no-audit || \
    (echo "npm ci failed, retrying..." && sleep 10 && timeout 600 npm ci --maxsockets 1 --prefer-offline --no-audit) && \
    npm cache clean --force

# Copier le code source
COPY . .

# Créer le répertoire pour la base de données
RUN mkdir -p /app/data

# Créer le répertoire public
RUN mkdir -p /app/public

# Exposer le port
EXPOSE 3000

# Variables d'environnement pour le développement
ENV NODE_ENV=development
ENV PORT=3000

# Commande de démarrage en mode développement avec hot reload
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start:dev"]

# Stage de builder
FROM node:20-alpine AS builder

# Installer timeout et coreutils
RUN apk add --no-cache coreutils

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances avec timeout et retry
RUN npm config set fetch-timeout 300000 && \
    npm config set fetch-retries 3 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    timeout 600 npm ci --maxsockets 1 --prefer-offline --no-audit || \
    (echo "npm ci failed, retrying..." && sleep 10 && timeout 600 npm ci --maxsockets 1 --prefer-offline --no-audit) && \
    npm cache clean --force

# Copier le code source
COPY . .

# Construire l'application avec timeout (15 minutes)
RUN timeout 900 npm run build || (echo "Build failed or timed out" && exit 1)

# Stage de production
FROM node:20-alpine AS production

# Installer dumb-init et timeout
RUN apk add --no-cache dumb-init coreutils

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer uniquement les dépendances de production avec timeout
RUN npm config set fetch-timeout 300000 && \
    npm config set fetch-retries 3 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    timeout 600 npm ci --only=production --maxsockets 1 --prefer-offline --no-audit || \
    (echo "npm ci failed, retrying..." && sleep 10 && timeout 600 npm ci --only=production --maxsockets 1 --prefer-offline --no-audit) && \
    npm cache clean --force

# Créer le répertoire pour la base de données avec les bonnes permissions
RUN mkdir -p /app/data && chown nestjs:nodejs /app/data

# Copier les fichiers construits depuis le stage builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Créer le répertoire public avec les bonnes permissions
RUN mkdir -p /app/public && chown nestjs:nodejs /app/public

# Créer le répertoire logs avec les bonnes permissions
RUN mkdir -p /app/logs && chown nestjs:nodejs /app/logs

# Copier le dossier public s'il contient des fichiers
COPY --from=builder --chown=nestjs:nodejs /app/public ./public

# Copier le dossier data (starter-packs.json)
COPY --from=builder --chown=nestjs:nodejs /app/src/data ./dist/data

# Changer vers l'utilisateur non-root
USER nestjs

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Commande de démarrage avec dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
