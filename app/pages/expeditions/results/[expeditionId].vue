<script setup lang="ts">
import { useExpeditionStore } from '~/stores/expeditions'
import { useZoneStore } from '~/stores/zones'
import { useHeroStore } from '~/stores/heroes'
import { useInventoryStore } from '~/stores/inventory'
import { storeToRefs } from 'pinia'
import type { Equipment } from '~~/types'

definePageMeta({
  title: 'Expedition Results',
})

const route = useRoute()
const router = useRouter()

// Stores
const expeditionStore = useExpeditionStore()
const zoneStore = useZoneStore()
const heroStore = useHeroStore()
const inventoryStore = useInventoryStore()

// State
const isStartingNew = ref(false)
const showFullLog = ref(true) // Default to expanded

// Get expedition ID from route
const expeditionId = computed(() => route.params.expeditionId as string)

// Get expedition data
const expedition = computed(() => expeditionStore.getExpeditionById(expeditionId.value))

// Get zone and subzone data
const zone = computed(() => {
  if (!expedition.value) return null
  return zoneStore.getZoneById(expedition.value.zoneId)
})

const subzone = computed(() => {
  if (!expedition.value || !zone.value) return null
  return zone.value.subzones.find(sz => sz.id === expedition.value.subzoneId)
})

// Get heroes who participated
const expeditionHeroes = computed(() => {
  if (!expedition.value) return []
  return expedition.value.heroIds
    .map(id => heroStore.getHeroById(id))
    .filter(Boolean)
})

// Get equipment items from rewards
const lootItems = computed<Equipment[]>(() => {
  if (!expedition.value?.rewards?.equipment) return []
  return expedition.value.rewards.equipment
    .map(id => inventoryStore.getEquipmentById(id))
    .filter(Boolean) as Equipment[]
})

// Categorize loot by rarity
const epicPlusLoot = computed(() =>
  lootItems.value.filter(item =>
    ['epic', 'legendary', 'mythic'].includes(item.rarity)
  )
)

const commonLoot = computed(() =>
  lootItems.value.filter(item => item.rarity === 'common')
)

// Check if expedition is completed
const isCompleted = computed(() => expedition.value?.status === 'completed')

// Efficiency display (already stored as percentage 60-150)
const efficiencyPercent = computed(() => {
  if (!expedition.value?.efficiency) return 100
  return Math.round(expedition.value.efficiency)
})

const efficiencyColor = computed(() => {
  const eff = efficiencyPercent.value
  if (eff >= 130) return 'text-purple-600'
  if (eff >= 110) return 'text-green-600'
  if (eff >= 90) return 'text-blue-600'
  if (eff >= 70) return 'text-yellow-600'
  return 'text-red-600'
})

// Duration display
const durationDisplay = computed(() => {
  if (!expedition.value) return ''
  const minutes = expedition.value.durationMinutes
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
})

// Load data on mount
onMounted(async () => {
  // Fetch all needed data in parallel
  await Promise.all([
    expeditionStore.fetchExpeditions(),
    heroStore.fetchHeroes(),
    inventoryStore.fetchInventory(),
    zoneStore.initialize(),
  ])
})

// Actions
const runAgain = async () => {
  if (!expedition.value || isStartingNew.value) return

  isStartingNew.value = true
  try {
    // Start new expedition with same parameters
    await expeditionStore.startExpedition({
      zoneId: expedition.value.zoneId,
      subzoneId: expedition.value.subzoneId,
      heroIds: expedition.value.heroIds,
    })

    // Navigate to expeditions page
    router.push('/expeditions')
  } catch (error) {
    console.error('Failed to start new expedition:', error)
    alert('Failed to start new expedition. Please try again.')
  } finally {
    isStartingNew.value = false
  }
}

const returnToHub = () => {
  router.push('/expeditions')
}

const viewHero = (heroId: string) => {
  router.push(`/heroes/${heroId}`)
}

const equipItem = async (itemId: string) => {
  // This would open an equip modal or navigate to inventory
  router.push(`/inventory?highlight=${itemId}`)
}

