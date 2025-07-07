<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side -->
          <div class="flex items-center">
            <!-- Logo -->
            <router-link to="/" class="flex items-center">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <UserGroupIcon class="h-5 w-5 text-white" />
              </div>
              <span class="ml-2 text-xl font-bold text-gray-900">Groups</span>
            </router-link>
            
            <!-- Navigation links -->
            <div class="hidden md:flex ml-10 space-x-8">
              <router-link
                to="/groups"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-blue-600 bg-blue-50"
              >
                Mes groupes
              </router-link>
            </div>
          </div>
          
          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- User menu -->
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-700">{{ authStore.userName }}</span>
              <BaseButton
                variant="ghost"
                size="sm"
                @click="handleLogout"
              >
                <ArrowRightOnRectangleIcon class="h-4 w-4" />
                Déconnexion
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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