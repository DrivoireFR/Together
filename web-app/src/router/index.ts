import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/domain/stores/authStore'
import { useGroupStore } from '@/domain/stores/groupStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/groups'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/presentation/views/auth/LoginView.vue'),
      meta: {
        requiresAuth: false,
        layout: 'auth'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/presentation/views/auth/RegisterView.vue'),
      meta: {
        requiresAuth: false,
        layout: 'auth'
      }
    },
    {
      path: '/groups',
      name: 'Groups',
      component: () => import('@/presentation/views/GroupSelectionView.vue'),
      meta: {
        requiresAuth: true,
        layout: 'app'
      }
    },
    {
      path: '/group/:id',
      name: 'GroupDetail',
      component: () => import('@/presentation/views/group/GroupView.vue'),
      meta: {
        requiresAuth: true,
        layout: 'app'
      },
      children: [
        {
          path: '',
          name: 'GroupHomeCats',
          component: () => import('@/presentation/views/group/GroupHome.vue'),
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'tasks',
          name: 'GroupTasks',
          component: () => import('@/presentation/views/group/GroupTasks.vue'),
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'history',
          name: 'GroupHistory',
          component: () => import('@/presentation/views/group/GroupHistory.vue'),
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'settings',
          name: 'GroupSettings',
          component: () => import('@/presentation/views/group/GroupSettings.vue'),
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'stats',
          name: 'GroupStats',
          component: () => import('@/presentation/views/group/GroupStatsView.vue'),
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'add',
          name: 'GroupAddForm',
          component: () => import('@/presentation/views/group/GroupAddForm.vue'),
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'tag/edit',
          name: 'GroupEditTag',
          component: () => import('@/presentation/views/group/GroupEditTag.vue'),
          meta: {
            requiresAuth: true,
          }
        }
      ]
    },
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const groupStore = useGroupStore()

  // Plus besoin de vérifier isLoading car l'init est terminée avant le mount
  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next('/groups')
    return
  }

  if (to.path.startsWith('/group/') && isAuthenticated && authStore.user) {
    const groupId = Number(to.params.id)

    if (isNaN(groupId)) {
      next('/groups')
      return
    }

    if (groupStore.groups.length === 0) {
      await groupStore.getUserGroups(authStore.user.id)
    }

    const hasAccess = groupStore.groups.some(group => group.id === groupId)

    if (!hasAccess) {
      next('/groups')
      return
    }
  }

  next()
})

export default router
