<template>
  <div class="group-info">
    <section class="group-summary" v-if="group">
      <h2 class="group-title">{{ group.nom }}</h2>
      <p class="group-code">Partagez le code du groupe :</p>
      <BaseButton
        variant="outline"
        @click="copyInvite"
      >
        Copier le code dans le presse papier
      </BaseButton>
      <p v-if="copied" class="copy-feedback">
        Lien d'invitation copié dans le presse-papiers.
      </p>

      <div class="group-stats">
        <div class="stat-item">
          <span class="stat-label">Nombre de tâches</span>
          <span class="stat-value">{{ tasksCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Nombre de catégories</span>
          <span class="stat-value">{{ tagsCount }}</span>
        </div>
      </div>
    </section>

    <section class="group-members" v-if="members.length">
      <h3 class="section-title">Les membres</h3>
      <div class="members-grid">
        <div
          v-for="member in members"
          :key="member.id"
          class="member-item"
        >
          <Avatar
            :avatar="member.avatar"
            :username="member.pseudo"
            :firstName="member.prenom"
            :lastName="member.nom"
            size="sm"
          />
          <span class="member-name">{{ member.pseudo }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGroupStore } from '@/domain/stores/groupStore'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import Avatar from '@/presentation/components/atoms/Avatar.vue'

const groupStore = useGroupStore()

const group = computed(() => groupStore.currentGroup)
const tasksCount = computed(() => group.value?.tasks?.length ?? 0)
const tagsCount = computed(() => group.value?.tags?.length ?? 0)
const members = computed(() => group.value?.users ?? [])

const copied = ref(false)

const copyInvite = async () => {
  if (!group.value) return

  const text = `${group.value.nom} - Code pour rejoindre le groupe : ${group.value.code}`

  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch {
    copied.value = false
  }
}
</script>

<style scoped>
.group-info {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.group-summary {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.group-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.group-code {
  margin: 0;
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.group-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
}

.stat-item {
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--border-radius-md);
  background: var(--color-gray-50);
  min-width: 10rem;
}

.stat-label {
  display: block;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-500);
}

.stat-value {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.group-members {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-4);
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
}

.member-name {
  font-size: var(--font-size-xs);
  color: var(--color-gray-700);
  text-align: center;
}

.group-invite {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-2);
}

.copy-feedback {
  font-size: var(--font-size-xs);
  color: var(--color-success, #16a34a);
  margin: 0;
}
</style>

