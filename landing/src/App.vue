<script setup>
import { ref } from 'vue'

const showPWAInstructions = ref(false)
const currentOS = ref('android') // android or ios

const togglePWAInstructions = () => {
  showPWAInstructions.value = !showPWAInstructions.value
}

const switchOS = (os) => {
  currentOS.value = os
}
</script>

<template>
  <div class="landing-page">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <h1 class="logo">To Get There</h1>
        <p class="tagline">L'équilibre à portée de main</p>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h2 class="hero-title">
            Ensemble vers l'équilibre parfait
          </h2>
          <p class="hero-subtitle">
            Parce que chaque petit geste compte, découvrez une façon simple et ludique 
            de visualiser la répartition des tâches à la maison.
          </p>
          <div class="hero-visual">
            <div class="balance-scale">
              <div class="scale-left">👫</div>
              <div class="scale-center">⚖️</div>
              <div class="scale-right">🏠</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Concept Section -->
    <section class="concept">
      <div class="container">
        <h3>Le concept en quelques mots</h3>
        <div class="concept-grid">
          <div class="concept-card">
            <div class="concept-icon">📝</div>
            <h4>Déclarez vos actions</h4>
            <p>En quelques clics, notez simplement ce que vous venez de faire : vaisselle, courses, ménage...</p>
          </div>
          <div class="concept-card">
            <div class="concept-icon">📊</div>
            <h4>Visualisez l'équilibre</h4>
            <p>Découvrez en un coup d'œil la répartition actuelle et ce qu'il reste à faire pour atteindre l'harmonie.</p>
          </div>
          <div class="concept-card">
            <div class="concept-icon">💬</div>
            <h4>Échangez naturellement</h4>
            <p>Les données parlent d'elles-mêmes, facilitant les discussions constructives et bienveillantes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Section -->
    <section class="why">
      <div class="container">
        <h3>Pourquoi "To Get There" ?</h3>
        <div class="why-content">
          <p>
            Nous savons tous que gérer un foyer, c'est du travail. Parfois, on a l'impression de porter plus que sa part, 
            ou au contraire, de ne pas en faire assez. Plutôt que de laisser ces sentiments s'installer, 
            pourquoi ne pas avoir une vision claire et partagée ?
          </p>
          <p>
            <strong>To Get There</strong> n'est pas là pour pointer du doigt ou créer de la culpabilité. 
            C'est un outil bienveillant qui vous aide simplement à mieux vous organiser ensemble, 
            en célébrant chaque contribution et en rendant visible l'invisible.
          </p>
        </div>
      </div>
    </section>

    <!-- Current State Section -->
    <section class="current-state">
      <div class="container">
        <h3>État actuel du projet</h3>
        <div class="state-content">
          <div class="state-card prototype">
            <h4>🚧 Phase Prototype</h4>
            <p>
              To Get There est actuellement en phase de développement. C'est un prototype fonctionnel 
              qui vous permet déjà de tester le concept et de nous faire vos retours.
            </p>
            <p class="warning">
              ⚠️ Vous pourriez rencontrer quelques bugs ou fonctionnalités incomplètes. 
              C'est tout à fait normal à ce stade !
            </p>
          </div>
          
          <div class="state-card future">
            <h4>🎮 Vision Future</h4>
            <p>
              Nous travaillons sur une expérience gamifiée qui rendra l'équilibre des tâches 
              encore plus motivant et amusant :
            </p>
            <ul>
              <li>Défis quotidiens et hebdomadaires</li>
              <li>Système de récompenses et badges</li>
              <li>Suggestions intelligentes de répartition</li>
              <li>Célébrations des victoires communes</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- PWA Section -->
    <section class="pwa-section">
      <div class="container">
        <h3>Installez l'application</h3>
        <p class="pwa-intro">
          Pour une expérience optimale, installez To Get There comme une application native sur votre téléphone !
        </p>
        
        <button class="pwa-toggle" @click="togglePWAInstructions">
          {{ showPWAInstructions ? 'Masquer les instructions' : 'Voir comment installer' }}
        </button>

        <div v-if="showPWAInstructions" class="pwa-instructions">
          <div class="os-selector">
            <button 
              :class="{ active: currentOS === 'android' }" 
              @click="switchOS('android')"
              class="os-button"
            >
              📱 Android
            </button>
            <button 
              :class="{ active: currentOS === 'ios' }" 
              @click="switchOS('ios')"
              class="os-button"
            >
              🍎 iOS
            </button>
          </div>

          <div v-if="currentOS === 'android'" class="instruction-steps">
            <h4>Installation sur Android</h4>
            <ol>
              <li>Ouvrez le site dans Chrome</li>
              <li>Appuyez sur le menu (⋮) en haut à droite</li>
              <li>Sélectionnez "Ajouter à l'écran d'accueil"</li>
              <li>Confirmez en appuyant sur "Ajouter"</li>
              <li>L'icône apparaît sur votre écran d'accueil !</li>
            </ol>
          </div>

          <div v-if="currentOS === 'ios'" class="instruction-steps">
            <h4>Installation sur iOS</h4>
            <ol>
              <li>Ouvrez le site dans Safari</li>
              <li>Appuyez sur le bouton de partage (□↗)</li>
              <li>Faites défiler et sélectionnez "Sur l'écran d'accueil"</li>
              <li>Personnalisez le nom si souhaité</li>
              <li>Appuyez sur "Ajouter" en haut à droite</li>
              <li>L'application est maintenant sur votre écran d'accueil !</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h3>Prêt à commencer ?</h3>
        <p>Créez votre groupe et découvrez comment To Get There peut transformer votre quotidien.</p>
        <a href="#" class="cta-button">Essayer maintenant</a>
        <p class="cta-note">Gratuit • Pas d'inscription compliquée • Données privées</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 To Get There - Vers l'équilibre, ensemble</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Variables CSS */
