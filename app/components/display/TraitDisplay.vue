<script setup lang="ts">
interface Trait {
  name: string
  description: string
  type?: 'buff' | 'debuff' | 'neutral'
}

interface Props {
  trait: Trait
  active?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: true,
  compact: false,
})

const typeColorClasses = computed(() => {
  if (!props.active) {
    return 'bg-gray-100 text-gray-500 border-gray-300'
  }

  switch (props.trait.type) {
    case 'buff':
      return 'bg-green-50 text-green-800 border-green-300'
    case 'debuff':
      return 'bg-red-50 text-red-800 border-red-300'
    case 'neutral':
    default:
      return 'bg-blue-50 text-blue-800 border-blue-300'
  }
})

const iconClasses = computed(() => {
  if (!props.active) {
    return 'text-gray-400'
  }

  switch (props.trait.type) {
    case 'buff':
      return 'text-green-600'
    case 'debuff':
      return 'text-red-600'
    case 'neutral':
    default:
      return 'text-blue-600'
  }
})
</script>

<template>
  <div
    class="inline-flex items-start gap-2 rounded-lg border px-3 py-2 transition-all"
    :class="[
      typeColorClasses,
      {
        'opacity-60': !active,
        'py-1': compact,
      }
    ]"
    :title="compact ? trait.description : ''"
  >
    <!-- Icon indicator -->
    <div class="flex-shrink-0 mt-0.5">
      <svg
        v-if="trait.type === 'buff'"
        class="w-4 h-4"
        :class="iconClasses"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <svg
        v-else-if="trait.type === 'debuff'"
        class="w-4 h-4"
        :class="iconClasses"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M5 12h14" />
      </svg>
      <svg
        v-else
        class="w-4 h-4"
        :class="iconClasses"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-sm leading-tight">
        {{ trait.name }}
      </div>
      <div
        v-if="!compact"
        class="text-xs mt-1 leading-relaxed opacity-90"
      >
        {{ trait.description }}
      </div>
    </div>
  </div>
</template>
