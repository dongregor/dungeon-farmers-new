<script setup lang="ts">
import type { TavernHero } from '~~/types'
import { getArchetypeById } from '~~/types/archetypes'

const props = defineProps<{
  hero: TavernHero
  slotIndex: number
  isLocked: boolean
}>()

const emit = defineEmits(['recruit', 'lock', 'unlock'])

const archetype = computed(() => getArchetypeById(props.hero.archetype))

const rarityColors = {
  common: 'border-common',
  uncommon: 'border-uncommon',
  rare: 'border-rare',
  epic: 'border-epic',
  legendary: 'border-legendary'
}

function handleRecruit() {
  emit('recruit', props.slotIndex)
}

function handleLockToggle() {
  if (props.isLocked) {
    emit('unlock', props.slotIndex)
  } else {
    emit('lock', props.slotIndex)
  }
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden border-2" :class="rarityColors[hero.rarity]">
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-guild-gold">{{ hero.name }}</h3>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-400 capitalize">{{ hero.rarity }}</span>
          <button 
            @click="handleLockToggle" 
            class="text-xl hover:text-guild-gold transition-colors"
            :title="isLocked ? 'Unlock this hero' : 'Lock this hero'"
          >
            {{ isLocked ? '🔒' : '🔓' }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2 mb-3">
        <span class="text-sm bg-gray-700 px-2 py-1 rounded">{{ archetype?.name || 'Unknown' }}</span>
        <span class="text-xs text-gray-400">Lvl {{ hero.level }}</span>
      </div>

      <div class="mb-3">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-common">Combat: {{ hero.baseStats.combat }}</span>
          <span class="text-uncommon">Utility: {{ hero.baseStats.utility }}</span>
          <span class="text-rare">Survival: {{ hero.baseStats.survival }}</span>
        </div>
      </div>

      <div class="flex gap-2 flex-wrap mb-3">
        <span v-for="trait in hero.gameplayTraits.slice(0, 3)" 
              :key="trait.traitId" 
              class="text-xs bg-gray-700 px-2 py-1 rounded">
          {{ trait.traitId.replace('_', ' ') }}
        </span>
      </div>

      <div class="flex items-center justify-between mt-4">
        <button
          @click="handleRecruit"
          class="bg-guild-gold text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors flex-1"
          :disabled="isLocked"
        >
          Recruit ({{ hero.recruitCost }} Gold)
        </button>
      </div>
    </div>
  </div>
</template>