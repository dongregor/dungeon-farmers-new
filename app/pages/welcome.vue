<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import type { Hero } from '~~/types'
import { generateHero } from '~/utils/heroGenerator'

definePageMeta({
  layout: false,
  title: 'Welcome to Dungeon Farmers',
})

// Stores
const gameStore = useGameStore()
const heroStore = useHeroStore()
const tutorialStore = useTutorialStore()
const router = useRouter()

// State
const currentStep = ref(1)
const guildName = ref('')
const guildNameError = ref('')
const firstHero = ref<Hero | null>(null)
const rerollsUsed = ref(0)
const maxRerolls = ref(1)
const tutorialMode = ref(true)
const isGenerating = ref(false)
const isSaving = ref(false)

// Load saved progress from localStorage
onMounted(() => {
  try {
    const savedProgress = localStorage.getItem('welcome_progress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      currentStep.value = progress.step || 1
      guildName.value = progress.guildName || ''
      if (progress.firstHero) {
        firstHero.value = progress.firstHero
      }
      rerollsUsed.value = progress.rerollsUsed || 0
      tutorialMode.value = progress.tutorialMode !== false
    }
  } catch (error) {
    console.error('Failed to load welcome progress:', error)
  }
})

// Save progress to localStorage whenever state changes
watch([currentStep, guildName, firstHero, rerollsUsed, tutorialMode], () => {
  try {
    localStorage.setItem('welcome_progress', JSON.stringify({
      step: currentStep.value,
      guildName: guildName.value,
      firstHero: firstHero.value,
      rerollsUsed: rerollsUsed.value,
      tutorialMode: tutorialMode.value,
    }))
  } catch (error) {
    console.error('Failed to save welcome progress:', error)
  }
})

// Computed
const totalSteps = 4
const progressPercentage = computed(() => (currentStep.value / totalSteps) * 100)
const canReroll = computed(() => rerollsUsed.value < maxRerolls.value)

// Step 1: Welcome
const handleStartAdventure = () => {
  currentStep.value = 2
}

// Step 2: Guild Naming
const validateGuildName = () => {
  guildNameError.value = ''

  if (!guildName.value.trim()) {
    guildNameError.value = 'Guild name is required'
    return false
  }

  if (guildName.value.trim().length < 3) {
    guildNameError.value = 'Guild name must be at least 3 characters'
    return false
  }

  if (guildName.value.trim().length > 20) {
    guildNameError.value = 'Guild name must be 20 characters or less'
    return false
  }

  return true
}

const handleGuildNameSubmit = () => {
  if (validateGuildName()) {
    tutorialStore.setGuildMasterName(guildName.value.trim())
    currentStep.value = 3
    // Generate first hero when entering step 3
    if (!firstHero.value) {
      generateFirstHero()
    }
  }
}

