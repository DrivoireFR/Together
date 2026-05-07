# Contrat API — DTO entrée / sortie (état actuel vs cible refonte)

Référence code : contrôleurs dans [`nest-api/src/`](../nest-api/src/). Les colonnes **Changements cible** résument l’alignement avec [analyse-us-backend.md](analyse-us-backend.md) et [modele-donnees-er.md](modele-donnees-er.md).

**Légende** : Auth = Bearer JWT sauf mention contraire.

---

## Auth (`/auth`)

| Méthode | Chemin | Body In (DTO) | Réponse Out (résumé) | Changements cible |
|---------|--------|---------------|----------------------|-------------------|
| POST | `/auth/register` | `RegisterUserDto` : nom, prenom, pseudo, email, password, avatar? | User créé + tokens / message selon impl | US OTP : possible évolution vers flux email+OTP ; `groupId` null à l’inscription. |
| POST | `/auth/login` | `LoginDto` : email, password, rememberMe? | token, user, rememberMe? | Inchangé tant que mot de passe conservé. |
| GET | `/auth/confirm-email` | Query token, email | Confirmation | Inchangé. |
| POST | `/auth/resend-confirmation` | Body `{ email }` | Message | Inchangé. |
| GET | `/auth/verify` | — | Validité token | Inchangé. |
| GET | `/auth/remember-me` | Cookie / guard | Session longue | Inchangé. |
| GET | `/auth/profile` | — | Profil utilisateur | **Out** : inclure `group` ou `groupId` **unique** (plus de tableau `groups[]`). |
| POST | `/auth/forgot-password` | `ForgotPasswordDto` | Message | Inchangé. |
| GET/POST | `/auth/reset-password` | Query ou `ResetPasswordDto` | HTML redirect | Cible Expo : préférer endpoints JSON sans `res.render` si l’app mobile gère l’UI. |
| PUT | `/auth/change-password` | `ChangePasswordDto` : oldPassword, newPassword | Message | Inchangé. |

---

## Users (`/users`)

| Méthode | Chemin | Body In | Réponse Out | Changements cible |
|---------|--------|---------|-------------|-------------------|
| GET | `/users` | Query page?, limit? | Liste paginée | **Sécurité** : aujourd’hui sans guard — à restreindre ou supprimer en prod. |
| GET | `/users/profile` | — | Profil | Idem `auth/profile` : un seul groupe. |
| PUT | `/users/profile` | `UpdateUserDto` : nom?, prenom?, pseudo?, avatar? | Profil mis à jour | Inchangé. |
| GET | `/users/:id` | — | User | Ne pas exposer les mots de passe ; filtrer `groups` → relation simple. |
| DELETE | `/users/:id` | — | Suppression | Inchangé (réservé admin / self selon service). |

---

## Groups (`/groups`)

| Méthode | Chemin | Body In | Réponse Out | Changements cible |
|---------|--------|---------|-------------|-------------------|
| POST | `/groups` | `CreateGroupDto` : nom | Groupe créé | **400** si `user.groupId` déjà défini (déjà dans un groupe). |
| GET | `/groups` | page?, limit? | Liste groupes | Peut devenir inutile pour le mobile (un seul groupe par user) ; garder pour admin ou recherche globale. |
| GET | `/groups/search` | nom, limit? | Groupes par nom | Aligné US recherche par nom ; **ne pas** retourner d’infos sensibles. |
| GET | `/groups/user/:userId` | page?, limit? | Groupes d’un user | **Devient** 0 ou 1 élément ; possible fusion avec `GET /users/profile`. |
| GET | `/groups/:id` | — | Détail groupe + membres… | Membres : liste users avec `groupId` = id. |
| GET | `/groups/:id/hot-actions` | — | Actions « chaudes » | Conserver ou simplifier selon stats minimal. |
| POST | `/groups/:id/join` | `JoinGroupDto` : code | Adhésion | **400** si user a déjà un `groupId`. |
| POST | `/groups/:id/leave` | — | Sortie du groupe | Met `user.groupId` à null ; règles créateur à définir. |
| POST | `/groups/:id/tags` | `AddTagsDto` : tags[] (`StarterPackTagDto`) | Tags ajoutés | Inchangé structure. |
| POST | `/groups/:id/tasks` | `AddTasksDto` : tasks[] (`StarterPackTaskDto`) | Tâches ajoutées | Inchangé. |
| PUT | `/groups/:id` | `UpdateGroupDto` | Groupe mis à jour | Inchangé. |
| DELETE | `/groups/:id` | — | Suppression | Cascade sur entités liées (politique à documenter). |

---

## Tasks (`/tasks`)

| Méthode | Chemin | Body In | Réponse Out | Changements cible |
|---------|--------|---------|-------------|-------------------|
| POST | `/tasks` | `CreateTaskDto` : label, frequenceEstimee, uniteFrequence?, groupId, tagId?, points? | Tâche | Valider unicité `(groupId, label)` côté service + contrainte DB. |
| GET | `/tasks` | page?, limit? | Liste | Filtrer par groupe courant recommandé pour limiter la fuite de données. |
| GET | `/tasks/:id` | includeActions?, currentMonthOnly? | Tâche + actions optionnelles | Inchangé fonctionnel. |
| PUT | `/tasks/:id` | `UpdateTaskDto` | Tâche | Inchangé. |
| DELETE | `/tasks/:id` | — | Suppression | US historique parle plutôt de supprimer une **action** ; ne pas confondre avec suppression de définition de tâche. |

