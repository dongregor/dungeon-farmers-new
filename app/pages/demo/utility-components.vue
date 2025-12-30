<script setup lang="ts">
// Demo page for utility components
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const showWarningToast = ref(false)
const showInfoToast = ref(false)
const isLoading = ref(false)
let loadingTimeoutId: ReturnType<typeof setTimeout> | null = null

const simulateLoading = () => {
  // Guard against multiple calls while loading
  if (isLoading.value || loadingTimeoutId) return

  isLoading.value = true
  loadingTimeoutId = setTimeout(() => {
    isLoading.value = false
    showSuccessToast.value = true
    loadingTimeoutId = null
  }, 2000)
}

onUnmounted(() => {
  if (loadingTimeoutId) {
    clearTimeout(loadingTimeoutId)
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">
      Utility Components Demo
    </h1>

    <!-- LoadingSpinner Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        LoadingSpinner
      </h2>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="space-y-6">
          <!-- Size variants -->
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Sizes</h3>
            <div class="flex items-center gap-6">
              <div class="text-center">
                <UtilityLoadingSpinner size="sm" />
                <p class="text-xs text-gray-500 mt-2">Small</p>
              </div>
              <div class="text-center">
                <UtilityLoadingSpinner size="md" />
                <p class="text-xs text-gray-500 mt-2">Medium</p>
              </div>
              <div class="text-center">
                <UtilityLoadingSpinner size="lg" />
                <p class="text-xs text-gray-500 mt-2">Large</p>
              </div>
            </div>
          </div>

          <!-- Color variants -->
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Colors</h3>
            <div class="flex items-center gap-4 flex-wrap">
              <UtilityLoadingSpinner color="blue" />
              <UtilityLoadingSpinner color="green" />
              <UtilityLoadingSpinner color="purple" />
              <UtilityLoadingSpinner color="yellow" />
              <UtilityLoadingSpinner color="red" />
              <UtilityLoadingSpinner color="orange" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- EmptyState Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        EmptyState
      </h2>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="space-y-8">
          <!-- Basic -->
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Basic</h3>
            <div class="border border-gray-200 rounded">
              <UtilityEmptyState
                title="No heroes yet"
                description="Visit the tavern to recruit your first hero!"
              />
            </div>
          </div>

          <!-- With icon and action -->
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">With Icon & Action</h3>
            <div class="border border-gray-200 rounded">
              <UtilityEmptyState
                title="No expeditions available"
                description="Complete more zones to unlock new expeditions."
              >
                <template #icon>
                  <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </template>
                <template #action>
                  <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Explore Zones
                  </button>
                </template>
              </UtilityEmptyState>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Toast Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        Toast
      </h2>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="space-y-4">
          <div class="flex gap-3 flex-wrap">
            <button
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              @click="showSuccessToast = true"
            >
              Show Success
            </button>
            <button
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              @click="showErrorToast = true"
            >
              Show Error
            </button>
            <button
              class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              @click="showWarningToast = true"
            >
              Show Warning
            </button>
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              @click="showInfoToast = true"
            >
              Show Info
            </button>
          </div>

          <!-- Toast display area -->
          <div class="mt-6 space-y-3">
            <UtilityToast
              v-if="showSuccessToast"
              message="Hero successfully recruited!"
              type="success"
              @close="showSuccessToast = false"
            />
            <UtilityToast
              v-if="showErrorToast"
              message="Failed to connect to server"
              type="error"
              @close="showErrorToast = false"
            />
            <UtilityToast
              v-if="showWarningToast"
              message="Your expedition will expire soon"
              type="warning"
              @close="showWarningToast = false"
            />
            <UtilityToast
              v-if="showInfoToast"
              message="New content available!"
              type="info"
              @close="showInfoToast = false"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- SkeletonLoader Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        SkeletonLoader
      </h2>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="space-y-6">
          <!-- Button to toggle loading state -->
          <div>
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              @click="simulateLoading"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Loading...' : 'Simulate Loading' }}
            </button>
          </div>

          <!-- Text variant -->
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Text (3 lines)</h3>
            <UtilitySkeletonLoader v-if="isLoading" variant="text" />
            <div v-else class="space-y-2 text-gray-700">
              <p>This is line one of the content.</p>
              <p>This is line two of the content.</p>
              <p>This is line three of the content.</p>
            </div>
          </div>

          <!-- Card variant -->
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Card</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UtilitySkeletonLoader v-if="isLoading" variant="card" />
              <div v-else class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg h-48 flex items-center justify-center text-white font-semibold">
                Card Content
              </div>
            </div>
          </div>

          <!-- Avatar variant -->
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Avatar</h3>
            <div class="flex items-center gap-3">
              <UtilitySkeletonLoader v-if="isLoading" variant="avatar" />
              <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                AB
              </div>
              <div>
                <UtilitySkeletonLoader v-if="isLoading" variant="text" :lines="2" />
                <div v-else>
                  <p class="font-semibold text-gray-800">Hero Name</p>
                  <p class="text-sm text-gray-500">Level 10 Warrior</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Button variant -->
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Button</h3>
            <UtilitySkeletonLoader v-if="isLoading" variant="button" />
            <button v-else class="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
              Action Button
            </button>
          </div>

          <!-- Complex example: Hero card -->
          <div>
            <h3 class="text-lg font-medium text-gray-600 mb-3">Complex Example: Hero Card</h3>
            <div class="bg-gray-50 rounded-lg p-4 max-w-sm">
              <template v-if="isLoading">
                <div class="flex items-center gap-4 mb-4">
                  <UtilitySkeletonLoader variant="avatar" />
                  <div class="flex-1">
                    <UtilitySkeletonLoader variant="text" :lines="2" />
                  </div>
                </div>
                <UtilitySkeletonLoader variant="card" height="120px" />
                <div class="mt-4 flex gap-2">
                  <UtilitySkeletonLoader variant="button" />
                  <UtilitySkeletonLoader variant="button" />
                </div>
              </template>
              <template v-else>
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                    KN
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-800">Sir Knightly</h4>
                    <p class="text-sm text-gray-500">Level 15 Paladin</p>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg h-[120px] flex items-center justify-center text-white font-semibold">
                  Hero Stats & Equipment
                </div>
                <div class="mt-4 flex gap-2">
                  <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
                    Send on Quest
                  </button>
                  <button class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
