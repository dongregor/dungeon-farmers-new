<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  backLink?: string | { name: string; params?: Record<string, any> }
}

defineProps<Props>()

const router = useRouter()

const handleBack = (backLink: string | { name: string; params?: Record<string, any> }) => {
  if (typeof backLink === 'string') {
    router.push(backLink)
  } else {
    router.push(backLink)
  }
}
</script>

<template>
  <header class="mb-6">
    <div class="flex items-start justify-between gap-4">
      <!-- Title Section -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3 mb-2">
          <!-- Back Button -->
          <button
            v-if="backLink"
            type="button"
            class="flex-shrink-0 p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            :aria-label="'Go back'"
            @click="handleBack(backLink)"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- Title -->
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 truncate">
            {{ title }}
          </h1>
        </div>

        <!-- Subtitle -->
        <p v-if="subtitle" class="text-sm md:text-base text-gray-600 mt-1">
          {{ subtitle }}
        </p>

        <!-- Meta Slot (below title info like tags, status, etc.) -->
        <div v-if="$slots.meta" class="mt-3">
          <slot name="meta" />
        </div>
      </div>

      <!-- Actions Slot (right side buttons) -->
      <div v-if="$slots.actions" class="flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
