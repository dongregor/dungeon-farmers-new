<script setup lang="ts">
definePageMeta({ layout: 'admin' })

interface AdminGuild {
  playerId: string
  username: string
  email: string
  guildName: string
  guildTabard: any
  guildLevel: number
  gold: number
  gems: number
  isSupporter: boolean
  isAdmin: boolean
  heroCount: number
  expeditions: { total: number; active: number; completed: number }
  createdAt: string
  updatedAt: string
}

const loading = ref(true)
const error = ref<string | null>(null)
const guilds = ref<AdminGuild[]>([])
const search = ref('')

const filteredGuilds = computed(() => {
  if (!search.value) return guilds.value
  const q = search.value.toLowerCase()
  return guilds.value.filter(g =>
    g.guildName?.toLowerCase().includes(q) ||
    g.username?.toLowerCase().includes(q) ||
    g.email?.toLowerCase().includes(q)
  )
})

async function fetchGuilds() {
  loading.value = true
  error.value = null
  try {
    const res = await $fetch<{ guilds: AdminGuild[] }>('/api/admin/guilds')
    guilds.value = res.guilds
  } catch (e: any) {
    error.value = e.data?.statusMessage || e.message || 'Failed to load guilds'
  } finally {
    loading.value = false
  }
}

onMounted(fetchGuilds)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white">All Guilds</h1>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-500">{{ guilds.length }} guilds total</span>
        <input
          v-model="search"
          type="text"
          placeholder="Search guilds..."
          class="bg-gray-800 border border-gray-700 text-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-500"
        />
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-400 py-12 text-center">
      Loading guilds...
    </div>

    <!-- Guild Table -->
    <div v-else-if="filteredGuilds.length > 0" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-800 text-gray-400 text-left">
            <th class="px-4 py-3 font-medium">Guild</th>
            <th class="px-4 py-3 font-medium">Player</th>
            <th class="px-4 py-3 font-medium text-right">Level</th>
            <th class="px-4 py-3 font-medium text-right">Heroes</th>
            <th class="px-4 py-3 font-medium text-right">Gold</th>
            <th class="px-4 py-3 font-medium text-right">Expeditions</th>
            <th class="px-4 py-3 font-medium">Flags</th>
            <th class="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="guild in filteredGuilds"
            :key="guild.playerId"
            class="border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors cursor-pointer"
            @click="navigateTo(`/admin/guilds/${guild.playerId}`)"
          >
            <td class="px-4 py-3">
              <span class="font-medium text-white">{{ guild.guildName || 'Unnamed' }}</span>
            </td>
            <td class="px-4 py-3">
              <div>
                <span class="text-gray-200">{{ guild.username }}</span>
                <span class="block text-xs text-gray-500">{{ guild.email }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right text-gray-300">{{ guild.guildLevel }}</td>
            <td class="px-4 py-3 text-right text-gray-300">{{ guild.heroCount }}</td>
            <td class="px-4 py-3 text-right text-yellow-400">{{ guild.gold?.toLocaleString() }}</td>
            <td class="px-4 py-3 text-right">
              <span class="text-gray-300">{{ guild.expeditions.total }}</span>
              <span v-if="guild.expeditions.active > 0" class="ml-1 text-xs text-green-400">({{ guild.expeditions.active }} active)</span>
            </td>
            <td class="px-4 py-3">
              <span v-if="guild.isAdmin" class="inline-block px-1.5 py-0.5 text-xs rounded bg-red-900/40 text-red-400 mr-1">admin</span>
              <span v-if="guild.isSupporter" class="inline-block px-1.5 py-0.5 text-xs rounded bg-purple-900/40 text-purple-400">supporter</span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">
              {{ new Date(guild.createdAt).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-gray-500 py-12 text-center">
      <p v-if="search">No guilds match "{{ search }}"</p>
      <p v-else>No guilds found.</p>
    </div>
  </div>
</template>
