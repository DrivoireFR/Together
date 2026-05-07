# Analyse US — impacts backend (Monster Bakery)

Synthèse à partir des fichiers dans [user-stories/](user-stories/README.md), croisée avec l’API Nest actuelle.

## 1. Périmètre « un seul groupe par utilisateur »

Les US **US-ONBOARD-01**, **US-GRP-01** et les descriptions Notion imposent explicitement : un seul groupe par compte / pas de double appartenance.

**Conséquences backend**

- Remplacer la relation **Many-to-Many** `User` ↔ `Group` (table de jointure TypeORM) par une **clé étrangère** `User.groupId` → `Group` (nullable tant que l’utilisateur n’a pas rejoint ou créé de groupe).
- Règles métier à renforcer dans les services `GroupsService` / flux d’inscription :
  - refus de **créer** un groupe si `user.groupId` est déjà défini ;
  - refus de **rejoindre** un second groupe ;
  - quitter un groupe (si on garde ce flux) remet `groupId` à `null` avant toute autre jointure.
- Les endpoints qui listent « mes groupes » ou itèrent sur `user.groups[]` deviennent **0 ou 1** groupe : simplifier les DTO de profil et les guards qui supposent une collection.

## 2. Tâches : tout le monde est concerné — plus de « me concerne » ni de helping hand

**Décision produit (refonte)** :

- **Sémantique métier** : on ne distingue plus « cette tâche me concerne / ne me concerne pas » ni « j’ai fait l’action pour quelqu’un d’autre ». **Toutes les tâches du groupe concernent tous les membres** du point de vue métier ; une déclaration d’action (`Action`) enregistre toujours **l’utilisateur qui a réalisé** l’acte pour le groupe, sans notion de *helping hand*.
- **Persistance** : supprimer `UserTaskState.isConcerned`, `UserTaskState.concernedAt`, supprimer `Action.isHelpingHand`, supprimer le flux **`ActionAcknowledgment`** (il ne servait qu’aux actions déclarées pour un autre utilisateur + acceptation / refus).

**Notification « une nouvelle tâche existe »** : elle reste portée par **`UserTaskState.isAcknowledged`** (et `acknowledgedAt`) : un membre peut être notifié / marquer qu’il a pris connaissance d’une tâche, **sans** lien avec une action pour autrui ou avec « me concerne ».

**Conséquences**

- API création d’action : **plus de `userId` cible** dans le body — l’action est toujours pour l’utilisateur authentifié qui déclare.
- Retirer les endpoints `/actions/acknowledgments/*` et toute persistance `ActionAcknowledgment`.
- Nettoyer DTOs, Swagger, overview groupe, clients (web / mobile) des champs et modales associés.

## 3. Authentification et onboarding (US-ONBOARD-01)

- Passage **OTP** côté produit : le backend actuel (email + mot de passe, JWT) diverge. La refonte API devra soit introduire des endpoints OTP (envoi code, vérification), soit rester sur email/password en V1 — **à trancher** ; les US décrivent surtout le parcours mobile.
- Contrainte **1 email = 1 compte** : déjà aligné avec `email` unique ; à documenter dans les messages d’erreur API.

## 4. Starter pack (US-ONBOARD-02)

- Nécessite des **données catalogue** (labels + tâches modèles) et une logique « proposer uniquement si le groupe n’a aucune tâche ».
- Côté persistance : peut réutiliser `Task` / `Tag` avec un flag `isTemplate` ou une table dédiée `starter_pack_*` — **hors scope strict du modèle minimal** ; peut être une phase 2 si le MVP se limite à des seeds JSON + import API.

## 5. Labels et tâches (US-Tasks-1, US-Tasks-2-Tasks)

- Unicité du **nom de label par groupe** et du **nom de tâche par groupe** : contraintes DB (`UNIQUE (groupId, nom)` ou équivalent) + erreurs 409 côté API.
- Champs UI (jauge, fréquence, points) : déjà proches de `Task` (`frequenceEstimee`, `uniteFrequence`, `points`) ; la « jauge » peut rester un champ entier ou un futur `difficulty` — à préciser dans le DTO.

## 6. Actions et anti-spam (US-Tasks-3)

- **Plafond 3 déclarations** par tâche et par fenêtre temporelle : non présent aujourd’hui ; implémentation possible par comptage d’`Action` sur `(userId, taskId, jour)` ou règle métier plus fine. À prévoir dans le service `ActionsService` et dans le contrat d’erreur (ex. 429 / 400 avec code métier).
- La US « pour moi / pour quelqu’un d’autre » côté UI est **hors modèle** après refonte : côté API, une seule voie — l’utilisateur courant déclare sa propre action.

## 7. Historique et suppression (US-Tasks-3 Historique)

- Liste d’**actions** (pas suppression de « tâche » au sens schéma) : la US parle de retirer une **déclaration** ; le backend devrait exposer **DELETE** (ou annulation) sur `Action` pour l’auteur, avec contrôle « uniquement pour soi ».

## 8. Invitations (US-Contact-01, US-GRP-01)

- **Code groupe** + **deeplink** : le modèle `Group.code` existe ; il faudra des URLs stables documentées et éventuellement un endpoint « résoudre le code » pour l’app mobile.
- Recherche de groupe par **nom** ou **email du créateur** : nécessite endpoints de recherche publics ou authentifiés limités (pagination, rate limit).

## 9. Statistiques (US-STAT-01, US-STAT-02)

- **US-STAT-01** : indicateurs personnels (% objectif du mois, retard / avance) — peut se calculer à partir de `Action` + objectifs dérivés des `Task` ; pas besoin de multiplier les tables si on accepte du calcul à la volée.
- **US-STAT-02** : tâches « hot » / bonus — peut s’appuyer sur des champs calculés (échéance vs fréquence) ou un flag `isHot` en base ; **simplification** demandée côté refonte : garder **un seul endpoint léger** (ex. résumé perso + liste des tâches avec un statut `normal | behind`) plutôt que l’overview actuel très chargé.
- **Confidentialité** : pas de stats des autres — filtrer strictement par `userId` courant.
- Toute agrégation qui comptait les *helping hands* doit être retirée ou remplacée par des indicateurs sans cette notion.

## 10. Boutique et thème (US-BOUT-01, US-BOUT-02)

- Implique catalogue **produits**, **achats** (Stripe ou interne), et **préférences de thème** par utilisateur ou par groupe. **Hors modèle minimal** pour un premier backend « tâches + groupe unique » ; à planifier en epic séparé ou phase 2 pour éviter de bloquer la refonte cœur.

## 11. Pages Notion obsolètes

- **US-Tasks-2-Actions** et **US-CONT-02** : pages **supprimées** dans Notion ; contenu placeholder seulement. Ne pas en déduire de backlog backend sans revalidation produit.

## 12. Déploiement données

- **Reset DB** accepté : re-création du schéma sous **PostgreSQL** (voir [modele-donnees-er.md](modele-donnees-er.md)) sans migration SQLite → PG des données existantes.

---

Prochain livrable d’implémentation : [dto-api-contract.md](dto-api-contract.md) pour traduire ces règles en contrats HTTP concrets.
