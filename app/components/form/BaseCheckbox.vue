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

const checkboxId = computed(() => props.id || `checkbox-${Math.random().toString(36).substring(7)}`)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div class="flex items-start">
    <div class="flex items-center h-5">
      <input
        :id="checkboxId"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :aria-describedby="description ? `${checkboxId}-description` : undefined"
        class="w-4 h-4 rounded border-2 border-gray-600 bg-gray-800
               text-quest-blue focus:ring-2 focus:ring-quest-blue focus:ring-offset-2
               focus:ring-offset-gray-900 transition-colors duration-200
               disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        @change="handleChange"
      />
    </div>

    <div v-if="label || description" class="ml-3 text-sm">
      <label
        v-if="label"
        :for="checkboxId"
        class="font-medium text-gray-300 cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      >
        {{ label }}
      </label>

      <p
        v-if="description"
        :id="`${checkboxId}-description`"
        class="text-gray-400 mt-0.5"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>
