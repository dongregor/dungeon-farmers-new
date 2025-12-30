<script setup lang="ts">
interface Props {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  dismissible: true,
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

// Auto-dismiss after duration
let timeoutId: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      handleClose()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
})

const handleClose = () => {
  visible.value = false
  // Wait for animation to complete before emitting close
  setTimeout(() => {
    emit('close')
  }, 300)
}

const typeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        icon: 'text-green-500',
        focusRing: 'focus:ring-green-500',
      }
    case 'error':
      return {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        icon: 'text-red-500',
        focusRing: 'focus:ring-red-500',
      }
    case 'warning':
      return {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        icon: 'text-yellow-500',
        focusRing: 'focus:ring-yellow-500',
      }
    case 'info':
    default:
      return {
        bg: 'bg-blue-50 border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-500',
        focusRing: 'focus:ring-blue-500',
      }
  }
})

const iconPath = computed(() => {
  switch (props.type) {
    case 'success':
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'error':
      return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    case 'info':
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="visible"
      class="flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md"
      :class="[typeClasses.bg, typeClasses.text]"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <!-- Icon -->
      <svg
        class="w-5 h-5 flex-shrink-0 mt-0.5"
        :class="typeClasses.icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="iconPath"
        />
      </svg>

      <!-- Message -->
      <p class="flex-1 text-sm font-medium">
        {{ message }}
      </p>

      <!-- Close button -->
      <button
        v-if="dismissible"
        type="button"
        class="flex-shrink-0 inline-flex rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
        :class="typeClasses.focusRing"
        @click="handleClose"
        aria-label="Dismiss notification"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
