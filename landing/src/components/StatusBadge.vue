<template>
    <div class="status-badge" :class="statusClass">
      <span class="status-indicator"></span>
      <span class="status-text">{{ text }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps<{
    status: 'validee' | 'en-cours' | 'objectif' | 'essentiel'
    text: string
  }>()
  
  const statusClass = computed(() => `status-badge--${props.status}`)
  </script>
  
  <style scoped>
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .status-badge--validee {
    background: #dcfce7;
    color: #16a34a;
  }
  
  .status-badge--validee .status-indicator {
    background: #16a34a;
  }
  
  .status-badge--en-cours {
    background: #fef3c7;
    color: #d97706;
  }
  
  .status-badge--en-cours .status-indicator {
    background: #d97706;
  }
  
  .status-badge--objectif {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .status-badge--objectif .status-indicator {
    background: #dc2626;
  }
  
  .status-badge--essentiel {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  .status-badge--essentiel .status-indicator {
    background: #6b7280;
  }
  </style>