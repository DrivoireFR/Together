import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/domain/stores/authStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize authentication BEFORE mounting
const initApp = async () => {
    const authStore = useAuthStore()
    await authStore.initializeAuth()
    app.mount('#app')
}

initApp()

// Enregistrement du Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js')
            console.log('✅ Service Worker enregistré:', registration.scope)

            // Écouter les mises à jour du SW
            registration.addEventListener('updatefound', () => {
                console.log('🔄 Nouvelle version du Service Worker disponible')
            })
        } catch (error) {
            console.error('❌ Échec enregistrement Service Worker:', error)
        }
    })
}
