<template>
  <div class="expedition-setup bg-gray-800 rounded-lg p-6 space-y-6">
    <div class="header">
      <h2 class="text-2xl font-bold text-white mb-2">
        {{ zone?.name }} - {{ subzone?.name }}
      </h2>
      <p class="text-gray-400">Duration: {{ subzone?.baseDuration }} minutes</p>
    </div>

    <!-- Hero Selection -->
    <div class="hero-selection">
      <h3 class="text-lg font-semibold text-white mb-3">Select Heroes ({{ selectedHeroIds.length }}/4)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          v-for="hero in availableHeroes"
          :key="hero.id"
          @click="toggleHero(hero.id)"
          :disabled="!canSelectHero(hero.id)"
          :class="[
            'hero-card p-4 rounded-lg border-2 transition-colors',
            selectedHeroIds.includes(hero.id)
              ? 'border-blue-500 bg-blue-900/30'
              : 'border-gray-600 bg-gray-700 hover:border-gray-500',
            !canSelectHero(hero.id) && 'opacity-50 cursor-not-allowed'
          ]"
        >
          <div class="flex justify-between items-start">
            <div class="text-left">
              <div class="font-semibold text-white">{{ hero.name }}</div>
              <div class="text-sm text-gray-400">Level {{ hero.level }} {{ hero.archetype }}</div>
              <div class="text-xs text-gray-500 mt-1">
                Combat: {{ hero.stats.combat }} | Utility: {{ hero.stats.utility }} | Survival: {{ hero.stats.survival }}
              </div>
            </div>
            <div
              v-if="selectedHeroIds.includes(hero.id)"
              class="text-blue-400 text-xl"
            >
              ✓
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Preview Section -->
    <div v-if="selectedHeroIds.length > 0 && preview" class="preview-section space-y-4">
      <!-- Threat Analysis -->
      <div class="threats bg-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">Threats & Counters</h3>
        <div class="space-y-2">
          <div
            v-for="(counter, index) in preview.counters"
            :key="counter.threatId"
            :class="[
              'threat-item p-3 rounded',
              counter.hasCounter ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
            ]"
          >
            <div class="flex justify-between items-center">
              <div>
                <div class="font-semibold" :class="counter.hasCounter ? 'text-green-400' : 'text-red-400'">
                  {{ preview.threats[index]?.name || counter.threatId }}
                </div>
                <div class="text-xs text-gray-400">
                  Required: {{ counter.counterTags.join(', ') }}
                </div>
              </div>
              <div class="text-sm">
                {{ counter.hasCounter ? '✓ Countered' : '✗ Not Countered' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estimated Rewards -->
      <div class="rewards bg-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">Estimated Rewards</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-400">Efficiency</div>
            <div
              :class="[
                'text-2xl font-bold',
                preview.estimatedEfficiency >= 100 ? 'text-green-400' : 'text-yellow-400'
              ]"
            >
              {{ preview.estimatedEfficiency }}%
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-400">Gold</div>
            <div class="text-2xl font-bold text-yellow-400">
              {{ preview.estimatedRewards.gold }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-400">XP</div>
            <div class="text-2xl font-bold text-blue-400">
              {{ preview.estimatedRewards.xp }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-400">Duration</div>
            <div class="text-2xl font-bold text-gray-300">
              {{ preview.estimatedRewards.duration }}m
            </div>
          </div>
        </div>
      </div>

      <!-- Auto-Repeat Settings -->
      <div class="settings bg-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-white mb-3">Settings</h3>
        <div class="space-y-2">
          <label class="flex items-center text-gray-300 cursor-pointer">
            <input
              v-model="autoRepeat"
              type="checkbox"
              class="mr-2 rounded"
            >
            Auto-repeat this expedition
          </label>
          <div v-if="autoRepeat" class="ml-6 space-y-2">
            <label class="flex items-center text-gray-400 cursor-pointer text-sm">
              <input
                v-model="stopConditions.anyHeroTired"
                type="checkbox"
                class="mr-2 rounded"
              >
              Stop if any hero becomes tired
            </label>
            <label class="flex items-center text-gray-400 cursor-pointer text-sm">
              <input
                v-model="stopConditions.inventoryFull"
                type="checkbox"
                class="mr-2 rounded"
              >
              Stop if inventory is full
            </label>
            <label class="flex items-center text-gray-400 cursor-pointer text-sm">
              <input
                v-model="stopConditions.resourceCap"
                type="checkbox"
                class="mr-2 rounded"
              >
              Stop if resource cap is reached
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions flex gap-3">
      <button
        @click="startExpedition"
        :disabled="!canStart || loading"
        :class="[
          'flex-1 py-3 px-6 rounded-lg font-semibold transition-colors',
          canStart && !loading
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        ]"
      >
        {{ loading ? 'Starting...' : 'Start Expedition' }}
      </button>
      <button
        @click="$emit('cancel')"
        class="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
      >
        Cancel
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHeroStore } from '~/stores/heroes'
import { useExpeditionStore } from '~/stores/expeditions'
import type { Zone, Subzone } from '~~/types'
import { toError } from '~~/shared/utils/errorHandler'

interface Props {
  zone: Zone
  subzone: Subzone
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'started', expeditionId: string): void
  (e: 'cancel'): void
}>()

