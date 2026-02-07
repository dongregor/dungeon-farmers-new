<script setup lang="ts">
interface Props {
  guildName: string
  issueNumber: number
  date: string
}

const props = defineProps<Props>()

const formattedDate = computed(() => {
  const d = new Date(props.date)
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})
</script>

<template>
  <div class="text-center border-b-4 border-double border-gray-600 pb-4 mb-6">
    <div class="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">
      Official Publication of {{ guildName }}
    </div>
    <h1 class="text-5xl font-black text-gray-100 tracking-tight font-serif">
      THE DAILY GRIND
    </h1>
    <div class="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
      <span>Issue #{{ issueNumber }}</span>
      <span class="text-gray-600">|</span>
      <span>{{ formattedDate }}</span>
      <span class="text-gray-600">|</span>
      <span>1 Gold</span>
    </div>
  </div>
</template>
