<script setup lang="ts">
import { ref } from 'vue'

type CollectibleCategory = 'story_items' | 'materials' | 'treasures'

interface Collectible {
  id: string
  name: string
  description: string
  icon: string
  category: CollectibleCategory
  collected: boolean
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  source?: string
}

const activeCategory = ref<CollectibleCategory>('story_items')

// Mock data
const collectibles = ref<Collectible[]>([
  {
    id: 'map_piece_1',
    name: 'Ancient Map Fragment (North)',
    description: 'A torn piece of an old map showing northern territories',
    icon: '🗺️',
    category: 'story_items',
    collected: true,
    rarity: 'rare',
    source: 'Verdant Woods - Sunlit Clearing',
  },
  {
    id: 'map_piece_2',
    name: 'Ancient Map Fragment (South)',
    description: 'A torn piece of an old map showing southern territories',
    icon: '🗺️',
    category: 'story_items',
    collected: true,
    rarity: 'rare',
    source: 'Verdant Woods - Dense Thicket',
  },
  {
    id: 'map_piece_3',
    name: 'Ancient Map Fragment (West)',
    description: 'A torn piece of an old map showing western territories',
    icon: '🗺️',
    category: 'story_items',
    collected: false,
    rarity: 'rare',
    source: 'Verdant Woods - Ancient Grove',
  },
  {
    id: 'crystal_shard',
    name: 'Glowing Crystal Shard',
    description: 'A mysterious crystal that pulses with inner light',
    icon: '💎',
    category: 'story_items',
    collected: true,
    rarity: 'epic',
    source: 'Goblin Caves - Fungal Grotto',
  },
])

const categoryLabels = {
  story_items: 'Story Items',
  materials: 'Rare Materials',
  treasures: 'Treasures',
}

const filteredCollectibles = computed(() => {
  return collectibles.value.filter(c => c.category === activeCategory.value)
})

const categoryStats = computed(() => {
  const stats: Record<CollectibleCategory, { collected: number; total: number }> = {
    story_items: { collected: 0, total: 0 },
    materials: { collected: 0, total: 0 },
    treasures: { collected: 0, total: 0 },
  }

  collectibles.value.forEach(c => {
    stats[c.category].total++
    if (c.collected) {
      stats[c.category].collected++
    }
  })

  return stats
})

const getRarityColor = (rarity: string) => {
  const colors: Record<string, string> = {
    common: 'text-gray-600',
    uncommon: 'text-green-600',
    rare: 'text-blue-600',
    epic: 'text-purple-600',
    legendary: 'text-yellow-600',
  }
  return colors[rarity] || 'text-gray-600'
}

const getRarityBg = (rarity: string) => {
  const colors: Record<string, string> = {
    common: 'bg-gray-100 border-gray-300',
    uncommon: 'bg-green-50 border-green-300',
    rare: 'bg-blue-50 border-blue-300',
    epic: 'bg-purple-50 border-purple-300',
    legendary: 'bg-yellow-50 border-yellow-300',
  }
  return colors[rarity] || 'bg-gray-100 border-gray-300'
}
</script>

<template>
  <div>
    <!-- Category Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="(label, category) in categoryLabels"
        :key="category"
        class="flex-1 py-3 px-4 rounded-lg font-bold transition-all"
        :class="activeCategory === category
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        @click="activeCategory = category as CollectibleCategory"
      >
        <div>{{ label }}</div>
        <div class="text-sm opacity-90">
          {{ categoryStats[category as CollectibleCategory].collected }} / {{ categoryStats[category as CollectibleCategory].total }}
        </div>
      </button>
    </div>

    <!-- Collectibles Grid -->
    <div v-if="filteredCollectibles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="collectible in filteredCollectibles"
        :key="collectible.id"
        class="border-2 rounded-lg p-4 transition-all"
        :class="[
          collectible.collected ? getRarityBg(collectible.rarity) : 'bg-gray-50 border-gray-300 opacity-60'
        ]"
      >
        <div class="flex items-start gap-3">
          <div class="text-4xl">
            {{ collectible.collected ? collectible.icon : '❓' }}
          </div>

          <div class="flex-1">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h4 class="font-bold text-gray-800">
                  {{ collectible.collected ? collectible.name : '???' }}
                </h4>
                <div class="text-xs capitalize font-medium" :class="getRarityColor(collectible.rarity)">
                  {{ collectible.rarity }}
                </div>
              </div>

              <div v-if="collectible.collected" class="text-green-600 font-bold text-xl">
                ✓
              </div>
            </div>

            <p class="text-sm text-gray-600 mb-2">
              {{ collectible.collected ? collectible.description : 'Undiscovered collectible' }}
            </p>

            <div v-if="collectible.collected && collectible.source" class="text-xs text-gray-500">
              Source: {{ collectible.source }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <div class="text-6xl mb-4">📦</div>
      <p class="text-lg">No collectibles in this category yet</p>
    </div>
  </div>
</template>
