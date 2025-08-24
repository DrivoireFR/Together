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
      component: () => import('@/presentation/views/LoginView.vue'),
      meta: {
        requiresAuth: false,
        layout: 'auth'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/presentation/views/RegisterView.vue'),
      meta: {
        requiresAuth: false,
        layout: 'auth'
      }
    },
    {
      path: '/groups',
      name: 'Groups',
      component: () => import('@/presentation/views/GroupsView.vue'),
      meta: {
        requiresAuth: true,
        layout: 'app'
      }
    },
    {
      path: '/groups/:id',
      name: 'GroupDetail',
      component: () => import('@/presentation/views/GroupDetailView.vue'),
      meta: {
        requiresAuth: true,
        layout: 'app'
      }
    },
    {
      path: '/groups/:id/stats',
      name: 'GroupStats',
      component: () => import('@/presentation/views/GroupStatsView.vue'),
      meta: {
        requiresAuth: true,
        layout: 'app'
      }
    }
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
