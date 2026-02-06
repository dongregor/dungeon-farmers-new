<script setup lang="ts">
import type { Zone, Subzone, MonsterSpawn, Collectible } from '~~/types'

interface Props {
  zone: Zone
  subzoneProgress: Record<string, { mastery: number }>
  discoveredSubzones: string[]
}

const props = defineProps<Props>()

// Monster display info (would come from a monster database in full implementation)
const monsterInfo: Record<string, { name: string; icon: string }> = {
  forest_wolf: { name: 'Forest Wolf', icon: '🐺' },
  basic_slime: { name: 'Basic Slime', icon: '🟢' },
  woodland_sprite: { name: 'Woodland Sprite', icon: '✨' },
  elder_treant: { name: 'Elder Treant', icon: '🌳' },
  grove_guardian: { name: 'Grove Guardian', icon: '🛡️' },
  shadow_stalker: { name: 'Shadow Stalker', icon: '👤' },
  corrupted_wolf: { name: 'Corrupted Wolf', icon: '🐺' },
  blight_treant: { name: 'Blight Treant', icon: '🌲' },
  goblin_scout: { name: 'Goblin Scout', icon: '👺' },
  cave_bat: { name: 'Cave Bat', icon: '🦇' },
  goblin_shaman: { name: 'Goblin Shaman', icon: '🔮' },
  goblin_brute: { name: 'Goblin Brute', icon: '👹' },
  goblin_king: { name: 'Goblin King', icon: '👑' },
  swamp_lurker: { name: 'Swamp Lurker', icon: '🐊' },
  bog_wisp: { name: 'Bog Wisp', icon: '💫' },
  mire_toad: { name: 'Mire Toad', icon: '🐸' },
  swamp_hag: { name: 'Swamp Hag', icon: '🧙' },
  bog_horror: { name: 'Bog Horror', icon: '👾' },
}

// Check if monster is discovered (based on subzone mastery)
function isMonsterDiscovered(subzone: Subzone, monster: MonsterSpawn): boolean {
  if (!props.discoveredSubzones.includes(subzone.id)) return false
  const mastery = props.subzoneProgress[subzone.id]?.mastery ?? 0
  return mastery >= monster.requiredMastery
}

// Check if collectible is discovered
function isCollectibleDiscovered(subzone: Subzone, collectible: Collectible): boolean {
  if (!props.discoveredSubzones.includes(subzone.id)) return false
  const mastery = props.subzoneProgress[subzone.id]?.mastery ?? 0
  return mastery >= collectible.requiresMastery
}

// Get spawn type styling
function getSpawnTypeClass(spawnType: string): string {
  const classes: Record<string, string> = {
    common: 'bg-gray-700 text-gray-300',
    uncommon: 'bg-green-900/50 text-green-400',
    rare: 'bg-blue-900/50 text-blue-400',
    boss: 'bg-purple-900/50 text-purple-400',
  }
  return classes[spawnType] || classes.common
}

// Get rarity styling for collectibles
function getRarityClass(rarity: string): string {
  const classes: Record<string, string> = {
    common: 'border-gray-600 bg-gray-800',
    uncommon: 'border-green-600 bg-green-900/20',
    rare: 'border-blue-600 bg-blue-900/20',
  }
  return classes[rarity] || classes.common
}

function getRarityTextClass(rarity: string): string {
  const classes: Record<string, string> = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
  }
  return classes[rarity] || classes.common
}

// Get collectible type icon
function getCollectibleTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    material: '🧪',
    trophy: '🏆',
    both: '💎',
  }
  return icons[type] || '📦'
}

// Format percentage
function formatPercent(value: number): string {
  return (value * 100).toFixed(0) + '%'
}

// Expand/collapse state per subzone
const expandedSubzones = ref<Set<string>>(new Set())

function toggleSubzone(subzoneId: string) {
  if (expandedSubzones.value.has(subzoneId)) {
    expandedSubzones.value.delete(subzoneId)
  } else {
    expandedSubzones.value.add(subzoneId)
  }
}

// Calculate totals
const totalMonsters = computed(() => {
  return props.zone.subzones.reduce((acc, sz) => acc + sz.monsters.length, 0)
})

const discoveredMonsters = computed(() => {
  let count = 0
  for (const sz of props.zone.subzones) {
    for (const m of sz.monsters) {
      if (isMonsterDiscovered(sz, m)) count++
    }
  }
  return count
})

const totalCollectibles = computed(() => {
  return props.zone.subzones.reduce((acc, sz) => acc + sz.collectibles.length, 0)
})

const discoveredCollectibles = computed(() => {
  let count = 0
  for (const sz of props.zone.subzones) {
    for (const c of sz.collectibles) {
      if (isCollectibleDiscovered(sz, c)) count++
    }
  }
  return count
})
</script>

