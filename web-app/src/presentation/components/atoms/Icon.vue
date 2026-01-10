<template>
  <div 
    v-if="svgContent" 
    class="icon-wrapper"
    v-html="svgContent"
  ></div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue'
    import shoppingSvg from '@/assets/icons/shopping.svg?raw'
    import stackRectSvg from '@/assets/icons/stack-rect.svg?raw'
    import historySvg from '@/assets/icons/history.svg?raw'
    import statsSvg from '@/assets/icons/stats.svg?raw'
    import paramsSvg from '@/assets/icons/params.svg?raw'
    import cookSvg from '@/assets/icons/cook.svg?raw'
    import laundrySvg from '@/assets/icons/laundry.svg?raw'
    import mopSvg from '@/assets/icons/mop.svg?raw'
    import showerSvg from '@/assets/icons/shower.svg?raw'
    import catSvg from '@/assets/icons/cat.svg?raw'
    import allSvg from '@/assets/icons/all.svg?raw'
    import { Icon } from '@/shared/types/enums'

    const props = defineProps<{
        icon: Icon
    }>()

    const svgMap: Record<Icon, string> = {
        [Icon.Courses]: shoppingSvg,
        [Icon.Copain]: catSvg,
        [Icon.Cuisine]: cookSvg,
        [Icon.Linge]: laundrySvg,
        [Icon.Poubelle]: mopSvg,
        [Icon.Sanitaires]: showerSvg,
        [Icon.Surfaces]: mopSvg,
        [Icon.Default]: allSvg,
        [Icon.Tasks]: stackRectSvg,
        [Icon.Historique]: historySvg,
        [Icon.Stats]: statsSvg,
        [Icon.Parametres]: paramsSvg,
    }

const svgContent = computed(() => svgMap[props.icon] || null)
</script>

<style>
    .icon-wrapper svg {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>

<style scoped>
    .icon-wrapper {
        width: 100%;
        height: 100%;
    }
</style>