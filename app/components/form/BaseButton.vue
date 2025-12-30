<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

const variantClasses = computed(() => {
  if (props.disabled || props.loading) {
    return 'bg-gray-600 text-gray-400 cursor-not-allowed'
  }

  switch (props.variant) {
    case 'primary':
      return 'bg-quest-blue hover:bg-blue-600 text-white'
    case 'secondary':
      return 'bg-gray-700 hover:bg-gray-600 text-white'
    case 'danger':
      return 'bg-danger-red hover:bg-red-600 text-white'
    case 'ghost':
      return 'bg-transparent hover:bg-gray-700 text-gray-300 border border-gray-600'
    default:
      return 'bg-quest-blue hover:bg-blue-600 text-white'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'lg':
      return 'px-6 py-3 text-lg'
    case 'md':
    default:
      return 'px-4 py-2 text-base'
  }
})

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :class="[
      'rounded-lg font-medium transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
      'inline-flex items-center justify-center gap-2',
      variantClasses,
      sizeClasses,
      {
        'focus:ring-blue-500': variant === 'primary',
        'focus:ring-gray-500': variant === 'secondary' || variant === 'ghost',
        'focus:ring-red-500': variant === 'danger',
      }
    ]"
    :aria-busy="loading"
    :aria-disabled="isDisabled"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Button Content -->
    <slot />
  </button>
</template>
