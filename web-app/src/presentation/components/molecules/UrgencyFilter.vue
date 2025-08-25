<template>
  <div class="urgency-filter">
    <div class="urgency-filter-header">
      <h3 class="urgency-filter-title">Tri par urgence</h3>
    </div>
    
    <div class="urgency-toggle">
      <BaseButton 
        :variant="sortByUrgency ? 'primary' : 'ghost'"
        size="sm" 
        @click="toggleSort"
        class="urgency-button"
      >
        <span class="urgency-icon">🚨</span>
        <span>{{ sortByUrgency ? 'Tri activé' : 'Trier par urgence' }}</span>
      </BaseButton>
      
      <p class="urgency-description" v-if="sortByUrgency">
        Les tâches sont triées de la plus urgente à la moins urgente
      </p>
      <p class="urgency-description" v-else>
        Cliquez pour trier les tâches par niveau d'urgence
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

interface Props {
  sortByUrgency: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'toggle-urgency-sort': []
}>()

const toggleSort = () => {
  emit('toggle-urgency-sort')
}
</script>

<style scoped>
.urgency-filter {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

.urgency-filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.urgency-filter-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.urgency-toggle {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.urgency-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  align-self: flex-start;
}

.urgency-icon {
  font-size: var(--font-size-base);
  line-height: 1;
}

.urgency-description {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.4;
}
</style>