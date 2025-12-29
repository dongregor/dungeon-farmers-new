<script setup lang="ts">
const gameStore = useGameStore()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<template>
  <header class="bg-gray-800 border-b border-gray-700 px-4 py-3">
    <div class="container mx-auto flex items-center justify-between">
      <h1 class="text-xl font-bold text-guild-gold">Dungeon Farmers</h1>
      <div class="flex items-center gap-4">
        <span class="text-guild-gold font-semibold">
          {{ gameStore.gold }} Gold
        </span>
        <button
          v-if="user"
          class="text-sm text-gray-400 hover:text-white transition-colors"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>