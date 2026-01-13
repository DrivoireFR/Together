<template>
  <div 
    class="task-swipe-card-container"
    ref="containerRef"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
  <div v-if="task.hurryState" class="hurry-badge" :class="hurryClass">
    <span class="hurry-icon">{{ hurryIcon }}</span>
  </div>
    <div class="actions-layer">
      <div class="action action-left">
        <BaseButton @click="handleDeclare" :disabled="isLoading" class="action-button">
          Déclarer
        </BaseButton>
      </div>
      
      <div class="action action-center">
        <BaseButton @click="handleDeclareForMember" :disabled="isLoading" class="action-button">
          Pour membre
        </BaseButton>
      </div>
      
      <!-- Action 3: Déclarer pour membre (droite, 1/3) -->
      <div class="action action-right">
        <BaseButton @click="handleDeleteClick" variant="danger" :disabled="isLoading" class="action-button">
          Supprimer
        </BaseButton>
      </div>
    </div>
    
    <div class="swipe-container">
      <div 
        class="task-swipe-card"
        :class="{ swiping: isSwiping }"
        :style="{ transform: `translateX(${translateXPercent}%)` }"
      >
        <div class="task-content" @click="handleCardClick">
          <div class="task-left">
            <h3 class="task-title">{{ task.label }}</h3>
            <p class="task-frequency">{{ frequencyText }}</p>
          </div>
          <div class="task-right">
            <div class="task-points">{{ task.points }} pts</div>
            <div class="tag-chip-container" v-if="task.tag" @click.stop>
              <TagChip
                small
                :tag="task.tag"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, onUnmounted } from 'vue'
import type { Task, User } from '@/domain/types'
import { useConfirmModal } from '@/shared/composables/useConfirmModal'
import { useTasksStore } from '@/domain/stores/tasksStore'
import TagChip from '@/presentation/components/atoms/TagChip.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import MemberSelectorModal from '@/presentation/components/molecules/MemberSelectorModal.vue'

interface Props {
  task: Task
  groupMembers: User[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [task: Task]
  declare: [task: Task]
}>()

const tasksStore = useTasksStore()

// Container ref for width calculation
const containerRef = ref<HTMLElement | null>(null)

// Swipe state
const touchStartX = ref(0)
const touchStartY = ref(0)
const translateXPercent = ref(0)
const currentDeltaX = ref(0)
const isSwiping = ref(false)
const hasMoved = ref(false) // Pour distinguer tap de swipe
const SWIPE_THRESHOLD = 30 // pixels

// États de swipe :
// 0 = position initiale (0%)
// 1 = swipe droite (66.67% = 2/3)
// 2 = swipe gauche (-33.33% = -1/3)
const swipeState = ref<0 | 1 | 2>(0)

// Loading state
const isLoading = computed(() => tasksStore.isTaskLoading(props.task.id))

// Frequency text
const frequencyText = computed(() => {
  const { frequenceEstimee, uniteFrequence } = props.task
  const unit = uniteFrequence === 'jour' ? 'jour' : 
               uniteFrequence === 'semaine' ? 'semaine' : 'mois'
  
  if (frequenceEstimee === 1) {
    return `1 fois par ${unit}`
  }
  
  return `${frequenceEstimee} fois par ${unit}`
})

// Hurry state
const hurryIcon = computed(() => {
  const hurryState = props.task.hurryState
  switch (hurryState) {
    case 'no':
      return '😌'
    case 'maybe':
      return '⚠️'
    case 'yes':
      return '🚨'
    default:
      return ''
  }
})

const hurryClass = computed(() => {
  const hurryState = props.task.hurryState
  switch (hurryState) {
    case 'no':
      return 'hurry--no'
    case 'maybe':
      return 'hurry--maybe'
    case 'yes':
      return 'hurry--yes'
    default:
      return ''
  }
})

// Swipe handlers
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  hasMoved.value = false
}

