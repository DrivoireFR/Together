<template>
  <section class="progress-section">
    <div class="progress-container">
      <!-- Development Badge -->
      <div class="development-badge">
        Projet en développement
      </div>

      <!-- Section Header -->
      <div class="section-header">
        <h2 class="section-title">Où en sommes-nous ?</h2>
        <p class="section-subtitle">
          Soyons transparents : ce n'est encore qu'un prototype ! <br> Mais on avance bien et on a hâte de vous le
          faire tester.
        </p>
      </div>

      <!-- Status Cards Grid -->
      <div class="status-grid">
        <StatusCard
          icon="💡"
          title="L'idée"
          status="validee"
          status-text="Validée"
          description="Les chiffres parlent d’eux-mêmes : les inégalités existent. Nous avons choisi de participer à trouver une solution, non pas en désignant des coupables, mais en encourageant chaque membre du foyer à participer de façon plus équitable."
        />
        
        <StatusCard
          icon="🔧"
          title="Le prototype"
          status="en-cours"
          status-text="En cours"
          description="On a une première version qui fonctionne ! C'est encore basique, mais ça permet déjà de tester le concept. L'interface est simple et l'idée prend forme."
        />
        
        <StatusCard
          icon="🔬"
          title="Les premiers tests"
          status="objectif"
          status-text="Objectif"
          description="On cherche des groupes volontaires pour tester le prototype ! Vos retours nous aideront à améliorer l'expérience et à créer quelque chose qui vous correspond vraiment."
        />
        
        <StatusCard
          icon="💬"
          title="Vos retours"
          status="essentiel"
          status-text="Essentiel"
          description="On construit cette app AVEC vous, pas juste POUR vous. Chaque suggestion compte, chaque problème rencontré nous fait avancer vers une solution qui marche vraiment."
        />
      </div>

      <!-- Call to Action -->
      <div class="cta-section">
        <div class="cta-content">
          <h3 class="cta-title">Envie de nous aider ?</h3>
          <p class="cta-description">
            Testez notre application ! <br> Vous avez accès au prototype en avant-première et
            vous pouvez nous aider à le rendre encore meilleur.
          </p>
          <div class="cta-buttons">
            <a href="https://to-get-there-app.creative-developer.com" target="_blank"><button class="cta-button cta-button--primary">Tester le prototype</button></a>
            <a href="https://creative-developer.notion.site/23e0cdfcaf3c80a68285de5f368d0e53?pvs=105" target="_blank"><button class="cta-button cta-button--secondary">Nous donner votre avis</button></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import StatusCard from './StatusCard.vue'
</script>

<style scoped>
.progress-section {
  padding: 6rem 0;
  background: #fafafa;
}

.progress-container {
    text-align: center;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
}

.development-badge {
  display: inline-block;
  background: #fef3c7;
  color: #d97706;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2rem;
  text-align: center;
  /* width: fit-content; */
  margin: 0 auto;
  margin-left: auto;
  margin-right: auto;
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

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.cta-section {
  background: linear-gradient(135deg, #e0f2fe 0%, #cffafe 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  border: 1px solid rgba(14, 165, 233, 0.1);
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.cta-description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 200px;
}

.cta-button--primary {
  background-color: #000;
  color: white;
  border-color: #000;
}

.cta-button--primary:hover {
  background-color: #333;
  border-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.cta-button--secondary {
  background-color: transparent;
  color: #333;
  border-color: #ddd;
}

.cta-button--secondary:hover {
  background-color: #f8f8f8;
  border-color: #bbb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1024px) {
  .status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .progress-section {
    padding: 4rem 0;
  }
}

@media (max-width: 768px) {
  .status-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1.1rem;
  }
  
  .cta-title {
    font-size: 1.7rem;
  }
  
  .cta-description {
    font-size: 1rem;
  }
  
  .cta-section {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    min-width: 250px;
  }
  
  .progress-section {
    padding: 3rem 0;
  }
  
  .section-header {
    margin-bottom: 3rem;
  }
}

@media (max-width: 480px) {
  .progress-container {
    padding: 0 1rem;
  }
  
  .cta-section {
    padding: 1.5rem 1rem;
  }
}
</style> 