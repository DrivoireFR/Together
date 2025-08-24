# Test des StarterPacks - Frontend

## Fonctionnalité implémentée

La fonctionnalité StarterPacks permet aux utilisateurs de créer des groupes avec un ensemble prédéfini de tags et de tâches, évitant ainsi la saisie manuelle lors de la création d'un nouveau groupe.

## Flux d'utilisation

1. **Création du groupe** : L'utilisateur remplit le formulaire de création de groupe
2. **Modal de confirmation** : Une fois le groupe créé, une modal s'affiche avec :
   - Le message de confirmation
   - Le code du groupe
   - Un aperçu des catégories et tâches disponibles
   - Options : "Ignorer" ou "Configurer mon groupe"

3. **Sélection des tags** (si l'utilisateur choisit "Configurer") :
   - Modal avec la liste des catégories disponibles
   - Interface de sélection/désélection
   - Validation pour créer les tags sélectionnés

4. **Sélection des tâches** :
   - Modal avec les tâches organisées par catégorie
   - Options "Tout sélectionner/désélectionner" par catégorie
   - Validation pour créer les tâches sélectionnées

5. **Redirection** : Redirection automatique vers le groupe créé avec les tags/tâches ajoutés

## Composants créés

- `GroupCreatedModal.vue` : Modal de confirmation de création
- `StarterPackTagsModal.vue` : Sélection des catégories
- `StarterPackTasksModal.vue` : Sélection des tâches

## Modifications apportées

- `groupRepository.ts` : Ajout des endpoints `createBulkTags` et `createBulkTasks`
- `groupStore.ts` : Gestion des StarterPacks et de la redirection
- `CreateGroupForm.vue` : Intégration du flux StarterPacks
- Types : Ajout des interfaces pour les payloads et réponses bulk

## Comment tester

1. Aller sur la page de création de groupe
2. Saisir un nom de groupe et valider
3. Vérifier que la modal de confirmation s'affiche
4. Tester les deux flux :
   - "Ignorer" : doit rediriger directement vers le groupe
   - "Configurer" : doit ouvrir le flux de sélection des tags puis des tâches
5. Vérifier que les tags et tâches sélectionnés apparaissent bien dans le groupe final

## Critères d'acceptance validés

✅ Je veux être redirigé sur ce groupe et voir un message de confirmation s'afficher dans une modale à la création de mon groupe

✅ Grâce à l'objet starterPack dans la réponse, j'affiche une modale qui me permet d'afficher d'abord la liste de Tag, de cocher/décocher chacune d'entre elle et enfin d'utiliser la méthode backend pour créer les Tags selectionnés

✅ La validation des Tag lance la modale avec les tâches à cocher/décocher avec aussi un bouton de validation

✅ Quand je valide les Tasks, je vois mon groupe avec les Tags et Tasks mises à jour dans mon groupe