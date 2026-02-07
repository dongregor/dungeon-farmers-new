<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<template>
  <div class="border-t-2 border-double border-gray-700 pt-4 mt-6">
    <div class="flex items-center gap-2 text-xs text-gray-500">
      <span class="text-sm">&#9729;&#65039;</span>
      <span class="uppercase tracking-wider font-bold">Tomorrow's Forecast</span>
    </div>
    <p class="text-sm text-gray-500 mt-1 italic">
      {{ text }}
    </p>
  </div>
</template>
