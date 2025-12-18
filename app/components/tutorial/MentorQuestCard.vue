<script setup lang="ts">
import type { MentorQuest } from '~/data/mentorQuests'
import type { MentorQuestProgress } from '~/stores/tutorial'

interface Props {
  quest: MentorQuest & MentorQuestProgress
  unlockText?: string
}

interface Emits {
  (e: 'claim'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tierColors = {
  early: 'from-green-400 to-green-600',
  mid: 'from-blue-400 to-blue-600',
  late: 'from-purple-400 to-purple-600',
  final: 'from-yellow-400 to-yellow-600',
}

const tierBorderColors = {
  early: 'border-green-500',
  mid: 'border-blue-500',
  late: 'border-purple-500',
  final: 'border-yellow-500',
}

const tierLabels = {
  early: 'Early Quest',
  mid: 'Mid Quest',
  late: 'Late Quest',
  final: 'Final Quest',
}

const progressPercentage = computed(() => {
  if (!props.quest.progress) return 0
  if (props.quest.progress.target === 0) return 0
  return Math.min(100, (props.quest.progress.current / props.quest.progress.target) * 100)
})

const handleClaim = () => {
  emit('claim')
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border-2"
    :class="[
      tierBorderColors[quest.tier],
      {
        'opacity-60': !quest.isUnlocked,
        'bg-green-50': quest.isComplete && !quest.isClaimed,
        'bg-gray-50': quest.isClaimed,
      }
    ]"
  >
    <!-- Header with tier gradient -->
    <div
      class="h-2 bg-gradient-to-r"
      :class="tierColors[quest.tier]"
    />

    <div class="p-4">
      <!-- Icon and tier badge -->
      <div class="flex items-start justify-between mb-3">
        <div class="text-4xl">
          {{ quest.isUnlocked || quest.isComplete ? quest.icon : '🔒' }}
        </div>

        <div class="flex items-center gap-2">
          <!-- Tier badge -->
          <div class="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
            {{ tierLabels[quest.tier] }}
          </div>
        </div>
      </div>

      <!-- Title -->
      <div class="mb-2">
        <h3 class="font-bold text-gray-800 text-lg mb-1">
          {{ quest.title }}
        </h3>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-3">
        {{ quest.description }}
      </p>

      <!-- Unlock condition (if locked) -->
      <div v-if="!quest.isUnlocked" class="mb-3">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
          <p class="text-xs text-yellow-800">
            🔒 {{ unlockText || 'Locked' }}
          </p>
        </div>
      </div>

      <!-- Progress bar (if unlocked but not complete) -->
      <div v-if="quest.isUnlocked && !quest.isComplete && quest.progress" class="mb-3">
        <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{{ quest.progress.current }} / {{ quest.progress.target }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300 bg-gradient-to-r"
            :class="tierColors[quest.tier]"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
      </div>

      <!-- Completed date -->
      <div v-if="quest.isComplete && quest.completedAt && !quest.isClaimed" class="mb-3">
        <div class="text-xs text-green-600 font-medium">
          ✓ Completed {{ new Date(quest.completedAt).toLocaleDateString() }}
        </div>
      </div>

      <!-- Claimed date -->
      <div v-if="quest.isClaimed && quest.claimedAt" class="mb-3">
        <div class="text-xs text-gray-500 font-medium">
          ✓ Claimed {{ new Date(quest.claimedAt).toLocaleDateString() }}
        </div>
      </div>

      <!-- Reward -->
      <div
        class="rounded-lg p-3 border-2"
        :class="quest.isClaimed
          ? 'bg-gray-100 border-gray-300'
          : quest.isComplete
            ? 'bg-green-50 border-green-300'
            : 'bg-blue-50 border-blue-200'"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 flex-1">
            <span class="text-lg">
              {{ quest.isClaimed ? '✓' : quest.isComplete ? '🎁' : '🎯' }}
            </span>
            <div class="flex-1">
              <div class="text-xs text-gray-600 mb-1">Reward</div>
              <div
                class="text-sm font-medium"
                :class="quest.isClaimed
                  ? 'text-gray-600'
                  : quest.isComplete
                    ? 'text-green-800'
                    : 'text-blue-800'"
              >
                {{ quest.reward.description }}
              </div>
            </div>
          </div>

          <!-- Claim button -->
          <button
            v-if="quest.isComplete && !quest.isClaimed"
            class="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ml-2"
            @click="handleClaim"
          >
            Claim
          </button>
        </div>
      </div>

      <!-- Locked overlay (subtle) -->
      <div
        v-if="!quest.isUnlocked"
        class="absolute inset-0 bg-gray-900 bg-opacity-5 flex items-center justify-center rounded-lg pointer-events-none"
      >
        <div class="text-4xl opacity-30">🔒</div>
      </div>
    </div>
  </div>
</template>
