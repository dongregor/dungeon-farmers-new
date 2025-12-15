<script setup lang="ts">
import type { Hero } from '~~/types'

interface Props {
  hero: Hero
  availableHeroes: Hero[]
  expeditionCount?: number
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm', data: { selectedTraitId: string | null; recipientHeroId: string | null }): void
}

const props = withDefaults(defineProps<Props>(), {
  expeditionCount: 0,
})

const emit = defineEmits<Emits>()

const selectedTraitId = ref<string | null>(null)
const selectedRecipientId = ref<string | null>(null)
const showTraitSelection = ref(false)
const showRecipientSelection = ref(false)

// Rarity multipliers
const RARITY_MULTIPLIERS: Record<string, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
}

// Calculate retirement gold
const retirementGold = computed(() => {
  const baseGold = props.hero.level * 10
  const rarityMultiplier = RARITY_MULTIPLIERS[props.hero.rarity] || 1
  const prestigeBonus = props.hero.prestigeLevel * 50
  const expeditionBonus = props.expeditionCount

  return (baseGold * rarityMultiplier) + prestigeBonus + expeditionBonus
})

// Get available story traits
const availableTraits = computed(() => {
  return props.hero.storyTraitIds || []
})

const hasStoryTraits = computed(() => availableTraits.value.length > 0)

// Get eligible recipient heroes (all except retiring hero)
const eligibleRecipients = computed(() => {
  return props.availableHeroes.filter(h => h.id !== props.hero.id)
})

const selectedRecipient = computed(() => {
  if (!selectedRecipientId.value) return null
  return eligibleRecipients.value.find(h => h.id === selectedRecipientId.value)
})

const handleClose = () => {
  resetSelections()
  emit('close')
}

const handleConfirm = () => {
  if (hasStoryTraits.value && !selectedTraitId.value) {
    alert('Please select a story trait to transfer (or skip if you don\'t want to transfer)')
    return
  }

  if (selectedTraitId.value && !selectedRecipientId.value) {
    alert('Please select a hero to receive the story trait')
    return
  }

  if (!confirm(`Are you sure you want to retire ${props.hero.name}? This cannot be undone.`)) {
    return
  }

  emit('confirm', {
    selectedTraitId: selectedTraitId.value,
    recipientHeroId: selectedRecipientId.value,
  })

  resetSelections()
}

const resetSelections = () => {
  selectedTraitId.value = null
  selectedRecipientId.value = null
  showTraitSelection.value = false
  showRecipientSelection.value = false
}

const handleSelectTrait = (traitId: string) => {
  selectedTraitId.value = traitId
  showTraitSelection.value = false
  showRecipientSelection.value = true
}

const handleSkipTrait = () => {
  selectedTraitId.value = null
  selectedRecipientId.value = null
  showTraitSelection.value = false
}

const handleSelectRecipient = (heroId: string) => {
  selectedRecipientId.value = heroId
  showRecipientSelection.value = false
}

