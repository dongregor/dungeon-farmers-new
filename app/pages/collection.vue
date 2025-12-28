<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  title: 'Collection Journal',
})

type CollectionTab = 'monsters' | 'collectibles' | 'sets'

const activeTab = ref<CollectionTab>('monsters')

// Mock data - would come from stores in real implementation
const monsterCollectionStats = ref({
  total: 32,
  collected: 17,
  percentage: 53,
})

const setCollectionStats = ref({
  total: 8,
  completed: 2,
  partialProgress: 3,
})

const collectibleStats = ref({
  total: 24,
  collected: 10,
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Collection Journal</h1>
        <p class="text-gray-600">
          Track your discoveries across the realm
        </p>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="flex border-b border-gray-200">
          <button
            class="flex-1 py-4 px-6 font-bold transition-all"
            :class="activeTab === 'monsters'
              ? 'bg-green-500 text-white border-b-4 border-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeTab = 'monsters'"
          >
            <div class="text-lg">Monsters</div>
            <div class="text-sm opacity-90">
              {{ monsterCollectionStats.collected }} / {{ monsterCollectionStats.total }}
            </div>
          </button>
          <button
            class="flex-1 py-4 px-6 font-bold transition-all"
            :class="activeTab === 'collectibles'
              ? 'bg-blue-500 text-white border-b-4 border-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeTab = 'collectibles'"
          >
            <div class="text-lg">Collectibles</div>
            <div class="text-sm opacity-90">
              {{ collectibleStats.collected }} / {{ collectibleStats.total }}
            </div>
          </button>
          <button
            class="flex-1 py-4 px-6 font-bold transition-all"
            :class="activeTab === 'sets'
              ? 'bg-purple-500 text-white border-b-4 border-purple-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeTab = 'sets'"
          >
            <div class="text-lg">Equipment Sets</div>
            <div class="text-sm opacity-90">
              {{ setCollectionStats.completed }} / {{ setCollectionStats.total }} Complete
            </div>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 min-h-[600px]">
          <!-- Monsters Tab -->
          <CollectionMonster v-if="activeTab === 'monsters'" />

          <!-- Collectibles Tab -->
          <CollectionCollectible v-if="activeTab === 'collectibles'" />

          <!-- Sets Tab -->
          <CollectionSet v-if="activeTab === 'sets'" />
        </div>
      </div>
    </div>
  </div>
</template>
