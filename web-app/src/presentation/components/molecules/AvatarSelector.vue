<template>
  <div class="avatar-selector">
    <label v-if="label" class="avatar-selector-label">{{ label }}</label>
    <div class="avatar-selector-container">
      <div class="avatar-grid">
        <button
          v-for="avatarValue in availableAvatars"
          :key="avatarValue"
          :class="['avatar-item', { 'avatar-item--selected': modelValue === avatarValue }]"
          @click="selectAvatar(avatarValue)"
          type="button"
          :aria-label="`Sélectionner l'avatar ${avatarValue}`"
        >
          <AvatarComponent
            :avatar="avatarValue"
            :username="avatarValue"
            :size="avatarSize"
          />
        </button>
        <button
          v-if="allowNone"
          :class="['avatar-item', 'avatar-item--none', { 'avatar-item--selected': modelValue === undefined }]"
          @click="selectAvatar(undefined)"
          type="button"
          aria-label="Aucun avatar"
        >
          <div class="avatar-item-wrapper avatar-item-wrapper--none">
            <span class="avatar-none-text">Aucun</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar } from '@/shared/types/enums'
import AvatarComponent from '@/presentation/components/atoms/Avatar.vue'

interface Props {
  modelValue?: Avatar
  availableAvatars?: Avatar[]
  label?: string
  avatarSize?: 'sm' | 'md' | 'lg'
  allowNone?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  availableAvatars: () => Object.values(Avatar),
  avatarSize: 'md',
  allowNone: true
})

const emit = defineEmits<{
  'update:modelValue': [value: Avatar | undefined]
}>()

const selectAvatar = (avatar: Avatar | undefined) => {
  emit('update:modelValue', avatar)
}
</script>

<style scoped>
.avatar-selector {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.avatar-selector-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.avatar-selector-container {
  width: 100%;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
  gap: var(--spacing-3);
  padding: var(--spacing-2);
}

.avatar-item {
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  background: var(--color-white);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: var(--spacing-2);
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.avatar-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-item:active {
  transform: translateY(0);
}

.avatar-item--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.avatar-item-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-item-wrapper--none {
  width: 100%;
  height: 100%;
}

.avatar-item--none {
  border-style: dashed;
}

.avatar-none-text {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
}

.avatar-item--selected .avatar-none-text {
  color: var(--color-primary);
}
</style>
