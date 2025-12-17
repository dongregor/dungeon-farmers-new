<script setup lang="ts">
import type { Hero } from '~~/types'
import { getArchetypeById } from '~~/types/archetypes'
import { getGameplayTraitById } from '~/data/gameplayTraits'
import { getStoryTraitById } from '~/data/storyTraits'
import { getCultureInfo } from '~/data/cultures'

const props = defineProps<{
  hero: Hero
}>()

const emit = defineEmits(['close'])

const archetype = getArchetypeById(props.hero.archetype)
const culture = getCultureInfo(props.hero.culture)

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

const powerBreakdown = computed(() => {
  const basePower = statTotal.value
  const levelPower = props.hero.level * 2
  const traitPower = props.hero.gameplayTraits.reduce((sum, trait) => {
    const def = getGameplayTraitById(trait.traitId)
    return def && !def.isNegative ? sum + trait.rolledValue : sum
  }, 0)
  
  return {
    basePower,
    levelPower,
    traitPower,
    total: basePower + levelPower + traitPower
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2" :class="rarityColors[hero.rarity]">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-guild-gold">{{ hero.name }}</h2>
          <button @click="emit('close')" class="text-2xl text-gray-400 hover:text-white">×</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left column - Stats and Info -->
          <div>
            <div class="mb-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm bg-gray-700 px-2 py-1 rounded">{{ archetype.name }}</span>
                <span class="text-sm bg-gray-700 px-2 py-1 rounded">{{ culture.name }}</span>
              </div>
              <p class="text-gray-300 text-sm mb-2">{{ archetype.description }}</p>
              <p class="text-gray-400 text-xs italic">{{ culture.description }}</p>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-semibold text-guild-gold mb-2">STATS</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-common text-sm">Combat</span>
                  <span class="font-mono">{{ hero.baseStats.combat }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-uncommon text-sm">Utility</span>
                  <span class="font-mono">{{ hero.baseStats.utility }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-rare text-sm">Survival</span>
                  <span class="font-mono">{{ hero.baseStats.survival }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-700 pt-2 mt-2">
                  <span class="text-guild-gold text-sm font-semibold">Total</span>
                  <span class="font-mono font-semibold">{{ statTotal }}</span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-semibold text-guild-gold mb-2">POWER BREAKDOWN</h4>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-300">Base Stats</span>
                  <span class="font-mono">{{ powerBreakdown.basePower }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Level Bonus</span>
                  <span class="font-mono">+{{ powerBreakdown.levelPower }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Trait Bonus</span>
                  <span class="font-mono">+{{ powerBreakdown.traitPower }}</span>
                </div>
                <div class="flex justify-between border-t border-gray-700 pt-1 mt-1 font-semibold">
                  <span class="text-guild-gold">Total Power</span>
                  <span class="font-mono">{{ powerBreakdown.total }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right column - Traits -->
          <div>
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-guild-gold mb-2">GAMEPLAY TRAITS</h4>
              <div class="space-y-3">
                <div v-for="trait in hero.gameplayTraits" :key="trait.traitId" class="p-3 bg-gray-700 rounded">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="font-semibold text-guild-gold capitalize">{{ trait.traitId.replace('_', ' ') }}</div>
                      <div class="text-xs text-gray-400 capitalize">{{ getGameplayTraitById(trait.traitId)?.statType || 'unknown' }}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-mono" :class="{
                        'text-success-green': !getGameplayTraitById(trait.traitId)?.isNegative,
                        'text-danger-red': getGameplayTraitById(trait.traitId)?.isNegative
                      }">
                        {{ getGameplayTraitById(trait.traitId)?.isNegative ? '-' : '+' }}{{ trait.rolledValue }}
                      </div>
                      <div class="text-xs text-gray-500 capitalize">{{ trait.quality }}</div>
                    </div>
                  </div>
                  <div class="text-xs text-gray-300 mt-1">
                    {{ getGameplayTraitById(trait.traitId)?.description || 'No description' }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="hero.storyTraitIds.length > 0" class="mb-4">
              <h4 class="text-sm font-semibold text-guild-gold mb-2">STORY TRAITS</h4>
              <div class="space-y-2">
                <div v-for="traitId in hero.storyTraitIds" :key="traitId" class="p-2 bg-gray-700 rounded text-sm">
                  <div class="flex justify-between items-center">
                    <span class="capitalize">{{ traitId.replace(/_/g, ' ') }}</span>
                    <span class="text-xs text-gray-400">
                      {{ getStoryTraitById(traitId)?.reactions.join(', ') || '' }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-300 mt-1">
                    {{ getStoryTraitById(traitId)?.description || 'No description' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-700">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-sm text-gray-400">Level {{ hero.level }}</div>
              <div class="text-sm text-gray-400">Prestige {{ hero.prestigeLevel }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-400 capitalize">{{ hero.morale }} Morale</div>
              <div class="text-sm text-gray-400">
                {{ hero.isOnExpedition ? 'On Expedition' : hero.isStationed ? 'Stationed' : 'Available' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>