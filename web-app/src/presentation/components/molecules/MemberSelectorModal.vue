<template>
  <MemberSelector
    :members="members"
    @member-selected="handleMemberSelected"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/domain/types'
import MemberSelector from './MemberSelector.vue'

interface Props {
  members: User[]
  modelValue?: User | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null
})

const emit = defineEmits<{
  'update:modelValue': [value: User | null]
  'member-selected': [member: User]
}>()

const selectedMember = ref<User | null>(props.modelValue || null)

watch(() => props.modelValue, (newValue) => {
  selectedMember.value = newValue || null
})

const handleMemberSelected = (member: User) => {
  selectedMember.value = member
  emit('update:modelValue', member)
  emit('member-selected', member)
}
</script>
