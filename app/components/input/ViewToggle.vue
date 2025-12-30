<script setup lang="ts">
interface Props {
  modelValue: 'grid' | 'list'
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: 'grid' | 'list']
}>()

const setView = (view: 'grid' | 'list') => {
  emit('update:modelValue', view)
}
</script>

<template>
  <div
    class="inline-flex border border-gray-300 rounded-lg overflow-hidden"
    role="group"
    aria-label="View toggle"
  >
    <!-- Grid View Button -->
    <button
      type="button"
      class="px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10"
      :class="modelValue === 'grid'
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-700 hover:bg-gray-50'"
      :aria-label="'Grid view'"
      :aria-pressed="modelValue === 'grid'"
      @click="setView('grid')"
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
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    </button>

    <!-- List View Button -->
    <button
      type="button"
      class="px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 border-l border-gray-300"
      :class="modelValue === 'list'
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-gray-700 hover:bg-gray-50'"
      :aria-label="'List view'"
      :aria-pressed="modelValue === 'list'"
      @click="setView('list')"
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
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </div>
</template>
