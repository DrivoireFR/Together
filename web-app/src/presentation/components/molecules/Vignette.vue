<template>
  <div class="vignette">
    <Avatar
      :avatar="avatar"
      :username="username"
      :firstName="firstName"
      :lastName="lastName"
      :size="avatarSize"
    />
    <p class="vignette-username">{{ username }}</p>
  </div>
</template>

<script setup lang="ts">
import { Avatar as AvatarEnum } from '@/shared/types/enums'
import Avatar from '@/presentation/components/atoms/Avatar.vue'

interface Props {
  avatar?: AvatarEnum
  username: string
  firstName?: string
  lastName?: string
  avatarSize?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  avatarSize: 'md'
})
</script>

<style scoped>
.vignette {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
}

.vignette-username {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin: 0;
  text-align: center;
}
</style>
