<script setup lang="ts">
import type { Hero, Expedition, ExpeditionDebugLog, DebugLogEntry, ExpeditionLog, LogSection } from '~~/types'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const expeditionId = route.params.expeditionId as string

interface ExpeditionDetail {
  expedition: Expedition
  debugLog: ExpeditionDebugLog | null
  heroes: Hero[]
  player: { id: string; username: string; guildName: string } | null
}

const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<ExpeditionDetail | null>(null)
const activeSection = ref<'overview' | 'start_log' | 'completion_log' | 'narrative'>('overview')

async function fetchExpeditionDetail() {
  loading.value = true
  error.value = null
  try {
    data.value = await $fetch<ExpeditionDetail>(`/api/admin/expeditions/${expeditionId}`)
  } catch (e: any) {
    error.value = e.data?.statusMessage || e.message || 'Failed to load expedition'
  } finally {
    loading.value = false
  }
}

function getRarityColor(rarity: string): string {
  const map: Record<string, string> = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-orange-400',
  }
  return map[rarity] || 'text-gray-400'
}

function getStepIcon(step: string): string {
  if (step.includes('hero_power')) return 'PWR'
  if (step.includes('team_power')) return 'SUM'
  if (step.includes('required_power')) return 'REQ'
  if (step.includes('power_ratio')) return 'RAT'
  if (step.includes('efficiency')) return 'EFF'
  if (step.includes('threat_countered')) return '+TH'
  if (step.includes('threat_uncountered')) return '-TH'
  if (step.includes('hero_tags')) return 'TAG'
  if (step.includes('hero_update')) return 'UPD'
  if (step.includes('gold')) return 'GLD'
  if (step.includes('xp')) return 'XP'
  if (step.includes('familiarity')) return 'FAM'
  if (step.includes('mastery')) return 'MAS'
  return 'LOG'
}

function getStepColor(step: string): string {
  if (step.includes('threat_countered')) return 'border-green-700 bg-green-950/30'
  if (step.includes('threat_uncountered')) return 'border-red-700 bg-red-950/30'
  if (step.includes('efficiency') || step.includes('final')) return 'border-yellow-700 bg-yellow-950/30'
  if (step.includes('hero_update')) return 'border-blue-700 bg-blue-950/30'
  return 'border-gray-700 bg-gray-900/50'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString()
}

function getLogRarityColor(rarity?: string): string {
  const map: Record<string, string> = {
    common: 'text-gray-500',
    standard: 'text-gray-300',
    noteworthy: 'text-green-400',
    memorable: 'text-blue-400',
    epic: 'text-purple-400',
    legendary: 'text-orange-400',
  }
  return map[rarity || 'standard'] || 'text-gray-300'
}

onMounted(fetchExpeditionDetail)
</script>

