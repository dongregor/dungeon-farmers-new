<script setup lang="ts">
import { useHeroStore } from '~/stores/heroes'
import { useInventoryStore } from '~/stores/inventory'
import { useExpeditionStore } from '~/stores/expeditions'
import { storeToRefs } from 'pinia'
import { getArchetypeById, TAG_INFO, type ArchetypeTag } from '~~/types/archetypes'
import { getGameplayTraitById } from '~/data/gameplayTraits'
import { getStoryTraitById } from '~/data/storyTraits'
import { getCultureInfo } from '~/data/cultures'
import type { EquipmentSlot } from '~~/types'

definePageMeta({
  title: 'Hero Detail',
})

const route = useRoute()
const router = useRouter()
const heroId = route.params.id as string

// Stores
const heroStore = useHeroStore()
const inventoryStore = useInventoryStore()
const expeditionStore = useExpeditionStore()

const { heroes, loading: heroLoading } = storeToRefs(heroStore)
const { inventory } = storeToRefs(inventoryStore)
const { activeExpeditions } = storeToRefs(expeditionStore)

// Track if initial fetch has been attempted
const hasFetched = ref(false)

// Fetch data
onMounted(async () => {
  if (heroes.value.length === 0) {
    await heroStore.fetchHeroes()
  }
  if (inventory.value.length === 0) {
    await inventoryStore.fetchInventory()
  }
  hasFetched.value = true
})

// Get hero
const hero = computed(() => heroStore.getHeroById(heroId))

// Redirect if hero not found after loading completes
watch([hero, heroLoading, hasFetched], ([heroValue, loading, fetched]) => {
  if (fetched && !loading && !heroValue) {
    router.push('/heroes')
  }
})

// Hero metadata
const archetype = computed(() => hero.value ? getArchetypeById(hero.value.archetype) : null)
const culture = computed(() => hero.value ? getCultureInfo(hero.value.culture) : null)

// Status
const status = computed(() => {
  if (!hero.value) return 'idle'
  if (hero.value.isOnExpedition) return 'on_expedition'
  if (hero.value.isStationed) return 'stationed'
  return 'idle'
})

const statusLabel = computed(() => {
  switch (status.value) {
    case 'on_expedition':
      return 'On Expedition'
    case 'stationed':
      return 'Stationed'
    default:
      return 'Idle'
  }
})

const statusColor = computed(() => {
  switch (status.value) {
    case 'on_expedition':
      return 'text-blue-600 bg-blue-100 border-blue-300'
    case 'stationed':
      return 'text-purple-600 bg-purple-100 border-purple-300'
    default:
      return 'text-green-600 bg-green-100 border-green-300'
  }
})

// Current expedition
const currentExpedition = computed(() => {
  if (!hero.value?.currentExpeditionId) return null
  return expeditionStore.getExpeditionById(hero.value.currentExpeditionId)
})

// Equipment
const equippedItems = computed(() => {
  if (!hero.value) return {}
  return inventory.value
    .filter(item => item.equippedBy === hero.value!.id)
    .reduce((acc, item) => {
      acc[item.slot] = item
      return acc
    }, {} as Record<string, any>)
})

const equipmentSlots: EquipmentSlot[] = ['weapon', 'head', 'chest', 'hands', 'legs', 'feet', 'accessory']

// Can prestige?
const canPrestige = computed(() => {
  return hero.value && hero.value.level >= 60
})

// Power breakdown
const powerBreakdown = computed(() => {
  if (!hero.value) return null

  const basePower = hero.value.baseStats.combat + hero.value.baseStats.utility + hero.value.baseStats.survival
  const levelPower = hero.value.level * 2
  const equipmentPower = Object.values(equippedItems.value).reduce((sum: number, item: any) => {
    return sum + (item?.gearScore || 0)
  }, 0)
  const traitPower = hero.value.gameplayTraits.reduce((sum, trait) => {
    const def = getGameplayTraitById(trait.traitId)
    return def && !def.isNegative ? sum + trait.rolledValue : sum
  }, 0)
  const prestigePower = hero.value.prestigeBonuses ?
    (hero.value.prestigeBonuses.combat + hero.value.prestigeBonuses.utility + hero.value.prestigeBonuses.survival) : 0

  return {
    base: basePower,
    level: levelPower,
    equipment: equipmentPower,
    traits: traitPower,
    prestige: prestigePower,
    total: hero.value.power
  }
})

