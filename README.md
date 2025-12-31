# Together
Manage Life tasks together equaly

## 📁 Structure du projet

```
Together/
├── nest-api/        # API Backend (NestJS)
├── web-app/         # Application Frontend (Vue 3)
└── landing/         # Page de présentation (Vue 3)
```

## 🚀 Démarrage rapide

### Avec Docker (Recommandé)

```bash
# Mode développement
docker-compose -f docker-compose.dev.yml up

# Mode production
docker-compose -f docker-compose.prod.yml up
```

### Sans Docker

#### API Backend (NestJS)
```bash
cd nest-api
npm install
npm run start:dev
```

#### Frontend Web App
```bash
cd web-app
npm install
npm run dev
```

#### Landing Page
```bash
cd landing
npm install
npm run dev
```
