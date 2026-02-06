<script setup lang="ts">
import type { TavernHero } from '~~/types'
import { getArchetypeById, TAG_INFO, type ArchetypeTag } from '~~/types/archetypes'
import { getPositiveGameplayTraits, getNegativeGameplayTraits } from '~~/app/data/gameplayTraits'
import { getStoryTraitById } from '~~/app/data/storyTraits'

const props = defineProps<{
  hero: TavernHero | null
  slotIndex: number
  isLocked: boolean
}>()

const emit = defineEmits(['recruit', 'lock', 'unlock'])

const archetype = computed(() => props.hero ? getArchetypeById(props.hero.archetype) : null)

const borderColor = computed(() => {
    return props.hero ? (rarityColors[props.hero.rarity as keyof typeof rarityColors] || 'border-gray-600') : 'border-gray-600'
})

const rarityColors = {
  common: 'border-common',
  uncommon: 'border-uncommon',
  rare: 'border-rare',
  epic: 'border-epic',
  legendary: 'border-legendary'
}

// Get all trait definitions for lookup
const positiveTraits = getPositiveGameplayTraits()
const negativeTraits = getNegativeGameplayTraits()

// Resolve story trait IDs to full trait objects
const storyTraits = computed(() => {
  if (!props.hero?.storyTraitIds) return []
  return props.hero.storyTraitIds
    .map(id => getStoryTraitById(id))
    .filter(Boolean)
})

function formatTraitName(traitId: string): string {
  // Try to find the trait definition for a proper name
  const trait = positiveTraits.find(t => t.id === traitId) || negativeTraits.find(t => t.id === traitId)
  if (trait) return trait.name
  // Fallback to formatting the ID
  return traitId.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function getTraitColorClass(traitId: string): string {
  const isPositive = positiveTraits.some(t => t.id === traitId)
  const isNegative = negativeTraits.some(t => t.id === traitId)

  if (isPositive) {
    return 'bg-green-900/50 text-green-300 border-green-700'
  } else if (isNegative) {
    return 'bg-red-900/50 text-red-300 border-red-700'
  }
  return 'bg-gray-700 text-gray-300 border-gray-600'
}

// Format threat ID to readable name
function formatThreatName(threatId: string): string {
  return threatId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Get tag info with tooltip text
function getTagTooltip(tagId: string): string {
  const tagData = TAG_INFO[tagId as ArchetypeTag]
  if (!tagData) return ''

  const counters = tagData.counters.map(formatThreatName).join(', ')
  return `${tagData.description}\nCounters: ${counters}`
}

function getTagDisplayName(tagId: string): string {
  const tagData = TAG_INFO[tagId as ArchetypeTag]
  return tagData?.name || tagId.replaceAll('_', ' ')
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
  <div class="bg-gray-800 rounded-lg overflow-hidden border-2" :class="borderColor">
    <div v-if="hero" class="p-4">
      <div class="flex gap-3 mb-3">
        <!-- Hero Portrait -->
        <HeroPortrait :hero="hero" size="md" class="flex-shrink-0" />

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-lg font-bold text-guild-gold truncate">{{ hero.name }}</h3>
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

          <div class="flex items-center gap-2">
            <span class="text-sm bg-gray-700 px-2 py-1 rounded">{{ archetype?.name || 'Unknown' }}</span>
            <span class="text-xs text-gray-400">Lvl {{ hero.level }}</span>
            <span class="text-xs text-gray-400">⚔️ {{ hero.power }}</span>
          </div>
        </div>
      </div>

      <!-- Archetype Tags -->
      <div v-if="hero.archetypeTags?.length" class="flex gap-1 flex-wrap mb-2">
        <span
          v-for="tag in hero.archetypeTags"
          :key="tag"
          class="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-700 cursor-help"
          :title="getTagTooltip(tag)"
        >
          {{ getTagDisplayName(tag) }}
        </span>
      </div>

      <div class="mb-3">
        <div class="flex justify-between text-xs mb-1">
          <span class="text-common">Combat: {{ hero.baseStats.combat }}</span>
          <span class="text-uncommon">Utility: {{ hero.baseStats.utility }}</span>
          <span class="text-rare">Survival: {{ hero.baseStats.survival }}</span>
        </div>
      </div>

      <!-- Gameplay Traits -->
      <div v-if="hero.gameplayTraits?.length" class="flex gap-1 flex-wrap mb-2">
        <span
          v-for="trait in hero.gameplayTraits"
          :key="trait.traitId"
          class="text-xs px-2 py-0.5 rounded border"
          :class="getTraitColorClass(trait.traitId)"
          :title="`Quality: ${trait.quality}, Value: ${trait.rolledValue}`"
        >
          {{ formatTraitName(trait.traitId) }}
        </span>
      </div>

      <!-- Personality/Story Traits -->
      <div v-if="storyTraits.length" class="flex gap-1 flex-wrap mb-3">
        <span
          v-for="trait in storyTraits"
          :key="trait.id"
          class="text-xs px-2 py-0.5 rounded border bg-amber-900/50 text-amber-300 border-amber-700"
          :title="trait.description"
        >
          {{ trait.name }}
        </span>
      </div>

      <div class="flex items-center justify-between mt-4">
        <button
          @click="handleRecruit"
          class="bg-guild-gold text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors flex-1"
        >
          Recruit ({{ hero.recruitCost }} Gold)
        </button>
      </div>
    </div>
    <div v-else class="p-4 flex items-center justify-center h-full min-h-[200px]">
      <span class="text-gray-500">Empty Slot</span>
    </div>
  </div>
</template>