<template>
  <BaseModal
    :isOpen="isOpen"
    title="Choisissez vos catégories"
    size="lg"
    @close="handleClose"
  >
    <div class="starter-pack-content">
      <p class="description">
        Sélectionnez les catégories que vous souhaitez ajouter à votre groupe.
        Vous pourrez ensuite choisir les tâches associées.
      </p>

      <div class="tags-grid">
        <div
          v-for="(tag, index) in availableTags"
          :key="tag.id || `tag-${index}`"
          class="tag-item"
          :class="{ 'selected': selectedTags.has(tag.id || index) }"
          @click="toggleTag(tag, index)"
        >
          <div class="tag-checkbox">
            <input
              type="checkbox"
              :checked="selectedTags.has(tag.id || index)"
              @change="toggleTag(tag, index)"
            />
          </div>
          <div class="tag-info">
            <div 
              class="tag-color" 
              :style="{ backgroundColor: tag.color }"
            ></div>
            <span class="tag-label">{{ tag.label }}</span>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <template #footer>
      <div class="modal-actions">
        <BaseButton
          variant="outline"
          @click="handleClose"
          :disabled="isLoading"
        >
          Annuler
        </BaseButton>
        
        <BaseButton
          @click="handleValidate"
          :loading="isLoading"
          :disabled="selectedTags.size === 0"
        >
          Valider les catégories ({{ selectedTags.size }})
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/presentation/components/atoms/BaseModal.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import { useGroupStore } from '@/domain/stores/groupStore'
import type { Tag } from '@/domain/types'

interface Props {
  isOpen: boolean
  availableTags: Tag[]
  groupId: number
}

interface Emits {
  close: []
  success: [createdTags: Tag[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const groupStore = useGroupStore()

const selectedTags = ref<Set<number>>(new Set())
const isLoading = ref(false)
const error = ref<string>('')

const selectedTagsList = computed(() => 
  props.availableTags.filter((tag, index) => selectedTags.value.has(tag.id || index))
)

const toggleTag = (tag: Tag, index: number) => {
  const tagId = tag.id || index
  if (selectedTags.value.has(tagId)) {
    selectedTags.value.delete(tagId)
  } else {
    selectedTags.value.add(tagId)
  }
}

const handleValidate = async () => {
  if (selectedTags.value.size === 0) return

  isLoading.value = true
  error.value = ''

  try {
    const tagsToCreate = selectedTagsList.value.map(tag => ({
      label: tag.label,
      color: tag.color
    }))

    const result = await groupStore.createBulkTags(props.groupId, tagsToCreate)

    if (result.success) {
      emit('success', result.tags as unknown as Tag[])
      groupStore.afterTagsCreated()
    } else {
      error.value = result.error || 'Erreur lors de la création des catégories'
    }
  } catch (err) {
    error.value = 'Erreur lors de la création des catégories'
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  selectedTags.value.clear()
  error.value = ''
  emit('close')
}
</script>

<style scoped>
.starter-pack-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.description {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  margin: 0;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-3);
}

.tag-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all 0.15s ease;
  background: var(--color-white);
}

.tag-item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.tag-item.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.tag-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.tag-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex: 1;
}

.tag-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-white);
  box-shadow: 0 0 0 1px var(--color-gray-300);
}

.tag-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
}

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-3);
  background-color: var(--color-danger-light);
  border-radius: var(--border-radius);
  border: var(--border-width) solid var(--color-danger);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .tags-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>