<script setup lang="ts">
import type { Equipment, EquipmentSet, SetBonus } from '~~/types'
import { formatTraitDescription } from '~/data/equipmentTraits'

const props = defineProps<{
  equippedItems: Equipment[]
  availableSets?: EquipmentSet[]
}>()

interface ActiveSet {
  setId: string
  setName: string
  equippedCount: number
  totalPieces: number
  activeBonuses: SetBonus[]
  nextBonus?: SetBonus
}

// Calculate active sets
const activeSets = computed(() => {
  const setMap = new Map<string, { name: string; count: number; pieces: string[] }>()

  // Count equipped pieces per set
  props.equippedItems.forEach(item => {
    if (item.setId && item.setName) {
      if (!setMap.has(item.setId)) {
        setMap.set(item.setId, {
          name: item.setName,
          count: 0,
          pieces: []
        })
      }
      const set = setMap.get(item.setId)!
      set.count++
      set.pieces.push(item.id)
    }
  })

  // Find corresponding set definitions and active bonuses
  const results: ActiveSet[] = []
  setMap.forEach((data, setId) => {
    const setDef = props.availableSets?.find(s => s.id === setId)
    if (!setDef) return

    const activeBonuses = setDef.bonuses.filter(b => b.requiredPieces <= data.count)
    const nextBonus = setDef.bonuses
      .filter(b => b.requiredPieces > data.count)
      .sort((a, b) => a.requiredPieces - b.requiredPieces)[0]

    results.push({
      setId,
      setName: data.name,
      equippedCount: data.count,
      totalPieces: setDef.pieces.length,
      activeBonuses,
      nextBonus
    })
  })

  return results.sort((a, b) => b.equippedCount - a.equippedCount)
})

const hasActiveSets = computed(() => activeSets.value.length > 0)
</script>

<template>
  <div class="space-y-3">
    <!-- No Sets Active -->
    <div v-if="!hasActiveSets" class="bg-gray-800 rounded-lg p-4 text-center">
      <div class="text-gray-400 text-sm">No set bonuses active</div>
      <div class="text-xs text-gray-500 mt-1">
        Equip multiple pieces from the same set to gain bonuses
      </div>
    </div>

    <!-- Active Sets -->
    <div
      v-for="set in activeSets"
      :key="set.setId"
      class="bg-gray-800 rounded-lg border-2 border-loot-purple/50 overflow-hidden"
    >
      <!-- Set Header -->
      <div class="bg-loot-purple/20 p-3 border-b border-loot-purple/30">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-loot-purple">{{ set.setName }}</h3>
          <div class="text-sm text-gray-300">
            {{ set.equippedCount }}/{{ set.totalPieces }} pieces
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-2 w-full bg-gray-700 rounded-full h-2">
          <div
            class="bg-loot-purple h-2 rounded-full transition-all"
            :style="`width: ${(set.equippedCount / set.totalPieces) * 100}%`"
          />
        </div>
      </div>

      <!-- Set Bonuses -->
      <div class="p-3 space-y-3">
        <!-- Active Bonuses -->
        <div v-if="set.activeBonuses.length > 0" class="space-y-2">
          <div
            v-for="(bonus, idx) in set.activeBonuses"
            :key="idx"
            class="bg-gray-700/50 rounded p-2"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs text-success-green font-bold">
                ✓ {{ bonus.requiredPieces }}-Piece Bonus
              </span>
            </div>
            <div class="space-y-1">
              <div
                v-for="trait in bonus.grantedTraits"
                :key="trait.traitId"
                class="text-sm text-gray-200"
              >
                {{ formatTraitDescription(trait.traitId, trait.fixedValue) }}
                <span class="text-xs text-purple-400 ml-1">({{ trait.quality }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Bonus -->
        <div v-if="set.nextBonus" class="bg-gray-700/30 rounded p-2 border border-gray-600">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs text-gray-400 font-bold">
              {{ set.nextBonus.requiredPieces }}-Piece Bonus
            </span>
            <span class="text-xs text-gray-500">
              ({{ set.nextBonus.requiredPieces - set.equippedCount }} more needed)
            </span>
          </div>
          <div class="space-y-1 opacity-50">
            <div
              v-for="trait in set.nextBonus.grantedTraits"
              :key="trait.traitId"
              class="text-sm text-gray-400"
            >
              {{ formatTraitDescription(trait.traitId, trait.fixedValue) }}
            </div>
          </div>
        </div>

        <!-- All Bonuses Unlocked -->
        <div
          v-if="set.activeBonuses.length > 0 && !set.nextBonus"
          class="text-center text-xs text-success-green"
        >
          All set bonuses unlocked! 🎉
        </div>
      </div>
    </div>
  </div>
</template>