const sellAllCommon = async () => {
  if (commonLoot.value.length === 0) return

  if (!confirm(`Sell all ${commonLoot.value.length} common items?`)) {
    return
  }

  try {
    // Delete all common items
    for (const item of commonLoot.value) {
      await inventoryStore.deleteItem(item.id)
    }
    alert(`Sold ${commonLoot.value.length} common items!`)
  } catch (error) {
    console.error('Failed to sell items:', error)
    alert('Failed to sell items. Please try again.')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Loading State -->
    <div v-if="!expedition" class="text-center py-12">
      <UtilityLoadingSpinner />
      <p class="text-gray-600 mt-4">Loading expedition results...</p>
    </div>

    <!-- Expedition Not Found -->
    <div v-else-if="!isCompleted" class="text-center py-12">
      <div class="text-6xl mb-4">⚠️</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Expedition Not Completed</h1>
      <p class="text-gray-600 mb-6">This expedition is still in progress or has not been found.</p>
      <FormBaseButton @click="returnToHub">Return to Expeditions</FormBaseButton>
    </div>

    <!-- Results Display -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <NavigationPageHeader
        :title="`${zone?.name || 'Expedition'} - ${subzone?.name || 'Complete'}`"
        subtitle="Expedition Complete!"
        back-link="/expeditions"
      >
        <template #meta>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              ✓ Completed
            </span>
            <span class="text-sm text-gray-600">{{ durationDisplay }}</span>
          </div>
        </template>
      </NavigationPageHeader>

      <!-- Summary Banner -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Efficiency -->
          <div class="text-center">
            <div class="text-3xl font-bold" :class="efficiencyColor">
              {{ efficiencyPercent }}%
            </div>
            <div class="text-sm opacity-90">Efficiency</div>
          </div>

          <!-- Gold -->
          <div class="text-center">
            <div class="text-3xl font-bold">
              <EconomyCurrencyDisplay
                :amount="expedition.rewards?.gold || 0"
                type="gold"
                size="lg"
              />
            </div>
            <div class="text-sm opacity-90">Gold Earned</div>
          </div>

          <!-- XP -->
          <div class="text-center">
            <div class="text-3xl font-bold">
              {{ expedition.rewards?.xp || 0 }}
            </div>
            <div class="text-sm opacity-90">XP per Hero</div>
          </div>

          <!-- Duration -->
          <div class="text-center">
            <div class="text-3xl font-bold">{{ durationDisplay }}</div>
            <div class="text-sm opacity-90">Duration</div>
          </div>
        </div>
      </div>

      <!-- Team Display -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Party Members</h2>

        <!-- Empty state -->
        <div v-if="expeditionHeroes.length === 0" class="text-center py-8 text-gray-500">
          <p>No hero data available</p>
          <p class="text-sm mt-1">Hero IDs: {{ expedition.heroIds?.join(', ') || 'none' }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="hero in expeditionHeroes"
            :key="hero.id"
            class="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
            @click="viewHero(hero.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="text-lg font-bold text-gray-800">{{ hero.name }}</h3>
                <p class="text-sm text-gray-600">Level {{ hero.level }}</p>
              </div>
              <DisplayRarityBadge :rarity="hero.rarity" size="sm" />
            </div>

            <!-- XP Gained -->
            <div class="bg-blue-50 rounded-lg p-3 mb-2">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-blue-800">
                  +{{ expedition.rewards?.xp || 0 }} XP
                </span>
                <span class="text-xs text-blue-600">{{ hero.xp }}/{{ hero.xpToNextLevel }}</span>
              </div>
              <div class="w-full bg-blue-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all"
                  :style="`width: ${Math.min((hero.xp / hero.xpToNextLevel) * 100, 100)}%`"
                />
              </div>
            </div>

            <!-- Level Up Badge (if applicable) -->
            <div v-if="hero.xp >= hero.xpToNextLevel" class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-2 text-center font-bold animate-pulse">
              🎉 LEVEL UP! 🎉
            </div>

            <button
              class="w-full mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              @click.stop="viewHero(hero.id)"
            >
              View Hero →
            </button>
          </div>
        </div>
      </div>

      <!-- Loot Section -->
      <div v-if="lootItems.length > 0" class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            Loot ({{ lootItems.length }} items)
          </h2>
          <div class="flex gap-2">
            <FormBaseButton
              v-if="commonLoot.length > 0"
              variant="secondary"
              size="sm"
              @click="sellAllCommon"
            >
              Sell All Common ({{ commonLoot.length }})
            </FormBaseButton>
          </div>
        </div>

        <!-- Epic+ Items (Special Display) -->
        <div v-if="epicPlusLoot.length > 0" class="mb-6">
          <h3 class="text-lg font-semibold text-purple-600 mb-3 flex items-center gap-2">
            <span class="animate-pulse">✨</span>
            Rare Finds
            <span class="animate-pulse">✨</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in epicPlusLoot"
              :key="item.id"
              class="transform hover:scale-105 transition-transform"
            >
              <EquipmentCard
                :equipment="item"
                :show-details="true"
                clickable
                @click="equipItem(item.id)"
              />
            </div>
          </div>
        </div>

        <!-- All Items Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="item in lootItems" :key="item.id">
            <EquipmentCard
              :equipment="item"
              clickable
              @click="equipItem(item.id)"
            />
          </div>
        </div>
      </div>

      <!-- No Loot -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="text-4xl mb-2">🎒</div>
        <p class="text-gray-600">No equipment drops this time</p>
      </div>

      <!-- Monster Captures (Future Feature) -->
      <!-- This section will be uncommented when monster system is implemented -->
      <!--
      <div v-if="expedition.rewards?.monsters?.length > 0" class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          Monster Captures
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CollectionMonster
            v-for="monster in expedition.rewards.monsters"
            :key="monster.id"
            :monster="monster"
          />
        </div>
      </div>
      -->

      <!-- Expedition Log -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          @click="showFullLog = !showFullLog"
        >
          <h2 class="text-2xl font-bold text-gray-800">Expedition Log</h2>
          <svg
            class="w-6 h-6 transform transition-transform"
            :class="{ 'rotate-180': showFullLog }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-show="showFullLog" class="p-6 pt-0">
          <ExpeditionLog
            v-if="expedition.log && expedition.log.sections"
            :log="expedition.log"
            :heroes="expeditionHeroes"
            :rewards="expedition.rewards"
          />
          <div v-else class="text-center text-gray-500 py-8">
            <p>No expedition log available</p>
            <p class="text-xs mt-2">Log exists: {{ !!expedition.log }}</p>
            <p class="text-xs">Sections: {{ expedition.log?.sections?.length ?? 'none' }}</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pb-8">
        <FormBaseButton
          variant="primary"
          size="lg"
          :disabled="isStartingNew"
          @click="runAgain"
        >
          <span v-if="isStartingNew">Starting...</span>
          <span v-else>🔄 Run Again</span>
        </FormBaseButton>

        <FormBaseButton
          variant="secondary"
          size="lg"
          @click="returnToHub"
        >
          ← Return to Expeditions
        </FormBaseButton>
      </div>

      <!-- Rewards Applied Message -->
      <div class="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
        <p class="text-green-800 font-semibold">
          ✓ Rewards applied! Gold added and heroes gained XP.
        </p>
      </div>
    </div>
  </div>
</template>
