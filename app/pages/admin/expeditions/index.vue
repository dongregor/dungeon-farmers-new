<script setup lang="ts">
import type { Expedition } from '~~/types'

definePageMeta({ layout: 'admin' })

interface ExpeditionWithPlayer extends Expedition {
  playerUsername: string
  guildName: string
  hasDebugLog: boolean
}

const loading = ref(true)
const error = ref<string | null>(null)
const expeditions = ref<ExpeditionWithPlayer[]>([])
const statusFilter = ref<'all' | 'completed' | 'active'>('all')

async function fetchExpeditions() {
  loading.value = true
  error.value = null
  try {
    const params: Record<string, string> = { limit: '100' }
    if (statusFilter.value !== 'all') {
      params.status = statusFilter.value
    }
    const queryString = new URLSearchParams(params).toString()
    const res = await $fetch<{ expeditions: ExpeditionWithPlayer[] }>(`/api/admin/expeditions?${queryString}`)
    expeditions.value = res.expeditions
  } catch (e: any) {
    error.value = e.data?.statusMessage || e.message || 'Failed to load expeditions'
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString()
}

watch(statusFilter, fetchExpeditions)
onMounted(fetchExpeditions)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white">All Expeditions</h1>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-500">{{ expeditions.length }} shown</span>
        <select
          v-model="statusFilter"
          class="bg-gray-800 border border-gray-700 text-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-500"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-400 py-12 text-center">Loading expeditions...</div>

    <!-- Expedition Table -->
    <div v-else-if="expeditions.length > 0" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-800 text-gray-400 text-left">
            <th class="px-3 py-2 font-medium">Guild</th>
            <th class="px-3 py-2 font-medium">Zone / Subzone</th>
            <th class="px-3 py-2 font-medium text-right">Heroes</th>
            <th class="px-3 py-2 font-medium text-right">Efficiency</th>
            <th class="px-3 py-2 font-medium text-right">Gold</th>
            <th class="px-3 py-2 font-medium text-right">XP</th>
            <th class="px-3 py-2 font-medium">Status</th>
            <th class="px-3 py-2 font-medium">Debug</th>
            <th class="px-3 py-2 font-medium">Started</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="exp in expeditions"
            :key="exp.id"
            class="border-b border-gray-800/50 hover:bg-gray-900/50 cursor-pointer transition-colors"
            @click="navigateTo(`/admin/expeditions/${exp.id}`)"
          >
            <td class="px-3 py-2">
              <span class="text-gray-200">{{ exp.guildName }}</span>
              <span class="block text-xs text-gray-500">{{ exp.playerUsername }}</span>
            </td>
            <td class="px-3 py-2">
              <span class="text-gray-200">{{ exp.zoneId }}</span>
              <span class="text-gray-500"> / {{ exp.subzoneId }}</span>
            </td>
            <td class="px-3 py-2 text-right text-gray-300">{{ exp.heroIds.length }}</td>
            <td class="px-3 py-2 text-right">
              <span v-if="exp.efficiency" :class="exp.efficiency >= 100 ? 'text-green-400' : 'text-yellow-400'">
                {{ exp.efficiency }}%
              </span>
              <span v-else class="text-gray-600">-</span>
            </td>
            <td class="px-3 py-2 text-right text-yellow-400">
              {{ exp.rewards?.gold ?? '-' }}
            </td>
            <td class="px-3 py-2 text-right text-blue-400">
              {{ exp.rewards?.xp ?? '-' }}
            </td>
            <td class="px-3 py-2">
              <span
                :class="exp.status === 'completed' ? 'text-green-400' : 'text-blue-400'"
                class="capitalize"
              >
                {{ exp.status }}
              </span>
            </td>
            <td class="px-3 py-2">
              <span v-if="exp.hasDebugLog" class="text-green-400 text-xs">Yes</span>
              <span v-else class="text-gray-600 text-xs">No</span>
            </td>
            <td class="px-3 py-2 text-gray-500 text-xs">
              {{ formatDate(exp.startedAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-gray-500 py-12 text-center">
      No expeditions found.
    </div>
  </div>
</template>
