<template>
  <div class="action-card">
    <div class="action-avatar" :style="{ backgroundColor: avatarColor }">
      {{ initials }}
    </div>
    <div class="action-content">
      <div class="action-text">{{ text }}</div>
      <div class="action-details">
        <span class="action-category">{{ category }}</span>
        <span class="action-time">{{ timeAgo }}</span>
      </div>
    </div>
    <div class="action-status">
      <div class="check-icon">✓</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  category: string
  timeAgo: string
  initials: string
  avatarColor: string
}>()
</script>

<style scoped>
.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.action-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.action-content {
  flex: 1;
}

.action-text {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.action-details {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.action-category {
  font-weight: 500;
}

.action-status {
  display: flex;
  align-items: center;
}

.check-icon {
  width: 1.5rem;
  height: 1.5rem;
  background: #22c55e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .action-card {
    padding: 1rem;
  }
  
  .action-details {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style> 