import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/domain/stores/authStore'

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
          component: () => import('@/presentation/views/group/GroupHome.vue')
        },
        {
          path: 'tasks',
          name: 'GroupTasks',
          component: () => import('@/presentation/views/group/GroupTasks.vue')
        },
        {
          path: 'history',
          name: 'GroupHistory',
          component: () => import('@/presentation/views/group/GroupHistory.vue')
        },
        {
          path: 'settings',
          name: 'GroupSettings',
          component: () => import('@/presentation/views/group/GroupSettings.vue')
        },
        {
          path: 'stats',
          name: 'GroupStats',
          component: () => import('@/presentation/views/group/GroupStatsView.vue'),
          meta: {
            requiresAuth: true,
            layout: 'app'
          }
        }
      ]
    },
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Plus besoin de vérifier isLoading car l'init est terminée avant le mount
  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next('/groups')
  } else {
    next()
  }
})

export default router
