  <template>
    <section class="intro-section">
      <div class="intro-container">
        <div class="heart-icon">
          <Heart class="heart-svg" />
        </div>
        <h1 class="intro-title">Envie de donner votre avis ?</h1>
        <p class="intro-subtitle">
            Commencez dès aujourd'hui votre parcours vers un foyer plus harmonieux.
Donner votre avis, c'est gratuit, c'est simple et ça aide beaucoup !
        </p>
        <a href="https://creative-developer.notion.site/23e0cdfcaf3c80a68285de5f368d0e53?pvs=105" target="_blank">
            <button class="cta-button">
                Je partage mon expérience
            </button>
        </a>
      </div>
    </section>
  </template>

  <script setup lang="ts">
  import { Heart } from 'lucide-vue-next'
  </script>

  <style scoped>
  .intro-section {
    padding: 4rem 0 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    text-align: center;
    position: relative;
  }

  .intro-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .heart-icon {
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
    color: rgba(255, 255, 255, 0.9);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    animation: pulse 2s infinite;
  }

  .heart-svg {
    width: 3rem;
    height: 3rem;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .intro-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 1.5rem;
    line-height: 1.1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .intro-subtitle {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin: 0 0 1rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .cta-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1.25rem 3rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  min-width: 250px;
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.cta-button:active {
  transform: translateY(-1px);
}

  @media (max-width: 1024px) {
    .intro-title {
      font-size: 3rem;
    }
    
    .intro-subtitle {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 768px) {
    .intro-section {
      padding: 3rem 0 1.5rem;
    }
    
    .heart-icon {
      margin-bottom: 1.5rem;
    }
    
    .heart-svg {
      width: 2.5rem;
      height: 2.5rem;
    }
    
    .intro-title {
      font-size: 2.5rem;
    }
    
    .intro-subtitle {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 480px) {
    .intro-section {
      padding: 2rem 0 1rem;
    }
    
    .intro-container {
      padding: 0 1rem;
    }
    
    .heart-icon {
      margin-bottom: 1rem;
    }
    
    .heart-svg {
      width: 2rem;
      height: 2rem;
    }
    
    .intro-title {
      font-size: 2rem;
    }
    
    .intro-subtitle {
      font-size: 1rem;
    }
  }
  </style> 