<template>
  <div>
    <!-- Breadcrumb -->
    <div class="mb-4 text-sm">
      <NuxtLink to="/admin" class="text-gray-400 hover:text-white transition-colors">All Guilds</NuxtLink>
      <span class="text-gray-600 mx-2">/</span>
      <NuxtLink
        v-if="data?.player"
        :to="`/admin/guilds/${data.player.id}`"
        class="text-gray-400 hover:text-white transition-colors"
      >
        {{ data.player.guildName || data.player.username }}
      </NuxtLink>
      <span class="text-gray-600 mx-2">/</span>
      <span class="text-gray-200">Expedition</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-400 py-12 text-center">Loading expedition...</div>

    <template v-else-if="data">
      <!-- Expedition Header -->
      <div class="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-xl font-bold text-white mb-1">
              Expedition: {{ data.expedition.zoneId }} / {{ data.expedition.subzoneId }}
            </h1>
            <p class="text-sm text-gray-400">
              ID: <span class="font-mono text-xs">{{ data.expedition.id }}</span>
            </p>
          </div>
          <div class="text-right">
            <span
              :class="data.expedition.status === 'completed' ? 'text-green-400' : 'text-blue-400'"
              class="text-lg font-bold capitalize"
            >
              {{ data.expedition.status }}
            </span>
          </div>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-5">
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Efficiency</p>
            <p class="text-lg font-bold" :class="(data.expedition.efficiency ?? 0) >= 100 ? 'text-green-400' : 'text-yellow-400'">
              {{ data.expedition.efficiency ?? '-' }}%
            </p>
          </div>
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Duration</p>
            <p class="text-lg font-bold text-white">{{ data.expedition.durationMinutes }}m</p>
          </div>
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Heroes</p>
            <p class="text-lg font-bold text-white">{{ data.heroes.length }}</p>
          </div>
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Gold</p>
            <p class="text-lg font-bold text-yellow-400">{{ data.expedition.rewards?.gold ?? '-' }}</p>
          </div>
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">XP</p>
            <p class="text-lg font-bold text-blue-400">{{ data.expedition.rewards?.xp ?? '-' }}</p>
          </div>
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Started</p>
            <p class="text-sm text-gray-300">{{ formatDate(data.expedition.startedAt) }}</p>
          </div>
        </div>

        <!-- Heroes involved -->
        <div class="mt-4 pt-4 border-t border-gray-800">
          <p class="text-xs text-gray-500 mb-2">Party Composition</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="hero in data.heroes"
              :key="hero.id"
              class="bg-gray-800 rounded px-3 py-2 text-sm"
            >
              <span :class="getRarityColor(hero.rarity)" class="font-medium">{{ hero.name }}</span>
              <span class="text-gray-500 ml-1">Lv.{{ hero.level }}</span>
              <span class="text-gray-600 ml-1">P:{{ hero.power }}</span>
              <span class="text-gray-600 ml-1 text-xs">[{{ hero.archetypeTags?.join(', ') }}]</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Sections -->
      <div class="flex gap-1 mb-4 border-b border-gray-800">
        <button
          v-for="tab in [
            { key: 'overview', label: 'Overview' },
            { key: 'start_log', label: 'Start Calculations' },
            { key: 'completion_log', label: 'Completion Calculations' },
            { key: 'narrative', label: 'Narrative Log' },
          ]"
          :key="tab.key"
          class="px-4 py-2 text-sm font-medium transition-colors border-b-2"
          :class="activeSection === tab.key
            ? 'text-red-400 border-red-400'
            : 'text-gray-400 border-transparent hover:text-white'"
          @click="activeSection = tab.key as any"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeSection === 'overview'">
        <div v-if="!data.debugLog" class="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
          <p class="text-yellow-400 text-sm">No debug log available for this expedition. Debug logging was added after this expedition was created.</p>
        </div>
        <template v-else>
          <!-- Start Phase Summary -->
          <div class="bg-gray-900 rounded-lg border border-gray-800 p-5 mb-4">
            <h3 class="text-sm font-bold text-gray-300 mb-3">Start Phase Summary</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p class="text-xs text-gray-500">Team Power</p>
                <p class="text-white font-bold">{{ data.debugLog.start.teamPower }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Required Power</p>
                <p class="text-white font-bold">{{ data.debugLog.start.requiredPower }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Power Ratio</p>
                <p class="text-white font-bold">{{ data.debugLog.start.powerRatio }}x</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Final Efficiency</p>
                <p class="font-bold" :class="data.debugLog.start.finalEfficiency >= 100 ? 'text-green-400' : 'text-yellow-400'">
                  {{ data.debugLog.start.finalEfficiency }}%
                </p>
              </div>
            </div>

            <!-- Threat summary -->
            <div v-if="data.debugLog.start.threats.length > 0" class="mt-4 pt-3 border-t border-gray-800">
              <p class="text-xs text-gray-500 mb-2">Threats</p>
              <div class="space-y-1">
                <div
                  v-for="(threat, i) in data.debugLog.start.threats"
                  :key="i"
                  class="flex items-center gap-2 text-sm"
                >
                  <span
                    :class="threat.countered ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'"
                    class="px-1.5 py-0.5 rounded text-xs"
                  >
                    {{ threat.countered ? 'COUNTERED' : 'UNCOUNTERED' }}
                  </span>
                  <span class="text-gray-200">{{ threat.threatName }}</span>
                  <span class="text-gray-500">({{ threat.severity }})</span>
                  <span v-if="threat.counteringHeroName" class="text-gray-400">by {{ threat.counteringHeroName }}</span>
                  <span :class="threat.efficiencyChange > 0 ? 'text-green-400' : 'text-red-400'" class="ml-auto">
                    {{ threat.efficiencyChange > 0 ? '+' : '' }}{{ threat.efficiencyChange }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Completion Phase Summary -->
          <div v-if="data.debugLog.completion.efficiencyUsed > 0" class="bg-gray-900 rounded-lg border border-gray-800 p-5">
            <h3 class="text-sm font-bold text-gray-300 mb-3">Completion Phase Summary</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p class="text-xs text-gray-500">Efficiency Used</p>
                <p class="text-white font-bold">{{ data.debugLog.completion.efficiencyUsed }}%</p>
                <p class="text-[10px] text-gray-600">Source: {{ data.debugLog.completion.efficiencySource }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Gold (base / final)</p>
                <p class="text-yellow-400 font-bold">{{ data.debugLog.completion.rewards.baseGold }} / {{ data.debugLog.completion.rewards.goldAfterEfficiency }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">XP (base / final)</p>
                <p class="text-blue-400 font-bold">{{ data.debugLog.completion.rewards.baseXp }} / {{ data.debugLog.completion.rewards.xpAfterEfficiency }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Hero Count</p>
                <p class="text-white font-bold">{{ data.debugLog.completion.rewards.heroCount }}</p>
              </div>
            </div>

            <!-- Hero Updates -->
            <div v-if="data.debugLog.completion.heroUpdates.length > 0" class="mt-4 pt-3 border-t border-gray-800">
              <p class="text-xs text-gray-500 mb-2">Hero Updates</p>
              <div class="space-y-2">
                <div
                  v-for="(upd, i) in data.debugLog.completion.heroUpdates"
                  :key="i"
                  class="bg-gray-800 rounded p-3 text-sm"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-white font-medium">{{ upd.heroName }}</span>
                    <span v-if="upd.leveledUp" class="text-yellow-400 text-xs font-bold">LEVEL UP!</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 text-xs text-gray-400">
                    <div>XP: {{ upd.previousXp }} + {{ upd.xpGained }} = {{ upd.newXp }}</div>
                    <div>Level: {{ upd.previousLevel }} -> {{ upd.newLevel }}</div>
                    <div>Morale: {{ upd.previousMorale }} + ({{ upd.moraleChange }}) = {{ upd.newMorale }} ({{ upd.newMoraleState }})</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Start Calculations Tab -->
      <div v-if="activeSection === 'start_log'">
        <div v-if="!data.debugLog?.start?.steps?.length" class="text-gray-500 py-8 text-center">
          No start calculation log available.
        </div>
        <div v-else class="space-y-1">
          <!-- Hero Power Breakdowns -->
          <div v-if="data.debugLog?.start.heroPowerBreakdowns?.length" class="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
            <h3 class="text-sm font-bold text-gray-300 mb-3">Hero Power Breakdown</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-gray-500 text-left border-b border-gray-800">
                    <th class="px-2 py-1">Hero</th>
                    <th class="px-2 py-1 text-right">Stats</th>
                    <th class="px-2 py-1 text-right">Level</th>
                    <th class="px-2 py-1 text-right">Prestige</th>
                    <th class="px-2 py-1 text-right">Gear</th>
                    <th class="px-2 py-1 text-right">Traits</th>
                    <th class="px-2 py-1 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(bp, i) in data.debugLog.start.heroPowerBreakdowns"
                    :key="i"
                    class="border-b border-gray-800/50"
                  >
                    <td class="px-2 py-1 text-gray-200">{{ bp.heroName }}</td>
                    <td class="px-2 py-1 text-right text-gray-400">{{ bp.statPower }}</td>
                    <td class="px-2 py-1 text-right text-gray-400">{{ bp.levelPower }}</td>
                    <td class="px-2 py-1 text-right text-gray-400">{{ bp.prestigePower }}</td>
                    <td class="px-2 py-1 text-right text-gray-400">{{ bp.gearPower }}</td>
                    <td class="px-2 py-1 text-right text-gray-400">{{ bp.traitPower }}</td>
                    <td class="px-2 py-1 text-right text-white font-bold">{{ bp.totalPower }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Step-by-step log -->
          <h3 class="text-sm font-bold text-gray-300 mb-2">Step-by-step Calculation</h3>
          <div
            v-for="(entry, i) in data.debugLog?.start.steps"
            :key="i"
            class="flex items-start gap-3 px-4 py-2.5 rounded border text-sm"
            :class="getStepColor(entry.step)"
          >
            <span class="flex-shrink-0 w-8 text-center font-mono text-xs text-gray-500 pt-0.5">
              {{ getStepIcon(entry.step) }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-gray-200">{{ entry.detail }}</p>
              <p v-if="entry.formula" class="text-[11px] text-gray-500 font-mono mt-0.5">{{ entry.formula }}</p>
            </div>
            <span v-if="entry.value !== undefined" class="flex-shrink-0 font-mono text-xs text-gray-300">
              = {{ entry.value }}
            </span>
          </div>
        </div>
      </div>

      <!-- Completion Calculations Tab -->
      <div v-if="activeSection === 'completion_log'">
        <div v-if="!data.debugLog?.completion?.steps?.length" class="text-gray-500 py-8 text-center">
          <p>No completion calculation log available.</p>
          <p v-if="data.expedition.status !== 'completed'" class="text-xs mt-1">Expedition is still in progress.</p>
        </div>
        <div v-else class="space-y-1">
          <h3 class="text-sm font-bold text-gray-300 mb-2">Step-by-step Calculation</h3>
          <div
            v-for="(entry, i) in data.debugLog?.completion.steps"
            :key="i"
            class="flex items-start gap-3 px-4 py-2.5 rounded border text-sm"
            :class="getStepColor(entry.step)"
          >
            <span class="flex-shrink-0 w-8 text-center font-mono text-xs text-gray-500 pt-0.5">
              {{ getStepIcon(entry.step) }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-gray-200">{{ entry.detail }}</p>
              <p v-if="entry.formula" class="text-[11px] text-gray-500 font-mono mt-0.5">{{ entry.formula }}</p>
            </div>
            <span v-if="entry.value !== undefined" class="flex-shrink-0 font-mono text-xs text-gray-300">
              = {{ entry.value }}
            </span>
          </div>
        </div>
      </div>

      <!-- Narrative Log Tab -->
      <div v-if="activeSection === 'narrative'">
        <div v-if="!data.expedition.log" class="text-gray-500 py-8 text-center">
          No narrative log available (expedition not yet completed).
        </div>
        <template v-else>
          <!-- Summary -->
          <div class="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-4">
            <h3 class="text-sm font-bold text-gray-300 mb-2">Summary</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <span class="text-gray-500">Duration:</span>
                <span class="text-white ml-1">{{ data.expedition.log.summary.duration }}</span>
              </div>
              <div>
                <span class="text-gray-500">Efficiency:</span>
                <span class="text-white ml-1">{{ data.expedition.log.summary.efficiency }}</span>
              </div>
              <div>
                <span class="text-gray-500">Gold:</span>
                <span class="text-yellow-400 ml-1">{{ data.expedition.log.summary.rewards.gold }}</span>
              </div>
              <div>
                <span class="text-gray-500">XP:</span>
                <span class="text-blue-400 ml-1">{{ data.expedition.log.summary.rewards.xp }}</span>
              </div>
            </div>
          </div>

          <!-- Sections -->
          <div
            v-for="(section, si) in data.expedition.log.sections"
            :key="si"
            class="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-3"
          >
            <h3 class="text-sm font-bold text-gray-300 mb-2 capitalize">
              {{ section.title }}
              <span class="text-[10px] text-gray-600 font-normal ml-2">({{ section.type }})</span>
            </h3>
            <div class="space-y-1.5">
              <div
                v-for="(entry, ei) in section.entries"
                :key="ei"
                class="text-sm pl-3 border-l-2"
                :class="{
                  'border-gray-700': entry.type === 'narrative',
                  'border-blue-700': entry.type === 'reaction',
                  'border-red-700': entry.type === 'combat',
                  'border-yellow-700': entry.type === 'loot',
                  'border-purple-700': entry.type === 'choice_result',
                }"
              >
                <p :class="getLogRarityColor(entry.rarity)">{{ entry.text }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[10px] text-gray-600 capitalize">{{ entry.type }}</span>
                  <span v-if="entry.rarity" class="text-[10px] capitalize" :class="getLogRarityColor(entry.rarity)">{{ entry.rarity }}</span>
                  <span v-if="entry.heroId" class="text-[10px] text-gray-600 font-mono">hero:{{ entry.heroId.slice(0, 8) }}</span>
                  <span v-if="entry.traitId" class="text-[10px] text-gray-600">trait:{{ entry.traitId }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
