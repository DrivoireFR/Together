# Dockerfile pour l'API NestJS - Together

# Stage de développement
FROM node:20-alpine AS development

# Installer dumb-init pour une gestion propre des signaux
RUN apk add --no-cache dumb-init

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (dev + production)
RUN npm ci && npm cache clean --force

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

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (dev + production) pour pouvoir construire
RUN npm ci && npm cache clean --force

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Stage de production
FROM node:20-alpine AS production

# Installer dumb-init pour une gestion propre des signaux
RUN apk add --no-cache dumb-init

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production && npm cache clean --force

# Créer le répertoire pour la base de données avec les bonnes permissions
RUN mkdir -p /app/data && chown nestjs:nodejs /app/data

# Copier les fichiers construits depuis le stage builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Créer le répertoire public avec les bonnes permissions
RUN mkdir -p /app/public && chown nestjs:nodejs /app/public

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
