<script setup lang="ts">
import type { ExpeditionEvent, ExpeditionLog, ExpeditionRewards } from '~~/types'
import type { Hero } from '~~/types'

interface Props {
  log: ExpeditionLog
  heroes: Hero[]
  rewards?: ExpeditionRewards
}

const props = defineProps<Props>()

// Group events by section
const groupedEvents = computed(() => {
  const groups: Record<string, ExpeditionEvent[]> = {
    start: [],
    journey: [],
    climax: [],
    end: [],
  }

  for (const event of props.log.events) {
    const section = event.section || 'journey'
    if (!groups[section]) {
      groups[section] = []
    }
    groups[section].push(event)
  }

  return groups
})

const sectionTitles: Record<string, string> = {
  start: 'Departure',
  journey: 'The Journey',
  climax: 'Climax',
  end: 'Return',
}

const getEventTypeIcon = (type: ExpeditionEvent['type']): string => {
  switch (type) {
    case 'flavor':
      return '📖'
    case 'skill_check':
      return '⚔️'
    case 'choice':
      return '🔀'
    case 'rare':
      return '✨'
    default:
      return '•'
  }
}

const getEventTypeColor = (type: ExpeditionEvent['type']): string => {
  switch (type) {
    case 'flavor':
      return 'text-gray-600'
    case 'skill_check':
      return 'text-blue-600'
    case 'choice':
      return 'text-purple-600'
    case 'rare':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}

const formatRewardValue = (value: number, type: 'gold' | 'xp' | 'materials'): string => {
  if (type === 'gold') return `${value} gold`
  if (type === 'xp') return `${value} XP`
  return `${value}`
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="border-b border-gray-200 pb-4 mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Expedition Log
      </h2>
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <span class="font-medium">{{ log.zoneName }}</span>
        <span>•</span>
        <span>{{ log.subzoneName }}</span>
      </div>
      <div class="text-sm text-gray-500 mt-1">
        Duration: {{ log.durationMinutes }} minutes
      </div>
    </div>

    <!-- Party -->
    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 class="font-bold text-gray-700 mb-2">Party</h3>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="hero in heroes"
          :key="hero.id"
          class="bg-white px-3 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-200"
        >
          {{ hero.name }}
        </div>
      </div>
    </div>

    <!-- Events by section -->
    <div class="space-y-6">
      <div
        v-for="(section, sectionKey) in groupedEvents"
        v-show="section.length > 0"
        :key="sectionKey"
        class="border-l-4 border-blue-300 pl-4"
      >
        <h3 class="font-bold text-gray-800 mb-3 text-lg">
          {{ sectionTitles[sectionKey] || sectionKey }}
        </h3>

        <div class="space-y-4">
          <div
            v-for="(event, index) in section"
            :key="index"
            class="bg-gray-50 rounded-lg p-4"
          >
            <!-- Event header -->
            <div class="flex items-start gap-3">
              <span class="text-2xl" :class="getEventTypeColor(event.type)">
                {{ getEventTypeIcon(event.type) }}
              </span>
              <div class="flex-1">
                <!-- Narrative -->
                <p class="text-gray-700 leading-relaxed mb-2">
                  {{ event.narrative }}
                </p>

                <!-- Trait reactions -->
                <div v-if="event.traitReactions && event.traitReactions.length > 0" class="mt-2 space-y-1">
                  <div
                    v-for="(reaction, reactionIndex) in event.traitReactions"
                    :key="reactionIndex"
                    class="text-sm italic text-blue-600 pl-4 border-l-2 border-blue-200"
                  >
                    {{ reaction }}
                  </div>
                </div>

                <!-- Skill check result -->
                <div v-if="event.type === 'skill_check' && event.skillCheck" class="mt-2">
                  <div
                    class="inline-block px-3 py-1 rounded-full text-sm font-medium"
                    :class="event.skillCheck.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ event.skillCheck.success ? '✓ Success' : '✗ Failed' }}
                  </div>
                </div>

                <!-- Choice made -->
                <div v-if="event.type === 'choice' && event.choice" class="mt-2">
                  <div class="text-sm font-medium text-purple-700">
                    Choice: {{ event.choice.selectedOption }}
                  </div>
                </div>

                <!-- Loot found -->
                <div v-if="event.loot" class="mt-2">
                  <div class="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    💰 Loot: {{ event.loot.itemName || 'Treasure' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div v-if="log.summary" class="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
      <h3 class="font-bold text-gray-800 mb-2">Summary</h3>
      <p class="text-gray-700">{{ log.summary }}</p>
    </div>

    <!-- Rewards -->
    <div v-if="rewards" class="mt-6 bg-green-50 rounded-lg p-4">
      <h3 class="font-bold text-gray-800 mb-3">Rewards Earned</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-if="rewards.gold > 0" class="text-center">
          <div class="text-2xl mb-1">💰</div>
          <div class="font-bold text-yellow-600">{{ rewards.gold }}</div>
          <div class="text-xs text-gray-600">Gold</div>
        </div>
        <div v-if="rewards.xp > 0" class="text-center">
          <div class="text-2xl mb-1">⭐</div>
          <div class="font-bold text-blue-600">{{ rewards.xp }}</div>
          <div class="text-xs text-gray-600">XP (per hero)</div>
        </div>
        <div v-if="rewards.equipment.length > 0" class="text-center">
          <div class="text-2xl mb-1">🎒</div>
          <div class="font-bold text-purple-600">{{ rewards.equipment.length }}</div>
          <div class="text-xs text-gray-600">Equipment</div>
        </div>
        <div v-if="rewards.materials && rewards.materials.length > 0" class="text-center">
          <div class="text-2xl mb-1">🔮</div>
          <div class="font-bold text-green-600">{{ rewards.materials.length }}</div>
          <div class="text-xs text-gray-600">Materials</div>
        </div>
      </div>
    </div>

    <!-- Efficiency indicator -->
    <div v-if="log.efficiency" class="mt-4 text-center text-sm text-gray-600">
      Efficiency: {{ Math.round(log.efficiency * 100) }}%
    </div>
  </div>
</template>
