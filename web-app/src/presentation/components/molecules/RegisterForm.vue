<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-container">
      <!-- Nom -->
      <BaseInput
        v-model="form.nom"
        type="text"
        label="Nom"
        placeholder="Dupont"
        :error="errors.nom"
        :disabled="authStore.isLoading"
        required
        :iconBefore="UserIcon"
        @blur="validateNom"
      />
      
      <!-- Prénom -->
      <BaseInput
        v-model="form.prenom"
        type="text"
        label="Prénom"
        placeholder="Jean"
        :error="errors.prenom"
        :disabled="authStore.isLoading"
        required
        :iconBefore="UserIcon"
        @blur="validatePrenom"
      />
      
      <!-- Pseudo -->
      <BaseInput
        v-model="form.pseudo"
        type="text"
        label="Pseudo"
        placeholder="jean.dupont"
        :error="errors.pseudo"
        :disabled="authStore.isLoading"
        required
        :iconBefore="AtSymbolIcon"
        @blur="validatePseudo"
      />
      
      <!-- Email -->
      <BaseInput
        v-model="form.email"
        type="email"
        label="Adresse email"
        placeholder="exemple@email.com"
        :error="errors.email"
        :disabled="authStore.isLoading"
        required
        :iconBefore="EnvelopeIcon"
        @blur="validateEmail"
      />
      
      <!-- Password -->
      <BaseInput
        v-model="form.password"
        type="password"
        label="Mot de passe"
        placeholder="••••••••"
        :error="errors.password"
        :disabled="authStore.isLoading"
        required
        :iconBefore="LockClosedIcon"
        @blur="validatePassword"
      />
      
      <!-- Confirm Password -->
      <BaseInput
        v-model="form.confirmPassword"
        type="password"
        label="Confirmer le mot de passe"
        placeholder="••••••••"
        :error="errors.confirmPassword"
        :disabled="authStore.isLoading"
        required
        :iconBefore="LockClosedIcon"
        @blur="validateConfirmPassword"
      />
      
      <!-- Avatar (optional) -->
      <AvatarSelector
        v-model="form.avatar"
        label="Avatar (optionnel)"
        avatarSize="md"
        :allow-none="true"
      />
      
      <!-- Error message -->
      <div v-if="authStore.error" class="form-error">
        {{ authStore.error }}
      </div>
      
      <!-- Submit button -->
      <BaseButton
        type="submit"
        :loading="authStore.isLoading"
        :disabled="!isFormValid"
        class="form-submit"
      >
        S'inscrire
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  AtSymbolIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/domain/stores/authStore'
import BaseInput from '@/presentation/components/atoms/BaseInput.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import AvatarSelector from '@/presentation/components/molecules/AvatarSelector.vue'
import type { RegisterPayload } from '@/domain/types'
import type { Avatar } from '@/shared/types/enums'

const router = useRouter()
const authStore = useAuthStore()



// Form state
const form = reactive<{
  nom: string
  prenom: string
  pseudo: string
  email: string
  password: string
  confirmPassword: string
  avatar?: Avatar
}>({
  nom: '',
  prenom: '',
  pseudo: '',
  email: '',
  password: '',
  confirmPassword: '',
  avatar: undefined
})

// Validation errors
const errors = reactive({
  nom: '',
  prenom: '',
  pseudo: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Computed
const isFormValid = computed(() => {
  return form.nom.trim() !== '' && 
         form.prenom.trim() !== '' && 
         form.pseudo.trim() !== '' &&
         form.email.trim() !== '' && 
         form.password.trim() !== '' &&
         form.confirmPassword.trim() !== '' &&
         form.password === form.confirmPassword &&
         !errors.nom && 
         !errors.prenom && 
         !errors.pseudo &&
         !errors.email && 
         !errors.password &&
         !errors.confirmPassword
})

// Validation functions
const validateNom = () => {
  if (!form.nom.trim()) {
    errors.nom = 'Le nom est requis'
  } else if (form.nom.trim().length < 2) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères'
  } else {
    errors.nom = ''
  }
}

const validatePrenom = () => {
  if (!form.prenom.trim()) {
    errors.prenom = 'Le prénom est requis'
  } else if (form.prenom.trim().length < 2) {
    errors.prenom = 'Le prénom doit contenir au moins 2 caractères'
  } else {
    errors.prenom = ''
  }
}

const validatePseudo = () => {
  const pseudoRegex = /^[a-zA-Z0-9._-]+$/
  if (!form.pseudo.trim()) {
    errors.pseudo = 'Le pseudo est requis'
  } else if (form.pseudo.trim().length < 3) {
    errors.pseudo = 'Le pseudo doit contenir au moins 3 caractères'
  } else if (!pseudoRegex.test(form.pseudo)) {
    errors.pseudo = 'Le pseudo ne peut contenir que des lettres, chiffres, points, tirets et underscores'
  } else {
    errors.pseudo = ''
  }
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'L\'email est requis'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Format d\'email invalide'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!form.password.trim()) {
    errors.password = 'Le mot de passe est requis'
  } else if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  } else {
    errors.password = ''
  }
}

const validateConfirmPassword = () => {
  if (!form.confirmPassword.trim()) {
    errors.confirmPassword = 'La confirmation du mot de passe est requise'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
  } else {
    errors.confirmPassword = ''
  }
}

// Watch for password changes to re-validate confirmPassword
watch(() => form.password, () => {
  if (errors.confirmPassword) {
    validateConfirmPassword()
  }
})

// Watch for confirmPassword changes to re-validate
watch(() => form.confirmPassword, () => {
  if (errors.confirmPassword) {
    validateConfirmPassword()
  }
})

// Form submission - now directly uses the store
const handleSubmit = async () => {
  validateNom()
  validatePrenom()
  validatePseudo()
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  
  if (isFormValid.value) {
    const payload: RegisterPayload = {
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      pseudo: form.pseudo.trim(),
      email: form.email.trim(),
      password: form.password,
      avatar: form.avatar
    }
    
    const result = await authStore.register(payload)
    
    if (result.success) {
      router.push('/groups')
    }
  }
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

.form-submit {
  width: 100%;
}
</style> 