<script setup lang="ts">
interface SortOption {
  value: string
  label: string
}

interface Props {
  options: SortOption[]
  modelValue: string
  direction?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'asc',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:direction': [direction: 'asc' | 'desc']
}>()

const currentLabel = computed(() => {
  const option = props.options.find(opt => opt.value === props.modelValue)
  return option?.label || 'Sort by'
})

const toggleDirection = () => {
  emit('update:direction', props.direction === 'asc' ? 'desc' : 'asc')
}

const selectOption = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Sort Dropdown -->
    <div class="relative">
      <select
        :value="modelValue"
        class="appearance-none pl-3 pr-10 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        :aria-label="'Sort by'"
        @change="selectOption(($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Dropdown Icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- Direction Toggle Button -->
    <button
      type="button"
      class="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      :aria-label="direction === 'asc' ? 'Sort ascending' : 'Sort descending'"
      @click="toggleDirection"
    >
      <!-- Ascending Icon -->
      <svg
        v-if="direction === 'asc'"
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        />
      </svg>

      <!-- Descending Icon -->
      <svg
        v-else
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
        />
      </svg>
    </button>
  </div>
</template>
