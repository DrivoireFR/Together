<template>
  <div class="profile-section">
    <div class="profile-section-header">
      <h2 class="profile-section-title">Profil</h2>
      <BaseButton
        v-if="!isEditing"
        variant="outline"
        size="sm"
        @click="startEditing"
      >
        Modifier
      </BaseButton>
    </div>

    <div v-if="!isEditing" class="profile-section-content">
      <Vignette
        :avatar="user?.avatar"
        :username="user?.pseudo || ''"
        :firstName="user?.prenom"
        :lastName="user?.nom"
        avatarSize="lg"
      />
      <div class="profile-info">
        <div class="profile-info-item">
          <span class="profile-info-label">Nom</span>
          <span class="profile-info-value">{{ user?.nom }}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label">Prénom</span>
          <span class="profile-info-value">{{ user?.prenom }}</span>
        </div>
        <div class="profile-info-item">
          <span class="profile-info-label">Email</span>
          <span class="profile-info-value">{{ user?.email }}</span>
        </div>
      </div>
    </div>

    <form v-else class="profile-edit-form" @submit.prevent="handleSubmit">
      <div class="profile-edit-content">
        <AvatarSelector
          v-model="editForm.avatar"
          label="Avatar"
          avatarSize="md"
        />
        <BaseInput
          v-model="editForm.nom"
          label="Nom"
          required
          :error="errors.nom"
        />
        <BaseInput
          v-model="editForm.prenom"
          label="Prénom"
          required
          :error="errors.prenom"
        />
        <BaseInput
          v-model="editForm.pseudo"
          label="Pseudo"
          required
          :error="errors.pseudo"
        />
      </div>
      <div class="profile-edit-actions">
        <BaseButton
          type="button"
          variant="outline"
          @click="cancelEditing"
          :disabled="isLoading"
        >
          Annuler
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :loading="isLoading"
          :disabled="isLoading"
        >
          Enregistrer
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/domain/stores/authStore'
import type { User, UpdateProfilePayload } from '@/domain/types'
import Vignette from '@/presentation/components/molecules/Vignette.vue'
import AvatarSelector from '@/presentation/components/molecules/AvatarSelector.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isLoading = computed(() => authStore.isLoading)

const isEditing = ref(false)

const editForm = reactive<UpdateProfilePayload>({
  nom: '',
  prenom: '',
  pseudo: '',
  avatar: undefined
})

const errors = reactive<Record<string, string>>({})

const startEditing = () => {
  if (!user.value) return
  editForm.nom = user.value.nom
  editForm.prenom = user.value.prenom
  editForm.pseudo = user.value.pseudo
  editForm.avatar = user.value.avatar
  isEditing.value = true
  errors.nom = ''
  errors.prenom = ''
  errors.pseudo = ''
}

const cancelEditing = () => {
  isEditing.value = false
  errors.nom = ''
  errors.prenom = ''
  errors.pseudo = ''
}

const validateForm = (): boolean => {
  errors.nom = ''
  errors.prenom = ''
  errors.pseudo = ''

  if (!editForm.nom || editForm.nom.trim() === '') {
    errors.nom = 'Le nom est requis'
    return false
  }

  if (!editForm.prenom || editForm.prenom.trim() === '') {
    errors.prenom = 'Le prénom est requis'
    return false
  }

  if (!editForm.pseudo || editForm.pseudo.trim() === '') {
    errors.pseudo = 'Le pseudo est requis'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const payload: UpdateProfilePayload = {
    nom: editForm.nom,
    prenom: editForm.prenom,
    pseudo: editForm.pseudo,
    avatar: editForm.avatar
  }

  const result = await authStore.updateProfile(payload)

  if (result.success) {
    isEditing.value = false
  } else {
    // Les erreurs sont gérées par le store
    console.error('Erreur lors de la mise à jour:', result.error)
  }
}
</script>

<style scoped>
.profile-section {
  background: var(--color-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

.profile-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.profile-section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0;
}

.profile-section-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  align-items: center;
}

.profile-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.profile-info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.profile-info-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
}

.profile-info-value {
  font-size: var(--font-size-base);
  color: var(--color-gray-900);
}

.profile-edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.profile-edit-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.profile-edit-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}
</style>
