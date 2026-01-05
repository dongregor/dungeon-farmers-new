<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
    <div class="container mx-auto flex justify-around py-2">
      <NuxtLink
        to="/"
        class="flex flex-col items-center p-2 text-gray-400 hover:text-guild-gold"
        active-class="text-guild-gold"
      >
        <span class="text-2xl">⚔️</span>
        <span class="text-xs">Heroes</span>
      </NuxtLink>
      <NuxtLink
        to="/expeditions"
        class="flex flex-col items-center p-2 text-gray-400 hover:text-guild-gold"
        active-class="text-guild-gold"
      >
        <span class="text-2xl">🗺️</span>
        <span class="text-xs">Expeditions</span>
      </NuxtLink>
      <NuxtLink
        to="/inventory"
        class="flex flex-col items-center p-2 text-gray-400 hover:text-guild-gold"
        active-class="text-guild-gold"
      >
        <span class="text-2xl">🎒</span>
        <span class="text-xs">Inventory</span>
      </NuxtLink>
      <NuxtLink
        to="/settings"
        class="flex flex-col items-center p-2 text-gray-400 hover:text-guild-gold"
        active-class="text-guild-gold"
      >
        <span class="text-2xl">⚙️</span>
        <span class="text-xs">Settings</span>
      </NuxtLink>
    </div>
  </nav>
</template>