<template>
  <div>
    <!-- Summary Stats -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <span class="text-2xl">👾</span>
          <div>
            <div class="text-sm text-gray-400">Monsters</div>
            <div class="text-lg font-semibold text-white">
              {{ discoveredMonsters }} / {{ totalMonsters }}
              <span class="text-sm text-gray-500">discovered</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-800 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🧪</span>
          <div>
            <div class="text-sm text-gray-400">Collectibles</div>
            <div class="text-lg font-semibold text-white">
              {{ discoveredCollectibles }} / {{ totalCollectibles }}
              <span class="text-sm text-gray-500">discovered</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- By Subzone -->
    <div class="space-y-4">
      <div
        v-for="subzone in zone.subzones"
        :key="subzone.id"
        class="bg-gray-800 rounded-lg overflow-hidden"
      >
        <!-- Subzone Header -->
        <button
          class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-750 transition-colors"
          :class="{ 'opacity-50': !discoveredSubzones.includes(subzone.id) }"
          @click="toggleSubzone(subzone.id)"
        >
          <div class="flex items-center gap-3">
            <span v-if="discoveredSubzones.includes(subzone.id)" class="text-xl">
              {{ expandedSubzones.has(subzone.id) ? '▼' : '▶' }}
            </span>
            <span v-else class="text-xl text-gray-600">🔒</span>
            <span class="font-medium text-white">
              {{ discoveredSubzones.includes(subzone.id) ? subzone.name : '???' }}
            </span>
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-400">
            <span>{{ subzone.monsters.length }} monsters</span>
            <span>{{ subzone.collectibles.length }} collectibles</span>
          </div>
        </button>

        <!-- Expanded Content -->
        <div
          v-if="expandedSubzones.has(subzone.id) && discoveredSubzones.includes(subzone.id)"
          class="px-4 pb-4 border-t border-gray-700"
        >
          <!-- Monsters Section -->
          <div class="mt-4">
            <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Monsters
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="monster in subzone.monsters"
                :key="monster.monsterId"
                class="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50"
                :class="{ 'opacity-40': !isMonsterDiscovered(subzone, monster) }"
              >
                <!-- Monster Icon or Silhouette -->
                <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-2xl">
                  <template v-if="isMonsterDiscovered(subzone, monster)">
                    {{ monsterInfo[monster.monsterId]?.icon || '❓' }}
                  </template>
                  <template v-else>
                    <span class="text-gray-600">?</span>
                  </template>
                </div>

                <!-- Monster Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-white truncate">
                      {{ isMonsterDiscovered(subzone, monster)
                        ? (monsterInfo[monster.monsterId]?.name || monster.monsterId)
                        : '???'
                      }}
                    </span>
                    <span
                      :class="['px-2 py-0.5 text-xs rounded', getSpawnTypeClass(monster.spawnType)]"
                    >
                      {{ monster.spawnType }}
                    </span>
                  </div>
                  <div v-if="isMonsterDiscovered(subzone, monster)" class="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>Spawn: {{ formatPercent(monster.baseSpawnChance) }}</span>
                    <span>Capture: {{ formatPercent(monster.baseCaptureChance) }}</span>
                    <span>Power: {{ monster.power }}</span>
                  </div>
                  <div v-else class="text-xs text-gray-600 mt-1">
                    Requires {{ monster.requiredMastery }}% mastery
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Collectibles Section -->
          <div class="mt-6">
            <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Collectibles
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="collectible in subzone.collectibles"
                :key="collectible.id"
                class="flex items-center gap-3 p-3 rounded-lg border"
                :class="[
                  getRarityClass(collectible.rarity),
                  { 'opacity-40': !isCollectibleDiscovered(subzone, collectible) }
                ]"
              >
                <!-- Type Icon -->
                <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-900/50 text-2xl">
                  <template v-if="isCollectibleDiscovered(subzone, collectible)">
                    {{ getCollectibleTypeIcon(collectible.type) }}
                  </template>
                  <template v-else>
                    <span class="text-gray-600">?</span>
                  </template>
                </div>

                <!-- Collectible Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-white truncate">
                      {{ isCollectibleDiscovered(subzone, collectible) ? collectible.name : '???' }}
                    </span>
                    <span :class="['text-xs', getRarityTextClass(collectible.rarity)]">
                      {{ collectible.rarity }}
                    </span>
                  </div>
                  <div v-if="isCollectibleDiscovered(subzone, collectible)" class="text-xs text-gray-500 mt-1 line-clamp-1">
                    {{ collectible.description }}
                  </div>
                  <div v-else class="text-xs text-gray-600 mt-1">
                    Requires {{ collectible.requiresMastery }}% mastery
                  </div>
                </div>

                <!-- Drop Chance -->
                <div
                  v-if="isCollectibleDiscovered(subzone, collectible)"
                  class="text-xs text-gray-500"
                >
                  {{ formatPercent(collectible.dropChance) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="zone.subzones.length === 0"
      class="bg-gray-800 rounded-lg p-8 text-center"
    >
      <div class="text-4xl mb-4">🔍</div>
      <p class="text-gray-400">No discoverables found in this zone</p>
    </div>
  </div>
</template>

<style scoped>
.bg-gray-750 {
  background-color: rgb(55, 55, 65);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
