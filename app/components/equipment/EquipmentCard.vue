<script setup lang="ts">
import type { Equipment } from '~~/types'
import { getEquipmentTraitById, formatTraitDescription } from '~/data/equipmentTraits'

const props = defineProps<{
  equipment: Equipment
  showDetails?: boolean
  clickable?: boolean
}>()

const emit = defineEmits<{
  click: [equipment: Equipment]
}>()

const rarityColors = {
  common: 'border-common',
  uncommon: 'border-uncommon',
  rare: 'border-rare',
  epic: 'border-epic',
  legendary: 'border-legendary',
  mythic: 'border-mythic'
}

const rarityTextColors = {
  common: 'text-common',
  uncommon: 'text-uncommon',
  rare: 'text-rare',
  epic: 'text-epic',
  legendary: 'text-legendary',
  mythic: 'text-mythic'
}

const qualityColors = {
  normal: 'text-gray-400',
  magic: 'text-blue-400',
  perfect: 'text-purple-400'
}

const slotNames = {
  weapon: 'Weapon',
  armor: 'Armor',
  helmet: 'Helmet',
  boots: 'Boots',
  accessory1: 'Accessory',
  accessory2: 'Accessory'
}

const statTotal = computed(() =>
  props.equipment.baseStats.combat +
  props.equipment.baseStats.utility +
  props.equipment.baseStats.survival
)

function handleClick() {
  if (props.clickable) {
    emit('click', props.equipment)
  }
}
</script>

<template>
  <div
    class="bg-gray-800 rounded-lg overflow-hidden border-2 transition-all"
    :class="[
      rarityColors[equipment.rarity],
      clickable ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
    ]"
    @click="handleClick"
  >
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold" :class="rarityTextColors[equipment.rarity]">
          {{ equipment.name }}
        </h3>
        <span class="text-xs text-gray-400">
          {{ slotNames[equipment.slot] }}
        </span>
      </div>

      <div class="flex items-center gap-2 mb-3">
        <span class="text-sm capitalize" :class="rarityTextColors[equipment.rarity]">
          {{ equipment.rarity }}
        </span>
        <span class="text-xs text-gray-400">iLvl {{ equipment.itemLevel }}</span>
        <span class="text-xs text-guild-gold">⚡ {{ equipment.gearScore }}</span>
        <span v-if="equipment.setName" class="text-xs text-loot-purple ml-auto">
          {{ equipment.setName }}
        </span>
      </div>

      <div v-if="showDetails" class="mb-3">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-common">⚔ {{ equipment.baseStats.combat }}</span>
          <span class="text-uncommon">🔧 {{ equipment.baseStats.utility }}</span>
          <span class="text-rare">🛡 {{ equipment.baseStats.survival }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-1.5">
          <div
            class="bg-guild-gold h-1.5 rounded-full"
            :style="`width: ${Math.min((statTotal / 150) * 100, 100)}%`"
          />
        </div>
      </div>

      <div v-if="equipment.traits.length > 0" class="space-y-1">
        <div
          v-for="trait in equipment.traits.slice(0, showDetails ? undefined : 2)"
          :key="trait.traitId"
          class="text-xs"
          :class="qualityColors[trait.quality]"
        >
          {{ formatTraitDescription(trait.traitId, trait.rolledValue) }}
          <span v-if="showDetails" class="text-gray-500 ml-1">({{ trait.quality }})</span>
        </div>
        <span
          v-if="!showDetails && equipment.traits.length > 2"
          class="text-xs text-gray-500 block"
        >
          +{{ equipment.traits.length - 2 }} more
        </span>
      </div>

      <div v-if="showDetails" class="mt-3 pt-2 border-t border-gray-700">
        <p class="text-xs text-gray-400 italic">{{ equipment.description }}</p>
      </div>

      <div v-if="equipment.isEquipped" class="mt-2 pt-2 border-t border-gray-700">
        <span class="text-xs text-success-green">✓ Equipped</span>
      </div>
    </div>
  </div>
</template>
