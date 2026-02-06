<script setup lang="ts">
import type { ExpeditionLog, ExpeditionRewards, LogSection, LogEntry } from '~~/types'
import type { Hero } from '~~/types'

interface Props {
  log: ExpeditionLog
  heroes: Hero[]
  rewards?: ExpeditionRewards
}

const props = defineProps<Props>()

// Section titles mapping
const sectionTitles: Record<string, string> = {
  departure: 'Departure',
  travel: 'The Journey',
  encounter: 'Encounter',
  discovery: 'Discovery',
  return: 'Return',
}

const getEntryTypeIcon = (type: LogEntry['type']): string => {
  switch (type) {
    case 'narrative':
      return ''
    case 'reaction':
      return '💬'
    case 'combat':
      return '⚔️'
    case 'loot':
      return '💰'
    case 'choice_result':
      return '🔀'
    default:
      return ''
  }
}

const getEntryTypeColor = (type: LogEntry['type']): string => {
  switch (type) {
    case 'narrative':
      return 'text-gray-800 dark:text-gray-200'
    case 'reaction':
      return 'text-blue-600 dark:text-blue-400 italic'
    case 'combat':
      return 'text-red-600 dark:text-red-400'
    case 'loot':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'choice_result':
      return 'text-purple-600 dark:text-purple-400'
    default:
      return 'text-gray-700 dark:text-gray-300'
  }
}

const getRarityColor = (rarity?: string): string => {
  switch (rarity) {
    case 'legendary':
      return 'border-l-yellow-400'
    case 'epic':
      return 'border-l-purple-400'
    case 'noteworthy':
      return 'border-l-blue-400'
    default:
      return 'border-l-gray-200'
  }
}
</script>

<template>
  <div class="expedition-log space-y-6">
    <!-- Debug: Show we're rendering -->
    <div class="bg-blue-100 text-blue-800 p-2 rounded text-sm">
      Log Component Loaded - {{ log.sections?.length || 0 }} sections
    </div>

    <!-- Summary -->
    <div v-if="log.summary" class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Duration</div>
          <div class="font-semibold text-gray-800 dark:text-gray-100">{{ log.summary.duration }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Efficiency</div>
          <div class="font-semibold text-gray-800 dark:text-gray-100">{{ log.summary.efficiency }}</div>
        </div>
        <div v-if="log.summary.rewards">
          <div class="text-sm text-gray-500 dark:text-gray-400">Gold</div>
          <div class="font-semibold text-yellow-600 dark:text-yellow-400">{{ log.summary.rewards.gold }}</div>
        </div>
        <div v-if="log.summary.rewards">
          <div class="text-sm text-gray-500 dark:text-gray-400">XP</div>
          <div class="font-semibold text-blue-600 dark:text-blue-400">{{ log.summary.rewards.xp }}</div>
        </div>
      </div>
    </div>

    <!-- Sections -->
    <div
      v-for="(section, sectionIndex) in (log.sections || [])"
      v-show="section.entries && section.entries.length > 0"
      :key="sectionIndex"
      class="section"
    >
      <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-3 text-lg flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
        {{ section.title || sectionTitles[section.type] || section.type }}
      </h3>

      <div class="space-y-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
        <div
          v-for="(entry, entryIndex) in section.entries"
          :key="entryIndex"
          class="py-1 pl-3 border-l-2"
          :class="getRarityColor(entry.rarity)"
        >
          <span v-if="getEntryTypeIcon(entry.type)" class="mr-2">
            {{ getEntryTypeIcon(entry.type) }}
          </span>
          <span :class="getEntryTypeColor(entry.type)">
            {{ entry.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- Party -->
    <div v-if="heroes.length > 0" class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mt-6">
      <h3 class="font-bold text-gray-700 dark:text-gray-200 mb-2">Party</h3>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="hero in heroes"
          :key="hero.id"
          class="bg-white dark:bg-gray-600 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-500"
        >
          {{ hero.name }}
        </div>
      </div>
    </div>

    <!-- Rewards -->
    <div v-if="rewards" class="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
      <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-3">Rewards Earned</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-if="rewards.gold > 0" class="text-center">
          <div class="text-2xl mb-1">💰</div>
          <div class="font-bold text-yellow-600 dark:text-yellow-400">{{ rewards.gold }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Gold</div>
        </div>
        <div v-if="rewards.xp > 0" class="text-center">
          <div class="text-2xl mb-1">⭐</div>
          <div class="font-bold text-blue-600 dark:text-blue-400">{{ rewards.xp }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">XP (per hero)</div>
        </div>
        <div v-if="rewards.equipment && rewards.equipment.length > 0" class="text-center">
          <div class="text-2xl mb-1">🎒</div>
          <div class="font-bold text-purple-600 dark:text-purple-400">{{ rewards.equipment.length }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Equipment</div>
        </div>
        <div v-if="rewards.familiarityGain && rewards.familiarityGain > 0" class="text-center">
          <div class="text-2xl mb-1">🗺️</div>
          <div class="font-bold text-green-600 dark:text-green-400">+{{ rewards.familiarityGain }}%</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Familiarity</div>
        </div>
      </div>
    </div>
  </div>
</template>
