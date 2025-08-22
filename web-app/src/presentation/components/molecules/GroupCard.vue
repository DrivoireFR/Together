<template>
  <BaseCard
    :clickable="clickable"
    :hover="true"
    class="group-card"
    @click="handleClick"
  >
    <div class="group-card-header">
      <!-- Group info -->
      <div class="group-info">
        <h3 class="group-name">
          {{ group.nom }}
        </h3>
        
        <div class="group-stats">
          <div class="group-stat">
            <UserGroupIcon class="group-stat-icon" />
            <span>{{ group.users.length }} membre{{ group.users.length > 1 ? 's' : '' }}</span>
          </div>
          
          <div class="group-stat">
            <ClipboardDocumentListIcon class="group-stat-icon" />
            <span>{{ group.tasks?.length || 0 }} tâche{{ (group.tasks?.length || 0) > 1 ? 's' : '' }}</span>
          </div>
          
          <div class="group-stat">
            <TagIcon class="group-stat-icon" />
            <span>{{ group.tags?.length || 0 }} tag{{ (group.tags?.length || 0) > 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="group-actions">
        <!-- Join button -->
        <BaseButton
          v-if="showJoinButton"
          size="sm"
          :loading="groupStore.isLoading"
          @click.stop="handleJoin"
        >
          Rejoindre
        </BaseButton>
        
        <!-- Leave button -->
        <BaseButton
          v-if="showLeaveButton"
          size="sm"
          variant="danger"
          :loading="groupStore.isLoading"
          @click.stop="handleLeave"
        >
          Quitter
        </BaseButton>
        
        <!-- Menu button -->
        <!-- <BaseButton
          v-if="showMenu"
          size="sm"
          variant="ghost"
          @click.stop="$emit('menu', group)"
        >
          <EllipsisVerticalIcon class="menu-icon" />
        </BaseButton> -->
      </div>
    </div>
    
    <!-- Members preview -->
    <div v-if="showMembers && group.users.length > 0" class="group-members">
      <p class="members-title">Membres :</p>
      <div class="members-list">
        <span
          v-for="user in group.users.slice(0, 3)"
          :key="user.id"
          class="member-tag member-tag--user"
        >
          {{ user.nom }}
        </span>
        <span
          v-if="group.users.length > 3"
          class="member-tag member-tag--count"
        >
          +{{ group.users.length - 3 }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  TagIcon,
  EllipsisVerticalIcon 
} from '@heroicons/vue/24/outline'
import { useGroupStore } from '@/domain/stores/groupStore'
import { useAuthStore } from '@/domain/stores/authStore'
import BaseCard from '@/presentation/components/atoms/BaseCard.vue'
import BaseButton from '@/presentation/components/atoms/BaseButton.vue'
import type { Group } from '@/shared/types/api'

interface Props {
  group: Group
  showJoinButton?: boolean
  showLeaveButton?: boolean
  showMenu?: boolean
  showMembers?: boolean
  clickable?: boolean
  joinCode?: string  // Code needed for joining a group
}

const props = withDefaults(defineProps<Props>(), {
  showJoinButton: false,
  showLeaveButton: false,
  showMenu: false,
  showMembers: true,
  clickable: true,
  joinCode: ''
})

const groupStore = useGroupStore()
const authStore = useAuthStore()

// Keep only the click and menu emits since they handle navigation/UI logic
const emit = defineEmits<{
  click: [group: Group]
  menu: [group: Group]
  joinRequested: [groupId: number]  // New emit for when join needs a code
}>()

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.group)
  }
}

const handleJoin = async () => {
  if (!props.joinCode) {
    // If no join code provided, emit to parent to handle code input
    emit('joinRequested', props.group.id)
    return
  }
  
  // Direct store call for joining
  const result = await groupStore.joinGroup(props.group.id, props.joinCode)
  
  if (result.success) {
    // Refresh user groups to show the new group
    if (authStore.user?.id) {
      await groupStore.getUserGroups(authStore.user.id)
    }
  }
  // Error handling is done by the store and displayed via groupStore.error
}

const handleLeave = async () => {
  if (confirm('Êtes-vous sûr de vouloir quitter ce groupe ?')) {
    // Direct store call for leaving
    const result = await groupStore.leaveGroup(props.group.id)
    // The store handles updating the groups list automatically
  }
}

const handleMenu = () => {
  emit('menu', props.group)
}
</script>

<style scoped>
.group-card {
  cursor: pointer;
}

.group-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.group-info {
  flex: 1;
  min-width: 0;
}

.group-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0 var(--spacing-2) 0;
}

.group-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.group-stat {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.group-stat-icon {
  width: var(--spacing-4);
  height: var(--spacing-4);
  margin-right: var(--spacing-1);
}

.group-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-left: var(--spacing-4);
}

.menu-icon {
  width: var(--spacing-4);
  height: var(--spacing-4);
}

.group-members {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: var(--border-width) solid var(--color-gray-100);
}

.members-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin: 0 0 var(--spacing-2) 0;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.member-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) calc(var(--spacing-2) + var(--spacing-1));
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.member-tag--user {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.member-tag--count {
  background-color: var(--color-gray-100);
  color: var(--color-gray-800);
}
</style>