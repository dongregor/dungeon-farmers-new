<script setup lang="ts">
interface Props {
  amount: number
  type: 'gold' | 'gems' | 'tokens'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  animated: false,
})

const displayAmount = ref(props.amount)
const animationFrameId = ref<number | null>(null)

const formattedAmount = computed(() => {
  const value = Math.floor(displayAmount.value)

  // Format large numbers
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  } else {
    return value.toLocaleString()
  }
})

const currencyIcon = computed(() => {
  switch (props.type) {
    case 'gold':
      return '🪙'
    case 'gems':
      return '💎'
    case 'tokens':
      return '🎫'
    default:
      return '💰'
  }
})

const currencyColor = computed(() => {
  switch (props.type) {
    case 'gold':
      return 'text-yellow-600'
    case 'gems':
      return 'text-purple-600'
    case 'tokens':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        container: 'gap-1',
        icon: 'text-sm',
        text: 'text-sm',
      }
    case 'lg':
      return {
        container: 'gap-2',
        icon: 'text-2xl',
        text: 'text-xl',
      }
    case 'md':
    default:
      return {
        container: 'gap-1.5',
        icon: 'text-base',
        text: 'text-base',
      }
  }
})

// Animated count-up effect
const animateToValue = (targetValue: number) => {
  const startValue = displayAmount.value
  const difference = targetValue - startValue
  const duration = 1000 // 1 second
  const startTime = performance.now()

  const updateValue = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    displayAmount.value = startValue + (difference * easeOut)

    if (progress < 1) {
      animationFrameId.value = requestAnimationFrame(updateValue)
    } else {
      displayAmount.value = targetValue
      animationFrameId.value = null
    }
  }

  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value)
  }

  animationFrameId.value = requestAnimationFrame(updateValue)
}

// Watch for amount changes
watch(() => props.amount, (newAmount) => {
  if (props.animated) {
    animateToValue(newAmount)
  } else {
    displayAmount.value = newAmount
  }
})

onUnmounted(() => {
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

<template>
  <div
    class="inline-flex items-center font-semibold"
    :class="[sizeClasses.container, currencyColor]"
  >
    <!-- Currency icon -->
    <span :class="sizeClasses.icon">
      {{ currencyIcon }}
    </span>

    <!-- Amount -->
    <span :class="[sizeClasses.text, 'tabular-nums']">
      {{ formattedAmount }}
    </span>
  </div>
</template>
