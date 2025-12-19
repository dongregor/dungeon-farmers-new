<script setup lang="ts">
import { useGuildMasterStore } from '~/stores/guildMaster'
import { storeToRefs } from 'pinia'
import type { GuildMasterTraitSelection } from '~/stores/guildMaster'

definePageMeta({
  title: 'Guild Master',
})

const guildMasterStore = useGuildMasterStore()
const {
  guildMaster,
  isInitialized,
  equippedTraits,
  unequippedTraits,
  traitSlots,
  availableSlots,
  power,
  hasArchetype,
  displayStats,
} = storeToRefs(guildMasterStore)

const showTraitModal = ref(false)
const selectedSlotIndex = ref<number | null>(null)
const showArchetypeModal = ref(false)
const processing = ref(false)

onMounted(() => {
  guildMasterStore.fetchGuildMaster()
})

const handleEquipTrait = async (traitId: string) => {
  processing.value = true
  try {
    await guildMasterStore.equipTrait(traitId, selectedSlotIndex.value ?? undefined)
    showTraitModal.value = false
    selectedSlotIndex.value = null
  } catch (err: unknown) {
      const error = toError(err)
    alert(error.message)
  } finally {
    processing.value = false
  }
}

const handleUnequipTrait = async (traitId: string) => {
  processing.value = true
  try {
    await guildMasterStore.unequipTrait(traitId)
  } catch (err: unknown) {
      const error = toError(err)
    alert(error.message)
  } finally {
    processing.value = false
  }
}

const openTraitModal = (slotIndex?: number) => {
  selectedSlotIndex.value = slotIndex ?? null
  showTraitModal.value = true
}

const getRarityColor = () => {
  return 'from-purple-400 to-purple-600'
}

