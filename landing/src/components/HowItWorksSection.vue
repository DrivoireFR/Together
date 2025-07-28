<template>
  <section class="how-it-works">
    <div class="how-it-works-container">
      <!-- Main Title -->
      <div class="section-header">
        <h2 class="section-title">Comment ça marche ?</h2>
        <p class="section-subtitle">
          Pas de prise de tête, pas de culpabilisation. Juste une vision claire de qui fait quoi, et<br>
          ce qu'il faut ajuster pour que tout le monde soit heureux.
        </p>
      </div>

      <!-- Two Column Layout -->
      <div class="how-it-works-grid">
        <!-- Left Column: Actions Declaration -->
        <div class="actions-section">
          <h3 class="subsection-title">1. Chacun déclare ses actions</h3>
          <div class="actions-list">
            <ActionCard
              text="Alex a fait la vaisselle"
              category="Cuisine"
              time-ago="il y a 2h"
              initials="A"
              avatar-color="#f97316"
            />
            <ActionCard
              text="Marie a fait une lessive"
              category="Linge"
              time-ago="il y a 1h"
              initials="M"
              avatar-color="#facc15"
            />
          </div>
        </div>

        <!-- Right Column: Collective Progress -->
        <div class="progress-section">
          <h3 class="subsection-title">2. Vous voyez la progression collective</h3>
          <CollectiveProgress />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ActionCard from './ActionCard.vue'
import CollectiveProgress from './CollectiveProgress.vue'
</script>

<style scoped>
.how-it-works {
  padding: 6rem 0;
  background: white;
}

.how-it-works-container {
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

.how-it-works-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.subsection-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
  line-height: 1.3;
}

.actions-section {
  /* Styles handled by grid */
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-section {
  /* Styles handled by grid */
}

@media (max-width: 1024px) {
  .how-it-works-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .how-it-works {
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
  
  .subsection-title {
    font-size: 1.3rem;
  }
  
  .how-it-works {
    padding: 3rem 0;
  }
  
  .section-header {
    margin-bottom: 3rem;
  }
  
  .how-it-works-grid {
    gap: 2.5rem;
  }
}
</style> 