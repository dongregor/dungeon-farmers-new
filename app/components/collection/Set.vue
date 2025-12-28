<script setup lang="ts">
import { ref } from 'vue'

interface SetBonus {
  pieces: number
  bonus: string
}

interface EquipmentSet {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'uncommon' | 'rare' | 'epic' | 'legendary'
  totalPieces: number
  collectedPieces: number
  pieces: Array<{
    id: string
    name: string
    slot: string
    collected: boolean
  }>
  bonuses: SetBonus[]
  theme: string
}

// Mock data
const sets = ref<EquipmentSet[]>([
  {
    id: 'guardian_plate',
    name: "Guardian's Plate",
    description: 'Heavy armor forged for defenders of the realm',
    icon: '🛡️',
    rarity: 'rare',
    totalPieces: 6,
    collectedPieces: 4,
    theme: 'Defense',
    pieces: [
      { id: 'helm', name: "Guardian's Helm", slot: 'Head', collected: true },
      { id: 'chest', name: "Guardian's Breastplate", slot: 'Chest', collected: true },
      { id: 'legs', name: "Guardian's Greaves", slot: 'Legs', collected: true },
      { id: 'gloves', name: "Guardian's Gauntlets", slot: 'Hands', collected: false },
      { id: 'boots', name: "Guardian's Sabatons", slot: 'Feet', collected: true },
      { id: 'shield', name: "Guardian's Bulwark", slot: 'Off-hand', collected: false },
    ],
    bonuses: [
      { pieces: 2, bonus: '+3 Survival' },
      { pieces: 4, bonus: '+5 Combat, +5 Survival' },
      { pieces: 6, bonus: 'Taunt: Draw enemy focus in combat' },
    ],
  },
  {
    id: 'shadow_veil',
    name: "Shadow Veil",
    description: 'Light armor crafted for those who strike from darkness',
    icon: '🗡️',
    rarity: 'epic',
    totalPieces: 5,
    collectedPieces: 2,
    theme: 'Stealth',
    pieces: [
      { id: 'hood', name: "Shadow Hood", slot: 'Head', collected: true },
      { id: 'tunic', name: "Shadow Tunic", slot: 'Chest', collected: false },
      { id: 'leggings', name: "Shadow Leggings", slot: 'Legs', collected: false },
      { id: 'gloves', name: "Shadow Gloves", slot: 'Hands', collected: true },
      { id: 'boots', name: "Shadow Boots", slot: 'Feet', collected: false },
    ],
    bonuses: [
      { pieces: 2, bonus: '+4 Utility' },
      { pieces: 4, bonus: '+6 Utility, +3 Combat' },
      { pieces: 5, bonus: 'First Strike: +20% damage on expedition start' },
    ],
  },
  {
    id: 'arcane_regalia',
    name: "Arcane Regalia",
    description: 'Robes imbued with ancient magical power',
    icon: '✨',
    rarity: 'legendary',
    totalPieces: 6,
    collectedPieces: 0,
    theme: 'Magic',
    pieces: [
      { id: 'crown', name: "Arcane Crown", slot: 'Head', collected: false },
      { id: 'robe', name: "Arcane Robe", slot: 'Chest', collected: false },
      { id: 'sash', name: "Arcane Sash", slot: 'Waist', collected: false },
      { id: 'gloves', name: "Arcane Gloves", slot: 'Hands', collected: false },
      { id: 'boots', name: "Arcane Boots", slot: 'Feet', collected: false },
      { id: 'staff', name: "Arcane Staff", slot: 'Weapon', collected: false },
    ],
    bonuses: [
      { pieces: 2, bonus: '+5 Utility' },
      { pieces: 4, bonus: '+8 Utility, +5 Survival' },
      { pieces: 6, bonus: 'Arcane Mastery: Double effect from all stat-based traits' },
    ],
  },
])

const selectedSet = ref<string | null>(null)

const currentSet = computed(() => {
  if (!selectedSet.value) return null
  return sets.value.find(s => s.id === selectedSet.value)
})

