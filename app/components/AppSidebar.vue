<script setup lang="ts">
const gameStore = useGameStore()
const gazetteStore = useGazetteStore()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()

const navItems = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/heroes', icon: '⚔️', label: 'Heroes' },
  { to: '/tavern', icon: '🍺', label: 'Tavern' },
  { to: '/exploration', icon: '🌍', label: 'Exploration' },
  { to: '/expeditions', icon: '🗺️', label: 'Expeditions' },
  { to: '/inventory', icon: '🎒', label: 'Inventory' },
  { to: '/gazette', icon: '📰', label: 'Daily Grind' },
]

const bottomItems = [
  { to: '/settings', icon: '⚙️', label: 'Settings' },
]

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout failed:', error.message)
  }
  navigateTo('/login')
}
</script>

<template>
  <aside class="fixed left-0 top-0 h-screen w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
    <!-- Logo/Title -->
    <div class="p-4 border-b border-gray-700">
      <h1 class="text-xl font-bold text-guild-gold">Dungeon Farmers</h1>
    </div>

    <!-- Resources -->
    <div class="px-4 py-3 border-b border-gray-700">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-400">Gold</span>
        <span class="text-guild-gold font-bold">{{ gameStore.gold?.toLocaleString() || 0 }}</span>
      </div>
    </div>

    <!-- Main Navigation -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <ul class="space-y-1 px-2">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="isActive(item.to)
              ? 'bg-guild-gold/20 text-guild-gold'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
          >
            <span class="text-xl">{{ item.icon }}</span>
            <span class="font-medium">{{ item.label }}</span>
            <span
              v-if="item.to === '/gazette' && gazetteStore.hasUnread"
              class="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full"
            >
              NEW
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Bottom Navigation -->
    <div class="border-t border-gray-700 py-4">
      <ul class="space-y-1 px-2">
        <li v-for="item in bottomItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="isActive(item.to)
              ? 'bg-guild-gold/20 text-guild-gold'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'"
          >
            <span class="text-xl">{{ item.icon }}</span>
            <span class="font-medium">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>

      <!-- User & Logout -->
      <div v-if="user" class="px-4 pt-4 mt-2 border-t border-gray-700">
        <div class="text-xs text-gray-500 truncate mb-2">
          {{ user.email }}
        </div>
        <button
          class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          @click="logout"
        >
          <span class="text-xl">🚪</span>
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>
