/**
 * Enum Icon - Liste des icônes disponibles pour les tags
 * 
 * IMPORTANT: Cette énum doit être synchronisée avec l'énum Icon côté frontend
 * (web-app/src/shared/types/enums.ts)
 * 
 * Si vous modifiez cette énum, vous DEVEZ également mettre à jour l'énum côté frontend.
 * 
 * Valeurs actuelles:
 * - Courses
 * - Copain
 * - Cuisine
 * - Linge
 * - Poubelle
 * - Sanitaires
 * - Surfaces
 * - Default (Défaut)
 * - Tasks (Tâches)
 * - Historique
 * - Stats
 * - Parametres
 * - Urgent
 * - Add (Ajouter)
 */
export enum Icon {
    Courses = 'Courses',
    Copain = 'Copain',
    Cuisine = 'Cuisine',
    Linge = 'Linge',
    Poubelle = 'Poubelle',
    Sanitaires = 'Sanitaires',
    Surfaces = 'Surfaces',
    Default = 'Default',
    Tasks = 'Tasks',
    Historique = 'Historique',
    Stats = 'Stats',
    Parametres = 'Parametres',
    Urgent = 'Urgent',
    Add = 'Add',
}
