<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  closeOnOverlay?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  closable: true,
  closeOnOverlay: true,
})

const emit = defineEmits<Emits>()

// Modal dialog ref for focus trap
const modalRef = ref<HTMLElement | null>(null)

// Size classes mapping
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

// Close modal
const close = () => {
  emit('update:modelValue', false)
}

// Handle overlay click
const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    close()
  }
}

// Handle ESC key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closable) {
    close()
  }
}

// Focus trap - keep focus within modal
const handleFocusTrap = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || !modalRef.value) return

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      lastElement?.focus()
      event.preventDefault()
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      firstElement?.focus()
      event.preventDefault()
    }
  }
}

// Watch for modal open/close
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    // Add event listeners when modal opens
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keydown', handleFocusTrap)

    // Lock body scroll
    document.body.style.overflow = 'hidden'

    // Focus first focusable element
    nextTick(() => {
      const firstFocusable = modalRef.value?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    })
  } else {
    // Remove event listeners when modal closes
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('keydown', handleFocusTrap)

    // Unlock body scroll
    document.body.style.overflow = ''
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('keydown', handleFocusTrap)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      name="modal"
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click="handleOverlayClick"
      >
        <Transition
          name="modal-content"
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            ref="modalRef"
            :class="[
              'bg-white rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col',
              sizeClasses[size]
            ]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'modal-title' : undefined"
            @click.stop
          >
            <!-- Header -->
            <div
              v-if="$slots.header || title || closable"
              class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
            >
              <slot name="header">
                <h2
                  v-if="title"
                  id="modal-title"
                  class="text-xl font-bold text-gray-800"
                >
                  {{ title }}
                </h2>
              </slot>

              <button
                v-if="closable"
                type="button"
                class="ml-auto text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label="Close modal"
                @click="close"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto px-6 py-4">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="px-6 py-4 border-t border-gray-200"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
