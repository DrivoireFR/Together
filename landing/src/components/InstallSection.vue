<template>
  <section class="install-section">
    <div class="install-container">
      <!-- Section Header -->
      <div class="section-header">
        <h2 class="section-title">Installez l'app sur votre téléphone</h2>
        <p class="section-subtitle">
          To Get There est une application web : pour une expérience optimale, installez <strong>To Get There</strong> directement sur votre téléphone comme une application mobile !
        </p>
      </div>

      <!-- Installation Cards -->
      <div class="install-grid">
        <InstallCard
          :icons="androidIcons"
          title="Sur Android"
          title-color="android"
          :steps="androidSteps"
        />
        
        <InstallCard
          :icons="iosIcons"
          title="Sur iPhone/iPad"
          title-color="ios"
          :steps="iosSteps"
        />
      </div>

      <!-- Final Note -->
      <!-- <div class="final-note">
        <p class="note-text">
          Une fois installée, l'application se comporte exactement comme une app native : accès rapide, notifications, et utilisation<br>
          hors ligne limitée !
        </p>
      </div> -->
    </div>
  </section>
</template>

<script setup lang="ts">
import InstallCard from './InstallCard.vue'

const androidIcons = ['🤖', '📱']
const iosIcons = ['🍎', '🍎']

const androidSteps = [
  'Ouvrez l\'application dans Chrome',
  'Tapez sur le menu (3 points) en haut à droite',
  'Sélectionnez "Ajouter à l\'écran d\'accueil"',
  'Confirmez en tapant "Ajouter"',
  'L\'icône apparaît sur votre écran d\'accueil !'
]

const iosSteps = [
  'Ouvrez l\'application dans Safari',
  'Tapez sur le bouton de partage (carré avec flèche)',
  'Faites défiler et sélectionnez "Sur l\'écran d\'accueil"',
  'Personnalisez le nom si vous le souhaitez',
  'Tapez "Ajouter" en haut à droite',
  'Votre app est prête à l\'emploi !'
]
</script>

<style scoped>
.install-section {
  padding: 6rem 0;
  background: #f8fafc;
}

.install-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.section-subtitle strong {
  color: #1a1a1a;
  font-weight: 600;
}

.install-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.final-note {
  text-align: center;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.note-text {
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
}

@media (max-width: 1024px) {
  .install-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .install-section {
    padding: 4rem 0;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1.1rem;
  }
  
  .note-text {
    font-size: 1rem;
  }
  
  .final-note {
    padding: 1.5rem;
  }
  
  .install-section {
    padding: 3rem 0;
  }
  
  .section-header {
    margin-bottom: 3rem;
  }
}

@media (max-width: 480px) {
  .install-container {
    padding: 0 1rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .final-note {
    padding: 1rem;
  }
}
</style> 