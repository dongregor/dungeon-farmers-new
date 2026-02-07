<script setup lang="ts">
import { useGazetteStore } from '~/stores/gazette'
import { storeToRefs } from 'pinia'

definePageMeta({
  title: 'The Daily Grind',
})

const gazetteStore = useGazetteStore()
const { currentIssue, loading, error, archive } = storeToRefs(gazetteStore)

const showArchive = ref(false)

onMounted(async () => {
  try {
    await gazetteStore.fetchAndGenerate()
    gazetteStore.markAsRead()
  } catch {
    // Error is handled in store
  }
})

const handleRegenerate = async () => {
  try {
    await gazetteStore.regenerate()
  } catch {
    // Error is handled in store
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Loading state -->
    <div v-if="loading && !currentIssue" class="text-center py-20">
      <div class="text-4xl mb-4 animate-pulse">&#128240;</div>
      <p class="text-gray-400">Printing today's edition...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error && !currentIssue" class="text-center py-20">
      <div class="text-4xl mb-4">&#128683;</div>
      <p class="text-red-400 mb-4">{{ error }}</p>
      <button
        class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        @click="handleRegenerate"
      >
        Try Again
      </button>
    </div>

    <!-- Gazette content -->
    <div v-else-if="currentIssue && !showArchive">
      <!-- Masthead -->
      <GazetteMasthead
        :guild-name="currentIssue.guildName"
        :issue-number="currentIssue.issueNumber"
        :date="currentIssue.coveringDate"
      />

      <!-- Headline -->
      <GazetteHeadline :article="currentIssue.headline" />

      <!-- Two-column layout for middle content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Left column (2/3) - Dispatches + Spotlight -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Dispatches -->
          <div v-if="currentIssue.dispatches.length > 0">
            <h2 class="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 border-b border-gray-700 pb-2">
              Expedition Dispatches
            </h2>
            <div class="space-y-4">
              <GazetteDispatch
                v-for="dispatch in currentIssue.dispatches"
                :key="dispatch.id"
                :article="dispatch"
              />
            </div>
          </div>

          <!-- Hero Spotlight -->
          <GazetteSpotlight
            v-if="currentIssue.heroSpotlight"
            :article="currentIssue.heroSpotlight"
          />

          <!-- Letters to the Editor -->
          <GazetteLetters
            v-if="currentIssue.letters.length > 0"
            :letters="currentIssue.letters"
          />
        </div>

        <!-- Right column (1/3) - Stats, Gossip, Classifieds -->
        <div class="space-y-6">
          <!-- Stats Corner -->
          <GazetteStatsCorner :stats="currentIssue.stats" />

          <!-- Gossip Column -->
          <GazetteGossipColumn :articles="currentIssue.gossip" />

          <!-- Classifieds -->
          <GazetteClassifieds :classifieds="currentIssue.classifieds" />
        </div>
      </div>

      <!-- Forecast -->
      <GazetteForecast
        v-if="currentIssue.forecast"
        :text="currentIssue.forecast"
      />

      <!-- Footer actions -->
      <div class="flex items-center justify-between mt-8 pt-4 border-t border-gray-700">
        <button
          v-if="archive.length > 0"
          class="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          @click="showArchive = true"
        >
          View Archive ({{ archive.length }} issues)
        </button>
        <div v-else />

        <button
          class="text-sm text-gray-600 hover:text-gray-400 transition-colors"
          :disabled="loading"
          @click="handleRegenerate"
        >
          {{ loading ? 'Generating...' : 'Re-roll Edition' }}
        </button>
      </div>
    </div>

    <!-- Archive view -->
    <div v-else-if="showArchive">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-200">Archive</h1>
        <button
          class="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          @click="showArchive = false"
        >
          Back to Today's Edition
        </button>
      </div>

      <div v-if="archive.length === 0" class="text-center py-12">
        <p class="text-gray-500">No archived issues yet. Come back tomorrow!</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="issue in archive"
          :key="issue.id"
          class="border border-gray-700 rounded-lg p-4 bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-colors"
        >
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-bold text-gray-200">Issue #{{ issue.issueNumber }}</span>
              <span class="text-sm text-gray-500 ml-2">{{ issue.coveringDate }}</span>
            </div>
            <div class="text-xs text-gray-500">
              {{ issue.headline.title }}
            </div>
          </div>
          <p class="text-sm text-gray-400 mt-1 truncate">
            {{ issue.headline.body }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
