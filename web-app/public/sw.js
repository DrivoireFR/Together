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
    // Laisser passer toutes les requêtes normalement
    // Aucun cache, juste pour respecter les critères PWA
    event.respondWith(fetch(event.request))
})

// Gestion des messages depuis l'app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})

console.log('📱 Service Worker Together chargé - Version 1.0.0') 