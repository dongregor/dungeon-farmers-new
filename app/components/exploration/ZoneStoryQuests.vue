<script setup lang="ts">
interface Props {
  zoneName: string
  zoneId: string
}

const props = defineProps<Props>()

// Example story quests that would be available (grayed out preview)
const previewQuests = [
  {
    id: 'origins',
    title: 'Origins of the Ancients',
    description: 'Discover the forgotten history of this land',
    duration: '45 min',
    requirements: ['3 Heroes', 'Min. Level 10'],
    rewards: ['Zone Lore Unlock', 'Rare Equipment'],
  },
  {
    id: 'secrets',
    title: 'Hidden Secrets',
    description: 'Uncover what lies beneath the surface',
    duration: '60 min',
    requirements: ['4 Heroes', 'Min. Level 15', '50% Zone Familiarity'],
    rewards: ['Special Title', 'Unique Monster Capture'],
  },
]
</script>

<template>
  <div>
    <!-- Coming Soon Banner -->
    <div class="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-lg p-6 mb-6">
      <div class="flex items-start gap-4">
        <div class="text-4xl">📖</div>
        <div>
          <h3 class="text-xl font-semibold text-white mb-2">
            Story Quests Coming Soon
          </h3>
          <p class="text-gray-300 mb-4">
            Uncover the mysteries of <span class="text-purple-400 font-medium">{{ zoneName }}</span> through narrative-driven missions.
          </p>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex items-center gap-2 text-gray-400">
              <span class="text-purple-400">•</span>
              Fixed team compositions with specific hero requirements
            </div>
            <div class="flex items-center gap-2 text-gray-400">
              <span class="text-purple-400">•</span>
              Guaranteed rewards and content unlocks
            </div>
            <div class="flex items-center gap-2 text-gray-400">
              <span class="text-purple-400">•</span>
              Zone-specific lore and character development
            </div>
            <div class="flex items-center gap-2 text-gray-400">
              <span class="text-purple-400">•</span>
              30-60 minute immersive gameplay
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Quests (Grayed Out) -->
    <div class="space-y-4">
      <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Preview (Locked)
      </h4>

      <div
        v-for="quest in previewQuests"
        :key="quest.id"
        class="bg-gray-800/50 rounded-lg p-5 border border-gray-700 border-dashed opacity-60 cursor-not-allowed select-none"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl text-gray-600">🔒</span>
              <div>
                <h3 class="text-lg font-semibold text-gray-400">{{ quest.title }}</h3>
                <p class="text-sm text-gray-600">{{ quest.description }}</p>
              </div>
            </div>

            <!-- Requirements -->
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="req in quest.requirements"
                :key="req"
                class="px-2 py-1 text-xs rounded bg-gray-700/50 text-gray-500"
              >
                {{ req }}
              </span>
            </div>
          </div>

          <!-- Right Side Info -->
          <div class="text-right">
            <div class="text-sm text-gray-500 mb-2">
              <span class="text-gray-600">Duration:</span> {{ quest.duration }}
            </div>
            <div class="flex flex-wrap gap-1 justify-end">
              <span
                v-for="reward in quest.rewards"
                :key="reward"
                class="px-2 py-1 text-xs rounded bg-purple-900/20 text-purple-600"
              >
                {{ reward }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Development Note -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Story quests are in development. Stay tuned for updates!
      </p>
    </div>
  </div>
</template>
