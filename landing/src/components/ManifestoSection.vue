<template>
  <section class="manifesto-section">
    <div class="manifesto-container">
      <h2 class="manifesto-title">Un équilibre retrouvé, tout en douceur</h2>
      
      <div class="manifesto-content">
        <p class="manifesto-paragraph">
          Nous savons tous que gérer un foyer, c'est du boulot ! Entre le ménage, la cuisine, les courses et mille autres 
          petites tâches, il n'est pas toujours évident de savoir qui fait quoi et de s'assurer que chacun contribue 
          équitablement.
        </p>
        
        <p class="manifesto-paragraph highlight">
          <strong>To Get There</strong> vous propose une approche bienveillante et ludique pour visualiser la répartition des tâches 
          ménagères au sein de votre couple ou groupe. Plus de disputes, plus de malentendus - juste une vue claire et 
          partagée de vos efforts communs !
        </p>
        
        <p class="manifesto-paragraph final">
          En un simple clic, déclarez vos actions quotidiennes et tendez ensemble vers un meilleur équilibre pour votre foyer. 
          C'est simple, c'est transparent, et c'est efficace ! <Smile class="emoji-icon" :size="20" />
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Smile } from 'lucide-vue-next'
</script>

<style scoped>
.manifesto-section {
  padding: 6rem 0;
  background: white;
}

.manifesto-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.manifesto-title {
  font-size: 3.2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 3rem;
  line-height: 1.1;
}

.manifesto-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.manifesto-paragraph {
  font-size: 1.3rem;
  line-height: 1.7;
  color: #666;
  margin: 0;
  text-align: center;
}

.manifesto-paragraph.highlight {
  color: #4b5563;
  position: relative;
}

.manifesto-paragraph.highlight strong {
  color: #8b5cf6;
  font-weight: 700;
}

.manifesto-paragraph.final {
  color: #4b5563;
  font-weight: 500;
}

.emoji-icon {
  display: inline-block;
  margin-left: 0.25rem;
  vertical-align: middle;
  color: #f59e0b;
}

@media (max-width: 1024px) {
  .manifesto-title {
    font-size: 2.8rem;
  }
  
  .manifesto-paragraph {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .manifesto-section {
    padding: 4rem 0;
  }
  
  .manifesto-title {
    font-size: 2.3rem;
    margin-bottom: 2.5rem;
  }
  
  .manifesto-paragraph {
    font-size: 1.1rem;
  }
  
  .manifesto-content {
    gap: 1.75rem;
  }
}

@media (max-width: 480px) {
  .manifesto-container {
    padding: 0 1rem;
  }
  
  .manifesto-section {
    padding: 3rem 0;
  }
  
  .manifesto-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .manifesto-paragraph {
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .manifesto-content {
    gap: 1.5rem;
  }
  
  .emoji-icon {
    /* Size handled by :size prop */
  }
}
</style> 