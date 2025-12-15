<script setup lang="ts">
import type { PartyPreset } from '~~/types/hero'
import type { Hero } from '~~/types'
import { usePresetStore } from '~/stores/presets'

interface Props {
  selectedHeroIds?: string[]
  availableHeroes: Hero[]
  accountLevel?: number
}

interface Emits {
  (e: 'select', heroIds: string[]): void
  (e: 'save', name: string): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedHeroIds: () => [],
  accountLevel: 1,
})

const emit = defineEmits<Emits>()

const presetStore = usePresetStore()

const showSaveDialog = ref(false)
const newPresetName = ref('')
const selectedPresetId = ref<string | null>(null)

// Fetch presets on mount
onMounted(() => {
  presetStore.fetchPresets()
})

const sortedPresets = computed(() => presetStore.sortedByLastUsed)

const maxSlots = computed(() => presetStore.maxPresetSlots(props.accountLevel))

const canCreateMore = computed(() => {
  return presetStore.presets.length < maxSlots.value
})

const handleSelectPreset = async (preset: PartyPreset) => {
  selectedPresetId.value = preset.id

  // Validate preset
  const validation = presetStore.validatePreset(
    preset,
    props.availableHeroes.map(h => h.id)
  )

  if (validation.isValid) {
    // Preset is valid, emit selection
    emit('select', preset.heroIds)
    await presetStore.markAsUsed(preset.id)
  } else {
    // Show warning about missing/unavailable heroes
    // In production, would show a modal with replacement options
    console.warn('Preset has missing or unavailable heroes:', validation)
    alert(
      `Some heroes are not available:\n${validation.missingHeroes.join(', ')}`
    )
  }
}

const handleSavePreset = () => {
  if (props.selectedHeroIds.length === 0) {
    alert('Please select at least one hero first')
    return
  }

  if (!canCreateMore.value) {
    alert(`Maximum preset slots reached (${maxSlots.value})`)
    return
  }

  showSaveDialog.value = true
  newPresetName.value = ''
}

const confirmSavePreset = async () => {
  if (!newPresetName.value.trim()) {
    alert('Please enter a preset name')
    return
  }

  if (!presetStore.isNameAvailable(newPresetName.value.trim())) {
    alert('A preset with this name already exists')
    return
  }

  try {
    await presetStore.createPreset({
      name: newPresetName.value.trim(),
      heroIds: props.selectedHeroIds,
      lastUsedAt: new Date().toISOString(),
    })

    showSaveDialog.value = false
    emit('save', newPresetName.value.trim())
  } catch (error) {
    console.error('Failed to save preset:', error)
    alert('Failed to save preset')
  }
}

const handleDeletePreset = async (presetId: string) => {
  if (!confirm('Are you sure you want to delete this preset?')) {
    return
  }

  try {
    await presetStore.deletePreset(presetId)
    if (selectedPresetId.value === presetId) {
      selectedPresetId.value = null
    }
  } catch (error) {
    console.error('Failed to delete preset:', error)
    alert('Failed to delete preset')
  }
}

const getHeroNames = (heroIds: string[]): string => {
  return heroIds
    .map(id => {
      const hero = props.availableHeroes.find(h => h.id === id)
      return hero?.name || 'Unknown'
    })
    .join(', ')
}
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-gray-800">Party Presets</h3>
      <div class="text-sm text-gray-600">
        {{ presetStore.presets.length }} / {{ maxSlots }} slots
      </div>
    </div>

    <!-- Preset list -->
    <div v-if="sortedPresets.length > 0" class="space-y-2 mb-4">
      <div
        v-for="preset in sortedPresets"
        :key="preset.id"
        class="border rounded-lg p-3 cursor-pointer transition-all hover:border-blue-300"
        :class="selectedPresetId === preset.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
        @click="handleSelectPreset(preset)"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="font-medium text-gray-800 mb-1">
              {{ preset.name }}
            </div>
            <div class="text-sm text-gray-600">
              {{ getHeroNames(preset.heroIds) }}
            </div>
            <div v-if="preset.preferredZoneId" class="text-xs text-gray-500 mt-1">
              Preferred zone set
            </div>
          </div>

          <button
            class="text-red-500 hover:text-red-700 ml-2"
            @click.stop="handleDeletePreset(preset.id)"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-6 text-gray-500">
      <p class="mb-2">No presets saved</p>
      <p class="text-sm">Save your party compositions for quick access</p>
    </div>

    <!-- Save button -->
    <button
      :disabled="!canCreateMore || selectedHeroIds.length === 0"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      @click="handleSavePreset"
    >
      Save Current Party
    </button>

    <!-- Save dialog -->
    <div
      v-if="showSaveDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="showSaveDialog = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Save Party Preset</h3>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Preset Name
          </label>
          <input
            v-model="newPresetName"
            type="text"
            maxlength="30"
            placeholder="e.g., Dragon Hunters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="confirmSavePreset"
          />
          <div class="text-xs text-gray-500 mt-1">
            {{ newPresetName.length }} / 30 characters
          </div>
        </div>

        <div class="flex gap-3">
          <button
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
            @click="showSaveDialog = false"
          >
            Cancel
          </button>
          <button
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            @click="confirmSavePreset"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