const handleTouchMove = (e: TouchEvent) => {
  if (!touchStartX.value || !containerRef.value) return

  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  const deltaX = currentX - touchStartX.value
  const deltaY = Math.abs(currentY - touchStartY.value)
  const containerWidth = containerRef.value.offsetWidth

  // Only allow horizontal swipe (prevent vertical scrolling interference)
  if (Math.abs(deltaX) > deltaY) {
    e.preventDefault()
    hasMoved.value = true
    isSwiping.value = true
    currentDeltaX.value = deltaX
    
    // Calculer le pourcentage de déplacement depuis la position de départ du touch
    const deltaPercent = (deltaX / containerWidth) * 100
    
    // Position de base selon l'état actuel
    const basePercent = swipeState.value === 0 ? 0 : swipeState.value === 1 ? 66.67 : -33.33
    
    if (swipeState.value === 0) {
      // État initial : on peut swiper vers la droite ou la gauche
      if (deltaX > 0) {
        // Swipe droite
        translateXPercent.value = Math.min(basePercent + deltaPercent, 66.67) // Max 2/3
      } else {
        // Swipe gauche depuis état initial
        translateXPercent.value = Math.max(basePercent + deltaPercent, -33.33) // Min -1/3
      }
    } else if (swipeState.value === 1) {
      // État swipe droite : on peut swiper vers la gauche, revenir à 0, ou rester
      if (deltaX < 0) {
        // Swipe gauche depuis état 1
        translateXPercent.value = Math.max(basePercent + deltaPercent, -33.33) // Min -1/3
      } else {
        // Retour vers droite ou position initiale
        translateXPercent.value = Math.min(basePercent + deltaPercent, 66.67)
      }
    } else if (swipeState.value === 2) {
      // État swipe gauche : on peut revenir vers droite ou position initiale
      if (deltaX > 0) {
        // Retour vers droite ou position initiale
        translateXPercent.value = Math.min(basePercent + deltaPercent, 66.67)
      } else {
        // Swipe gauche (mais pas au-delà de -1/3)
        translateXPercent.value = Math.max(basePercent + deltaPercent, -33.33)
      }
    }
  }
}

const handleTouchEnd = () => {
  if (!containerRef.value) return
  
  const deltaX = currentDeltaX.value
  const containerWidth = containerRef.value.offsetWidth
  const deltaPercent = (deltaX / containerWidth) * 100
  
  // Si pas de mouvement, c'est un tap
  if (!hasMoved.value && Math.abs(deltaX) < 5) {
    handleCardTap()
    touchStartX.value = 0
    touchStartY.value = 0
    currentDeltaX.value = 0
    isSwiping.value = false
    hasMoved.value = false
    return
  }
  
  if (swipeState.value === 0) {
    // État initial
    if (deltaX > SWIPE_THRESHOLD) {
      // Swipe droite : aller à l'état 1 (2/3)
      swipeState.value = 1
      translateXPercent.value = 66.67
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe gauche : aller à l'état 2 (-1/3)
      swipeState.value = 2
      translateXPercent.value = -33.33
    } else {
      // Pas assez de swipe : revenir à 0
      translateXPercent.value = 0
    }
  } else if (swipeState.value === 1) {
    // État swipe droite
    if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe gauche : aller à l'état 2 (-1/3)
      swipeState.value = 2
      translateXPercent.value = -33.33
    } else if (deltaX < -10) {
      // Petit swipe gauche : revenir à l'état 0
      swipeState.value = 0
      translateXPercent.value = 0
    } else if (deltaX > SWIPE_THRESHOLD) {
      // Swipe droite : rester à l'état 1
      translateXPercent.value = 66.67
    } else {
      // Pas assez de swipe : revenir à l'état 0 (permet de revenir facilement)
      swipeState.value = 0
      translateXPercent.value = 0
    }
  } else if (swipeState.value === 2) {
    // État swipe gauche
    if (deltaX > SWIPE_THRESHOLD) {
      // Swipe droite : aller à l'état 1 ou 0 selon la position
      if (translateXPercent.value > 33) {
        swipeState.value = 1
        translateXPercent.value = 66.67
      } else {
        swipeState.value = 0
        translateXPercent.value = 0
      }
    } else if (deltaX > 10) {
      // Petit swipe droite : revenir à l'état 0
      swipeState.value = 0
      translateXPercent.value = 0
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // Swipe gauche : rester à l'état 2
      translateXPercent.value = -33.33
    } else {
      // Pas assez de swipe : rester à l'état 2
      translateXPercent.value = -33.33
    }
  }
  
  touchStartX.value = 0
  touchStartY.value = 0
  currentDeltaX.value = 0
  isSwiping.value = false
  hasMoved.value = false
}

// Handle card tap (mobile) or click (desktop) to toggle swipe right
const handleCardTap = () => {
  if (swipeState.value === 0) {
    // Si on est en position initiale, passer à l'état swipe right
    swipeState.value = 1
    translateXPercent.value = 66.67
  } else {
    // Sinon, revenir à la position initiale
    swipeState.value = 0
    translateXPercent.value = 0
  }
}

