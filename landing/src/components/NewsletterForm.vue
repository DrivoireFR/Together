<template>
  <div class="newsletter-form">
    <div class="form-header">
      <h3 class="form-title">Soyez les premiers informés !</h3>
      <p class="form-subtitle">
        Recevez un email dès que le prototype sera prêt pour vos premiers tests.
      </p>
    </div>
    
    <form class="form-content" @submit.prevent="handleSubmit">
      <div class="email-input-group">
        <input
          type="email"
          v-model="email"
          placeholder="votre@email.com"
          class="email-input"
          required
        />
        <button type="submit" class="subscribe-button">
          <span class="envelope-icon">✉️</span>
          M'inscrire
        </button>
      </div>
      
      <div class="additional-buttons">
        <button type="button" class="contact-button contact-button--placeholder">
          <!-- Placeholder button -->
        </button>
        <button type="button" class="contact-button contact-button--active">
          Nous contacter
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

const handleSubmit = () => {
  console.log('Newsletter subscription:', email.value)
  // Handle newsletter subscription
  email.value = ''
}
</script>

<style scoped>
.newsletter-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.form-subtitle {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.email-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.email-input {
  flex: 1;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
}

.email-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.email-input::placeholder {
  color: #9ca3af;
}

.subscribe-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.subscribe-button:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.envelope-icon {
  font-size: 0.9rem;
}

.additional-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.contact-button {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 200px;
}

.contact-button--placeholder {
  border-color: #f3f4f6;
  background: #f9fafb;
  color: #d1d5db;
  cursor: default;
}

.contact-button--active {
  border-color: #3b82f6;
  color: #3b82f6;
}

.contact-button--active:hover {
  background: #eff6ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .newsletter-form {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }
  
  .form-title {
    font-size: 1.7rem;
  }
  
  .form-subtitle {
    font-size: 1rem;
  }
  
  .email-input-group {
    flex-direction: column;
  }
  
  .subscribe-button {
    justify-content: center;
  }
  
  .additional-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .contact-button {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .newsletter-form {
    padding: 1.5rem 1rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .email-input,
  .subscribe-button,
  .contact-button {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
  }
}
</style> 