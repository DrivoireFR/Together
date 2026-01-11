<template>
	<div class="loading-state">
	      <div class="loading-spinner"></div>
	      <p class="loading-text">Chargement du groupe...</p>
	    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
	.loading-state {
	text-align: center;
	padding: var(--spacing-8) 0;
	}

	.loading-spinner {
	width: var(--spacing-8);
	height: var(--spacing-8);
	border: 2px solid var(--color-primary);
	border-top-color: transparent;
	border-radius: var(--border-radius-full);
	margin: 0 auto var(--spacing-2);
	animation: spin 1s linear infinite;
	}

	.loading-text {
	margin: 0;
	color: var(--color-gray-500);
	}
</style>