// Handle card click (desktop) to toggle swipe right
const handleCardClick = (e: MouseEvent) => {
  // Ne pas déclencher si on clique sur un bouton d'action ou un élément interactif
  const target = e.target as HTMLElement
  
  // Si on clique sur un élément interactif, ne pas déclencher
  if (target.closest('.action-button') || 
      target.closest('.action') ||
      target.closest('a') ||
      target.tagName === 'BUTTON') {
    return
  }
  
  // Empêcher la propagation pour éviter les doubles déclenchements
  e.stopPropagation()
  handleCardTap()
}

// Handle click outside to reset swipe
const handleClickOutside = (e: MouseEvent) => {
  if (!containerRef.value) return
  
  const target = e.target as HTMLElement
  // Si le clic est en dehors de la carte et qu'on est dans un état swipé
  if (!containerRef.value.contains(target) && swipeState.value !== 0) {
    resetSwipe()
  }
}

// Setup click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Action handlers
const resetSwipe = () => {
  swipeState.value = 0
  translateXPercent.value = 0
}

const handleDeclare = async () => {
  await tasksStore.createActionForTask(props.task.id)
  resetSwipe()
}

const handleDeleteClick = () => {
  useConfirmModal()
    .title('Supprimer la tâche')
    .description(`Êtes-vous sûr de vouloir supprimer la tâche "${props.task.label}" ?`)
    .confirmLabel('Supprimer')
    .cancelLabel('Annuler')
    .onConfirm(async () => {
      emit('delete', props.task)
      resetSwipe()
    })
    .open()
}

const selectedMemberForAction = ref<User | null>(null)

const handleDeclareForMember = () => {
  selectedMemberForAction.value = null
  
  const createMemberSelectorComponent = () => {
    return h(MemberSelectorModal, {
      members: props.groupMembers,
      modelValue: selectedMemberForAction.value,
      'onUpdate:modelValue': (value: User | null) => {
        selectedMemberForAction.value = value
      },
      onMemberSelected: (member: User) => {
        selectedMemberForAction.value = member
      }
    })
  }
  
  useConfirmModal()
    .title('Déclarer pour un membre')
    .description('Sélectionnez le membre pour qui vous souhaitez déclarer cette tâche')
    .template(createMemberSelectorComponent as any)
    .confirmLabel('Confirmer')
    .cancelLabel('Annuler')
    .onConfirm(async () => {
      if (selectedMemberForAction.value) {
        await tasksStore.createActionForMember(props.task.id, selectedMemberForAction.value.id)
        selectedMemberForAction.value = null
        resetSwipe()
      }
    })
    .open()
}
</script>

<style scoped>
.task-swipe-card-container {
  position: relative;
  width: 100%;
  /* overflow: hidden; */
  margin-bottom: var(--spacing-3);
  touch-action: pan-y;
}

/* Actions layer (derrière) */
.actions-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  z-index: 1;
}

.action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding: var(--spacing-4); */
}

.action-left {
  background: var(--color-primary-light);
  border-radius: var(--border-radius-lg) 0 0 var(--border-radius-lg);
}

.action-center {
  background: var(--color-red-50);
}

.action-right {
  background: var(--color-blue-50);
  border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
}

.action-button {
  width: 100%;
  max-width: 200px;
}

/* Card layer (devant) */
.swipe-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.task-swipe-card {
  position: relative;
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  will-change: transform;
}

.task-swipe-card.swiping {
  transition: none;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-4);
}

.task-left {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-1) 0;
  line-height: 1.25;
}

.task-frequency {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.25;
}

.task-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-shrink: 0;
}

.tag-chip-container {
  position: absolute;
  bottom: 0;
  right: 0;
}

.task-points {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--color-gray-100);
  border-radius: var(--border-radius-md);
}

.hurry-badge {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transform: translate(50%, -50%);
}

.hurry--no {
  background: var(--color-green-100);
  border: 1px solid var(--color-green-200);
}

.hurry--maybe {
  background: var(--color-yellow-100);
  border: 1px solid var(--color-yellow-200);
}

.hurry--yes {
  background: var(--color-red-100);
  border: 1px solid var(--color-red-200);
}

.hurry-icon {
  line-height: 1;
}

/* Responsive */
@media (max-width: 640px) {
  /* .task-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  } */

  /* .task-right {
    width: 100%;
    justify-content: flex-start;
  } */
}
</style>
