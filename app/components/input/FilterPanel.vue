<script setup lang="ts">
interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'select' | 'toggle'
  options?: FilterOption[]
}

interface Props {
  filters: FilterConfig[]
  modelValue: Record<string, any>
  collapsible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsible: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const isExpanded = ref(true)

const activeFilterCount = computed(() => {
  return Object.keys(props.modelValue).filter(key => {
    const value = props.modelValue[key]
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return value !== undefined && value !== null && value !== ''
  }).length
})

const updateFilter = (filterId: string, value: any) => {
  const updated = { ...props.modelValue }
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
    delete updated[filterId]
  } else {
    updated[filterId] = value
  }
  emit('update:modelValue', updated)
}

const clearAll = () => {
  emit('update:modelValue', {})
}

const toggleCheckbox = (filterId: string, optionValue: string) => {
  const currentValues = (props.modelValue[filterId] as string[]) || []
  const newValues = currentValues.includes(optionValue)
    ? currentValues.filter(v => v !== optionValue)
    : [...currentValues, optionValue]
  updateFilter(filterId, newValues)
}

const isCheckboxChecked = (filterId: string, optionValue: string) => {
  const currentValues = (props.modelValue[filterId] as string[]) || []
  return currentValues.includes(optionValue)
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-gray-900">Filters</h3>
        <span
          v-if="activeFilterCount > 0"
          class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700"
        >
          {{ activeFilterCount }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Clear All Button -->
        <button
          v-if="activeFilterCount > 0"
          type="button"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          @click="clearAll"
        >
          Clear All
        </button>

        <!-- Collapse Toggle (mobile) -->
        <button
          v-if="collapsible"
          type="button"
          class="p-1 text-gray-600 hover:text-gray-900 rounded md:hidden"
          :aria-label="isExpanded ? 'Collapse filters' : 'Expand filters'"
          :aria-expanded="isExpanded"
          @click="isExpanded = !isExpanded"
        >
          <svg
            class="w-5 h-5 transition-transform"
            :class="{ 'rotate-180': !isExpanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filter Content -->
    <div
      v-show="!collapsible || isExpanded"
      class="p-4 space-y-4"
    >
      <div
        v-for="filter in filters"
        :key="filter.id"
        class="space-y-2"
      >
        <label class="block text-sm font-medium text-gray-700">
          {{ filter.label }}
        </label>

        <!-- Checkbox Group -->
        <div v-if="filter.type === 'checkbox' && filter.options" class="space-y-2">
          <label
            v-for="option in filter.options"
            :key="option.value"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="isCheckboxChecked(filter.id, option.value)"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              @change="toggleCheckbox(filter.id, option.value)"
            >
            <span class="text-sm text-gray-700">{{ option.label }}</span>
          </label>
        </div>

        <!-- Radio Group -->
        <div v-else-if="filter.type === 'radio' && filter.options" class="space-y-2">
          <label
            v-for="option in filter.options"
            :key="option.value"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              :name="filter.id"
              :value="option.value"
              :checked="modelValue[filter.id] === option.value"
              class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              @change="updateFilter(filter.id, option.value)"
            >
            <span class="text-sm text-gray-700">{{ option.label }}</span>
          </label>
        </div>

        <!-- Select -->
        <select
          v-else-if="filter.type === 'select' && filter.options"
          :value="modelValue[filter.id] || ''"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="updateFilter(filter.id, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All</option>
          <option
            v-for="option in filter.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Toggle Switch -->
        <label
          v-else-if="filter.type === 'toggle'"
          class="flex items-center gap-2 cursor-pointer"
        >
          <button
            type="button"
            role="switch"
            :aria-checked="!!modelValue[filter.id]"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :class="modelValue[filter.id] ? 'bg-blue-600' : 'bg-gray-200'"
            @click="updateFilter(filter.id, !modelValue[filter.id])"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="modelValue[filter.id] ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
          <span class="text-sm text-gray-700">{{ filter.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>
