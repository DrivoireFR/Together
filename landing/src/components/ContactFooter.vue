<template>
  <div class="contact-footer">
    <div class="contact-content">
      <p class="contact-question">
        Une question ? Une suggestion ? On adore discuter !
      </p>
      <a href="mailto:hello@equilibre-maison.fr" class="contact-email">
        Contactez-nous à hello@equilibre-maison.fr
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this static component
</script>

<style scoped>
.contact-footer {
  padding: 2rem 0;
  text-align: center;
}

.contact-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-question {
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.contact-email {
  font-size: 1.1rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
}

.contact-email:hover {
  color: #2563eb;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .contact-footer {
    padding: 1.5rem 0;
  }
  
  .contact-question {
    font-size: 1rem;
  }
  
  .contact-email {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .contact-content {
    padding: 0 1rem;
  }
  
  .contact-question {
    font-size: 0.95rem;
  }
  
  .contact-email {
    font-size: 0.95rem;
  }
}
</style> 