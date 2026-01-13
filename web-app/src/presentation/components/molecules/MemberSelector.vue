<template>
  <div class="member-selector">
    <div class="member-grid">
      <button
        v-for="member in members"
        :key="member.id"
        :class="['member-item', { 'member-item--selected': selectedMemberId === member.id }]"
        @click="selectMember(member)"
        type="button"
        :aria-label="`Sélectionner ${member.pseudo}`"
      >
        <AvatarComponent
          :avatar="member.avatar"
          :username="member.pseudo"
          :firstName="member.prenom"
          :lastName="member.nom"
          :size="avatarSize"
        />
        <span class="member-name">{{ member.pseudo }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '@/domain/types'
import AvatarComponent from '@/presentation/components/atoms/Avatar.vue'

interface Props {
  members: User[]
  avatarSize?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  avatarSize: 'md'
})

const emit = defineEmits<{
  'member-selected': [member: User]
}>()

const selectedMemberId = ref<number | null>(null)

const selectMember = (member: User) => {
  selectedMemberId.value = member.id
  emit('member-selected', member)
}
</script>

<style scoped>
.member-selector {
  width: 100%;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  gap: var(--spacing-3);
  padding: var(--spacing-2);
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  border: 2px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  background: var(--color-white);
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  width: 100%;
}

.member-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.member-item:active {
  transform: translateY(0);
}

.member-item--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.member-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  text-align: center;
  word-break: break-word;
}

.member-item--selected .member-name {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}
</style>
