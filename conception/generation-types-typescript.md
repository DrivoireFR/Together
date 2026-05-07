# Génération des types TypeScript (API → Expo)

Le client mobile utilise **OpenAPI** exporté par Nest et le paquet **`openapi-typescript`** pour produire un fichier de types unique.

## Prérequis

- API Nest démarrée ou **fichier `swagger.json`** à jour à la racine de `nest-api/`.
- Node.js 20+ (aligné sur le Dockerfile de l’API).

## Script monorepo

Un script prêt à l’emploi : [`scripts/generate-api-types.sh`](../scripts/generate-api-types.sh) (variable d’environnement `OPENAPI_URL` optionnelle, défaut `http://localhost:3000/api/docs-json`).

```bash
./scripts/generate-api-types.sh
```

## Chaîne actuelle (mobile)

Définie dans [`mobile-app/package.json`](../mobile-app/package.json) :

```bash
cd mobile-app && npm run generate:api-types
```

Cette commande exécute :

`npx openapi-typescript ../nest-api/swagger.json -o src/api/generated/schema.ts`

## Obtenir `swagger.json` à jour

1. Lancer l’API : `cd nest-api && npm run start:dev` (ou Docker compose dev).
2. Télécharger le document OpenAPI (l’URL exacte du JSON figure dans [`nest-api/src/main.ts`](../nest-api/src/main.ts) : `SwaggerModule.setup` + `jsonDocumentUrl`). En cas de doute, ouvrir l’UI Swagger dans le navigateur et utiliser le lien JSON affiché. Exemples fréquents : `/api/api/docs-json` ou `/api/docs-json` selon les versions / préfixes.

## Intégration continue (recommandation)

- Ajouter une étape CI qui vérifie que `schema.ts` est synchronisé avec `swagger.json` (ou régénère et échoue si diff).
- Ne pas committer de `swagger.json` obsolète si l’équipe préfère le générer à la volée uniquement en CI.

## Après la refonte des DTO

Chaque modification des DTO / contrôleurs Nest doit être suivie d’une régénération pour garder Expo type-safe (`components["schemas"]` dans le fichier généré).
