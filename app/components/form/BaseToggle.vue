<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  disabled?: boolean
  id?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggleId = computed(() => props.id || `toggle-${Math.random().toString(36).substring(7)}`)

const handleToggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    handleToggle()
  }
}
</script>

<template>
  <div class="flex items-start justify-between">
    <div v-if="label || description" class="mr-3">
      <label
        :for="toggleId"
        class="font-medium text-sm text-gray-300 cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      >
        {{ label }}
      </label>

      <p
        v-if="description"
        :id="`${toggleId}-description`"
        class="text-xs text-gray-400 mt-0.5"
      >
        {{ description }}
      </p>
    </div>

    <!-- Toggle Switch -->
    <button
      :id="toggleId"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-describedby="description ? `${toggleId}-description` : undefined"
      :disabled="disabled"
      :class="[
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full',
        'border-2 border-transparent transition-colors duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-quest-blue focus:ring-offset-2 focus:ring-offset-gray-900',
        modelValue ? 'bg-success-green' : 'bg-gray-600',
        { 'opacity-50 cursor-not-allowed': disabled }
      ]"
      @click="handleToggle"
      @keydown="handleKeydown"
    >
      <span class="sr-only">{{ label || 'Toggle' }}</span>

      <!-- Toggle Circle -->
      <span
        :class="[
          'pointer-events-none inline-block h-5 w-5 transform rounded-full',
          'bg-white shadow ring-0 transition duration-200 ease-in-out',
          modelValue ? 'translate-x-5' : 'translate-x-0'
        ]"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