// Formatted traits for TraitDisplay
const formattedGameplayTraits = computed(() => {
  if (!hero.value) return []

  return hero.value.gameplayTraits.map(trait => {
    const def = getGameplayTraitById(trait.traitId)
    return {
      name: def?.name || trait.traitId,
      description: def?.description.replace('{value}', trait.rolledValue.toString()) || '',
      type: def?.isNegative ? 'debuff' : 'buff'
    }
  })
})

const formattedStoryTraits = computed(() => {
  if (!hero.value) return []

  return hero.value.storyTraitIds.map(traitId => {
    const def = getStoryTraitById(traitId)
    return {
      name: def?.name || traitId,
      description: def?.description || '',
      type: 'neutral' as const
    }
  })
})

// Format threat ID to readable name
function formatThreatName(threatId: string): string {
  return threatId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Formatted abilities (archetype tags) with counters
const formattedAbilities = computed(() => {
  if (!hero.value) return []

  return (hero.value.archetypeTags || []).map(tagId => {
    const tagData = TAG_INFO[tagId as ArchetypeTag]
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

// Modals
const showRetirementModal = ref(false)
const showPrestigeModal = ref(false)
const confirmingRelease = ref(false)

// Actions
async function handlePrestige() {
  showPrestigeModal.value = true
}

function handleRelease() {
  confirmingRelease.value = true
}

async function confirmRelease() {
  if (!hero.value) return
  try {
    await heroStore.retireHero(hero.value.id)
    router.push('/heroes')
  } catch (error) {
    console.error('Failed to release hero:', error)
  }
}

function viewExpedition() {
  if (currentExpedition.value) {
    router.push(`/expeditions`)
  }
}

function sendOnExpedition() {
  router.push(`/expeditions?hero=${heroId}`)
}

function manageEquipment() {
  router.push(`/inventory?hero=${heroId}`)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Loading State -->
    <div v-if="heroLoading && !hero" class="flex items-center justify-center py-12">
      <UtilityLoadingSpinner size="lg" />
    </div>

    <!-- Hero Detail -->
    <div v-else-if="hero">
      <!-- Page Header with Portrait -->
      <div class="flex gap-6 mb-6">
        <!-- Large Hero Portrait -->
        <HeroPortrait :hero="hero" size="xl" class="flex-shrink-0" />

        <div class="flex-1">
          <NavigationPageHeader
            :title="hero.name"
            :subtitle="`${archetype?.name || hero.archetype} • ${culture?.name || hero.culture}`"
            :back-link="'/heroes'"
          >
            <template #meta>
              <div class="flex flex-wrap items-center gap-3 mt-2">
                <DisplayRarityBadge :rarity="hero.rarity" size="md" />
                <div
                  class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border"
                  :class="statusColor"
                >
                  <span class="w-2 h-2 rounded-full bg-current" />
                  {{ statusLabel }}
                </div>
                <div v-if="hero.prestigeLevel > 0" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                  <span>⭐</span>
                  <span>Prestige {{ hero.prestigeLevel }}</span>
                </div>
              </div>
            </template>
            <template #actions>
              <DisplayPowerScore
                :value="hero.power"
                :breakdown="powerBreakdown"
                size="lg"
              />
            </template>
          </NavigationPageHeader>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Hero Info & Stats -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Level & XP Card -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Progress</h2>
            <ProgressXPProgressBar
              :current-x-p="hero.xp"
              :required-x-p="hero.xpToNextLevel"
              :level="hero.level"
              :max-level="60"
              :show-milestones="true"
              size="lg"
            />

            <div v-if="canPrestige" class="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-center">
              <p class="text-yellow-800 font-semibold mb-2">👑 This hero can prestige!</p>
              <p class="text-sm text-yellow-700">Reset to level 1 and gain permanent stat bonuses</p>
            </div>
          </div>

          <!-- Stats Card -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Stats</h2>
            <div class="space-y-4">
              <DisplayStatBar
                stat="Combat"
                :value="hero.baseStats.combat"
                :max="50"
                color="red"
                size="md"
              />
              <DisplayStatBar
                stat="Utility"
                :value="hero.baseStats.utility"
                :max="50"
                color="blue"
                size="md"
              />
              <DisplayStatBar
                stat="Survival"
                :value="hero.baseStats.survival"
                :max="50"
                color="green"
                size="md"
              />
            </div>

            <!-- Power Breakdown -->
            <div v-if="powerBreakdown" class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Power Breakdown</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Base Stats</span>
                  <span class="font-mono text-gray-900">{{ powerBreakdown.base }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Level Bonus</span>
                  <span class="font-mono text-gray-900">+{{ powerBreakdown.level }}</span>
                </div>
                <div v-if="powerBreakdown.equipment > 0" class="flex justify-between">
                  <span class="text-gray-600">Equipment</span>
                  <span class="font-mono text-gray-900">+{{ powerBreakdown.equipment }}</span>
                </div>
                <div v-if="powerBreakdown.traits > 0" class="flex justify-between">
                  <span class="text-gray-600">Traits</span>
                  <span class="font-mono text-gray-900">+{{ powerBreakdown.traits }}</span>
                </div>
                <div v-if="powerBreakdown.prestige > 0" class="flex justify-between">
                  <span class="text-gray-600">Prestige Bonuses</span>
                  <span class="font-mono text-gray-900">+{{ powerBreakdown.prestige }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                  <span class="text-gray-900">Total Power</span>
                  <span class="font-mono text-orange-600">{{ powerBreakdown.total }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Abilities Card -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Abilities</h2>

            <div v-if="formattedAbilities.length > 0" class="space-y-3">
              <div
                v-for="ability in formattedAbilities"
                :key="ability.id"
                class="bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-semibold text-blue-900">{{ ability.name }}</h3>
                    <p class="text-sm text-blue-700">{{ ability.description }}</p>
                  </div>
                </div>
                <div v-if="ability.counters.length > 0" class="mt-2 pt-2 border-t border-blue-200">
                  <span class="text-xs font-medium text-green-700">Counters:</span>
                  <span class="text-xs text-green-600 ml-1">{{ ability.counters.join(', ') }}</span>
                </div>
              </div>
            </div>

            <div v-else>
              <UtilityEmptyState
                title="No Abilities"
                description="This hero has no special abilities."
              >
                <template #icon>
                  <span class="text-6xl">⚔️</span>
                </template>
              </UtilityEmptyState>
            </div>
          </div>

          <!-- Traits Card -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Traits</h2>

            <!-- Gameplay Traits -->
            <div v-if="formattedGameplayTraits.length > 0" class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Gameplay Traits</h3>
              <div class="flex flex-wrap gap-3">
                <DisplayTraitDisplay
                  v-for="(trait, index) in formattedGameplayTraits"
                  :key="index"
                  :trait="trait"
                  :active="true"
                />
              </div>
            </div>

            <!-- Story Traits -->
            <div v-if="formattedStoryTraits.length > 0">
              <h3 class="text-sm font-semibold text-gray-700 mb-3">Story Traits</h3>
              <div class="flex flex-wrap gap-3">
                <DisplayTraitDisplay
                  v-for="(trait, index) in formattedStoryTraits"
                  :key="index"
                  :trait="trait"
                  :active="true"
                  compact
                />
              </div>
            </div>

            <!-- No traits -->
            <div v-if="formattedGameplayTraits.length === 0 && formattedStoryTraits.length === 0">
              <UtilityEmptyState
                title="No Traits"
                description="This hero has no special traits yet."
              >
                <template #icon>
                  <span class="text-6xl">✨</span>
                </template>
              </UtilityEmptyState>
            </div>
          </div>
        </div>

        <!-- Right Column: Equipment & Actions -->
        <div class="space-y-6">
          <!-- Equipment Card -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">Equipment</h2>
              <FormBaseButton
                variant="ghost"
                size="sm"
                @click="manageEquipment"
              >
                Manage
              </FormBaseButton>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <EquipmentSlot
                v-for="slot in equipmentSlots"
                :key="slot"
                :slot="slot"
                :equipment="equippedItems[slot]"
                :clickable="false"
              />
            </div>

            <!-- Equipment Stats Summary -->
            <div v-if="Object.keys(equippedItems).length > 0" class="mt-4 pt-4 border-t border-gray-200">
              <div class="text-sm text-gray-600">
                <div class="flex justify-between mb-1">
                  <span>Equipped Items</span>
                  <span class="font-semibold text-gray-900">{{ Object.keys(equippedItems).length }} / {{ equipmentSlots.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Total Gear Score</span>
                  <span class="font-semibold text-orange-600">{{ powerBreakdown?.equipment || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Card -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Actions</h2>

            <div class="space-y-3">
              <!-- Expedition Actions -->
              <FormBaseButton
                v-if="status === 'idle'"
                variant="primary"
                size="md"
                class="w-full"
                @click="sendOnExpedition"
              >
                <span class="flex items-center justify-center gap-2">
                  <span>🗺️</span>
                  <span>Send on Expedition</span>
                </span>
              </FormBaseButton>

              <FormBaseButton
                v-else-if="status === 'on_expedition'"
                variant="secondary"
                size="md"
                class="w-full"
                @click="viewExpedition"
              >
                <span class="flex items-center justify-center gap-2">
                  <span>👁️</span>
                  <span>View Expedition</span>
                </span>
              </FormBaseButton>

              <FormBaseButton
                v-else-if="status === 'stationed'"
                variant="secondary"
                size="md"
                class="w-full"
                disabled
              >
                <span class="flex items-center justify-center gap-2">
                  <span>⚔️</span>
                  <span>Currently Stationed</span>
                </span>
              </FormBaseButton>

              <!-- Prestige Action -->
              <FormBaseButton
                v-if="canPrestige && status === 'idle'"
                variant="primary"
                size="md"
                class="w-full bg-yellow-500 hover:bg-yellow-600"
                @click="handlePrestige"
              >
                <span class="flex items-center justify-center gap-2">
                  <span>👑</span>
                  <span>Prestige Hero</span>
                </span>
              </FormBaseButton>

              <!-- Release Action -->
              <FormBaseButton
                v-if="status === 'idle'"
                variant="danger"
                size="md"
                class="w-full"
                @click="handleRelease"
              >
                <span class="flex items-center justify-center gap-2">
                  <span>🚪</span>
                  <span>Release Hero</span>
                </span>
              </FormBaseButton>
            </div>
          </div>

          <!-- Morale Card -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Morale</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Current State</span>
                <span class="text-sm font-semibold capitalize" :class="{
                  'text-green-600': hero.morale === 'excited',
                  'text-blue-600': hero.morale === 'content',
                  'text-yellow-600': hero.morale === 'tired',
                  'text-orange-600': hero.morale === 'frustrated',
                  'text-red-600': hero.morale === 'exhausted',
                }">
                  {{ hero.morale }}
                </span>
              </div>

              <!-- Morale Bar -->
              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="{
                    'bg-green-500': hero.morale === 'excited',
                    'bg-blue-500': hero.morale === 'content',
                    'bg-yellow-500': hero.morale === 'tired',
                    'bg-orange-500': hero.morale === 'frustrated',
                    'bg-red-500': hero.morale === 'exhausted',
                  }"
                  :style="{ width: `${hero.moraleValue}%` }"
                />
              </div>

              <p class="text-xs text-gray-500">
                Morale affects expedition success rate and log reactions
              </p>
            </div>
          </div>

          <!-- Hero Info Card -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Info</h2>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-600">Gender</dt>
                <dd class="font-medium text-gray-900 capitalize">{{ hero.gender }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Culture</dt>
                <dd class="font-medium text-gray-900">{{ culture?.name }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Archetype</dt>
                <dd class="font-medium text-gray-900">{{ archetype?.name }}</dd>
              </div>
              <div v-if="hero.displayTitle" class="flex justify-between">
                <dt class="text-gray-600">Title</dt>
                <dd class="font-medium text-yellow-700">{{ hero.displayTitle }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Recruited</dt>
                <dd class="font-medium text-gray-900">{{ new Date(hero.createdAt).toLocaleDateString() }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <HeroPrestigeModal
      v-if="showPrestigeModal && hero"
      :hero="hero"
      @close="showPrestigeModal = false"
    />

    <ModalsConfirmationDialog
      v-model="confirmingRelease"
      title="Release Hero?"
      :message="`Are you sure you want to release ${hero?.name}? This action cannot be undone.`"
      confirm-text="Release"
      variant="danger"
      @confirm="confirmRelease"
    />
  </div>
</template>
