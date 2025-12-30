<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange' | 'white'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'blue',
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4 border-2'
    case 'lg':
      return 'h-12 w-12 border-4'
    case 'md':
    default:
      return 'h-8 w-8 border-4'
  }
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'green':
      return 'border-green-500 border-t-transparent'
    case 'purple':
      return 'border-purple-500 border-t-transparent'
    case 'yellow':
      return 'border-yellow-500 border-t-transparent'
    case 'red':
      return 'border-red-500 border-t-transparent'
    case 'orange':
      return 'border-orange-500 border-t-transparent'
    case 'white':
      return 'border-white border-t-transparent'
    case 'blue':
    default:
      return 'border-blue-500 border-t-transparent'
  }
})
</script>

<template>
  <div
    class="inline-block rounded-full animate-spin"
    :class="[sizeClasses, colorClasses]"
    role="status"
    aria-live="polite"
    aria-label="Loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>
