<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  hint?: string
  id?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

// Use Vue's useId() for SSR-safe ID generation
const generatedId = useId()
const inputId = computed(() => props.id || `input-${generatedId}`)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? (target.value === '' ? null : Number(target.value)) : target.value
  emit('update:modelValue', value)
}

const inputClasses = computed(() => {
  const baseClasses = [
    'w-full px-4 py-2 rounded-lg',
    'bg-gray-800 text-white',
    'border-2 transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
    'placeholder-gray-500',
  ]

  if (props.error) {
    baseClasses.push('border-danger-red focus:border-danger-red focus:ring-danger-red')
  } else {
    baseClasses.push('border-gray-600 focus:border-quest-blue focus:ring-quest-blue')
  }

  if (props.disabled) {
    baseClasses.push('opacity-50 cursor-not-allowed bg-gray-700')
  }

  return baseClasses.join(' ')
})
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger-red ml-1" aria-label="required">*</span>
    </label>

    <!-- Input -->
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
      @input="handleInput"
    />

    <!-- Hint Text -->
    <p
      v-if="hint && !error"
      :id="`${inputId}-hint`"
      class="mt-1 text-xs text-gray-400"
    >
      {{ hint }}
    </p>

    <!-- Error Message -->
    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="mt-1 text-xs text-danger-red"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
