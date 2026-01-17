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
    Paw = "Patoune",
    Plants = "Plantes",
    Clean = "Nettoyage",
    Trash = "Poubelles",
}

/**
 * Enum Avatar - Liste des avatars disponibles pour les utilisateurs
 * 
 * IMPORTANT: Cette énum doit être synchronisée avec l'énum Avatar côté backend
 * (nest-api/src/users/enums/avatar.enum.ts)
 * 
 * Si vous modifiez cette énum, vous DEVEZ également mettre à jour l'énum côté backend.
 */
export enum Avatar {
    Man1 = "Man1",
    Man2 = "Man2",
    Man3 = "Man3",
    Man4 = "Man4",
    Man5 = "Man5",
    Man6 = "Man6",
    Woman1 = "Woman1",
    Woman2 = "Woman2",
    Woman3 = "Woman3",
    Woman4 = "Woman4",
    Woman5 = "Woman5",
    Woman6 = "Woman6",
}