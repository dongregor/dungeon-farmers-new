<script setup lang="ts">
const {
  allQuests,
  unlockedQuests,
  lockedQuests,
  unclaimedQuests,
  unclaimedCount,
  completionStats,
  areMentorQuestsAvailable,
  showMentorPanel,
  toggleMentorPanel,
  claimQuestReward,
  claimAllRewards,
  getUnlockText,
} = useTutorial()

const activeFilter = ref<'all' | 'unlocked' | 'locked' | 'completed'>('all')
const claiming = ref(false)

const filteredQuests = computed(() => {
  switch (activeFilter.value) {
    case 'unlocked':
      return unlockedQuests.value.filter(q => !q.isComplete)
    case 'locked':
      return lockedQuests.value
    case 'completed':
      return allQuests.value.filter(q => q.isComplete)
    default:
      return allQuests.value
  }
})

const handleClaimQuest = async (questId: string) => {
  claiming.value = true
  try {
    await claimQuestReward(questId)
  } catch (error) {
    console.error('Failed to claim quest:', error)
  } finally {
    claiming.value = false
  }
}

const handleClaimAll = async () => {
  claiming.value = true
  try {
    await claimAllRewards()
  } catch (error) {
    console.error('Failed to claim all rewards:', error)
  } finally {
    claiming.value = false
  }
}

const tierGroups = computed(() => {
  const quests = filteredQuests.value
  return {
    early: quests.filter(q => q.tier === 'early'),
    mid: quests.filter(q => q.tier === 'mid'),
    late: quests.filter(q => q.tier === 'late'),
    final: quests.filter(q => q.tier === 'final'),
  }
})
</script>

<template>
  <div v-if="areMentorQuestsAvailable">
    <!-- Toggle Button (floating) -->
    <button
      class="fixed bottom-6 right-6 bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105 z-40 flex items-center gap-2"
      @click="toggleMentorPanel"
    >
      <span class="text-2xl">📚</span>
      <span>Mentor Quests</span>
      <span
        v-if="unclaimedCount > 0"
        class="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
      >
        {{ unclaimedCount }}
      </span>
    </button>

    <!-- Panel (slide-in from right) -->
    <Transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="showMentorPanel"
        class="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-4xl">📚</span>
              <div>
                <h2 class="text-2xl font-bold">Mentor Quests</h2>
                <p class="text-sm opacity-90">Optional tasks to learn and earn rewards</p>
              </div>
            </div>
            <button
              class="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              @click="toggleMentorPanel"
            >
              <span class="text-3xl">×</span>
            </button>
          </div>

          <!-- Stats -->
          <div class="bg-white bg-opacity-20 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium">Progress</span>
              <span class="text-sm font-bold">
                {{ completionStats.completed }} / {{ completionStats.total }}
              </span>
            </div>
            <div class="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div
                class="h-3 rounded-full bg-white transition-all duration-500"
                :style="{ width: `${completionStats.percentage}%` }"
              />
            </div>
          </div>

          <!-- Claim All Button -->
          <button
            v-if="unclaimedCount > 0"
            class="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            :disabled="claiming"
            @click="handleClaimAll"
          >
            <span>🎁</span>
            <span>Claim All Rewards ({{ unclaimedCount }})</span>
          </button>
        </div>

        <!-- Filters -->
        <div class="border-b border-gray-200 p-4 bg-gray-50">
          <div class="flex gap-2 overflow-x-auto">
            <button
              class="px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
              :class="activeFilter === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'"
              @click="activeFilter = 'all'"
            >
              All ({{ allQuests.length }})
            </button>
            <button
              class="px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
              :class="activeFilter === 'unlocked'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'"
              @click="activeFilter = 'unlocked'"
            >
              Available ({{ unlockedQuests.filter(q => !q.isComplete).length }})
            </button>
            <button
              class="px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
              :class="activeFilter === 'locked'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'"
              @click="activeFilter = 'locked'"
            >
              Locked ({{ lockedQuests.length }})
            </button>
            <button
              class="px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
              :class="activeFilter === 'completed'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'"
              @click="activeFilter = 'completed'"
            >
              Completed ({{ allQuests.filter(q => q.isComplete).length }})
            </button>
          </div>
        </div>

        <!-- Quest List -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="filteredQuests.length > 0">
            <!-- Early Quests -->
            <div v-if="tierGroups.early.length > 0" class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span class="text-2xl">🌱</span>
                <span>Early Quests</span>
              </h3>
              <div class="space-y-3">
                <TutorialMentorQuestCard
                  v-for="quest in tierGroups.early"
                  :key="quest.id"
                  :quest="quest"
                  :unlock-text="getUnlockText(quest)"
                  @claim="handleClaimQuest(quest.id)"
                />
              </div>
            </div>

            <!-- Mid Quests -->
            <div v-if="tierGroups.mid.length > 0" class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span class="text-2xl">⚡</span>
                <span>Mid Quests</span>
              </h3>
              <div class="space-y-3">
                <TutorialMentorQuestCard
                  v-for="quest in tierGroups.mid"
                  :key="quest.id"
                  :quest="quest"
                  :unlock-text="getUnlockText(quest)"
                  @claim="handleClaimQuest(quest.id)"
                />
              </div>
            </div>

            <!-- Late Quests -->
            <div v-if="tierGroups.late.length > 0" class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span class="text-2xl">👑</span>
                <span>Late Quests</span>
              </h3>
              <div class="space-y-3">
                <TutorialMentorQuestCard
                  v-for="quest in tierGroups.late"
                  :key="quest.id"
                  :quest="quest"
                  :unlock-text="getUnlockText(quest)"
                  @claim="handleClaimQuest(quest.id)"
                />
              </div>
            </div>

            <!-- Final Quest -->
            <div v-if="tierGroups.final.length > 0" class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span class="text-2xl">🏆</span>
                <span>Final Quest</span>
              </h3>
              <div class="space-y-3">
                <TutorialMentorQuestCard
                  v-for="quest in tierGroups.final"
                  :key="quest.id"
                  :quest="quest"
                  :unlock-text="getUnlockText(quest)"
                  @claim="handleClaimQuest(quest.id)"
                />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12 text-gray-500">
            <div class="text-6xl mb-4">📚</div>
            <p class="text-lg mb-2">No quests in this category</p>
            <p class="text-sm">Try a different filter!</p>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="border-t border-gray-200 p-4 bg-gray-50">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-xs text-blue-800">
              ℹ️ <strong>Tip:</strong> Mentor quests are optional and have no time limits.
              Complete them at your own pace to earn rewards and learn the game!
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showMentorPanel"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="toggleMentorPanel"
      />
    </Transition>
  </div>
</template>
