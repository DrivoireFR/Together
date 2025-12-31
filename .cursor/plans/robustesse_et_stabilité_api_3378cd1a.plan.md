---
name: Robustesse et Stabilité API
overview: Audit complet des relations, ajout de timeouts, rate limiting et logging pour éliminer les bugs de chargement infini et améliorer la stabilité en production.
todos:
  - id: optimize-relations
    content: Optimiser les requêtes N+1 dans groups.service et stats.service
    status: completed
  - id: add-pagination
    content: Ajouter pagination sur findAll et findUserGroups
    status: completed
    dependencies:
      - optimize-relations
  - id: setup-timeout
    content: Créer l'interceptor de timeout et configurer TypeORM
    status: completed
  - id: setup-ratelimit
    content: Installer et configurer @nestjs/throttler avec règles spécifiques
    status: completed
  - id: add-logging
    content: Ajouter logger NestJS dans tous les services critiques
    status: completed
  - id: exception-filter
    content: Créer le filtre d'exceptions global avec logging
    status: completed
    dependencies:
      - add-logging
  - id: log-rotation
    content: Configurer la rotation des logs avec limite de capacité
    status: completed
    dependencies:
      - add-logging
---

# Plan de Robustesse et Stabilité de l'API Together

## 1. Audit et Optimisation des Relations (N+1 & Boucles Infinies)

### Points critiques identifiés

**[nest-api/src/groups/groups.service.ts](nest-api/src/groups/groups.service.ts)** - Méthode `findOne()` (lignes 100-186)

- ⚠️ Chargement de relations profondes : `tasks.userStates.user`
- ⚠️ Double requête : récupération du groupe + appel `getTasksWithHurryState()`
- ⚠️ Boucle `.map()` sur potentiellement beaucoup de tâches
- **Solution** : Optimiser avec une seule requête + pagination optionnelle

**[nest-api/src/groups/groups.service.ts](nest-api/src/groups/groups.service.ts)** - Méthode `findUserGroups()` (lignes 66-97)

- ⚠️ Charge TOUS les groupes avec TOUTES les relations (users, tasks, actions, tags)
- ⚠️ Peut devenir très lourd avec plusieurs groupes et beaucoup de données
- **Solution** : Lazy loading ou sélection partielle des données

**[nest-api/src/stats/stats.service.ts](nest-api/src/stats/stats.service.ts)** - Méthode `getOverview()` (lignes 17-77)

- ⚠️ Récupère toutes les tâches puis fait une requête complexe avec tous les utilisateurs
- ⚠️ `.flatMap()` et `.reduce()` sur potentiellement beaucoup d'actions
- **Solution** : Utiliser des agrégations SQL directement

**[nest-api/src/groups/groups.service.ts](nest-api/src/groups/groups.service.ts)** - Méthode `findAll()` (lignes 55-63)

- 🚨 **CRITIQUE** : Charge TOUS les groupes avec TOUTES les relations sans pagination
- **Solution** : Ajouter pagination obligatoire ou supprimer cet endpoint

### Optimisations à implémenter

1. **Ajouter des indices de base de données** sur les colonnes fréquemment utilisées :

- `action.date` pour les filtres temporels
- `action.groupId` et `task.groupId` pour les jointures
- Clés composites pour les relations many-to-many

2. **Utiliser le QueryBuilder avec sélection partielle** au lieu de charger toutes les relations
3. **Ajouter une pagination** sur tous les endpoints retournant des collections
4. **Implémenter DataLoader pattern** pour éviter les N+1 (optionnel si les autres optimisations suffisent)

## 2. Configuration des Timeouts (Agressifs : 10s/3s)

### Installation des dépendances

```bash
npm install @nestjs/throttler
```



### Middleware de timeout global

Créer un **interceptor de timeout** appliqué globalement :

- Timeout de **3 secondes** pour les endpoints standards
- Timeout de **10 secondes** pour les endpoints lourds (stats, groupes avec relations)
- Retour d'erreur HTTP 408 (Request Timeout) avec message explicite

Fichiers à créer/modifier :

