<template>
  <div v-if="isDemoMode" class="demo-banner">
    <div class="demo-banner-content">
      <span class="demo-icon">🎭</span>
      <div class="demo-text">
        <strong>Mode Démo</strong>
        <span class="demo-description">
          Cette application utilise des données fictives pour la démonstration.
        </span>
      </div>
      <button @click="showInfo = !showInfo" class="demo-info-btn">
        {{ showInfo ? '✕' : 'ℹ️' }}
      </button>
    </div>
    
    <div v-if="showInfo" class="demo-info">
      <div class="demo-credentials">
        <h4>🔐 Connexion démo</h4>
        <p><strong>Email:</strong> demo@example.com</p>
        <p><strong>Mot de passe:</strong> demo123</p>
      </div>
      <div class="demo-features">
        <h4>✨ Fonctionnalités</h4>
        <ul>
          <li>Données persistantes dans votre navigateur</li>
          <li>Toutes les actions sont simulées</li>
          <li>Parfait pour tester l'interface</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IS_DEMO_MODE } from '@/shared/constants'

const showInfo = ref(false)

const isDemoMode = computed(() => IS_DEMO_MODE)
</script>

<style scoped>
.demo-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.demo-banner-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.demo-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-text strong {
  font-size: 16px;
  font-weight: 600;
}

.demo-description {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.4;
}

.demo-info-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  flex-shrink: 0;
}

.demo-info-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.demo-info {
  background: rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 200px;
    opacity: 1;
  }
}

.demo-credentials,
.demo-features {
  margin-bottom: 16px;
}

.demo-credentials:last-child,
.demo-features:last-child {
  margin-bottom: 0;
}

.demo-info h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.demo-info p {
  margin: 4px 0;
  font-size: 13px;
  opacity: 0.9;
}

.demo-info ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
  font-size: 13px;
  opacity: 0.9;
}

.demo-info li {
  margin: 4px 0;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 768px) {
  .demo-banner-content {
    padding: 10px 12px;
  }
  
  .demo-text strong {
    font-size: 14px;
  }
  
  .demo-description {
    font-size: 12px;
  }
  
  .demo-info {
    padding: 12px;
  }
  
  .demo-info h4 {
    font-size: 13px;
  }
  
  .demo-info p,
  .demo-info ul {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .demo-banner-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .demo-info-btn {
    align-self: flex-end;
    margin-top: -32px;
  }
}
</style>