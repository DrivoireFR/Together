<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-container">
      <!-- Nom du groupe -->
      <BaseInput
        v-model="form.nom"
        type="text"
        label="Nom du groupe"
        placeholder="Mon super groupe"
        :error="errors.nom"
        :disabled="groupStore.isLoading"
        required
        :iconBefore="UserGroupIcon"
      />
      
      <!-- Error message -->
      <div v-if="groupStore.error" class="form-error">
        {{ groupStore.error }}
      </div>
      
      <!-- Actions -->
      <div class="form-actions">
        <BaseButton
          type="button"
          variant="outline"
          @click="handleCancel"
          :disabled="groupStore.isLoading"
        >
          Annuler
        </BaseButton>
        
        <BaseButton
          type="submit"
          :loading="groupStore.isLoading"
          :disabled="!isFormValid"
          class="form-submit-primary"
        >
          Créer le groupe
        </BaseButton>
      </div>
    </div>
  </form>

  <!-- Modal de confirmation de création -->
  <GroupCreatedModal
    :isOpen="showGroupCreatedModal"
    :groupName="createdGroup?.nom || ''"
    :groupCode="createdGroup?.code || ''"
    :availableTags="availableStarterPackTags"
    :availableTasks="availableStarterPackTasks"
    @close="closeGroupCreatedModal"
    @startSetup="startStarterPackSetup"
    @skip="skipStarterPackSetup"
  />

  <!-- Modal de sélection des tags -->
  <StarterPackTagsModal
    :isOpen="showTagsModal"
    :availableTags="availableStarterPackTags"
    :groupId="createdGroup?.id || 0"
    @close="closeTagsModal"
    @success="handleTagsCreated"
  />

  <!-- Modal de sélection des tâches -->
  <StarterPackTasksModal
    :isOpen="showTasksModal"
    :availableTasks="availableStarterPackTasksWithTags"
    :groupId="createdGroup?.id || 0"
    @close="closeTasksModal"
    @success="handleTasksCreated"
  />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { UserGroupIcon } from '@heroicons/vue/24/outline'
import { useGroupStore } from '@/domain/stores/groupStore'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import GroupCreatedModal from './GroupCreatedModal.vue'
import StarterPackTagsModal from './StarterPackTagsModal.vue'
import StarterPackTasksModal from './StarterPackTasksModal.vue'
import type { CreateGroupPayload, Group, Tag, Task } from '@/domain/types'

interface Props {
  onSuccess?: () => void  // Callback for modal closing
  onCancel?: () => void   // Callback for cancel action
}

const props = withDefaults(defineProps<Props>(), {
  onSuccess: () => {},
  onCancel: () => {}
})

const groupStore = useGroupStore()

// Form state
const form = reactive({
  nom: ''
})

// Validation errors
const errors = reactive({
  nom: ''
})

// Modal states
const showGroupCreatedModal = ref(false)
const showTagsModal = ref(false)
const showTasksModal = ref(false)

// StarterPack data
const createdGroup = ref<Group | null>(null)
const selectedTags = ref<Tag[]>([])

// Computed
const isFormValid = computed(() => {
  return form.nom.trim() !== '' && !errors.nom
})

const availableStarterPackTags = computed(() => {
  return groupStore.createdGroupData?.starterPack.tags || []
})

const availableStarterPackTasks = computed(() => {
  return groupStore.createdGroupData?.starterPack.tasks || []
})

const availableStarterPackTasksWithTags = computed(() => {
  const starterPack = groupStore.createdGroupData?.starterPack
  if (!starterPack) return []

  // Associer chaque tâche avec son tag correspondant
  return starterPack.tasks.map((task, index) => {
    // Les tâches du StarterPack ont une propriété tagLabel au lieu d'une relation directe
    const taskWithTagLabel = task as any
    const associatedTag = starterPack.tags.find(tag => 
      tag.label === taskWithTagLabel.tagLabel
    )
    
    return {
      id: task.id || index + 1000, // ID temporaire si pas d'ID
      label: task.label,
      frequenceEstimee: task.frequenceEstimee,
      uniteFrequence: task.uniteFrequence,
      points: task.points,
      tag: associatedTag || starterPack.tags[0] // fallback au premier tag
    }
  })
})

// Validation functions
const validateNom = () => {
  if (!form.nom.trim()) {
    errors.nom = 'Le nom du groupe est requis'
  } else if (form.nom.trim().length < 3) {
    errors.nom = 'Le nom doit contenir au moins 3 caractères'
  } else if (form.nom.trim().length > 50) {
    errors.nom = 'Le nom ne peut pas dépasser 50 caractères'
  } else {
    errors.nom = ''
  }
}

// Form submission
const handleSubmit = async () => {
  validateNom()
  
  if (isFormValid.value) {
    const result = await groupStore.createGroup({
      nom: form.nom.trim()
    })
    
    if (result.success) {
      // Stocker le groupe créé si présent
      if ((result as any).group?.group) {
        createdGroup.value = (result as any).group.group
      }
      
      // Reset form
      form.nom = ''
      errors.nom = ''
      
      // Fermer le modal de création et ouvrir celui de confirmation
      props.onSuccess()
      
      // Afficher la modal de confirmation avec StarterPack
      showGroupCreatedModal.value = true
    }
  }
}

const handleCancel = () => {
  // Reset form
  form.nom = ''
  errors.nom = ''
  
  props.onCancel()
}

// StarterPack flow handlers
const startStarterPackSetup = () => {
  closeGroupCreatedModal()
  showTagsModal.value = true
}

const skipStarterPackSetup = () => {
  closeGroupCreatedModal()
  if (createdGroup.value) {
    groupStore.skipGroupSetup(createdGroup.value.id)
  }
  resetStarterPackFlow()
}

const handleTagsCreated = (createdTags: Tag[]) => {
  selectedTags.value = createdTags
  closeTagsModal()
  showTasksModal.value = true
}

const handleTasksCreated = (createdTasks: Task[]) => {
  closeTasksModal()
  if (createdGroup.value) {
    groupStore.finishGroupSetup(createdGroup.value.id)
  }
  resetStarterPackFlow()
}

// Modal handlers
const closeGroupCreatedModal = () => {
  showGroupCreatedModal.value = false
}

const closeTagsModal = () => {
  showTagsModal.value = false
}

const closeTasksModal = () => {
  showTasksModal.value = false
  // Si l'utilisateur ferme la modal des tâches, on considère que le setup est terminé
  if (createdGroup.value) {
    groupStore.finishGroupSetup(createdGroup.value.id)
  }
  resetStarterPackFlow()
}

const resetStarterPackFlow = () => {
  createdGroup.value = null
  selectedTags.value = []
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-2);
  background-color: var(--color-danger-light);
  border-radius: var(--border-radius);
  border: var(--border-width) solid var(--color-danger);
}

.form-actions {
  display: flex;
  gap: var(--spacing-3);
}

.form-submit-primary {
  flex: 1;
}
</style>