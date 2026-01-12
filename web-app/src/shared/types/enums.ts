/**
 * Enum Icon - Liste des icônes disponibles pour les tags
 * 
 * IMPORTANT: Cette énum doit être synchronisée avec l'énum Icon côté backend
 * (nest-api/src/tags/enums/icon.enum.ts)
 * 
 * Si vous modifiez cette énum, vous DEVEZ également mettre à jour l'énum côté backend.
 */
export enum Icon {
    Courses = "Courses",
    Copain = "Copain",
    Cuisine = "Cuisine",
    Linge = "Linge",
    Poubelle = "Poubelle",
    Sanitaires = "Sanitaires",
    Surfaces = "Surfaces",
    Default = "Défaut",
    Tasks = "Tâches",
    Historique = "Historique",
    Stats = "Stats",
    Parametres = "Parametres",
    Urgent = "Urgent",
    Add = "Ajouter",
    Options = "Options",
}