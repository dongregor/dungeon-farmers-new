<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <!-- Icon slot -->
    <div v-if="$slots.icon" class="mb-4 text-gray-400">
      <slot name="icon" />
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-700 mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p v-if="description" class="text-sm text-gray-500 mb-6 max-w-md">
      {{ description }}
    </p>

    <!-- Action slot -->
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