---

## Tags (`/tags`)

| Méthode | Chemin | Body In | Réponse Out | Changements cible |
|---------|--------|---------|-------------|-------------------|
| POST | `/tags` | `CreateTagDto` : label, color, groupId, icon? | Tag | Unicité `(groupId, nom)` — aligner nommage `label` DTO vs colonne `nom` entité dans la doc Swagger. |
| GET | `/tags` | — | Tous les tags | **À restreindre** par groupe ou utilisateur (fuite inter-groupes). |
| GET | `/tags/group/:groupId` | — | Tags du groupe | Inchangé. |
| GET | `/tags/:id` | — | Tag | Inchangé. |
| PUT | `/tags/:id` | `UpdateTagDto` | Tag | Inchangé. |
| DELETE | `/tags/:id` | — | Suppression | Inchangé. |

---

## Actions (`/actions`)

| Méthode | Chemin | Body In | Réponse Out | Changements cible |
|---------|--------|---------|-------------|-------------------|
| POST | `/actions` | `CreateActionDto` : taskId, date | Action créée | **Plus de `userId` cible** : l’action est toujours pour l’utilisateur connecté. Ajouter **anti-spam** (max 3 / tâche / jour US). |
| GET | `/actions` | page?, limit?, currentMonthOnly? | Liste | Inchangé. |
| GET | `/actions/me` | pagination + dates + fullHistory? | Mes actions | Inchangé. |
| GET | `/actions/user/:userId` | idem | Actions d’un user | **Confidentialité** : limiter aux co-membres du même groupe. |
| GET | `/actions/group/:groupId` | idem | Actions du groupe | Vérifier membre du groupe. |
| GET | `/actions/group/:groupId/recent` | — | Récentes | Inchangé. |
| GET | `/actions/task/:taskId` | idem | Actions par tâche | Inchangé. |
| GET | `/actions/:id` | — | Détail | Inchangé. |
| PUT | `/actions/:id` | `UpdateActionDto` | Mis à jour | Inchangé. |
| DELETE | `/actions/:id` | — | Supprimé | US « supprimer pour soi » : vérifier `action.userId === currentUser`. |

---

## User task states (`/user-task-states`)

| Méthode | Chemin | Body In | Réponse Out | Changements cible |
|---------|--------|---------|-------------|-------------------|
| PUT | `/user-task-states/:taskId` | `UpdateUserTaskStateDto` : **isAcknowledged** (requis ou seul champ mutable) | État mis à jour | Sert la notification « j’ai pris connaissance de cette tâche » ; plus de `isConcerned`. |
| GET | `/user-task-states/group/:groupId` | — | Liste états user dans le groupe | Idem : uniquement champs liés à l’acknowledgment de tâche. |

---

## Stats (`/stats`)

| Méthode | Chemin | Body In | Réponse Out | Changements cible |
|---------|--------|---------|-------------|-------------------|
| GET | `/stats/group/:groupId/overview` | — | Objet lourd : totalTasksVolume, totalDone, actions[], users[], tasks[] | **Remplacer** par un **résumé minimal** (ex. objectif mois + points réalisés + liste tâches avec statut normal/hot) ; ne pas exposer d’agrégats sur les autres users en dehors du périmètre US. |

---

## Action acknowledgments (`/actions/acknowledgments`)

**Supprimé** : ces routes et la table **`ActionAcknowledgment`** ne font plus partie du modèle (elles ne servaient qu’au helping hand). La notification « nouvelle tâche » reste couverte par **`UserTaskState.isAcknowledged`** (`PUT /user-task-states/:taskId`).

---

## Congrats (`/congrats`)

| Méthode | Chemin | Body In | Réponse Out | Changements cible |
|---------|--------|---------|-------------|-------------------|
| CRUD | `/congrats` … | `CreateCongratsDto`, `UpdateCongratsDto` | Entités Congrats | Phase 2 possible si boutique / gamification priorisées autrement. |

---

## Achievements (`/achievements`)

| Méthode | Chemin | Body In | Réponse Out | Changements cible |
|---------|--------|---------|-------------|-------------------|
| GET | `/achievements`, `/user/:id`, `/user/:id/stats`, `/group/:id`, `/:id` | — / `CreateAchievementDto` pour POST | Listes / stats | Endpoint `user/:id/stats` : **s’assurer** qu’on ne divulgue pas de stats interdites aux non-membres du groupe. |

---

## Task bundles

Aucun contrôleur HTTP aujourd’hui : entité seulement. Toute API starter pack future pourra s’appuyer sur `TaskBundle` + endpoints dédiés (hors périmètre strict de ce tableau).

---

## Champs supprimés ou dépréciés (synthèse)

| Zone | Champ / comportement | Action |
|------|----------------------|--------|
| `UpdateUserTaskStateDto` + entité | `isConcerned`, `concernedAt` | **Supprimer** |
| `Action` + `CreateActionDto` | `isHelpingHand`, `userId` cible | **Supprimer** |
| API | `/actions/acknowledgments/*`, entité `ActionAcknowledgment` | **Supprimer** |
| Profil / auth | `user.groups[]` (collection) | **Remplacer** par `group` ou `groupId` optionnel |
| `GET /stats/.../overview` | Payload complet multi-utilisateurs | **Réduire** ; stats perso first |

Ce document doit être mis à jour au fil de l’implémentation Nest (décorateurs `@ApiProperty` / Swagger).
