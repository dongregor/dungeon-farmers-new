<script setup lang="ts">
import type { Hero, Expedition } from '~~/types'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const playerId = route.params.playerId as string

interface GuildDetail {
  player: {
    id: string
    username: string
    email: string
    guildName: string
    guildTabard: any
    guildLevel: number
    gold: number
    gems: number
    isSupporter: boolean
    isAdmin: boolean
    createdAt: string
    updatedAt: string
  }
  guildMaster: {
    id: string
    name: string
    level: number
    archetype: string
    rarity: string
  } | null
  heroes: Hero[]
  expeditions: Expedition[]
  equipmentCount: number
}

const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<GuildDetail | null>(null)
const activeTab = ref<'roster' | 'expeditions'>('roster')

async function fetchGuildDetail() {
  loading.value = true
  error.value = null
  try {
    data.value = await $fetch<GuildDetail>(`/api/admin/guilds/${playerId}`)
  } catch (e: any) {
    error.value = e.data?.statusMessage || e.message || 'Failed to load guild'
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

function getArchetypeLabel(archetype: string): string {
  const map: Record<string, string> = {
    tank: 'Tank',
    healer: 'Healer',
    debuffer: 'Debuffer',
    melee_dps: 'Melee DPS',
    ranged_dps: 'Ranged DPS',
    caster: 'Caster',
  }
  return map[archetype] || archetype
}

function getMoraleColor(morale: string): string {
  const map: Record<string, string> = {
    excited: 'text-purple-400',
    content: 'text-blue-400',
    tired: 'text-yellow-400',
    frustrated: 'text-orange-400',
    exhausted: 'text-red-400',
  }
  return map[morale] || 'text-gray-400'
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleString()
}

function getExpeditionStatusColor(exp: Expedition): string {
  if (exp.status === 'completed') return 'text-green-400'
  const now = Date.now()
  const end = new Date(exp.completesAt).getTime()
  if (now >= end) return 'text-yellow-400'
  return 'text-blue-400'
}

function getExpeditionStatusText(exp: Expedition): string {
  if (exp.status === 'completed') return 'Completed'
  const now = Date.now()
  const end = new Date(exp.completesAt).getTime()
  if (now >= end) return 'Ready'
  const remaining = Math.ceil((end - now) / 60000)
  return `${remaining}m remaining`
}

onMounted(fetchGuildDetail)
</script>

<template>
  <div>
    <!-- Breadcrumb -->
    <div class="mb-4">
      <NuxtLink to="/admin" class="text-sm text-gray-400 hover:text-white transition-colors">
        All Guilds
      </NuxtLink>
      <span class="text-gray-600 mx-2">/</span>
      <span class="text-sm text-gray-200">{{ data?.player?.guildName || 'Loading...' }}</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-400 py-12 text-center">Loading guild details...</div>

    <template v-else-if="data">
      <!-- Guild Header -->
      <div class="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white mb-1">{{ data.player.guildName }}</h1>
            <p class="text-gray-400">
              {{ data.player.username }} &middot; {{ data.player.email }}
            </p>
          </div>
          <div class="text-right text-sm text-gray-400">
            <p>Created: {{ formatDate(data.player.createdAt) }}</p>
            <p>Updated: {{ formatDate(data.player.updatedAt) }}</p>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Guild Level</p>
            <p class="text-lg font-bold text-white">{{ data.player.guildLevel }}</p>
          </div>
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Gold</p>
            <p class="text-lg font-bold text-yellow-400">{{ data.player.gold?.toLocaleString() }}</p>
          </div>
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Heroes</p>
            <p class="text-lg font-bold text-white">{{ data.heroes.length }}</p>
          </div>
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Expeditions</p>
            <p class="text-lg font-bold text-white">{{ data.expeditions.length }}</p>
          </div>
          <div class="bg-gray-800 rounded p-3">
            <p class="text-xs text-gray-500 mb-1">Equipment</p>
            <p class="text-lg font-bold text-white">{{ data.equipmentCount }}</p>
          </div>
        </div>

        <!-- Guild Master -->
        <div v-if="data.guildMaster" class="mt-4 pt-4 border-t border-gray-800">
          <p class="text-xs text-gray-500 mb-1">Guild Master</p>
          <p class="text-white">
            <span :class="getRarityColor(data.guildMaster.rarity)">{{ data.guildMaster.name }}</span>
            <span class="text-gray-500 ml-2">Lv.{{ data.guildMaster.level }} {{ getArchetypeLabel(data.guildMaster.archetype) }}</span>
          </p>
        </div>

        <!-- Flags -->
        <div class="mt-4 flex gap-2">
          <span v-if="data.player.isAdmin" class="px-2 py-1 text-xs rounded bg-red-900/40 text-red-400">Admin</span>
          <span v-if="data.player.isSupporter" class="px-2 py-1 text-xs rounded bg-purple-900/40 text-purple-400">Supporter</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-4 border-b border-gray-800">
        <button
          class="px-4 py-2 text-sm font-medium transition-colors border-b-2"
          :class="activeTab === 'roster'
            ? 'text-red-400 border-red-400'
            : 'text-gray-400 border-transparent hover:text-white'"
          @click="activeTab = 'roster'"
        >
          Roster ({{ data.heroes.length }})
        </button>
        <button
          class="px-4 py-2 text-sm font-medium transition-colors border-b-2"
          :class="activeTab === 'expeditions'
            ? 'text-red-400 border-red-400'
            : 'text-gray-400 border-transparent hover:text-white'"
          @click="activeTab = 'expeditions'"
        >
          Expeditions ({{ data.expeditions.length }})
        </button>
      </div>

      <!-- Roster Tab -->
      <div v-if="activeTab === 'roster'">
        <div v-if="data.heroes.length === 0" class="text-gray-500 py-8 text-center">
          No heroes in roster.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-800 text-gray-400 text-left">
                <th class="px-3 py-2 font-medium">Name</th>
                <th class="px-3 py-2 font-medium">Rarity</th>
                <th class="px-3 py-2 font-medium">Archetype</th>
                <th class="px-3 py-2 font-medium text-right">Level</th>
                <th class="px-3 py-2 font-medium text-right">Power</th>
                <th class="px-3 py-2 font-medium text-right">XP</th>
                <th class="px-3 py-2 font-medium">Stats (C/U/S)</th>
                <th class="px-3 py-2 font-medium">Morale</th>
                <th class="px-3 py-2 font-medium">Status</th>
                <th class="px-3 py-2 font-medium text-right">Prestige</th>
                <th class="px-3 py-2 font-medium">Tags</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="hero in data.heroes"
                :key="hero.id"
                class="border-b border-gray-800/50 hover:bg-gray-900/50"
              >
                <td class="px-3 py-2">
                  <span :class="getRarityColor(hero.rarity)" class="font-medium">{{ hero.name }}</span>
                </td>
                <td class="px-3 py-2">
                  <span :class="getRarityColor(hero.rarity)" class="capitalize">{{ hero.rarity }}</span>
                </td>
                <td class="px-3 py-2 text-gray-300">{{ getArchetypeLabel(hero.archetype) }}</td>
                <td class="px-3 py-2 text-right text-gray-300">{{ hero.level }}</td>
                <td class="px-3 py-2 text-right text-gray-300">{{ hero.power }}</td>
                <td class="px-3 py-2 text-right text-gray-500">{{ hero.xp }}</td>
                <td class="px-3 py-2 text-gray-400 font-mono text-xs">
                  {{ hero.baseStats.combat }}/{{ hero.baseStats.utility }}/{{ hero.baseStats.survival }}
                </td>
                <td class="px-3 py-2">
                  <span :class="getMoraleColor(hero.morale)" class="capitalize">
                    {{ hero.morale }} ({{ hero.moraleValue }})
                  </span>
                </td>
                <td class="px-3 py-2">
                  <span v-if="hero.isOnExpedition" class="text-green-400 text-xs">On Expedition</span>
                  <span v-else-if="hero.isStationed" class="text-blue-400 text-xs">Stationed</span>
                  <span v-else class="text-gray-500 text-xs">Idle</span>
                </td>
                <td class="px-3 py-2 text-right text-gray-400">{{ hero.prestigeLevel }}</td>
                <td class="px-3 py-2">
                  <span
                    v-for="(tag, i) in hero.archetypeTags"
                    :key="i"
                    class="inline-block px-1 py-0.5 text-[10px] rounded bg-gray-800 text-gray-400 mr-0.5 mb-0.5"
                  >{{ tag }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Expeditions Tab -->
      <div v-if="activeTab === 'expeditions'">
        <div v-if="data.expeditions.length === 0" class="text-gray-500 py-8 text-center">
          No expeditions.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-800 text-gray-400 text-left">
                <th class="px-3 py-2 font-medium">Zone / Subzone</th>
                <th class="px-3 py-2 font-medium">Difficulty</th>
                <th class="px-3 py-2 font-medium">Heroes</th>
                <th class="px-3 py-2 font-medium text-right">Efficiency</th>
                <th class="px-3 py-2 font-medium text-right">Rewards</th>
                <th class="px-3 py-2 font-medium">Status</th>
                <th class="px-3 py-2 font-medium">Started</th>
                <th class="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="exp in data.expeditions"
                :key="exp.id"
                class="border-b border-gray-800/50 hover:bg-gray-900/50"
              >
                <td class="px-3 py-2">
                  <span class="text-gray-200">{{ exp.zoneId }}</span>
                  <span class="text-gray-500"> / {{ exp.subzoneId }}</span>
                </td>
                <td class="px-3 py-2 capitalize text-gray-300">{{ exp.status === 'completed' ? (exp as any).difficulty || '-' : '-' }}</td>
                <td class="px-3 py-2 text-gray-400">
                  {{ exp.heroIds.length }} heroes
                </td>
                <td class="px-3 py-2 text-right">
                  <span v-if="exp.efficiency" class="text-gray-200">{{ exp.efficiency }}%</span>
                  <span v-else class="text-gray-600">-</span>
                </td>
                <td class="px-3 py-2 text-right">
                  <template v-if="exp.rewards">
                    <span class="text-yellow-400">{{ exp.rewards.gold }}g</span>
                    <span class="text-gray-500 ml-1">{{ exp.rewards.xp }}xp</span>
                  </template>
                  <span v-else class="text-gray-600">-</span>
                </td>
                <td class="px-3 py-2">
                  <span :class="getExpeditionStatusColor(exp)">{{ getExpeditionStatusText(exp) }}</span>
                </td>
                <td class="px-3 py-2 text-gray-500 text-xs">
                  {{ formatDate(exp.startedAt) }}
                </td>
                <td class="px-3 py-2">
                  <NuxtLink
                    :to="`/admin/expeditions/${exp.id}`"
                    class="text-red-400 hover:text-red-300 text-xs font-medium"
                  >
                    Debug Log
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
