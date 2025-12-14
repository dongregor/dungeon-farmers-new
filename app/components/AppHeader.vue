<script setup lang="ts">
const gameStore = useGameStore()
</script>

<template>
  <header class="bg-gray-800 border-b border-gray-700 px-4 py-3">
    <div class="container mx-auto flex items-center justify-between">
      <h1 class="text-xl font-bold text-guild-gold">Dungeon Farmers</h1>
      <div class="flex items-center gap-4">
        <span class="text-guild-gold font-semibold">
          {{ gameStore.gold }} Gold
        </span>
      </div>
    </div>
  </header>
</template>