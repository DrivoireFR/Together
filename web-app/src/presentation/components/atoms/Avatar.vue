<template>
  <div class="avatar" :class="[`avatar--${size}`]">
    <img
      v-if="avatar && avatarImage"
      :src="avatarImage"
      :alt="`Avatar de ${username}`"
      class="avatar-image"
    />
    <div
      v-else
      class="avatar-initials"
      :style="{ backgroundColor: 'var(--color-primary)' }"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar as AvatarEnum } from '@/shared/types/enums'
import man1 from '@/assets/avatars/man-1.png'
import man2 from '@/assets/avatars/man-2.png'
import man3 from '@/assets/avatars/man-3.png'
import man4 from '@/assets/avatars/man-4.png'
import man5 from '@/assets/avatars/man-5.png'
import man6 from '@/assets/avatars/man-6.png'
import woman1 from '@/assets/avatars/woman-1.png'
import woman2 from '@/assets/avatars/woman-2.png'
import woman3 from '@/assets/avatars/woman-3.png'
import woman4 from '@/assets/avatars/woman-4.png'
import woman5 from '@/assets/avatars/woman-5.png'
import woman6 from '@/assets/avatars/woman-6.png'

interface Props {
  avatar?: AvatarEnum
  username: string
  firstName?: string
  lastName?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const avatarMap: Record<AvatarEnum, string> = {
  [AvatarEnum.Man1]: man1,
  [AvatarEnum.Man2]: man2,
  [AvatarEnum.Man3]: man3,
  [AvatarEnum.Man4]: man4,
  [AvatarEnum.Man5]: man5,
  [AvatarEnum.Man6]: man6,
  [AvatarEnum.Woman1]: woman1,
  [AvatarEnum.Woman2]: woman2,
  [AvatarEnum.Woman3]: woman3,
  [AvatarEnum.Woman4]: woman4,
  [AvatarEnum.Woman5]: woman5,
  [AvatarEnum.Woman6]: woman6,
}

const avatarImage = computed(() => {
  if (!props.avatar) return null
  return avatarMap[props.avatar] || null
})

const initials = computed(() => {
  const first = props.firstName?.charAt(0).toUpperCase() || ''
  const last = props.lastName?.charAt(0).toUpperCase() || ''
  return (first + last) || props.username.charAt(0).toUpperCase()
})
</script>

<style scoped>
.avatar {
  border-radius: var(--border-radius-full);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
}

.avatar--sm {
  width: 2rem;
  height: 2rem;
  font-size: var(--font-size-xs);
}

.avatar--md {
  width: 4rem;
  height: 4rem;
  font-size: var(--font-size-base);
}

.avatar--lg {
  width: 6rem;
  height: 6rem;
  font-size: var(--font-size-xl);
}
</style>