const completionStats = computed(() => {
  const complete = sets.value.filter(s => s.collectedPieces === s.totalPieces).length
  const partial = sets.value.filter(s => s.collectedPieces > 0 && s.collectedPieces < s.totalPieces).length
  const total = sets.value.length

  return { complete, partial, total }
})

const getRarityColor = (rarity: string) => {
  const colors: Record<string, string> = {
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600',
  }
  return colors[rarity] || 'from-gray-400 to-gray-600'
}

const getRarityBorder = (rarity: string) => {
  const colors: Record<string, string> = {
    uncommon: 'border-green-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500',
  }
  return colors[rarity] || 'border-gray-500'
}

const selectSet = (setId: string) => {
  selectedSet.value = selectedSet.value === setId ? null : setId
}
</script>

<template>
  <div>
    <!-- Stats Overview -->
    <div class="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-1">Equipment Sets</h3>
          <p class="text-sm text-gray-600">
            Collect complete sets to unlock powerful bonuses
          </p>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-600">
            Complete: <span class="font-bold text-purple-600">{{ completionStats.complete }}</span>
          </div>
          <div class="text-sm text-gray-600">
            In Progress: <span class="font-bold text-blue-600">{{ completionStats.partial }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sets List -->
    <div class="space-y-4">
      <div
        v-for="set in sets"
        :key="set.id"
        class="border-2 rounded-lg overflow-hidden transition-all"
        :class="[
          getRarityBorder(set.rarity),
          selectedSet === set.id ? 'shadow-lg' : ''
        ]"
      >
        <!-- Set Header -->
        <div class="h-2 bg-gradient-to-r" :class="getRarityColor(set.rarity)" />

        <button
          class="w-full p-4 hover:bg-gray-50 transition-colors"
          @click="selectSet(set.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-3">
              <div class="text-4xl">{{ set.icon }}</div>
              <div class="text-left">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-bold text-gray-800 text-lg">{{ set.name }}</h4>
                  <span class="text-xs capitalize font-medium px-2 py-1 rounded" :class="getRarityBorder(set.rarity) + ' bg-opacity-10'">
                    {{ set.rarity }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ set.description }}</p>
                <div class="flex items-center gap-4 text-sm">
                  <div class="text-gray-600">
                    Theme: <span class="font-medium">{{ set.theme }}</span>
                  </div>
                  <div class="text-gray-600">
                    Progress: <span class="font-bold">{{ set.collectedPieces }} / {{ set.totalPieces }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-2xl text-gray-400">
              {{ selectedSet === set.id ? '▼' : '▶' }}
            </div>
          </div>
        </button>

        <!-- Set Details (expanded) -->
        <div v-if="selectedSet === set.id" class="border-t border-gray-200 bg-gray-50 p-4">
          <!-- Pieces -->
          <div class="mb-4">
            <h5 class="font-bold text-gray-700 mb-3">Set Pieces</h5>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div
                v-for="piece in set.pieces"
                :key="piece.id"
                class="border-2 rounded-lg p-3 transition-all"
                :class="piece.collected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white opacity-60'"
              >
                <div class="flex items-center justify-between mb-1">
                  <div class="text-xs text-gray-600">{{ piece.slot }}</div>
                  <div v-if="piece.collected" class="text-green-600 font-bold">✓</div>
                  <div v-else class="text-gray-400">✗</div>
                </div>
                <div class="font-bold text-sm text-gray-800">
                  {{ piece.collected ? piece.name : '???' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Set Bonuses -->
          <div>
            <h5 class="font-bold text-gray-700 mb-3">Set Bonuses</h5>
            <div class="space-y-2">
              <div
                v-for="bonus in set.bonuses"
                :key="bonus.pieces"
                class="border-2 rounded-lg p-3 transition-all"
                :class="set.collectedPieces >= bonus.pieces
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 bg-white opacity-60'"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-bold text-gray-800">
                      {{ bonus.pieces }} Pieces
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ bonus.bonus }}
                    </div>
                  </div>
                  <div v-if="set.collectedPieces >= bonus.pieces" class="text-purple-600 font-bold text-xl">
                    ✓ Active
                  </div>
                  <div v-else class="text-gray-400">
                    Locked
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
