<script setup lang="ts">
interface Props {
  id?: string
  title: string
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: true,
})

const emit = defineEmits<{
  close: [id?: string]
}>()

const handleClose = () => {
  emit('close', props.id)
}

const typeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return {
        bg: 'bg-green-900/95 border-green-500',
        text: 'text-green-100',
        subtext: 'text-green-200',
        icon: 'text-green-400',
        focusRing: 'focus:ring-green-500',
      }
    case 'error':
      return {
        bg: 'bg-red-900/95 border-red-500',
        text: 'text-red-100',
        subtext: 'text-red-200',
        icon: 'text-red-400',
        focusRing: 'focus:ring-red-500',
      }
    case 'warning':
      return {
        bg: 'bg-yellow-900/95 border-yellow-500',
        text: 'text-yellow-100',
        subtext: 'text-yellow-200',
        icon: 'text-yellow-400',
        focusRing: 'focus:ring-yellow-500',
      }
    case 'info':
    default:
      return {
        bg: 'bg-blue-900/95 border-blue-500',
        text: 'text-blue-100',
        subtext: 'text-blue-200',
        icon: 'text-blue-400',
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
  <div
    class="flex items-start gap-3 p-4 rounded-lg border shadow-xl backdrop-blur-sm min-w-[320px] max-w-md"
    :class="[typeClasses.bg]"
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

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p class="font-semibold text-sm" :class="typeClasses.text">
        {{ title }}
      </p>
      <p v-if="message" class="text-sm mt-0.5 opacity-90" :class="typeClasses.subtext">
        {{ message }}
      </p>
    </div>

    <!-- Close button -->
    <button
      v-if="dismissible"
      type="button"
      class="flex-shrink-0 inline-flex rounded-md p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
      :class="typeClasses.focusRing"
      @click="handleClose"
      aria-label="Dismiss notification"
    >
      <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
