<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'info',
})

const emit = defineEmits<Emits>()

// Variant styling
const variantStyles = computed(() => {
  switch (props.variant) {
    case 'danger':
      return {
        icon: '⚠️',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        buttonBg: 'bg-red-500 hover:bg-red-600',
        buttonText: 'text-white',
        borderColor: 'border-red-200',
      }
    case 'warning':
      return {
        icon: '⚡',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
        buttonText: 'text-white',
        borderColor: 'border-yellow-200',
      }
    case 'info':
    default:
      return {
        icon: 'ℹ️',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        buttonBg: 'bg-blue-500 hover:bg-blue-600',
        buttonText: 'text-white',
        borderColor: 'border-blue-200',
      }
  }
})

// Handle confirm
const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

// Handle cancel
const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

// Update modelValue when BaseModal closes
const handleModalClose = (value: boolean) => {
  emit('update:modelValue', value)
  if (!value) {
    emit('cancel')
  }
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    size="sm"
    :closable="true"
    :close-on-overlay="true"
    @update:model-value="handleModalClose"
  >
    <!-- Content -->
    <div class="text-center">
      <!-- Icon -->
      <div
        :class="[
          'mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4',
          variantStyles.iconBg
        ]"
      >
        <span :class="['text-3xl', variantStyles.iconColor]">
          {{ variantStyles.icon }}
        </span>
      </div>

      <!-- Message -->
      <p
        class="text-gray-700 text-base mb-6"
        role="alertdialog"
        aria-describedby="confirmation-message"
      >
        <span id="confirmation-message">{{ message }}</span>
      </p>
    </div>

    <!-- Footer with actions -->
    <template #footer>
      <div class="flex gap-3">
        <button
          type="button"
          class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          :class="[
            'flex-1 font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
            variantStyles.buttonBg,
            variantStyles.buttonText,
            variant === 'danger' ? 'focus:ring-red-500' :
            variant === 'warning' ? 'focus:ring-yellow-500' :
            'focus:ring-blue-500'
          ]"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>