- `nest-api/src/common/interceptors/timeout.interceptor.ts` (nouveau)
- `nest-api/src/main.ts` (ajout de l'interceptor global)
- `nest-api/src/common/decorators/timeout.decorator.ts` (pour override sur endpoints spécifiques)

### Configuration TypeORM

Ajouter timeout sur les requêtes de base de données dans `app.module.ts` :

```typescript
TypeOrmModule.forRoot({
  // ... config existante
  extra: {
    max: 10, // pool de connexions
    connectionTimeoutMillis: 3000, // timeout de connexion
    statement_timeout: 10000, // timeout des requêtes SQL
  }
})
```



## 3. Rate Limiting (Protection DDoS & Brute Force)

### Configuration globale

Intégrer `@nestjs/throttler` pour protéger toute l'API :

- **Rate limit global** : 100 requêtes/minute par IP
- **Rate limit authentification** : 5 tentatives/minute sur `/auth/login` et `/auth/register`
- **Rate limit création** : 10 créations/minute sur les endpoints POST

Fichiers à modifier :

- `nest-api/src/app.module.ts` (import ThrottlerModule)
- `nest-api/src/auth/auth.controller.ts` (rate limit spécifique)
- `nest-api/src/main.ts` (configuration globale du throttler)

### Configuration spécifique par endpoint

Utiliser les decorators `@Throttle()` pour personnaliser :

- Login/Register : 5 requêtes/minute
- Création de groupe : 3 requêtes/minute
- Ajout d'actions : 30 requêtes/minute

## 4. Logging Structuré (Logger NestJS Natif)

### Configuration du logger

Remplacer les `console.log` par le logger NestJS :

- **Niveau ERROR** : Erreurs et exceptions avec stack trace complète
- **Niveau WARN** : Timeouts, rate limits dépassés, requêtes lentes (>2s)
- **Niveau LOG** : Événements importants (création, authentification)
- **Niveau DEBUG** : Détails des requêtes (désactivé en prod)

### Points de logging critiques à ajouter

**Authentification** (`auth.service.ts`) :

- Tentative de login (succès/échec)
- Création de compte
- Validation JWT

**Requêtes lourdes** :

- Début et fin de `getOverview()` avec durée
- Début et fin de `findOne(groupId)` avec durée
- Nombre d'entités chargées

**Erreurs et timeouts** :

- Toutes les exceptions avec contexte (userId, groupId, endpoint)
- Requêtes qui timeout
- Erreurs de base de données

Fichiers à modifier :

- Tous les services (*.service.ts) : ajout de `private readonly logger = new Logger(ServiceName.name)`
- `nest-api/src/common/filters/http-exception.filter.ts` (nouveau) : pour logger toutes les exceptions
- `nest-api/src/main.ts` : configuration du niveau de log selon l'environnement

### Format des logs en production

Configurer un format JSON pour faciliter l'analyse :

```typescript
app.useLogger(app.get(Logger));
```



### Rotation et limite de capacité des logs

⚠️ **Protection contre le remplissage du disque** : les logs en production peuvent rapidement saturer l'espace disque.**Solutions à implémenter** :**Option 1 : Logger NestJS natif avec rotation manuelle**

- Créer un service custom `LogRotationService` qui écrit dans des fichiers avec rotation
- Limiter à 50 MB par fichier, maximum 5 fichiers (total 250 MB)
- Supprimer automatiquement les anciens logs

**Option 2 : Winston avec rotation (recommandé)**

- Installer `winston` et `winston-daily-rotate-file`
- Configuration de rotation automatique :
- Taille max par fichier : 50 MB
- Nombre max de fichiers : 5
- Compression automatique des anciens logs (.gz)
- Suppression après dépassement de la capacité totale

**Configuration recommandée** :

```bash
npm install winston winston-daily-rotate-file
```

Créer `nest-api/src/common/logger/winston.logger.ts` avec :

- Rotation quotidienne OU par taille (50 MB max)
- Conservation max de 5 fichiers (250 MB total)
- Format JSON pour prod, format lisible pour dev
- Séparation des logs d'erreur dans un fichier dédié

Fichiers à créer :

- `nest-api/src/common/logger/winston.logger.ts` (configuration Winston)
- `nest-api/src/common/logger/logger.module.ts` (module NestJS)

Fichiers à modifier :

- `nest-api/src/main.ts` (utiliser le logger custom)
- `nest-api/package.json` (ajouter dépendances winston)

## Ordre d'exécution recommandé

1. **Audit et optimisation des relations** (impact le plus important)
2. **Configuration des timeouts** (protection contre le blocage)
3. **Rate limiting sur authentification** (sécurité)
4. **Logging structuré avec rotation** (observabilité + protection disque)

## Fichiers impactés (résumé)

**Nouveaux fichiers** :

- `common/interceptors/timeout.interceptor.ts`
- `common/decorators/timeout.decorator.ts`
- `common/filters/http-exception.filter.ts`
- `common/logger/winston.logger.ts`
- `common/logger/logger.module.ts`

**Fichiers à modifier** :

- `app.module.ts` (throttler, typeorm config, logger module)
- `main.ts` (interceptors, logger custom, timeout)
- `groups/groups.service.ts` (optimisation requêtes)
- `stats/stats.service.ts` (optimisation requêtes)
- `auth/auth.controller.ts` (rate limit)
- `auth/auth.service.ts` (logging)
- `package.json` (ajout winston et winston-daily-rotate-file)
- Tous les `*.service.ts` (ajout logger)

## Gains attendus

- ✅ Élimination des chargements infinis
- ✅ Protection contre les DDoS et brute force
- ✅ Visibilité complète sur les erreurs en production
- ✅ Dégradation gracieuse avec timeouts