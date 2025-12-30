<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string | { name: string; params?: Record<string, any> }
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-4">
    <ol class="flex items-center gap-2 text-sm">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-2"
      >
        <!-- Separator (not shown before first item) -->
        <span
          v-if="index > 0"
          class="text-gray-400"
          aria-hidden="true"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>

        <!-- Link (if not last item) -->
        <NuxtLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </NuxtLink>

        <!-- Current page (last item, no link) -->
        <span
          v-else
          class="text-gray-900 font-medium"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
