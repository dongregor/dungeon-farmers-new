<script setup lang="ts">
interface Props {
  count: number
  max?: number
  variant?: 'primary' | 'danger' | 'warning'
  pulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 99,
  variant: 'primary',
  pulse: false,
})

const displayCount = computed(() => {
  if (props.count > props.max) {
    return `${props.max}+`
  }
  return props.count.toString()
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-600 text-white'
    case 'warning':
      return 'bg-yellow-500 text-gray-900'
    case 'primary':
    default:
      return 'bg-blue-600 text-white'
  }
})
</script>

<template>
  <span
    v-if="count > 0"
    class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold rounded-full"
    :class="[variantClasses, { 'animate-pulse': pulse }]"
    :aria-label="`${count} notifications`"
  >
    {{ displayCount }}
  </span>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
