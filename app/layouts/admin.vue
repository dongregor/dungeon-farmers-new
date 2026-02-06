<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()

const adminNav = [
  { to: '/admin', label: 'Guilds' },
  { to: '/admin/expeditions', label: 'Expeditions' },
]

function isActive(path: string): boolean {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100">
    <!-- Top bar -->
    <header class="sticky top-0 z-50 bg-gray-900 border-b border-red-900/50">
      <div class="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin" class="text-lg font-bold text-red-400">
            Admin Panel
          </NuxtLink>
          <nav class="flex items-center gap-1">
            <NuxtLink
              v-for="item in adminNav"
              :key="item.to"
              :to="item.to"
              class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
              :class="isActive(item.to)
                ? 'bg-red-900/40 text-red-300'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/dashboard" class="text-sm text-gray-400 hover:text-white transition-colors">
            Back to Game
          </NuxtLink>
          <button
            class="text-sm text-gray-500 hover:text-white transition-colors"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-screen-2xl mx-auto px-6 py-6">
      <slot />
    </main>
  </div>
</template>
