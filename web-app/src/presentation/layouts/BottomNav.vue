<template>
	<div class="wrapper">
		<RouterLink 
			v-for="(item, index) in items"
			:key="index"
			class="item" 
			:class="{ active: route.name === item.route.name }" 
			:to="item.route"
		>
			<div class="icon">
				<IconComp :icon="item.icon" />
			</div>

			<p class="text">
				{{ item.label }}
			</p>
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
import { Icon } from '@/shared/types/enums'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import IconComp from '../components/atoms/Icon.vue'

const route = useRoute()

const groupId = computed(() => route.params.id as string)

interface MenuItem {
	route : {
		name: string;
		params: {
			id: string
		}
	}
	icon: Icon
	label: string
}

const items: MenuItem[] = [
	{
		route: {
			name: 'GroupHomeCats',
			params: { id: groupId.value }
		},
		icon: Icon.Tasks,
		label: "Tâches"
	},
	{
		route: {
			name: 'GroupHistory',
			params: { id: groupId.value }
		},
		icon: Icon.Historique,
		label: "Historique"
	},
	{
		route: {
			name: 'GroupAddForm',
			params: { id: groupId.value }
		},
		icon: Icon.Add,
		label: "Ajouter"
	},
	{
		route: {
			name: 'GroupStats',
			params: { id: groupId.value }
		},
		icon: Icon.Stats,
		label: "Stats"
	},
	{
		route: {
			name: 'GroupSettings',
			params: { id: groupId.value }
		},
		icon: Icon.Parametres,
		label: "Paramètres"
	}
]
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: var(--bottom-nav-bar-height);
  border-radius: 1rem 1rem 0 0;
  background: var(--color-secondary);
}

.item {
	--color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 100%;
	text-decoration: none;
}

.item.active {
	/* --color: var(--color-primary-light); */
	--color: var(--color-success-light);
}

.icon {
	--icon-color: var(--color);
	height: 40px;
}

.text {
	color: var(--color);
	font-weight: 500;
	font-size: .6rem;
}
</style>