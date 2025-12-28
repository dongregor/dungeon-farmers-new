<script setup lang="ts">
import { ref, computed } from 'vue'

// Mock data - would come from stores in real implementation
const zones = ref([
  {
    id: 'verdant_woods',
    name: 'Verdant Woods',
    collected: 12,
    total: 18,
    subzones: [
      { id: 'sunlit_clearing', name: 'Sunlit Clearing', collected: 6, total: 6, unlocked: true },
      { id: 'dense_thicket', name: 'Dense Thicket', collected: 4, total: 7, unlocked: true },
      { id: 'ancient_grove', name: 'Ancient Grove', collected: 2, total: 5, unlocked: true },
    ],
  },
  {
    id: 'goblin_caves',
    name: 'Goblin Caves',
    collected: 5,
    total: 14,
    subzones: [
      { id: 'entrance_tunnels', name: 'Entrance Tunnels', collected: 3, total: 5, unlocked: true },
      { id: 'fungal_grotto', name: 'Fungal Grotto', collected: 2, total: 6, unlocked: true },
      { id: 'treasure_vault', name: 'Treasure Vault', collected: 0, total: 3, unlocked: false },
    ],
  },
])

const selectedZone = ref<string | null>(null)
const selectedSubzone = ref<string | null>(null)

const overallStats = computed(() => {
  const total = zones.value.reduce((sum, z) => sum + z.total, 0)
  const collected = zones.value.reduce((sum, z) => sum + z.collected, 0)
  const percentage = Math.round((collected / total) * 100)
  return { total, collected, percentage }
})

const currentZone = computed(() => {
  if (!selectedZone.value) return null
  return zones.value.find(z => z.id === selectedZone.value)
})

const currentSubzone = computed(() => {
  if (!currentZone.value || !selectedSubzone.value) return null
  return currentZone.value.subzones.find(s => s.id === selectedSubzone.value)
})

const toggleZone = (zoneId: string) => {
  if (selectedZone.value === zoneId) {
    selectedZone.value = null
    selectedSubzone.value = null
  } else {
    selectedZone.value = zoneId
    selectedSubzone.value = null
  }
}

const selectSubzone = (subzoneId: string) => {
  selectedSubzone.value = subzoneId
}

const getProgressColor = (percentage: number) => {
  if (percentage === 100) return 'bg-green-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}
</script>

<template>
  <div>
    <!-- Overall Stats -->
    <div class="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-1">Monster Collection</h3>
          <p class="text-sm text-gray-600">
            Discover monsters by encountering them on expeditions
          </p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold text-green-600">
            {{ overallStats.percentage }}%
          </div>
          <div class="text-sm text-gray-600">
            {{ overallStats.collected }} / {{ overallStats.total }}
          </div>
        </div>
      </div>
    </div>

    <!-- Zones List -->
    <div class="space-y-3">
      <div
        v-for="zone in zones"
        :key="zone.id"
        class="border-2 rounded-lg overflow-hidden transition-all"
        :class="selectedZone === zone.id ? 'border-green-500' : 'border-gray-300'"
      >
        <!-- Zone Header -->
        <button
          class="w-full p-4 hover:bg-gray-50 transition-colors"
          @click="toggleZone(zone.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ selectedZone === zone.id ? '▼' : '▶' }}</span>
              <div class="text-left">
                <h4 class="font-bold text-gray-800 text-lg">{{ zone.name }}</h4>
                <div class="text-sm text-gray-600">
                  {{ zone.collected }} / {{ zone.total }} monsters
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="w-48">
              <div class="text-xs text-gray-600 mb-1 text-right">
                {{ Math.round((zone.collected / zone.total) * 100) }}%
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="getProgressColor((zone.collected / zone.total) * 100)"
                  :style="{ width: `${(zone.collected / zone.total) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </button>

        <!-- Subzones (expanded) -->
        <div v-if="selectedZone === zone.id" class="border-t border-gray-200 bg-gray-50 p-4">
          <div class="space-y-2">
            <button
              v-for="subzone in zone.subzones"
              :key="subzone.id"
              class="w-full text-left p-3 rounded-lg transition-all"
              :class="[
                selectedSubzone === subzone.id
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-white border-2 border-gray-200 hover:border-green-300',
                !subzone.unlocked && 'opacity-50'
              ]"
              :disabled="!subzone.unlocked"
              @click="selectSubzone(subzone.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ subzone.unlocked ? '📂' : '🔒' }}</span>
                  <div>
                    <div class="font-bold text-gray-800">{{ subzone.name }}</div>
                    <div class="text-sm text-gray-600">
                      {{ subzone.collected }} / {{ subzone.total }}
                    </div>
                  </div>
                </div>

                <div v-if="subzone.collected === subzone.total && subzone.unlocked" class="text-green-600 font-bold">
                  ✓ Complete
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Monster Details (when subzone selected) -->
    <div v-if="currentSubzone" class="mt-6 bg-white border-2 border-green-500 rounded-lg p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4">
        {{ currentSubzone.name }}
      </h3>

      <div class="text-center py-12 text-gray-500">
        <div class="text-6xl mb-4">🐉</div>
        <p class="text-lg mb-2">Monster catalog coming soon</p>
        <p class="text-sm">
          {{ currentSubzone.collected }} of {{ currentSubzone.total }} monsters discovered
        </p>
      </div>
    </div>
  </div>
</template>
