<script setup lang="ts">
const { tutorial, nextTutorialStep, setGuildMasterName, completeTutorialExpedition, skipTutorial } = useTutorial()

const guildNameInput = ref('')
const showSkipConfirm = ref(false)

const handleNameSubmit = () => {
  if (guildNameInput.value.trim()) {
    setGuildMasterName(guildNameInput.value.trim())
    nextTutorialStep()
  }
}

const handleStartExpedition = () => {
  // In a real implementation, this would trigger an instant expedition
  // For now, we'll simulate it
  setTimeout(() => {
    completeTutorialExpedition()
    nextTutorialStep()
  }, 500)
}

const handleViewLog = () => {
  nextTutorialStep()
}

const handleComplete = () => {
  nextTutorialStep()
}

const handleSkip = () => {
  showSkipConfirm.value = true
}

const confirmSkip = () => {
  skipTutorial()
  showSkipConfirm.value = false
}

const cancelSkip = () => {
  showSkipConfirm.value = false
}
</script>

<template>
  <div v-if="tutorial.isActive" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Skip button (top right) -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Tutorial</h2>
        <button
          class="text-gray-500 hover:text-gray-700 text-sm underline"
          @click="handleSkip"
        >
          Skip Tutorial
        </button>
      </div>

      <!-- Welcome Step -->
      <div v-if="tutorial.currentStep === 'welcome'" class="p-8">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">👋</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Welcome to Dungeon Farmers!</h3>
          <p class="text-gray-600">
            Build your guild, send heroes on expeditions, and capture monsters to stock your own dungeons.
          </p>
        </div>

        <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <h4 class="font-bold text-blue-900 mb-2">What You'll Learn</h4>
          <ul class="space-y-2 text-sm text-blue-800">
            <li class="flex items-start gap-2">
              <span class="text-lg">✓</span>
              <span>Name your Guild Master</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-lg">✓</span>
              <span>Send your first expedition</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-lg">✓</span>
              <span>See expedition logs and collect loot</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-lg">✓</span>
              <span>Discover optional mentor quests for deeper learning</span>
            </li>
          </ul>
        </div>

        <div class="flex justify-center">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg text-lg transition-colors"
            @click="nextTutorialStep"
          >
            Let's Get Started! →
          </button>
        </div>
      </div>

      <!-- Name Guild Step -->
      <div v-else-if="tutorial.currentStep === 'name_guild'" class="p-8">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">⚔️</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Name Your Guild Master</h3>
          <p class="text-gray-600">
            Every guild needs a leader. What will you call your first hero?
          </p>
        </div>

        <div class="max-w-md mx-auto">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Guild Master Name
            </label>
            <input
              v-model="guildNameInput"
              type="text"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              placeholder="e.g., Sir Reginald"
              maxlength="30"
              @keyup.enter="handleNameSubmit"
            />
            <p class="text-xs text-gray-500 mt-2">
              {{ guildNameInput.length }}/30 characters
            </p>
          </div>

          <div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-yellow-800">
              💡 <strong>Tip:</strong> Your Guild Master is a randomly generated hero like all others.
              Their name is just for fun - traits and stats are what matter!
            </p>
          </div>

          <button
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!guildNameInput.trim()"
            @click="handleNameSubmit"
          >
            Continue →
          </button>
        </div>
      </div>

      <!-- Tutorial Expedition Step -->
      <div v-else-if="tutorial.currentStep === 'tutorial_expedition'" class="p-8">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">🗺️</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Your First Expedition</h3>
          <p class="text-gray-600">
            Time to see the core loop in action. Send {{ tutorial.guildMasterName }} on a quick expedition!
          </p>
        </div>

        <div class="max-w-md mx-auto">
          <div class="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="text-3xl">👤</div>
              <div>
                <h4 class="font-bold text-gray-800">{{ tutorial.guildMasterName }}</h4>
                <p class="text-sm text-gray-600">Level 1 Guild Master</p>
              </div>
            </div>

            <div class="border-t border-gray-300 pt-4">
              <h5 class="font-bold text-gray-700 mb-2">Expedition Details</h5>
              <ul class="space-y-1 text-sm text-gray-600">
                <li class="flex justify-between">
                  <span>Zone:</span>
                  <span class="font-medium">The Starting Meadow</span>
                </li>
                <li class="flex justify-between">
                  <span>Duration:</span>
                  <span class="font-medium">Instant (tutorial only!)</span>
                </li>
                <li class="flex justify-between">
                  <span>Difficulty:</span>
                  <span class="font-medium text-green-600">Easy</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-blue-800">
              ℹ️ Normally expeditions take 15 minutes to 2 hours, but this one completes instantly so you can see the results!
            </p>
          </div>

          <button
            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            @click="handleStartExpedition"
          >
            Start Expedition! 🚀
          </button>
        </div>
      </div>

      <!-- View Log Step -->
      <div v-else-if="tutorial.currentStep === 'view_log'" class="p-8">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">📜</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Expedition Complete!</h3>
          <p class="text-gray-600">
            {{ tutorial.guildMasterName }} has returned! Check out what happened.
          </p>
        </div>

        <div class="max-w-md mx-auto">
          <!-- Mock expedition log -->
          <div class="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
            <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span class="text-2xl">📖</span>
              <span>Expedition Log</span>
            </h4>

            <div class="space-y-3 text-sm">
              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-gray-700">
                  <strong>{{ tutorial.guildMasterName }}</strong> entered The Starting Meadow, sword at the ready.
                </p>
              </div>

              <div class="bg-gray-50 rounded-lg p-3">
                <p class="text-gray-700">
                  A wild <strong class="text-green-600">Slime</strong> appeared! After a brief scuffle, it was defeated.
                </p>
              </div>

              <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                <p class="text-green-800">
                  <strong>Victory!</strong> Found <strong>50 gold</strong> and a <strong>Basic Sword</strong>.
                </p>
              </div>

              <div class="bg-blue-50 rounded-lg p-3">
                <p class="text-blue-700">
                  <strong>{{ tutorial.guildMasterName }}</strong> returned safely, feeling accomplished.
                </p>
              </div>
            </div>
          </div>

          <div class="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-purple-800">
              ✨ <strong>The Core Loop:</strong> Send heroes → Read their story → Collect loot → Repeat!
            </p>
          </div>

          <button
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            @click="handleViewLog"
          >
            Got It! →
          </button>
        </div>
      </div>

      <!-- Complete Step -->
      <div v-else-if="tutorial.currentStep === 'complete'" class="p-8">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">You're Ready!</h3>
          <p class="text-gray-600">
            You've seen the core loop. Now explore at your own pace!
          </p>
        </div>

        <div class="max-w-md mx-auto">
          <div class="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6 mb-6">
            <h4 class="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span class="text-2xl">📚</span>
              <span>Mentor Quests Available!</span>
            </h4>
            <p class="text-sm text-purple-800 mb-4">
              Check the <strong>Mentor Quest panel</strong> for optional tasks that teach you more about the game.
              Complete them at your own pace for rewards and deeper knowledge!
            </p>
            <ul class="space-y-1 text-sm text-purple-700">
              <li>✓ All quests visible from the start</li>
              <li>✓ No time limits or pressure</li>
              <li>✓ Rewards include gold, gear, and unlocks</li>
              <li>✓ Final quest grants exclusive title</li>
            </ul>
          </div>

          <div class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-yellow-800">
              💡 <strong>Quick Tips:</strong>
            </p>
            <ul class="text-sm text-yellow-800 mt-2 space-y-1">
              <li>• Visit the tavern to recruit more heroes</li>
              <li>• Match hero traits to expedition threats for better efficiency</li>
              <li>• Let tired heroes rest before sending them out again</li>
              <li>• Equip better gear to tackle harder zones</li>
            </ul>
          </div>

          <button
            class="w-full bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-colors text-lg"
            @click="handleComplete"
          >
            Start Playing! 🎮
          </button>
        </div>
      </div>

      <!-- Skip Confirmation Modal -->
      <div
        v-if="showSkipConfirm"
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md">
          <h4 class="text-xl font-bold text-gray-800 mb-3">Skip Tutorial?</h4>
          <p class="text-gray-600 mb-6">
            Are you sure you want to skip the tutorial? You can still access Mentor Quests later to learn the game.
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg transition-colors"
              @click="cancelSkip"
            >
              Cancel
            </button>
            <button
              class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg transition-colors"
              @click="confirmSkip"
            >
              Skip Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
