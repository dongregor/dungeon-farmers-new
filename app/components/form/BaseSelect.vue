<script setup lang="ts">
interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  options: Option[]
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  id?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

// Use Vue's useId() for SSR-safe ID generation
const generatedId = useId()
const selectId = computed(() => props.id || `select-${generatedId}`)

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const selectedOption = props.options.find(o => String(o.value) === target.value)
  emit('update:modelValue', selectedOption?.value ?? target.value)
}

const selectClasses = computed(() => {
  const baseClasses = [
    'w-full px-4 py-2 rounded-lg',
    'bg-gray-800 text-white',
    'border-2 transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
    'cursor-pointer appearance-none',
    'pr-10', // Extra padding for dropdown arrow
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
      :for="selectId"
      class="block text-sm font-medium text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger-red ml-1" aria-label="required">*</span>
    </label>

    <!-- Select Wrapper with Custom Arrow -->
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${selectId}-error` : undefined"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Custom Dropdown Arrow -->
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          class="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <p
      v-if="error"
      :id="`${selectId}-error`"
      class="mt-1 text-xs text-danger-red"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
