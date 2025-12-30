<script setup lang="ts">
interface TabItem {
  id: string
  label: string
  icon?: string
  badge?: number | string
}

interface Props {
  tabs: TabItem[]
  modelValue: string
  variant?: 'default' | 'pills' | 'underline'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const tabsContainer = ref<HTMLElement | null>(null)

const activeTabIndex = computed(() => {
  return props.tabs.findIndex(tab => tab.id === props.modelValue)
})

const handleTabClick = (tabId: string) => {
  emit('update:modelValue', tabId)
}

const handleKeydown = (event: KeyboardEvent, currentIndex: number) => {
  let newIndex = currentIndex

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    newIndex = currentIndex > 0 ? currentIndex - 1 : props.tabs.length - 1
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    newIndex = currentIndex < props.tabs.length - 1 ? currentIndex + 1 : 0
  } else if (event.key === 'Home') {
    event.preventDefault()
    newIndex = 0
  } else if (event.key === 'End') {
    event.preventDefault()
    newIndex = props.tabs.length - 1
  } else {
    return
  }

  emit('update:modelValue', props.tabs[newIndex].id)
  // Focus the new tab
  nextTick(() => {
    if (tabsContainer.value) {
      const tabElements = tabsContainer.value.querySelectorAll('[role="tab"]')
      if (tabElements[newIndex]) {
        (tabElements[newIndex] as HTMLElement).focus()
      }
    }
  })
}

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'pills':
      return {
        container: 'bg-gray-100 p-1 rounded-lg inline-flex gap-1',
        tab: 'px-4 py-2 rounded-md font-medium text-sm transition-colors',
        tabActive: 'bg-white text-blue-600 shadow-sm',
        tabInactive: 'text-gray-600 hover:text-gray-900',
        indicator: '',
      }
    case 'underline':
      return {
        container: 'border-b border-gray-200',
        tab: 'px-4 py-3 font-medium text-sm transition-colors relative',
        tabActive: 'text-blue-600',
        tabInactive: 'text-gray-600 hover:text-gray-900',
        indicator: 'absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600',
      }
    case 'default':
    default:
      return {
        container: 'border-b border-gray-200',
        tab: 'px-6 py-3 font-medium text-sm border-b-2 transition-colors',
        tabActive: 'border-blue-600 text-blue-600',
        tabInactive: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300',
        indicator: '',
      }
  }
})
</script>

<template>
  <div
    ref="tabsContainer"
    class="flex overflow-x-auto scrollbar-hide"
    :class="variantClasses.container"
    role="tablist"
    :aria-label="'Navigation tabs'"
  >
    <button
      v-for="(tab, index) in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      :aria-selected="tab.id === modelValue"
      :aria-controls="`tabpanel-${tab.id}`"
      :tabindex="tab.id === modelValue ? 0 : -1"
      class="flex items-center gap-2 whitespace-nowrap"
      :class="[
        variantClasses.tab,
        tab.id === modelValue ? variantClasses.tabActive : variantClasses.tabInactive,
      ]"
      @click="handleTabClick(tab.id)"
      @keydown="handleKeydown($event, index)"
    >
      <span v-if="tab.icon" :class="tab.icon" aria-hidden="true" />
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.badge !== undefined"
        class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold rounded-full"
        :class="tab.id === modelValue ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'"
        :aria-label="`${tab.badge} items`"
      >
        {{ tab.badge }}
      </span>
      <span
        v-if="variant === 'underline' && tab.id === modelValue"
        :class="variantClasses.indicator"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
