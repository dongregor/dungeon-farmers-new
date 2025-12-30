<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  suggestions?: string[]
  debounce?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  debounce: 300,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [query: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(-1)
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

const filteredSuggestions = computed(() => {
  if (!props.suggestions || !localValue.value) {
    return []
  }
  const query = localValue.value.toLowerCase()
  return props.suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query)
  ).slice(0, 5)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  localValue.value = target.value

  // Clear previous timer
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  // Set new debounced update
  debounceTimer.value = setTimeout(() => {
    emit('update:modelValue', localValue.value)
    emit('search', localValue.value)
  }, props.debounce)

  // Show suggestions if available
  showSuggestions.value = filteredSuggestions.value.length > 0
  selectedSuggestionIndex.value = -1
}

const handleClear = () => {
  localValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
  inputRef.value?.focus()
}

const selectSuggestion = (suggestion: string) => {
  localValue.value = suggestion
  emit('update:modelValue', suggestion)
  emit('search', suggestion)
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value || filteredSuggestions.value.length === 0) {
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedSuggestionIndex.value = Math.min(
      selectedSuggestionIndex.value + 1,
      filteredSuggestions.value.length - 1
    )
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (selectedSuggestionIndex.value >= 0) {
      selectSuggestion(filteredSuggestions.value[selectedSuggestionIndex.value])
    } else {
      emit('search', localValue.value)
      showSuggestions.value = false
    }
  } else if (event.key === 'Escape') {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }
}

const handleBlur = () => {
  // Delay to allow click on suggestion
  setTimeout(() => {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }, 200)
}

onBeforeUnmount(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})
</script>

<template>
  <div class="relative w-full">
    <div class="relative">
      <!-- Search Icon -->
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <!-- Input Field -->
      <input
        ref="inputRef"
        type="text"
        :value="localValue"
        :placeholder="placeholder"
        class="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        role="combobox"
        :aria-expanded="showSuggestions"
        aria-autocomplete="list"
        :aria-controls="showSuggestions ? 'search-suggestions' : undefined"
        :aria-activedescendant="selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
        @focus="showSuggestions = filteredSuggestions.length > 0"
      >

      <!-- Clear Button -->
      <button
        v-if="localValue"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        :aria-label="'Clear search'"
        @click="handleClear"
      >
        <svg
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Suggestions Dropdown -->
    <ul
      v-if="showSuggestions && filteredSuggestions.length > 0"
      id="search-suggestions"
      role="listbox"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      <li
        v-for="(suggestion, index) in filteredSuggestions"
        :id="`suggestion-${index}`"
        :key="suggestion"
        role="option"
        :aria-selected="index === selectedSuggestionIndex"
        class="px-4 py-2 text-sm cursor-pointer transition-colors"
        :class="index === selectedSuggestionIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>
