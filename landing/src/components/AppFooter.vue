<template>
  <footer class="app-footer">
    <div class="footer-container">
      <p class="footer-text">
        © 2025 To Get There - Vers l'équilibre, ensemble <Sparkles class="sparkle-icon" :size="16" />
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.footer-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.sparkle-icon {
  color: #fbbf24;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .footer-text {
    font-size: 0.8rem;
  }
  
  .app-footer {
    padding: 0.75rem 0;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 1rem;
  }
  
  .footer-text {
    font-size: 0.75rem;
  }
}
</style> 