const getRarityBorder = () => {
  return 'border-purple-500'
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="isInitialized && guildMaster" class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div class="h-3 bg-gradient-to-r" :class="getRarityColor()" />

        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-1">{{ guildMaster.name }}</h1>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="capitalize">{{ guildMaster.gender }}</span>
                <span class="text-gray-400">•</span>
                <span class="capitalize text-purple-600 font-bold">{{ guildMaster.rarity }}</span>
                <span v-if="hasArchetype" class="text-gray-400">•</span>
                <span v-if="hasArchetype" class="capitalize">{{ guildMaster.archetype }}</span>
              </div>
            </div>

            <div class="text-right">
              <div class="text-sm text-gray-600">Level</div>
              <div class="text-3xl font-bold text-purple-600">{{ guildMaster.level }}</div>
            </div>
          </div>

          <!-- Stats -->
          <div v-if="displayStats" class="grid grid-cols-3 gap-4 mb-4">
            <div class="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-center">
              <div class="text-sm text-gray-600 mb-1">Combat</div>
              <div class="text-2xl font-bold text-red-600">{{ displayStats.combat }}</div>
            </div>
            <div class="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 text-center">
              <div class="text-sm text-gray-600 mb-1">Utility</div>
              <div class="text-2xl font-bold text-blue-600">{{ displayStats.utility }}</div>
            </div>
            <div class="bg-green-50 border-2 border-green-300 rounded-lg p-3 text-center">
              <div class="text-sm text-gray-600 mb-1">Survival</div>
              <div class="text-2xl font-bold text-green-600">{{ displayStats.survival }}</div>
            </div>
          </div>

          <!-- Bonuses -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
              <div class="text-sm text-gray-600 mb-1">Leader Bonus</div>
              <div class="text-lg font-bold text-yellow-600">+{{ guildMaster.leaderBonus }}%</div>
              <div class="text-xs text-gray-500">Buff to party when leading</div>
            </div>
            <div class="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-3">
              <div class="text-sm text-gray-600 mb-1">Mentor Bonus</div>
              <div class="text-lg font-bold text-indigo-600">+{{ guildMaster.mentorBonus }}%</div>
              <div class="text-xs text-gray-500">XP boost to party members</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trait Slots -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Equipped Traits</h2>
          <div class="text-sm text-gray-600">
            {{ guildMaster.equippedTraitIds.length }} / {{ guildMaster.maxEquippedTraits }} Slots
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="slot in traitSlots"
            :key="slot.slotNumber"
            class="border-2 rounded-lg p-4 transition-all"
            :class="slot.equipped ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'"
          >
            <div v-if="slot.equipped" class="flex items-start justify-between">
              <div class="flex-1">
                <div class="font-bold text-gray-800 mb-1">
                  {{ equippedTraits.find(t => t.traitId === slot.equipped)?.name || 'Unknown Trait' }}
                </div>
                <div class="text-sm text-gray-600 mb-2">
                  {{ equippedTraits.find(t => t.traitId === slot.equipped)?.description }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ equippedTraits.find(t => t.traitId === slot.equipped)?.effectDescription }}
                </div>
              </div>
              <button
                class="text-red-500 hover:text-red-600 font-bold text-sm ml-2"
                :disabled="processing"
                @click="handleUnequipTrait(slot.equipped)"
              >
                Unequip
              </button>
            </div>

            <div v-else class="text-center py-4">
              <div class="text-gray-400 mb-2">Empty Slot {{ slot.slotNumber }}</div>
              <button
                v-if="unequippedTraits.length > 0"
                class="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                @click="openTraitModal(slot.slotNumber - 1)"
              >
                Equip Trait
              </button>
              <div v-else class="text-sm text-gray-500">
                No traits available
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Equip Button -->
        <div v-if="availableSlots > 0 && unequippedTraits.length > 0" class="mt-4">
          <button
            class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors"
            @click="openTraitModal()"
          >
            + Equip Trait ({{ availableSlots }} slots available)
          </button>
        </div>
      </div>

      <!-- Unlocked Traits -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Unlocked Traits</h2>

        <div v-if="guildMaster.unlockedTraitIds.length > 0" class="space-y-3">
          <div class="text-sm text-gray-600 mb-3">
            {{ guildMaster.unlockedTraitIds.length }} traits unlocked
          </div>

          <!-- Equipped Traits List -->
          <div v-if="equippedTraits.length > 0" class="mb-4">
            <h3 class="text-sm font-bold text-gray-700 mb-2">Equipped</h3>
            <div class="space-y-2">
              <div
                v-for="trait in equippedTraits"
                :key="trait.traitId"
                class="border-2 border-purple-500 bg-purple-50 rounded-lg p-3"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="font-bold text-gray-800">{{ trait.name }}</div>
                    <div class="text-sm text-gray-600 mb-1">{{ trait.description }}</div>
                    <div class="text-xs text-gray-500">{{ trait.effectDescription }}</div>
                  </div>
                  <span class="text-purple-600 font-bold text-sm ml-2">✓ Equipped</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Unequipped Traits List -->
          <div v-if="unequippedTraits.length > 0">
            <h3 class="text-sm font-bold text-gray-700 mb-2">Available to Equip</h3>
            <div class="space-y-2">
              <div
                v-for="trait in unequippedTraits"
                :key="trait.traitId"
                class="border-2 border-gray-300 rounded-lg p-3 hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="font-bold text-gray-800">{{ trait.name }}</div>
                    <div class="text-sm text-gray-600 mb-1">{{ trait.description }}</div>
                    <div class="text-xs text-gray-500">{{ trait.effectDescription }}</div>
                  </div>
                  <button
                    v-if="availableSlots > 0"
                    class="bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm px-3 py-1 rounded-lg transition-colors ml-2"
                    :disabled="processing"
                    @click="handleEquipTrait(trait.traitId)"
                  >
                    Equip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          <div class="text-6xl mb-4">🎯</div>
          <p class="text-lg mb-2">No traits unlocked yet</p>
          <p class="text-sm">Complete expeditions and achievements to unlock traits!</p>
        </div>
      </div>
    </div>

    <!-- Not Initialized -->
    <div v-else-if="!isInitialized && !guildMasterStore.loading" class="max-w-md mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="text-6xl mb-4">⚔️</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Welcome, Guild Master!</h2>
        <p class="text-gray-600 mb-6">
          Your journey begins here. Complete the tutorial to initialize your Guild Master.
        </p>
        <NuxtLink
          to="/"
          class="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Return to Dashboard
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="max-w-md mx-auto text-center py-12">
      <div class="text-6xl mb-4">⏳</div>
      <p class="text-lg text-gray-600">Loading Guild Master...</p>
    </div>

    <!-- Trait Selection Modal -->
    <div
      v-if="showTraitModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showTraitModal = false"
    >
      <div class="bg-white rounded-lg shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Select Trait to Equip</h3>

        <div v-if="unequippedTraits.length > 0" class="space-y-3">
          <button
            v-for="trait in unequippedTraits"
            :key="trait.traitId"
            class="w-full text-left border-2 border-gray-300 hover:border-purple-500 rounded-lg p-3 transition-all"
            :disabled="processing"
            @click="handleEquipTrait(trait.traitId)"
          >
            <div class="font-bold text-gray-800">{{ trait.name }}</div>
            <div class="text-sm text-gray-600 mb-1">{{ trait.description }}</div>
            <div class="text-xs text-gray-500">{{ trait.effectDescription }}</div>
          </button>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <p>No traits available to equip</p>
        </div>

        <button
          class="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition-colors"
          @click="showTraitModal = false"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
