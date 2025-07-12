import type { User, Group, Task, Action, Tag, UserTaskState } from '@/shared/types/api'

// Utilisateurs mockés
export const mockUsers: User[] = [
  {
    id: 1,
    nom: 'Alice Martin',
    email: 'alice@example.com',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    nom: 'Bob Dupont',
    email: 'bob@example.com',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    nom: 'Charlie Legrand',
    email: 'charlie@example.com',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
]

// Tags mockés
export const mockTags: Tag[] = [
  {
    id: 1,
    label: 'Cuisine',
    color: '#ff6b6b',
    group: {} as Group, // Sera rempli après
    tasks: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    label: 'Ménage',
    color: '#4ecdc4',
    group: {} as Group,
    tasks: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    label: 'Courses',
    color: '#45b7d1',
    group: {} as Group,
    tasks: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Tâches mockées
export const mockTasks: Task[] = [
  {
    id: 1,
    label: 'Faire la vaisselle',
    iconUrl: '🍽️',
    frequenceEstimee: 1,
    uniteFrequence: 'jour',
    group: {} as Group,
    tag: mockTags[0],
    actions: [],
    userTaskState: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    label: 'Passer l\'aspirateur',
    iconUrl: '🧹',
    frequenceEstimee: 2,
    uniteFrequence: 'semaine',
    group: {} as Group,
    tag: mockTags[1],
    actions: [],
    userTaskState: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    label: 'Faire les courses',
    iconUrl: '🛒',
    frequenceEstimee: 1,
    uniteFrequence: 'semaine',
    group: {} as Group,
    tag: mockTags[2],
    actions: [],
    userTaskState: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    label: 'Nettoyer la salle de bain',
    iconUrl: '🚿',
    frequenceEstimee: 1,
    uniteFrequence: 'semaine',
    group: {} as Group,
    tag: mockTags[1],
    actions: [],
    userTaskState: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    label: 'Préparer le dîner',
    iconUrl: '👨‍🍳',
    frequenceEstimee: 1,
    uniteFrequence: 'jour',
    group: {} as Group,
    tag: mockTags[0],
    actions: [],
    userTaskState: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Actions mockées (activité récente)
export const mockActions: Action[] = [
  {
    id: 1,
    date: '2024-01-15T10:00:00Z',
    isHelpingHand: false,
    task: mockTasks[0],
    user: mockUsers[0],
    group: {} as Group,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    date: '2024-01-15T14:30:00Z',
    isHelpingHand: true,
    task: mockTasks[1],
    user: mockUsers[1],
    group: {} as Group,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 3,
    date: '2024-01-14T09:15:00Z',
    isHelpingHand: false,
    task: mockTasks[2],
    user: mockUsers[2],
    group: {} as Group,
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z'
  },
  {
    id: 4,
    date: '2024-01-14T16:45:00Z',
    isHelpingHand: false,
    task: mockTasks[4],
    user: mockUsers[0],
    group: {} as Group,
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z'
  }
]

// États des tâches utilisateur
export const mockUserTaskStates: UserTaskState[] = [
  {
    id: 1,
    taskId: 1,
    userId: 1,
    isAcknowledged: true,
    isConcerned: true,
    acknowledgedAt: '2024-01-15T08:00:00Z',
    concernedAt: '2024-01-15T08:00:00Z',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 2,
    taskId: 2,
    userId: 2,
    isAcknowledged: true,
    isConcerned: false,
    acknowledgedAt: '2024-01-15T09:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  }
]

// Groupe principal mocké
export const mockGroup: Group = {
  id: 1,
  nom: 'Famille Demo',
  users: mockUsers,
  tasks: mockTasks,
  actions: mockActions,
  tags: mockTags,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

// Remplir les références circulaires
mockTasks.forEach(task => {
  task.group = mockGroup
})
mockTags.forEach(tag => {
  tag.group = mockGroup
})
mockActions.forEach(action => {
  action.group = mockGroup
})

// Associer les tâches aux tags
mockTags[0].tasks = mockTasks.filter(t => t.tag?.id === 1)
mockTags[1].tasks = mockTasks.filter(t => t.tag?.id === 2)  
mockTags[2].tasks = mockTasks.filter(t => t.tag?.id === 3)

// Associer les actions aux tâches
mockTasks.forEach(task => {
  task.actions = mockActions.filter(a => a.task.id === task.id)
})

// Utilisateur connecté pour la démo
export const mockCurrentUser = mockUsers[0]

// Token factice pour la démo
export const mockToken = 'demo-token-123456789'