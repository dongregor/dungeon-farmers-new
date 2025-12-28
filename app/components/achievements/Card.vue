<script setup lang="ts">
import type { Achievement } from '~/data/achievements'
import type { AchievementProgress } from '~/stores/achievements'

interface Props {
  achievement: Achievement
  isUnlocked?: boolean
  unlockedAt?: string
  progress?: AchievementProgress
  isShowcased?: boolean
  canToggleShowcase?: boolean
}

interface Emits {
  (e: 'toggleShowcase'): void
}

const props = withDefaults(defineProps<Props>(), {
  isUnlocked: false,
  isShowcased: false,
  canToggleShowcase: false,
})

const emit = defineEmits<Emits>()

const tierColors = {
  bronze: 'from-orange-400 to-orange-600',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
}

const tierBorderColors = {
  bronze: 'border-orange-500',
  silver: 'border-gray-400',
  gold: 'border-yellow-500',
  platinum: 'border-purple-500',
}

const categoryLabels = {
  explorer: 'Explorer',
  collector: 'Collector',
  hoarder: 'Hoarder',
  storyteller: 'Storyteller',
  master: 'Master',
  veteran: 'Veteran',
  merchant: 'Merchant',
  challenger: 'Challenger',
  hidden: 'Hidden',
}

const progressPercentage = computed(() => {
  if (!props.progress) return 0
  if (props.progress.targetValue === 0) return 0
  return Math.min(100, (props.progress.currentValue / props.progress.targetValue) * 100)
})

const formatUnlockDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
    :class="[
      tierBorderColors[achievement.tier],
      { 'opacity-50': !isUnlocked && achievement.isHidden },
      'border-2'
    ]"
  >
    <!-- Header with tier gradient -->
    <div
      class="h-2 bg-gradient-to-r"
      :class="tierColors[achievement.tier]"
    />

    <div class="p-4">
      <!-- Icon and showcase -->
      <div class="flex items-start justify-between mb-3">
        <div class="text-4xl">
          {{ isUnlocked || !achievement.isHidden ? achievement.icon : '❓' }}
        </div>

        <div class="flex items-center gap-2">
          <!-- Showcase toggle -->
          <button
            v-if="canToggleShowcase && isUnlocked"
            class="text-2xl hover:scale-110 transition-transform"
            :title="isShowcased ? 'Remove from showcase' : 'Add to showcase'"
            @click="emit('toggleShowcase')"
          >
            {{ isShowcased ? '⭐' : '☆' }}
          </button>

          <!-- Points badge -->
          <div class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
            {{ achievement.points }}p
          </div>
        </div>
      </div>

      <!-- Title and category -->
      <div class="mb-2">
        <h3 class="font-bold text-gray-800 text-lg mb-1">
          {{ isUnlocked || !achievement.isHidden ? achievement.name : '???' }}
        </h3>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-600 capitalize">
            {{ categoryLabels[achievement.category] }}
          </span>
          <span class="text-gray-400">•</span>
          <span class="text-gray-600 capitalize">
            {{ achievement.tier }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-3">
        {{ isUnlocked || !achievement.isHidden ? achievement.description : 'Hidden achievement - complete to reveal!' }}
      </p>

      <!-- Progress bar (if not unlocked and has progress) -->
      <div v-if="!isUnlocked && progress" class="mb-3">
        <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{{ progress.currentValue }} / {{ progress.targetValue }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300 bg-gradient-to-r"
            :class="tierColors[achievement.tier]"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
      </div>

      <!-- Unlocked date -->
      <div v-if="isUnlocked && unlockedAt" class="text-xs text-gray-500 mb-3">
        Unlocked on {{ formatUnlockDate(unlockedAt) }}
      </div>

      <!-- Reward -->
      <div
        class="rounded-lg p-3 border-2"
        :class="isUnlocked ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ isUnlocked ? '✓' : '🎁' }}</span>
          <div class="flex-1">
            <div class="text-xs text-gray-600 mb-1">Reward</div>
            <div class="text-sm font-medium" :class="isUnlocked ? 'text-green-800' : 'text-gray-700'">
              {{ achievement.reward.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Locked overlay (for hidden achievements) -->
      <div
        v-if="!isUnlocked && achievement.isHidden"
        class="absolute inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center rounded-lg"
      >
        <div class="text-6xl opacity-50">🔒</div>
      </div>
    </div>
  </div>
</template>
