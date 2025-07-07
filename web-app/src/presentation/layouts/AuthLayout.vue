<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="flex justify-center">
        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <UserGroupIcon class="h-8 w-8 text-white" />
        </div>
      </div>
      
      <!-- Title -->
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        <slot name="title">Connexion</slot>
      </h2>
      
      <!-- Subtitle -->
      <p v-if="$slots.subtitle" class="mt-2 text-center text-sm text-gray-600">
        <slot name="subtitle" />
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <BaseCard>
        <slot />
      </BaseCard>
      
      <!-- Footer links -->
      <div v-if="$slots.footer" class="mt-6 text-center">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserGroupIcon } from '@heroicons/vue/24/outline'
import BaseCard from '@/presentation/components/atoms/BaseCard.vue'
</script>