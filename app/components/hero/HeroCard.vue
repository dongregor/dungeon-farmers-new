<script setup lang="ts">
import type { Hero } from '~~/types'
import { getArchetypeById } from '~~/types/archetypes'

const props = defineProps<{
  hero: Hero
  showDetails?: boolean
}>()

const archetype = getArchetypeById(props.hero.archetype)

const rarityColors = {
  common: 'border-common',
  uncommon: 'border-uncommon',
  rare: 'border-rare',
  epic: 'border-epic',
  legendary: 'border-legendary'
}

const statTotal = computed(() =>
  props.hero.baseStats.combat +
  props.hero.baseStats.utility +
  props.hero.baseStats.survival
)
</script>

<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden border-2" :class="rarityColors[hero.rarity]">
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-guild-gold">{{ hero.name }}</h3>
        <span class="text-sm text-gray-400 capitalize">{{ hero.rarity }}</span>
      </div>

      <div class="flex items-center gap-2 mb-3">
        <span class="text-sm bg-gray-700 px-2 py-1 rounded">{{ archetype.name }}</span>
        <span class="text-xs text-gray-400">Lvl {{ hero.level }}</span>
        <span class="text-xs text-gray-400 capitalize">{{ hero.morale }}</span>
      </div>

      <div v-if="showDetails" class="mb-3">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-common">Combat: {{ hero.baseStats.combat }}</span>
          <span class="text-uncommon">Utility: {{ hero.baseStats.utility }}</span>
          <span class="text-rare">Survival: {{ hero.baseStats.survival }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div class="bg-guild-gold h-2 rounded-full" :style="`width: ${(statTotal / 100) * 100}%`"></div>
        </div>
      </div>

      <div class="flex gap-2 flex-wrap">
        <span v-for="trait in hero.gameplayTraits.slice(0, showDetails ? undefined : 2)" 
              :key="trait.traitId" 
              class="text-xs bg-gray-700 px-2 py-1 rounded">
          {{ trait.traitId.replace('_', ' ') }}
        </span>
        <span v-if="hero.gameplayTraits.length > (showDetails ? 0 : 2)" 
              class="text-xs text-gray-500">
          +{{ hero.gameplayTraits.length - (showDetails ? 0 : 2) }} more
        </span>
      </div>

      <div v-if="showDetails && hero.storyTraits.length > 0" class="mt-3 pt-2 border-t border-gray-700">
        <div class="text-xs text-gray-400 mb-1">Personality:</div>
        <div class="flex gap-2 flex-wrap">
          <span v-for="trait in hero.storyTraits.slice(0, 3)" 
                :key="trait.traitId" 
                class="text-xs bg-gray-700 px-2 py-1 rounded">
            {{ trait.traitId.replace('_', ' ') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>