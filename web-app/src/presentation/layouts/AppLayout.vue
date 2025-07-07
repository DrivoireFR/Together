<template>
  <div class="app-layout">
    <!-- Navigation -->
    <nav class="app-nav">
      <div class="nav-container">
        <div class="nav-content">
          <!-- Left side -->
          <div class="nav-left">
            <!-- Logo -->
            <router-link to="/" class="nav-logo">
              <div class="nav-logo-icon">
                <UserGroupIcon class="nav-logo-svg" />
              </div>
              <span class="nav-logo-text">Groups</span>
            </router-link>
            
            <!-- Navigation links -->
            <div class="nav-links">
              <router-link
                to="/groups"
                class="nav-link"
                active-class="nav-link--active"
              >
                Mes groupes
              </router-link>
            </div>
          </div>
          
          <!-- Right side -->
          <div class="nav-right">
            <!-- User menu -->
            <div class="user-menu">
              <span class="user-name">{{ authStore.userName }}</span>
              <BaseButton
                variant="ghost"
                size="sm"
                @click="handleLogout"
              >
                <ArrowRightOnRectangleIcon class="logout-icon" />
                Déconnexion
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main content -->
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { UserGroupIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/domain/stores/authStore'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.app-nav {
  background-color: var(--color-white);
  box-shadow: var(--shadow-sm);
  border-bottom: var(--border-width) solid var(--color-gray-200);
}

.nav-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  height: var(--spacing-16);
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.nav-logo-icon {
  width: var(--spacing-8);
  height: var(--spacing-8);
  background-color: var(--color-primary);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-logo-svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-white);
}

.nav-logo-text {
  margin-left: var(--spacing-2);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
}

.nav-links {
  display: none;
  margin-left: var(--spacing-10);
  gap: var(--spacing-8);
}

.nav-link {
  color: var(--color-gray-500);
  text-decoration: none;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
  transition-property: color, background-color;
}

.nav-link:hover {
  color: var(--color-gray-700);
}

.nav-link--active {
  color: var(--color-primary) !important;
  background-color: var(--color-primary-light) !important;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.user-name {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.logout-icon {
  width: var(--spacing-4);
  height: var(--spacing-4);
}

.app-main {
  max-width: 80rem;
  margin: 0 auto;
  padding: var(--spacing-8) var(--spacing-4);
}

/* Responsive design */
@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
  
  .nav-container {
    padding: 0 var(--spacing-6);
  }
  
  .app-main {
    padding: var(--spacing-8) var(--spacing-6);
  }
}

@media (min-width: 1024px) {
  .nav-container {
    padding: 0 var(--spacing-8);
  }
  
  .app-main {
    padding: var(--spacing-8) var(--spacing-8);
  }
}
</style>