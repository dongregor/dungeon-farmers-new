<script setup lang="ts">
interface Props {
  variant?: 'text' | 'card' | 'avatar' | 'button'
  lines?: number
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  lines: 3,
})

const baseClasses = 'bg-gray-200 rounded animate-pulse'

const shimmerClasses = 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'card':
      return 'h-48 w-full rounded-lg'
    case 'avatar':
      return 'h-12 w-12 rounded-full'
    case 'button':
      return 'h-10 w-24 rounded-md'
    case 'text':
    default:
      return 'h-4 w-full rounded'
  }
})

const customStyles = computed(() => {
  const styles: Record<string, string> = {}
  if (props.width) styles.width = props.width
  if (props.height) styles.height = props.height
  return styles
})
</script>

<template>
  <div class="w-full" role="status" aria-busy="true" aria-label="Loading content">
    <!-- Text variant with multiple lines -->
    <div v-if="variant === 'text'" class="space-y-3">
      <div
        v-for="i in lines"
        :key="i"
        class="h-4 rounded"
        :class="[baseClasses, shimmerClasses]"
        :style="{ width: i === lines ? '70%' : '100%', ...customStyles }"
      />
    </div>

    <!-- Single element variants -->
    <div
      v-else
      :class="[baseClasses, shimmerClasses, variantClasses]"
      :style="customStyles"
    />

    <span class="sr-only">Loading...</span>
  </div>
</template>
