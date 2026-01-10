<template>
  <div class="urgency-filter" @click="toggleSort">
    <h3 class="urgency-filter-title">
      <span class="icon-container">
        <IconComp :icon="Icon.Urgent" />
      </span>
      Tâches urgentes
    </h3>
  </div>
</template>

<script setup lang="ts">
import { useTasksStore } from '@/domain/stores/tasksStore';
import IconComp from '../atoms/Icon.vue';

import { Icon } from '@/shared/types/enums'

const taskStore = useTasksStore()

const toggleSort = () => {
  taskStore.onUrgencyCatTap()
}
</script>

<style scoped>
.urgency-filter {
  height: 100%;
  background: var(--color-white);
  border: 1px solid var(--color-danger);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  cursor: pointer;
  /* margin-bottom: var(--spacing-4); */
}

.urgency-filter-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-danger);
  margin: 0;
}

.icon-container {
  display: block;
	--icon-color: var(--color-danger);
	height: 80px;
}
</style>