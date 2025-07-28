<template>
  <section class="hero-section">
    <div class="header-container">
      <div class="header-icons">
        <Heart :size="28" />
        <User :size="28" />
        <Home :size="28" />
      </div>
    </div>

    <div class="hero-container">
      <h1 class="hero-title">Enfin l'équilibre à la maison !</h1>
      <p class="hero-subtitle">
        Une approche simple et bienveillante pour que chacun voie d'un coup d'œil
        ce qui reste à faire. <br> Le but : atteindre l'équilibre (presque) parfait dans votre foyer.
      </p>

        <div class="features-container">
            <div class="features-grid">
                <FeatureCard 
                icon="PenTool"
                title="Simple"
                description="Déclarez vos actions en quelques clics"
                />
                <FeatureCard 
                icon="Eye"
                title="Visuel"
                description="Voyez la répartition en un coup d'œil"
                />
                <FeatureCard 
                icon="Heart"
                title="Bienveillant"
                description="Aucun jugement, juste de l'harmonie"
                />
            </div>
        </div>
        <div class="hero-buttons">
            <a href="https://to-get-there-app.creative-developer.com" target="_blank"><button class="hero-button hero-button--primary">Tester le prototype</button></a>
                          <button class="hero-button hero-button--secondary" @click="scrollToNextSection">En savoir plus</button>
        </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Heart, User, Home } from 'lucide-vue-next';
import FeatureCard from './FeatureCard.vue';

const scrollToNextSection = () => {
  const nextSection = document.getElementById('functionalities-section');
  if (nextSection) {
    nextSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}
</script>

<style scoped>
.app-header {
  width: 100%;
  padding: 1rem 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: flex-end;
}

.header-icons {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 0 auto 5vh;
}
.hero-section {
  padding: 4rem 0;
  text-align: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #666;
  /* margin-bottom: 3rem; */
  line-height: 1.6;
  max-width: 850px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-button {
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 200px;
}

.hero-button--primary {
  background-color: #000;
  color: white;
  border-color: #000;
}

.hero-button--primary:hover {
  background-color: #333;
  border-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.hero-button--secondary {
  background-color: transparent;
  color: #333;
  border-color: #ddd;
}

.hero-button--secondary:hover {
  background-color: #f8f8f8;
  border-color: #bbb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 2rem;
  max-width: 700px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .features-grid {
    max-width: 800px;
  }
}


@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-button {
    min-width: 250px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .features-section {
    padding: 3rem 0;
  }
}
</style> 