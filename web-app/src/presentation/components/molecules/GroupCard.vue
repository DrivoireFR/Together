<template>
  <BaseCard
    :clickable="clickable"
    :hover="true"
    @click="handleClick"
  >
    <div class="flex items-start justify-between">
      <!-- Group info -->
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-medium text-gray-900 truncate">
          {{ group.nom }}
        </h3>
        
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <UserGroupIcon class="h-4 w-4 mr-1" />
          <span>{{ group.users.length }} membre{{ group.users.length > 1 ? 's' : '' }}</span>
        </div>
        
        <div class="mt-1 flex items-center text-sm text-gray-500">
          <ClipboardDocumentListIcon class="h-4 w-4 mr-1" />
          <span>{{ group.tasks?.length || 0 }} tâche{{ (group.tasks?.length || 0) > 1 ? 's' : '' }}</span>
        </div>
        
        <div class="mt-1 flex items-center text-sm text-gray-500">
          <TagIcon class="h-4 w-4 mr-1" />
          <span>{{ group.tags?.length || 0 }} tag{{ (group.tags?.length || 0) > 1 ? 's' : '' }}</span>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-col space-y-2 ml-4">
        <!-- Join button -->
        <BaseButton
          v-if="showJoinButton"
          size="sm"
          :loading="joiningLoading"
          @click.stop="$emit('join', group.id)"
        >
          Rejoindre
        </BaseButton>
        
        <!-- Leave button -->
        <BaseButton
          v-if="showLeaveButton"
          size="sm"
          variant="danger"
          :loading="leavingLoading"
          @click.stop="$emit('leave', group.id)"
        >
          Quitter
        </BaseButton>
        
        <!-- Menu button -->
        <BaseButton
          v-if="showMenu"
          size="sm"
          variant="ghost"
          @click.stop="$emit('menu', group)"
        >
          <EllipsisVerticalIcon class="h-4 w-4" />
        </BaseButton>
      </div>
    </div>
    
    <!-- Members preview -->
    <div v-if="showMembers && group.users.length > 0" class="mt-4 pt-4 border-t border-gray-100">
      <p class="text-sm font-medium text-gray-700 mb-2">Membres :</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="user in group.users.slice(0, 3)"
          :key="user.id"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{ user.nom }}
        </span>
        <span
          v-if="group.users.length > 3"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
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
  joiningLoading?: boolean
  leavingLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showJoinButton: false,
  showLeaveButton: false,
  showMenu: false,
  showMembers: true,
  clickable: true,
  joiningLoading: false,
  leavingLoading: false
})

const emit = defineEmits<{
  click: [group: Group]
  join: [groupId: number]
  leave: [groupId: number]
  menu: [group: Group]
}>()

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.group)
  }
}
</script>