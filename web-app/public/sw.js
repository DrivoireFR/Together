// Service Worker minimal pour PWA installable
// Version 1.0.0

const CACHE_NAME = 'together-v1'

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation en cours...')

    // Passer immédiatement à l'activation
    self.skipWaiting()
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker: Activé avec succès')

    // Prendre le contrôle immédiatement de toutes les pages
    event.waitUntil(self.clients.claim())
})

// Gestion des requêtes réseau (mode réseau d'abord)
self.addEventListener('fetch', (event) => {
    // Ne pas intercepter les requêtes - laisser le navigateur gérer
    // Cela évite les erreurs si le réseau échoue
    if (event.request.mode === 'navigate') {
        // Pour la navigation, on laisse passer sans intercepter
        return
    }
    // Pour les autres requêtes, on les laisse passer aussi
})

// Gestion des messages depuis l'app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})

console.log('📱 Service Worker Together chargé - Version 1.0.0') 