const heroStore = useHeroStore()
const expeditionStore = useExpeditionStore()

const selectedHeroIds = ref<string[]>([])
const autoRepeat = ref(false)
const stopConditions = ref({
  anyHeroTired: false,
  inventoryFull: false,
  resourceCap: false
})
const loading = ref(false)
const error = ref<string | null>(null)
const preview = ref<any>(null)

// Available heroes (idle, healthy morale)
const availableHeroes = computed(() => {
  return heroStore.heroes.filter(h =>
    h.status === 'idle' && h.morale >= 20
  )
})

const canStart = computed(() => {
  return selectedHeroIds.value.length > 0 && selectedHeroIds.value.length <= 4 && !loading.value
})

function canSelectHero(heroId: string): boolean {
  if (selectedHeroIds.value.includes(heroId)) return true
  if (selectedHeroIds.value.length >= 4) return false
  return true
}

function toggleHero(heroId: string) {
  const index = selectedHeroIds.value.indexOf(heroId)
  if (index > -1) {
    selectedHeroIds.value.splice(index, 1)
  } else if (selectedHeroIds.value.length < 4) {
    selectedHeroIds.value.push(heroId)
  }
}

// Watch for hero selection changes to update preview
const previewError = ref<string | null>(null)

watch(selectedHeroIds, async (newIds) => {
  if (newIds.length > 0) {
    try {
      previewError.value = null
      preview.value = await $fetch('/api/expeditions/preview', {
        params: {
          zoneId: props.zone.id,
          subzoneId: props.subzone.id,
          heroIds: newIds.join(',')
        }
      })
    } catch (err: unknown) {
      const e = toError(err)
      console.error('Failed to fetch preview:', e)
      previewError.value = 'Could not load preview'
      preview.value = null
    }
  } else {
    preview.value = null
  }
}, { immediate: true })

async function startExpedition() {
  if (!canStart.value) return

  loading.value = true
  error.value = null

  try {
    const result = await expeditionStore.startExpedition({
      zoneId: props.zone.id,
      subzoneId: props.subzone.id,
      heroIds: selectedHeroIds.value,
      autoRepeat: autoRepeat.value,
      stopConditions: stopConditions.value
    })
    if (result?.expedition?.id) {
      emit('started', result.expedition.id)
    } else {
      throw new Error('Invalid response from server')
    }
  } catch (err: unknown) {
    const e = toError(err)
    error.value = e.message || 'Failed to start expedition'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.expedition-setup {
  max-width: 800px;
  margin: 0 auto;
}
</style>
