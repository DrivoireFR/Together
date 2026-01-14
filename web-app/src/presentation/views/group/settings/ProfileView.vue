<template>
  <div class="profile-section">
    <div class="profile-section-header">
      <h2 class="profile-section-title">Profil</h2>

      <button class="profil-back-btn" @click="onBackTap">
        <ArrowLeftCircleIcon />
      </button>
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
        <div
          v-if="user"
          class="profile-info-item full-width"
        >
          <span class="profile-info-label">Email</span>
          <span class="profile-info-value">{{ user.email }}</span>
          <template v-if="!user.emailVerified">
            <span class="profile-info-helper">
              Votre adresse email n'est pas encore validée.
            </span>
            <BaseButton
              size="sm"
              variant="outline"
              :loading="isResending"
              :disabled="isResending"
              @click="handleResendConfirmation"
            >
              Renvoyer l'email de validation
            </BaseButton>
          </template>
        </div>

        <div class="profile-info-item">
          <span class="profile-info-label">Nom</span>
          <span class="profile-info-value">{{ user?.nom }}</span>
        </div>

        <div class="profile-info-item">
          <span class="profile-info-label">Prénom</span>
          <span class="profile-info-value">{{ user?.prenom }}</span>
        </div>

        <div class="profile-actions">
          <BaseButton
            variant="outline"
            size="sm"
            @click="startEditing"
          >
            Modifier le profil
          </BaseButton>
        </div>
      </div>
    </div>

    <form v-else class="profile-edit-form" @submit.prevent="handleSubmit">
      <div v-if="submitError" class="profile-error-message">
        {{ submitError }}
      </div>

      <div class="profile-edit-content">
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

        <AvatarSelector
          v-model="editForm.avatar"
          label="Avatar"
          avatarSize="md"
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
import type { UpdateProfilePayload } from '@/domain/types'
import Vignette from '@/presentation/components/molecules/Vignette.vue'
import AvatarSelector from '@/presentation/components/molecules/AvatarSelector.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function onBackTap() {
  router.back()
}

const user = computed(() => authStore.user)
const isLoading = computed(() => authStore.isLoading)
const isResending = ref(false)

const isEditing = ref(false)

const editForm = reactive<UpdateProfilePayload>({
  nom: '',
  prenom: '',
  pseudo: '',
  avatar: undefined
})

const errors = reactive<Record<string, string>>({})
const submitError = ref<string>('')
const resendMessage = ref<string>('') // kept for potential future UI use

const startEditing = () => {
  if (!user.value) {
    submitError.value = 'Impossible de charger les données utilisateur'
    return
  }
  editForm.nom = user.value.nom || ''
  editForm.prenom = user.value.prenom || ''
  editForm.pseudo = user.value.pseudo || ''
  editForm.avatar = user.value.avatar
  isEditing.value = true
  errors.nom = ''
  errors.prenom = ''
  errors.pseudo = ''
  submitError.value = ''
}

const cancelEditing = () => {
  isEditing.value = false
  errors.nom = ''
  errors.prenom = ''
  errors.pseudo = ''
  submitError.value = ''
}

const handleResendConfirmation = async () => {
  if (!user.value?.email) return
  isResending.value = true
  resendMessage.value = ''
  try {
    const result = await authStore.resendConfirmation(user.value.email)
    resendMessage.value =
      result?.message ||
      'Si cette adresse est enregistrée, un email de confirmation a été envoyé.'
  } finally {
    isResending.value = false
  }
}

const validateForm = (): boolean => {
  errors.nom = ''
  errors.prenom = ''
  errors.pseudo = ''

  const nomTrimmed = editForm.nom?.trim() || ''
  const prenomTrimmed = editForm.prenom?.trim() || ''
  const pseudoTrimmed = editForm.pseudo?.trim() || ''

  if (!nomTrimmed) {
    errors.nom = 'Le nom est requis'
    return false
  }
  if (nomTrimmed.length < 2) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères'
    return false
  }
  if (nomTrimmed.length > 50) {
    errors.nom = 'Le nom ne peut pas dépasser 50 caractères'
    return false
  }

  if (!prenomTrimmed) {
    errors.prenom = 'Le prénom est requis'
    return false
  }
  if (prenomTrimmed.length < 2) {
    errors.prenom = 'Le prénom doit contenir au moins 2 caractères'
    return false
  }
  if (prenomTrimmed.length > 50) {
    errors.prenom = 'Le prénom ne peut pas dépasser 50 caractères'
    return false
  }

  if (!pseudoTrimmed) {
    errors.pseudo = 'Le pseudo est requis'
    return false
  }
  if (pseudoTrimmed.length < 3) {
    errors.pseudo = 'Le pseudo doit contenir au moins 3 caractères'
    return false
  }
  if (pseudoTrimmed.length > 30) {
    errors.pseudo = 'Le pseudo ne peut pas dépasser 30 caractères'
    return false
  }
  const pseudoRegex = /^[a-zA-Z0-9._-]+$/
  if (!pseudoRegex.test(pseudoTrimmed)) {
    errors.pseudo = 'Le pseudo ne peut contenir que des lettres, chiffres, points, tirets et underscores'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const payload: UpdateProfilePayload = {
    nom: editForm.nom?.trim(),
    prenom: editForm.prenom?.trim(),
    pseudo: editForm.pseudo?.trim(),
    avatar: editForm.avatar
  }

  submitError.value = ''
  const result = await authStore.updateProfile(payload)

  if (result.success) {
    isEditing.value = false
    submitError.value = ''
  } else {
    submitError.value = result.error || 'Une erreur est survenue lors de la mise à jour du profil'
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
}

.profile-info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.full-width {
  grid-column: 1 / -1;
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

.profile-info-helper {
  font-size: var(--font-size-xs);
  color: var(--color-warning, #b45309);
}

.profile-actions {
  grid-column: span 2;
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}
.profile-actions button {
  width: 100%;
  height: 100%;
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

.profile-error-message {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-3);
  background-color: var(--color-danger-light);
  border-radius: var(--border-radius-md);
  border: var(--border-width) solid var(--color-danger);
  margin-bottom: var(--spacing-4);
}

.profil-back-btn {
  width: 3rem;
  background: transparent;
  border: 0;
}
</style>