:root {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
  --accent-color: #10b981;
  --text-dark: #1f2937;
  --text-light: #6b7280;
  --bg-light: #f9fafb;
  --bg-white: #ffffff;
  --border-color: #e5e7eb;
  --border-radius: 12px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Reset et base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.landing-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 20px 0;
  text-align: center;
}

.logo {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.tagline {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Hero Section */
.hero {
  background: var(--bg-light);
  padding: 80px 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-light);
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-visual {
  margin-top: 40px;
}

.balance-scale {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 3rem;
  animation: gentle-bounce 3s ease-in-out infinite;
}

@keyframes gentle-bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Concept Section */
.concept {
  padding: 80px 0;
  background: var(--bg-white);
}

.concept h3 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: var(--text-dark);
}

.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.concept-card {
  text-align: center;
  padding: 40px 20px;
  border-radius: var(--border-radius);
  background: var(--bg-light);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.concept-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.concept-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.concept-card h4 {
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: var(--primary-color);
}

.concept-card p {
  color: var(--text-light);
  line-height: 1.7;
}

/* Why Section */
.why {
  padding: 80px 0;
  background: var(--bg-light);
}

.why h3 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: var(--text-dark);
}

.why-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.why-content p {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 24px;
  line-height: 1.8;
}

/* Current State Section */
.current-state {
  padding: 80px 0;
  background: var(--bg-white);
}

.current-state h3 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: var(--text-dark);
}

.state-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
}

.state-card {
  padding: 40px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.state-card.prototype {
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  border-left: 4px solid #f59e0b;
}

.state-card.future {
  background: linear-gradient(135deg, #ddd6fe, #8b5cf6);
  border-left: 4px solid var(--primary-color);
}

.state-card h4 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: var(--text-dark);
}

.state-card p {
  margin-bottom: 16px;
  line-height: 1.7;
}

.warning {
  background: rgba(239, 68, 68, 0.1);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
  margin-top: 20px !important;
}

.state-card ul {
  margin-left: 20px;
}

.state-card li {
  margin-bottom: 8px;
}

/* PWA Section */
.pwa-section {
  padding: 80px 0;
  background: var(--bg-light);
}

.pwa-section h3 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: var(--text-dark);
}

.pwa-intro {
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.pwa-toggle {
  display: block;
  margin: 0 auto 40px;
  padding: 12px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pwa-toggle:hover {
  background: #4f46e5;
}

.pwa-instructions {
  max-width: 600px;
  margin: 0 auto;
  background: var(--bg-white);
  padding: 40px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.os-selector {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  justify-content: center;
}

.os-button {
  padding: 12px 20px;
  border: 2px solid var(--border-color);
  background: var(--bg-white);
  color: var(--text-dark);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
}

.os-button.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.instruction-steps h4 {
  margin-bottom: 20px;
  color: var(--primary-color);
  font-size: 1.3rem;
}

.instruction-steps ol {
  margin-left: 20px;
}

.instruction-steps li {
  margin-bottom: 12px;
  line-height: 1.6;
}

/* CTA Section */
.cta {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  text-align: center;
}

.cta h3 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta p {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  padding: 16px 32px;
  background: white;
  color: var(--primary-color);
  text-decoration: none;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 20px;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.cta-note {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0 !important;
}

/* Footer */
.footer {
  padding: 40px 0;
  background: var(--text-dark);
  color: white;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .concept h3,
  .why h3,
  .current-state h3,
  .pwa-section h3,
  .cta h3 {
    font-size: 2rem;
  }
  
  .concept-grid {
    grid-template-columns: 1fr;
  }
  
  .state-content {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .balance-scale {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .logo {
    font-size: 2rem;
  }
  
  .concept-card,
  .state-card,
  .pwa-instructions {
    padding: 20px;
  }
}
</style>