const startRetirement = () => {
  if (hasStoryTraits.value) {
    showTraitSelection.value = true
  } else {
    // No traits to transfer, proceed directly
    handleConfirm()
  }
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
      <!-- Main retirement screen -->
      <div v-if="!showTraitSelection && !showRecipientSelection">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="text-6xl mb-2">👋</div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            Retire Hero
          </h2>
          <p class="text-lg text-gray-600">
            {{ hero.name }}
          </p>
        </div>

        <!-- Hero summary -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-gray-600">Level</div>
              <div class="font-bold text-gray-800">{{ hero.level }}</div>
            </div>
            <div>
              <div class="text-gray-600">Rarity</div>
              <div class="font-bold text-gray-800 capitalize">{{ hero.rarity }}</div>
            </div>
            <div>
              <div class="text-gray-600">Prestige</div>
              <div class="font-bold text-gray-800">{{ hero.prestigeLevel }}</div>
            </div>
            <div>
              <div class="text-gray-600">Expeditions</div>
              <div class="font-bold text-gray-800">{{ expeditionCount }}</div>
            </div>
          </div>
        </div>

        <!-- Retirement rewards -->
        <div class="mb-6">
          <h3 class="font-bold text-gray-800 mb-3">Retirement Rewards</h3>

          <div class="bg-yellow-50 rounded-lg p-4 mb-4">
            <div class="text-center">
              <div class="text-4xl mb-2">💰</div>
              <div class="text-3xl font-bold text-yellow-600">
                {{ retirementGold }} Gold
              </div>
            </div>

            <!-- Breakdown -->
            <div class="mt-4 pt-4 border-t border-yellow-200 space-y-1 text-sm">
              <div class="flex justify-between text-gray-700">
                <span>Base (Level {{ hero.level }})</span>
                <span>{{ hero.level * 10 }} gold</span>
              </div>
              <div class="flex justify-between text-gray-700">
                <span>Rarity ({{ hero.rarity }})</span>
                <span>×{{ RARITY_MULTIPLIERS[hero.rarity] }}</span>
              </div>
              <div v-if="hero.prestigeLevel > 0" class="flex justify-between text-gray-700">
                <span>Prestige Bonus</span>
                <span>+{{ hero.prestigeLevel * 50 }} gold</span>
              </div>
              <div v-if="expeditionCount > 0" class="flex justify-between text-gray-700">
                <span>Expeditions</span>
                <span>+{{ expeditionCount }} gold</span>
              </div>
            </div>
          </div>

          <!-- Story trait transfer -->
          <div v-if="hasStoryTraits" class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start gap-2">
              <span class="text-2xl">📖</span>
              <div>
                <div class="font-medium text-blue-800 mb-1">Story Trait Transfer</div>
                <div class="text-sm text-blue-700">
                  You can transfer one story trait to another hero before retirement.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Warning -->
        <div class="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
          <div class="flex items-start gap-2">
            <span class="text-2xl">⚠️</span>
            <div>
              <div class="font-bold text-red-800">Permanent Action</div>
              <div class="text-sm text-red-700">
                Retiring this hero is permanent and cannot be undone. All equipment will be returned to inventory.
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-3">
          <button
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            @click="startRetirement"
          >
            Retire Hero
          </button>
        </div>
      </div>

      <!-- Trait selection screen -->
      <div v-else-if="showTraitSelection">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Select Story Trait to Transfer</h3>

        <div class="space-y-2 mb-6">
          <div
            v-for="traitId in availableTraits"
            :key="traitId"
            class="border-2 border-gray-300 hover:border-blue-400 rounded-lg p-3 cursor-pointer transition-all"
            @click="handleSelectTrait(traitId)"
          >
            <div class="font-medium text-gray-800">{{ traitId }}</div>
          </div>
        </div>

        <button
          class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors mb-2"
          @click="handleSkipTrait"
        >
          Skip Trait Transfer
        </button>

        <button
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 rounded-lg transition-colors"
          @click="showTraitSelection = false"
        >
          Back
        </button>
      </div>

      <!-- Recipient selection screen -->
      <div v-else-if="showRecipientSelection">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Select Recipient Hero</h3>

        <div class="bg-blue-50 rounded-lg p-3 mb-4">
          <div class="text-sm text-blue-800">
            Transferring: <span class="font-bold">{{ selectedTraitId }}</span>
          </div>
        </div>

        <div class="space-y-2 mb-6 max-h-96 overflow-y-auto">
          <div
            v-for="recipient in eligibleRecipients"
            :key="recipient.id"
            class="border-2 border-gray-300 hover:border-blue-400 rounded-lg p-3 cursor-pointer transition-all"
            @click="handleSelectRecipient(recipient.id)"
          >
            <div class="font-medium text-gray-800">{{ recipient.name }}</div>
            <div class="text-sm text-gray-600 capitalize">
              Level {{ recipient.level }} {{ recipient.rarity }} {{ recipient.archetype }}
            </div>
          </div>
        </div>

        <button
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 rounded-lg transition-colors"
          @click="showRecipientSelection = false"
        >
          Back
        </button>
      </div>
    </div>
  </div>
</template>
