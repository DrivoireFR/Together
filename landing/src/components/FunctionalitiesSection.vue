<template>
  <section id="functionalities-section" class="functionalities-section">
    <div class="functionalities-container">
      <!-- Section Header -->
      <div class="section-header">
        <h2 class="section-title">Des fonctionnalités pensées pour vous</h2>
      </div>

      <!-- Features Grid -->
      <div class="features-grid">
        <FeatureItem
          icon="Users"
          title="Créer un groupe"
          description="Démarrez votre espace partagé en quelques secondes"
        />
        
        <FeatureItem
          icon="Key"
          title="Rejoindre facilement"
          description="Un simple code pour que vos partenaires vous rejoignent"
        />
        
        <FeatureItem
          icon="Folder"
          title="Organiser par catégories"
          description="Cuisine, ménage, courses... classez comme vous voulez"
        />
        
        <FeatureItem
          icon="CheckSquare"
          title="Créer des tâches"
          description="Définissez ensemble les actions importantes de votre quotidien"
        />
        
        <FeatureItem
          icon="MousePointer"
          title="Déclarer en un clic"
          description="Action faite ? Un tap et c'est noté !"
        />
        
        <FeatureItem
          icon="BookOpen"
          title="Historique complet"
          description="Retrouvez toutes vos actions passées"
        />
        
        <FeatureItem
          icon="BarChart3"
          title="Statistiques mensuelles"
          description="Visualisez votre progression et votre équilibre"
        />
        
        <FeatureItem
          icon="Gamepad2"
          title="Gamification à venir"
          description="Bientôt des défis et récompenses pour rendre ça encore plus fun !"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FeatureItem from './FeatureItem.vue'
</script>

<style scoped>
.functionalities-section {
  padding: 6rem 0;
  background: #fafafa;
}

.functionalities-container {
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
  margin: 0;
  line-height: 1.1;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1200px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .functionalities-section {
    padding: 4rem 0;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .functionalities-section {
    padding: 3rem 0;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-header {
    margin-bottom: 3rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .functionalities-container {
    padding: 0 1rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .features-grid {
    gap: 0.75rem;
  }
}
</style> 