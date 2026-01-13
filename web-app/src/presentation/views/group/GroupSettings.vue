<template>
    <div class="group-settings">
        <ProfileSection />
        <div class="group-settings-actions">
            <BaseButton
                variant="danger"
                @click="handleLogout"
            >
                Déconnexion
            </BaseButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/domain/stores/authStore'
import ProfileSection from '@/presentation/components/molecules/ProfileSection.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.group-settings {
    max-width: 48rem;
    margin: 0 auto;
    padding: var(--spacing-6);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
}

.group-settings-actions {
    display: flex;
    justify-content: flex-end;
}
</style>