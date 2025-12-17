<script setup lang="ts">
import type { Equipment, EquipmentSlot } from '~~/types'

const props = defineProps<{
  slot: EquipmentSlot
  equipment?: Equipment
  clickable?: boolean
}>()

const emit = defineEmits<{
  click: [slot: EquipmentSlot, equipment?: Equipment]
}>()

const rarityColors = {
  common: 'border-common bg-common/10',
  uncommon: 'border-uncommon bg-uncommon/10',
  rare: 'border-rare bg-rare/10',
  epic: 'border-epic bg-epic/10',
  legendary: 'border-legendary bg-legendary/10',
  mythic: 'border-mythic bg-mythic/10'
}

const rarityTextColors = {
  common: 'text-common',
  uncommon: 'text-uncommon',
  rare: 'text-rare',
  epic: 'text-epic',
  legendary: 'text-legendary',
  mythic: 'text-mythic'
}

const slotIcons = {
  weapon: '⚔️',
  armor: '🛡️',
  helmet: '⛑️',
  boots: '👢',
  accessory1: '💍',
  accessory2: '📿'
}

const slotNames = {
  weapon: 'Weapon',
  armor: 'Armor',
  helmet: 'Helmet',
  boots: 'Boots',
  accessory1: 'Accessory 1',
  accessory2: 'Accessory 2'
}

function handleClick() {
  if (props.clickable) {
    emit('click', props.slot, props.equipment)
  }
}
</script>

<template>
  <div
    class="relative border-2 rounded-lg overflow-hidden transition-all"
    :class="[
      equipment ? rarityColors[equipment.rarity] : 'border-gray-600 bg-gray-800',
      clickable ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
    ]"
    @click="handleClick"
  >
    <!-- Empty Slot -->
    <div v-if="!equipment" class="aspect-square flex flex-col items-center justify-center p-4">
      <div class="text-4xl mb-2 opacity-30">{{ slotIcons[slot] }}</div>
      <div class="text-xs text-gray-500 text-center">{{ slotNames[slot] }}</div>
    </div>

    <!-- Equipped Item -->
    <div v-else class="aspect-square p-3 flex flex-col">
      <div class="flex items-start justify-between mb-2">
        <div class="text-2xl">{{ slotIcons[slot] }}</div>
        <div class="text-xs text-success-green">✓</div>
      </div>

      <div class="flex-1 flex flex-col justify-end">
        <div class="text-sm font-bold truncate" :class="rarityTextColors[equipment.rarity]">
          {{ equipment.name }}
        </div>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs text-gray-400">iLvl {{ equipment.itemLevel }}</span>
          <span class="text-xs text-guild-gold">⚡{{ equipment.gearScore }}</span>
        </div>
        <div v-if="equipment.traits.length > 0" class="text-xs text-gray-400 mt-1">
          {{ equipment.traits.length }} trait{{ equipment.traits.length !== 1 ? 's' : '' }}
        </div>
      </div>
    </div>

    <!-- Set Indicator -->
    <div
      v-if="equipment?.setName"
      class="absolute top-1 right-1 w-2 h-2 rounded-full bg-loot-purple"
      :title="equipment.setName"
    />
  </div>
</template>
