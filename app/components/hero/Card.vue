<script setup lang="ts">
import type { Hero } from '~~/types'
import { getArchetypeById, TAG_INFO } from '~~/types/archetypes'
import { GAMEPLAY_TRAITS } from '~/data/gameplayTraits'
import { STORY_TRAITS } from '~/data/storyTraits'

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

// Format threat ID to readable name (snake_case -> Title Case)
function formatThreatName(threatId: string): string {
  return threatId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Get archetype tag info (combat abilities)
const formattedArchetypeTags = computed(() => {
  return (props.hero.archetypeTags || []).map(tagId => {
    const tagData = TAG_INFO[tagId]
    if (!tagData) {
      return {
        id: tagId,
        name: tagId.replace(/_/g, ' '),
        description: '',
        counters: [] as string[],
      }
    }
    return {
      id: tagId,
      name: tagData.name,
      description: tagData.description,
      counters: tagData.counters.map(formatThreatName),
    }
  })
})

// Get full gameplay trait info with formatted description
const formattedGameplayTraits = computed(() => {
  return (props.hero.gameplayTraits || []).map(heroTrait => {
    const traitData = GAMEPLAY_TRAITS[heroTrait.traitId]
    if (!traitData) {
      return {
        id: heroTrait.traitId,
        name: heroTrait.traitId.replace(/_/g, ' '),
        description: '',
        isNegative: false,
      }
    }
    // Replace {value} placeholder with actual rolled value
    const description = traitData.description.replace('{value}', String(heroTrait.rolledValue))
    return {
      id: heroTrait.traitId,
      name: traitData.name,
      description,
      isNegative: traitData.isNegative,
    }
  })
})

// Get full story trait info
const formattedStoryTraits = computed(() => {
  return (props.hero.storyTraitIds || []).map(traitId => {
    const traitData = STORY_TRAITS[traitId]
    if (!traitData) {
      return {
        id: traitId,
        name: traitId.replace(/_/g, ' '),
        description: '',
      }
    }
    return {
      id: traitId,
      name: traitData.name,
      description: traitData.description,
    }
  })
})
</script>

<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden border-2" :class="rarityColors[hero.rarity]">
    <div class="p-4">
      <!-- Portrait and Hero Info -->
      <div class="flex gap-4 mb-3">
        <HeroPortrait :hero="hero" size="md" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-bold text-guild-gold truncate">{{ hero.name }}</h3>
            <span class="text-sm text-gray-400 capitalize">{{ hero.rarity }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm bg-gray-700 px-2 py-1 rounded">{{ archetype.name }}</span>
            <span class="text-xs text-gray-400">Lvl {{ hero.level }}</span>
            <span class="text-xs text-gray-400 capitalize">{{ hero.morale }}</span>
          </div>
        </div>
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

      <!-- Archetype Abilities (Tags) -->
      <div v-if="formattedArchetypeTags.length > 0" class="space-y-1.5">
        <div class="text-xs text-gray-400 mb-1">Abilities:</div>
        <div
          v-for="tag in (showDetails ? formattedArchetypeTags : formattedArchetypeTags.slice(0, 2))"
          :key="tag.id"
          class="text-xs bg-gray-700 px-2 py-1.5 rounded border-l-2 border-quest-blue"
        >
          <div>
            <span class="font-medium text-white">{{ tag.name }}:</span>
            <span class="text-gray-300 ml-1">{{ tag.description }}</span>
          </div>
          <div v-if="tag.counters.length > 0" class="mt-1 text-[10px] text-green-400">
            Counters: {{ tag.counters.join(', ') }}
          </div>
        </div>
        <div v-if="!showDetails && formattedArchetypeTags.length > 2" class="text-xs text-gray-500">
          +{{ formattedArchetypeTags.length - 2 }} more abilities
        </div>
      </div>

      <!-- Gameplay Traits -->
      <div v-if="formattedGameplayTraits.length > 0" class="mt-3 pt-2 border-t border-gray-700 space-y-1.5">
        <div class="text-xs text-gray-400 mb-1">Traits:</div>
        <div
          v-for="trait in (showDetails ? formattedGameplayTraits : formattedGameplayTraits.slice(0, 2))"
          :key="trait.id"
          class="text-xs bg-gray-700 px-2 py-1.5 rounded"
          :class="trait.isNegative ? 'border-l-2 border-danger-red' : 'border-l-2 border-uncommon'"
        >
          <span class="font-medium text-white">{{ trait.name }}:</span>
          <span class="text-gray-300 ml-1">{{ trait.description }}</span>
        </div>
        <div v-if="!showDetails && formattedGameplayTraits.length > 2" class="text-xs text-gray-500">
          +{{ formattedGameplayTraits.length - 2 }} more traits
        </div>
      </div>

      <!-- Story Traits (Personality) -->
      <div v-if="formattedStoryTraits.length > 0" class="mt-3 pt-2 border-t border-gray-700 space-y-1.5">
        <div class="text-xs text-gray-400 mb-1">Personality:</div>
        <div
          v-for="trait in (showDetails ? formattedStoryTraits : formattedStoryTraits.slice(0, 2))"
          :key="trait.id"
          class="text-xs bg-gray-700 px-2 py-1.5 rounded border-l-2 border-purple-500"
        >
          <span class="font-medium text-white">{{ trait.name }}:</span>
          <span class="text-gray-300 ml-1">{{ trait.description }}</span>
        </div>
        <div v-if="!showDetails && formattedStoryTraits.length > 2" class="text-xs text-gray-500">
          +{{ formattedStoryTraits.length - 2 }} more personality traits
        </div>
      </div>
    </div>
  </div>
</template>