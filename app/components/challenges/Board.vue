<script setup lang="ts">
import { useChallengeStore } from '~/stores/challenges'
import { storeToRefs } from 'pinia'
import type { Challenge, ChallengeProgress } from '~/stores/challenges'

const challengeStore = useChallengeStore()
const {
  dailyChallenges,
  weeklyChallenges,
  unclaimedCount,
  timeUntilDailyReset,
  timeUntilWeeklyReset,
  dailyStats,
  weeklyStats,
} = storeToRefs(challengeStore)

const activeTab = ref<'daily' | 'weekly'>('daily')
const claiming = ref(false)

onMounted(() => {
  challengeStore.fetchChallenges()
})

const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) return 'Resetting...'

  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const getProgressPercentage = (current: number, target: number): number => {
  return Math.min(100, (current / target) * 100)
}

const handleClaimReward = async (challengeId: string) => {
  claiming.value = true
  try {
    await challengeStore.claimReward(challengeId)
  } catch (error) {
    console.error('Failed to claim reward:', error)
  } finally {
    claiming.value = false
  }
}

const handleClaimAll = async () => {
  claiming.value = true
  try {
    await challengeStore.claimAllRewards()
  } catch (error) {
    console.error('Failed to claim all rewards:', error)
  } finally {
    claiming.value = false
  }
}

const getChallengeTypeColor = (type: 'daily' | 'weekly') => {
  return type === 'daily' ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'
}

const getChallengeTypeBorder = (type: 'daily' | 'weekly') => {
  return type === 'daily' ? 'border-blue-500' : 'border-purple-500'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Challenge Board</h2>
        <button
          v-if="unclaimedCount > 0"
          class="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          :disabled="claiming"
          @click="handleClaimAll"
        >
          <span>🎁</span>
          <span>Claim All ({{ unclaimedCount }})</span>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2">
        <button
          class="flex-1 py-3 px-4 rounded-lg font-bold transition-all"
          :class="activeTab === 'daily'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="activeTab = 'daily'"
        >
          <div class="text-lg">Daily Challenges</div>
          <div class="text-sm opacity-90">
            {{ dailyStats.completed }}/{{ dailyStats.total }} Complete
          </div>
        </button>
        <button
          class="flex-1 py-3 px-4 rounded-lg font-bold transition-all"
          :class="activeTab === 'weekly'
            ? 'bg-purple-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="activeTab = 'weekly'"
        >
          <div class="text-lg">Weekly Challenges</div>
          <div class="text-sm opacity-90">
            {{ weeklyStats.completed }}/{{ weeklyStats.total }} Complete
          </div>
        </button>
      </div>
    </div>

    <!-- Daily Challenges -->
    <div v-if="activeTab === 'daily'" class="p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-700">Today's Challenges</h3>
        <div class="text-sm text-gray-600">
          Resets in: <span class="font-bold text-blue-600">{{ formatTimeRemaining(timeUntilDailyReset) }}</span>
        </div>
      </div>

      <div v-if="dailyChallenges.length > 0" class="space-y-4">
        <div
          v-for="challenge in dailyChallenges"
          :key="challenge.id"
          class="border-2 rounded-lg p-4 transition-all hover:shadow-md"
          :class="[
            getChallengeTypeBorder('daily'),
            challenge.progress?.completed ? 'bg-green-50' : 'bg-white'
          ]"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div class="text-4xl">{{ challenge.icon }}</div>

            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h4 class="font-bold text-gray-800 text-lg">{{ challenge.title }}</h4>
                  <p class="text-sm text-gray-600">{{ challenge.description }}</p>
                </div>

                <!-- Claim button -->
                <button
                  v-if="challenge.progress?.completed && !challenge.progress?.claimed"
                  class="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                  :disabled="claiming"
                  @click="handleClaimReward(challenge.id)"
                >
                  Claim
                </button>
                <div
                  v-else-if="challenge.progress?.claimed"
                  class="text-green-600 font-bold flex items-center gap-1"
                >
                  <span>✓</span>
                  <span>Claimed</span>
                </div>
              </div>

              <!-- Progress bar -->
              <div v-if="!challenge.progress?.completed" class="mb-3">
                <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{{ challenge.progress?.current || 0 }} / {{ challenge.requirement.target }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all duration-300 bg-gradient-to-r"
                    :class="getChallengeTypeColor('daily')"
                    :style="{ width: `${getProgressPercentage(challenge.progress?.current || 0, challenge.requirement.target)}%` }"
                  />
                </div>
              </div>

              <!-- Reward -->
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600">Reward:</span>
                <span class="font-bold text-yellow-600">{{ challenge.reward.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-gray-500">
        <div class="text-6xl mb-4">📋</div>
        <p class="text-lg">No daily challenges available</p>
      </div>
    </div>

    <!-- Weekly Challenges -->
    <div v-if="activeTab === 'weekly'" class="p-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-700">This Week's Challenges</h3>
        <div class="text-sm text-gray-600">
          Resets in: <span class="font-bold text-purple-600">{{ formatTimeRemaining(timeUntilWeeklyReset) }}</span>
        </div>
      </div>

      <div v-if="weeklyChallenges.length > 0" class="space-y-4">
        <div
          v-for="challenge in weeklyChallenges"
          :key="challenge.id"
          class="border-2 rounded-lg p-4 transition-all hover:shadow-md"
          :class="[
            getChallengeTypeBorder('weekly'),
            challenge.progress?.completed ? 'bg-green-50' : 'bg-white'
          ]"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div class="text-4xl">{{ challenge.icon }}</div>

            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h4 class="font-bold text-gray-800 text-lg">{{ challenge.title }}</h4>
                  <p class="text-sm text-gray-600">{{ challenge.description }}</p>
                </div>

                <!-- Claim button -->
                <button
                  v-if="challenge.progress?.completed && !challenge.progress?.claimed"
                  class="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                  :disabled="claiming"
                  @click="handleClaimReward(challenge.id)"
                >
                  Claim
                </button>
                <div
                  v-else-if="challenge.progress?.claimed"
                  class="text-green-600 font-bold flex items-center gap-1"
                >
                  <span>✓</span>
                  <span>Claimed</span>
                </div>
              </div>

              <!-- Progress bar -->
              <div v-if="!challenge.progress?.completed" class="mb-3">
                <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{{ challenge.progress?.current || 0 }} / {{ challenge.requirement.target }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all duration-300 bg-gradient-to-r"
                    :class="getChallengeTypeColor('weekly')"
                    :style="{ width: `${getProgressPercentage(challenge.progress?.current || 0, challenge.requirement.target)}%` }"
                  />
                </div>
              </div>

              <!-- Reward -->
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600">Reward:</span>
                <span class="font-bold text-yellow-600">{{ challenge.reward.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-gray-500">
        <div class="text-6xl mb-4">📋</div>
        <p class="text-lg">No weekly challenges available</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!challengeStore.loading && dailyChallenges.length === 0 && weeklyChallenges.length === 0" class="p-12 text-center text-gray-500">
      <div class="text-6xl mb-4">🎯</div>
      <p class="text-lg mb-2">No challenges available</p>
      <p class="text-sm">Check back later for new challenges!</p>
    </div>
  </div>
</template>