// Step 3: First Hero
const generateFirstHero = () => {
  isGenerating.value = true

  // Add slight delay for better UX
  setTimeout(() => {
    const heroData = generateHero({ forceRarity: 'uncommon' })

    // Create full hero object with required fields
    firstHero.value = {
      id: uuid(),
      ...heroData,
      currentExpeditionId: null,
      isFavorite: false,
      isOnExpedition: false,
      isStationed: false,
      stationedZoneId: null,
      morale: 'content',
      moraleValue: 75,
      moraleLastUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Hero

    isGenerating.value = false
  }, 300)
}

const handleReroll = () => {
  if (canReroll.value) {
    rerollsUsed.value++
    generateFirstHero()
  }
}

const handleAcceptHero = () => {
  currentStep.value = 4
}

// Step 4: Tutorial Setup
const handleBeginAdventure = async () => {
  if (!firstHero.value) return

  isSaving.value = true

  try {
    // In a real implementation, this would:
    // 1. Create the guild with the given name
    // 2. Add the first hero to the player's roster
    // 3. Initialize tutorial state
    // 4. Save to backend

    // For now, we'll simulate this with local state
    await new Promise(resolve => setTimeout(resolve, 500))

    // Set tutorial preferences
    if (tutorialMode.value) {
      tutorialStore.startTutorial()
    } else {
      tutorialStore.skipTutorial()
    }

    // Clear welcome progress
    localStorage.removeItem('welcome_progress')

    // Redirect to dashboard
    await router.push('/')
  } catch (error) {
    console.error('Failed to complete onboarding:', error)
  } finally {
    isSaving.value = false
  }
}

// Navigation helpers
const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const skipOnboarding = () => {
  if (confirm('Are you sure you want to skip onboarding? You can still access the tutorial later.')) {
    localStorage.removeItem('welcome_progress')
    tutorialStore.skipTutorial()
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4 py-8">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
    </div>

    <!-- Main Card -->
    <div class="relative w-full max-w-2xl">
      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="flex justify-between text-sm text-gray-400 mb-2">
          <span>Step {{ currentStep }} of {{ totalSteps }}</span>
          <button
            v-if="currentStep > 1"
            type="button"
            class="text-gray-400 hover:text-gray-300 underline"
            @click="skipOnboarding"
          >
            Skip
          </button>
        </div>
        <UiProgressBar
          :current="currentStep"
          :max="totalSteps"
          color="purple"
          size="md"
        />
      </div>

      <!-- Content Card -->
      <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <!-- Step 1: Welcome -->
        <Transition name="fade" mode="out-in">
          <div v-if="currentStep === 1" key="step-1" class="p-8 md:p-12">
            <div class="text-center mb-8">
              <div class="text-6xl mb-6">⚔️</div>
              <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                Dungeon Farmers
              </h1>
              <p class="text-xl text-gray-300 mb-2">
                Build Your Guild. Farm Your Dungeons.
              </p>
              <p class="text-gray-400">
                Manage quirky heroes, send them on expeditions, and build your own farmable dungeons.
              </p>
            </div>

            <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 class="text-lg font-bold text-white mb-4">What Awaits You:</h2>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <span class="text-2xl">👥</span>
                  <div>
                    <h3 class="font-semibold text-white">Quirky Heroes</h3>
                    <p class="text-sm text-gray-400">Randomly generated heroes with unique traits and personalities</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-2xl">🗺️</span>
                  <div>
                    <h3 class="font-semibold text-white">Epic Expeditions</h3>
                    <p class="text-sm text-gray-400">Send heroes on adventures and read their emergent stories</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-2xl">🏰</span>
                  <div>
                    <h3 class="font-semibold text-white">Player-Built Dungeons</h3>
                    <p class="text-sm text-gray-400">Capture monsters and build dungeons to farm the loot you need</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <FormBaseButton
                variant="primary"
                size="lg"
                class="w-full"
                @click="handleStartAdventure"
              >
                Start Your Adventure →
              </FormBaseButton>

              <button
                type="button"
                class="text-gray-400 hover:text-gray-300 text-sm underline"
                @click="skipOnboarding"
              >
                I Have an Account
              </button>
            </div>
          </div>

          <!-- Step 2: Guild Naming -->
          <div v-else-if="currentStep === 2" key="step-2" class="p-8 md:p-12">
            <div class="text-center mb-8">
              <div class="text-6xl mb-6">🏰</div>
              <h2 class="text-3xl font-bold text-white mb-3">
                Name Your Guild
              </h2>
              <p class="text-gray-400">
                Every great guild needs a memorable name. What will you call yours?
              </p>
            </div>

            <div class="max-w-md mx-auto">
              <FormBaseInput
                v-model="guildName"
                label="Guild Name"
                placeholder="e.g., The Golden Slimes"
                :error="guildNameError"
                :hint="`${guildName.length}/20 characters`"
                required
                @keyup.enter="handleGuildNameSubmit"
                @input="guildNameError = ''"
              />

              <div class="mt-6 bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                <p class="text-sm text-blue-300">
                  <strong>Tip:</strong> Choose a name that reflects your guild's personality. You can always change it later in settings!
                </p>
              </div>

              <div class="mt-8 flex gap-3">
                <FormBaseButton
                  variant="ghost"
                  size="lg"
                  @click="goBack"
                >
                  ← Back
                </FormBaseButton>
                <FormBaseButton
                  variant="primary"
                  size="lg"
                  class="flex-1"
                  :disabled="!guildName.trim() || guildName.length < 3"
                  @click="handleGuildNameSubmit"
                >
                  Continue →
                </FormBaseButton>
              </div>
            </div>
          </div>

          <!-- Step 3: First Hero -->
          <div v-else-if="currentStep === 3" key="step-3" class="p-8 md:p-12">
            <div class="text-center mb-8">
              <div class="text-6xl mb-6">✨</div>
              <h2 class="text-3xl font-bold text-white mb-3">
                Meet Your First Hero
              </h2>
              <p class="text-gray-400">
                Every guild starts with one hero. Here's who answered your call!
              </p>
            </div>

            <div class="max-w-md mx-auto">
              <!-- Loading State -->
              <div v-if="isGenerating" class="flex flex-col items-center justify-center py-12">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4" />
                <p class="text-gray-400">Generating hero...</p>
              </div>

              <!-- Hero Card -->
              <div v-else-if="firstHero" class="mb-6">
                <HeroCard :hero="firstHero" :show-details="true" />

                <div class="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <h3 class="text-sm font-semibold text-white mb-2">Understanding Traits:</h3>
                  <ul class="text-xs text-gray-400 space-y-1">
                    <li><strong class="text-gray-300">Gameplay Traits:</strong> Affect combat, utility, and survival</li>
                    <li><strong class="text-gray-300">Personality Traits:</strong> Influence expedition logs and stories</li>
                    <li><strong class="text-gray-300">Rarity:</strong> Higher rarity = more traits and better stats</li>
                  </ul>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <FormBaseButton
                  variant="primary"
                  size="lg"
                  class="w-full"
                  @click="handleAcceptHero"
                >
                  Accept This Hero →
                </FormBaseButton>

                <FormBaseButton
                  v-if="canReroll"
                  variant="secondary"
                  size="md"
                  class="w-full"
                  :disabled="isGenerating"
                  @click="handleReroll"
                >
                  🎲 Reroll ({{ maxRerolls - rerollsUsed }} left)
                </FormBaseButton>

                <p v-else class="text-center text-sm text-gray-500">
                  No rerolls remaining
                </p>
              </div>

              <div class="mt-6">
                <FormBaseButton
                  variant="ghost"
                  size="md"
                  class="w-full"
                  @click="goBack"
                >
                  ← Back
                </FormBaseButton>
              </div>
            </div>
          </div>

          <!-- Step 4: Tutorial Setup -->
          <div v-else-if="currentStep === 4" key="step-4" class="p-8 md:p-12">
            <div class="text-center mb-8">
              <div class="text-6xl mb-6">📚</div>
              <h2 class="text-3xl font-bold text-white mb-3">
                Ready to Begin?
              </h2>
              <p class="text-gray-400">
                One last question before you start your adventure...
              </p>
            </div>

            <div class="max-w-md mx-auto">
              <!-- Tutorial Toggle -->
              <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-6">
                <div class="flex items-start justify-between gap-4 mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-2">
                      Enable Tutorial Mode?
                    </h3>
                    <p class="text-sm text-gray-400">
                      We recommend the tutorial for first-time players. It teaches you the core game mechanics through a quick guided experience.
                    </p>
                  </div>
                  <FormBaseToggle v-model="tutorialMode" />
                </div>

                <div v-if="tutorialMode" class="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-blue-300 mb-2">Tutorial includes:</h4>
                  <ul class="text-xs text-blue-200 space-y-1">
                    <li>• Your first expedition (instant completion)</li>
                    <li>• Understanding expedition logs</li>
                    <li>• Introduction to mentor quests</li>
                    <li>• ~2-3 minutes to complete</li>
                  </ul>
                </div>

                <div v-else class="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
                  <p class="text-xs text-yellow-200">
                    <strong>Note:</strong> You can still access mentor quests and help guides from the main menu at any time.
                  </p>
                </div>
              </div>

              <!-- Summary -->
              <div class="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-700/50 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-white mb-4">Your Adventure Begins:</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-400">Guild Name:</span>
                    <span class="text-white font-medium">{{ guildName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">First Hero:</span>
                    <span class="text-white font-medium">{{ firstHero?.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Tutorial:</span>
                    <span class="text-white font-medium">{{ tutorialMode ? 'Enabled' : 'Disabled' }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <FormBaseButton
                  variant="primary"
                  size="lg"
                  class="w-full"
                  :loading="isSaving"
                  :disabled="isSaving"
                  @click="handleBeginAdventure"
                >
                  {{ isSaving ? 'Preparing...' : 'Begin Adventure! 🎮' }}
                </FormBaseButton>

                <FormBaseButton
                  variant="ghost"
                  size="md"
                  class="w-full"
                  :disabled="isSaving"
                  @click="goBack"
                >
                  ← Back
                </FormBaseButton>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center text-sm text-gray-500">
        <p>Dungeon Farmers - A lighthearted idle RPG adventure</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
