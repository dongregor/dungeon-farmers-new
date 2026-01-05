<script setup lang="ts">
import { useNotificationStore } from '~/stores/notifications'
import { useGuildMasterStore } from '~/stores/guildMaster'
import { storeToRefs } from 'pinia'
import type { Tabard } from '~~/types'

definePageMeta({
  title: 'Settings',
})

type SettingsTab = 'guild' | 'notifications' | 'display' | 'gameplay' | 'account'

const notificationStore = useNotificationStore()
const guildMasterStore = useGuildMasterStore()
const { preferences } = storeToRefs(notificationStore)
const { guild } = storeToRefs(guildMasterStore)

const activeTab = ref<SettingsTab>('guild')
const saving = ref(false)
const saveMessage = ref('')

// Display settings
const displaySettings = ref({
  theme: 'light',
  compactMode: false,
  showTutorialHints: true,
  animationsEnabled: true,
  showPowerNumbers: true,
})

// Gameplay settings
const gameplaySettings = ref({
  autoRepeatByDefault: false,
  autoRepeatStopOnTired: true,
  autoRepeatStopOnInventoryFull: true,
  confirmRetirement: true,
  confirmPrestige: true,
  quickNavigation: false,
})

// Account settings
const accountSettings = ref({
  email: 'player@example.com',
  displayName: 'Guild Master',
  emailNotifications: true,
  marketingEmails: false,
})

// Guild settings
const guildName = ref('')
const guildTabard = ref<Tabard>({
  primaryColor: '#6366f1',
  secondaryColor: '#fbbf24',
  pattern: 'solid',
  emblem: 'sword',
})
const guildSaving = ref(false)

onMounted(async () => {
  notificationStore.loadPreferences()
  // Load other settings from localStorage or API
  loadDisplaySettings()
  loadGameplaySettings()
  // Load guild settings from store
  await guildMasterStore.fetchGuildMaster()
  loadGuildSettings()
})

const loadGuildSettings = () => {
  if (guild.value) {
    guildName.value = guild.value.name
    guildTabard.value = { ...guild.value.tabard }
  }
}

const saveGuildSettings = async () => {
  if (!guild.value) return

  guildSaving.value = true
  try {
    await guildMasterStore.updateGuild(guildName.value, guildTabard.value)
    showSaveMessage('Guild settings saved!')
  } catch (error) {
    console.error('Failed to save guild settings:', error)
    showSaveMessage('Failed to save guild settings')
  } finally {
    guildSaving.value = false
  }
}

const loadDisplaySettings = () => {
  const stored = localStorage.getItem('display_settings')
  if (stored) {
    try {
      displaySettings.value = { ...displaySettings.value, ...JSON.parse(stored) }
    } catch (error) {
      console.error('Failed to load display settings:', error)
    }
  }
}

const loadGameplaySettings = () => {
  const stored = localStorage.getItem('gameplay_settings')
  if (stored) {
    try {
      gameplaySettings.value = { ...gameplaySettings.value, ...JSON.parse(stored) }
    } catch (error) {
      console.error('Failed to load gameplay settings:', error)
    }
  }
}

const saveDisplaySettings = () => {
  localStorage.setItem('display_settings', JSON.stringify(displaySettings.value))
  showSaveMessage('Display settings saved!')
}

const saveGameplaySettings = () => {
  localStorage.setItem('gameplay_settings', JSON.stringify(gameplaySettings.value))
  showSaveMessage('Gameplay settings saved!')
}

const showSaveMessage = (message: string) => {
  saveMessage.value = message
  setTimeout(() => {
    saveMessage.value = ''
  }, 3000)
}

const updateNotificationPreference = (key: string, value: boolean) => {
  notificationStore.updatePreferences({ [key]: value })
  showSaveMessage('Notification preferences updated!')
}

const resetToDefaults = (category: SettingsTab) => {
  if (!confirm(`Reset ${category} settings to default?`)) return

  switch (category) {
    case 'notifications':
      // Reset notification preferences
      notificationStore.updatePreferences({
        expeditionComplete: true,
        choicesWaiting: true,
        autoRepeatStopped: true,
        rareDropFound: false,
        heroExhausted: false,
        heroLevelUp: false,
        heroReadyToPrestige: true,
        stationedHeroTired: false,
        freeRefreshAvailable: false,
        rareHeroAppeared: true,
        lockedHeroExpiring: true,
        dailyDigest: true,
        questCompleted: false,
        newZoneUnlocked: true,
      })
      showSaveMessage('Notification preferences reset!')
      break

    case 'display':
      displaySettings.value = {
        theme: 'light',
        compactMode: false,
        showTutorialHints: true,
        animationsEnabled: true,
        showPowerNumbers: true,
      }
      saveDisplaySettings()
      break

    case 'gameplay':
      gameplaySettings.value = {
        autoRepeatByDefault: false,
        autoRepeatStopOnTired: true,
        autoRepeatStopOnInventoryFull: true,
        confirmRetirement: true,
        confirmPrestige: true,
        quickNavigation: false,
      }
      saveGameplaySettings()
      break
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p class="text-gray-600">
          Customize your game experience
        </p>
      </div>

      <!-- Save Message -->
      <div
        v-if="saveMessage"
        class="bg-green-100 border-2 border-green-500 text-green-800 rounded-lg p-4 mb-6 animate-pulse"
      >
        {{ saveMessage }}
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="flex border-b border-gray-200 overflow-x-auto">
          <button
            class="py-4 px-6 font-bold transition-all whitespace-nowrap"
            :class="activeTab === 'guild'
              ? 'bg-blue-500 text-white border-b-4 border-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeTab = 'guild'"
          >
            Guild
          </button>
          <button
            class="py-4 px-6 font-bold transition-all whitespace-nowrap"
            :class="activeTab === 'notifications'
              ? 'bg-blue-500 text-white border-b-4 border-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeTab = 'notifications'"
          >
            Notifications
          </button>
          <button
            class="py-4 px-6 font-bold transition-all whitespace-nowrap"
            :class="activeTab === 'display'
              ? 'bg-blue-500 text-white border-b-4 border-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeTab = 'display'"
          >
            Display
          </button>
          <button
            class="py-4 px-6 font-bold transition-all whitespace-nowrap"
            :class="activeTab === 'gameplay'
              ? 'bg-blue-500 text-white border-b-4 border-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeTab = 'gameplay'"
          >
            Gameplay
          </button>
          <button
            class="py-4 px-6 font-bold transition-all whitespace-nowrap"
            :class="activeTab === 'account'
              ? 'bg-blue-500 text-white border-b-4 border-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="activeTab = 'account'"
          >
            Account
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Guild Tab -->
          <div v-if="activeTab === 'guild'" class="space-y-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Guild Settings</h2>

            <div v-if="guild" class="space-y-6">
              <!-- Guild Name -->
              <div class="border-2 border-gray-200 rounded-lg p-4">
                <label class="block font-medium text-gray-800 mb-2">Guild Name</label>
                <input
                  v-model="guildName"
                  type="text"
                  class="w-full border-2 border-gray-300 rounded px-4 py-2"
                  placeholder="Enter guild name"
                  maxlength="30"
                />
                <p class="text-sm text-gray-600 mt-1">2-30 characters</p>
              </div>

              <!-- Tabard Customization -->
              <div class="border-2 border-gray-200 rounded-lg p-4">
                <h3 class="font-bold text-gray-700 mb-4">Guild Tabard</h3>
                <GuildTabardCreator
                  v-model="guildTabard"
                  theme="light"
                  :show-emblem="true"
                />
              </div>

              <!-- Save Button -->
              <div class="flex justify-end">
                <button
                  class="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                  :disabled="guildSaving || guildName.length < 2"
                  @click="saveGuildSettings"
                >
                  {{ guildSaving ? 'Saving...' : 'Save Guild Settings' }}
                </button>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <p>No guild found. Please create your guild first.</p>
            </div>
          </div>

          <!-- Notifications Tab -->
          <div v-if="activeTab === 'notifications'" class="space-y-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-800">Notification Preferences</h2>
              <button
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                @click="resetToDefaults('notifications')"
              >
                Reset to Defaults
              </button>
            </div>

            <!-- Expedition Events -->
            <div class="border-2 border-gray-200 rounded-lg p-4">
              <h3 class="font-bold text-gray-700 mb-3">Expedition Events</h3>
              <div class="space-y-3">
                <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <div class="font-medium text-gray-800">Expedition Complete</div>
                    <div class="text-sm text-gray-600">Notify when expeditions finish</div>
                  </div>
                  <input
                    type="checkbox"
                    class="w-5 h-5"
                    :checked="preferences.expeditionComplete"
                    @change="updateNotificationPreference('expeditionComplete', ($event.target as HTMLInputElement).checked)"
                  />
                </label>

                <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <div class="font-medium text-gray-800">Choices Waiting</div>
                    <div class="text-sm text-gray-600">Notify when expedition events need decisions</div>
                  </div>
                  <input
                    type="checkbox"
                    class="w-5 h-5"
                    :checked="preferences.choicesWaiting"
                    @change="updateNotificationPreference('choicesWaiting', ($event.target as HTMLInputElement).checked)"
                  />
                </label>

                <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <div class="font-medium text-gray-800">Auto-Repeat Stopped</div>
                    <div class="text-sm text-gray-600">Notify when auto-repeat is interrupted</div>
                  </div>
                  <input
                    type="checkbox"
                    class="w-5 h-5"
                    :checked="preferences.autoRepeatStopped"
                    @change="updateNotificationPreference('autoRepeatStopped', ($event.target as HTMLInputElement).checked)"
                  />
                </label>

                <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <div class="font-medium text-gray-800">Rare Drop Found</div>
                    <div class="text-sm text-gray-600">Notify when rare items drop</div>
                  </div>
                  <input
                    type="checkbox"
                    class="w-5 h-5"
                    :checked="preferences.rareDropFound"
                    @change="updateNotificationPreference('rareDropFound', ($event.target as HTMLInputElement).checked)"
                  />
                </label>
              </div>
            </div>

            <!-- Hero Events -->
            <div class="border-2 border-gray-200 rounded-lg p-4">
              <h3 class="font-bold text-gray-700 mb-3">Hero Events</h3>
              <div class="space-y-3">
                <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <div class="font-medium text-gray-800">Hero Ready to Prestige</div>
                    <div class="text-sm text-gray-600">Notify when heroes reach max level</div>
                  </div>
                  <input
                    type="checkbox"
                    class="w-5 h-5"
                    :checked="preferences.heroReadyToPrestige"
                    @change="updateNotificationPreference('heroReadyToPrestige', ($event.target as HTMLInputElement).checked)"
                  />
                </label>

                <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <div class="font-medium text-gray-800">Hero Level Up</div>
                    <div class="text-sm text-gray-600">Notify on every level up (can be noisy)</div>
                  </div>
                  <input
                    type="checkbox"
                    class="w-5 h-5"
                    :checked="preferences.heroLevelUp"
                    @change="updateNotificationPreference('heroLevelUp', ($event.target as HTMLInputElement).checked)"
                  />
                </label>

                <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <div class="font-medium text-gray-800">Hero Exhausted</div>
                    <div class="text-sm text-gray-600">Notify when heroes become tired</div>
                  </div>
                  <input
                    type="checkbox"
                    class="w-5 h-5"
                    :checked="preferences.heroExhausted"
                    @change="updateNotificationPreference('heroExhausted', ($event.target as HTMLInputElement).checked)"
                  />
                </label>
              </div>
            </div>

            <!-- System Events -->
            <div class="border-2 border-gray-200 rounded-lg p-4">
              <h3 class="font-bold text-gray-700 mb-3">System Events</h3>
              <div class="space-y-3">
                <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <div class="font-medium text-gray-800">Daily Digest</div>
                    <div class="text-sm text-gray-600">Summary of yesterday's activity</div>
                  </div>
                  <input
                    type="checkbox"
                    class="w-5 h-5"
                    :checked="preferences.dailyDigest"
                    @change="updateNotificationPreference('dailyDigest', ($event.target as HTMLInputElement).checked)"
                  />
                </label>

                <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <div class="font-medium text-gray-800">New Zone Unlocked</div>
                    <div class="text-sm text-gray-600">Notify when new zones become available</div>
                  </div>
                  <input
                    type="checkbox"
                    class="w-5 h-5"
                    :checked="preferences.newZoneUnlocked"
                    @change="updateNotificationPreference('newZoneUnlocked', ($event.target as HTMLInputElement).checked)"
                  />
                </label>
              </div>
            </div>
          </div>

          <!-- Display Tab -->
          <div v-if="activeTab === 'display'" class="space-y-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-800">Display Options</h2>
              <button
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                @click="resetToDefaults('display')"
              >
                Reset to Defaults
              </button>
            </div>

            <div class="border-2 border-gray-200 rounded-lg p-4 space-y-4">
              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Theme</div>
                  <div class="text-sm text-gray-600">Choose your preferred color scheme</div>
                </div>
                <select
                  v-model="displaySettings.theme"
                  class="border-2 border-gray-300 rounded px-3 py-2"
                  @change="saveDisplaySettings"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Compact Mode</div>
                  <div class="text-sm text-gray-600">Reduce spacing for denser layout</div>
                </div>
                <input
                  v-model="displaySettings.compactMode"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveDisplaySettings"
                />
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Show Tutorial Hints</div>
                  <div class="text-sm text-gray-600">Display helpful tips for new features</div>
                </div>
                <input
                  v-model="displaySettings.showTutorialHints"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveDisplaySettings"
                />
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Animations Enabled</div>
                  <div class="text-sm text-gray-600">Show UI animations and transitions</div>
                </div>
                <input
                  v-model="displaySettings.animationsEnabled"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveDisplaySettings"
                />
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Show Power Numbers</div>
                  <div class="text-sm text-gray-600">Display power ratings on heroes and equipment</div>
                </div>
                <input
                  v-model="displaySettings.showPowerNumbers"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveDisplaySettings"
                />
              </label>
            </div>
          </div>

          <!-- Gameplay Tab -->
          <div v-if="activeTab === 'gameplay'" class="space-y-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-gray-800">Gameplay Preferences</h2>
              <button
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                @click="resetToDefaults('gameplay')"
              >
                Reset to Defaults
              </button>
            </div>

            <div class="border-2 border-gray-200 rounded-lg p-4 space-y-4">
              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Auto-Repeat by Default</div>
                  <div class="text-sm text-gray-600">Enable auto-repeat for new expeditions</div>
                </div>
                <input
                  v-model="gameplaySettings.autoRepeatByDefault"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveGameplaySettings"
                />
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Stop on Tired</div>
                  <div class="text-sm text-gray-600">Auto-stop when any hero becomes tired</div>
                </div>
                <input
                  v-model="gameplaySettings.autoRepeatStopOnTired"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveGameplaySettings"
                />
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Stop on Inventory Full</div>
                  <div class="text-sm text-gray-600">Auto-stop when inventory is full</div>
                </div>
                <input
                  v-model="gameplaySettings.autoRepeatStopOnInventoryFull"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveGameplaySettings"
                />
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Confirm Retirement</div>
                  <div class="text-sm text-gray-600">Ask for confirmation before retiring heroes</div>
                </div>
                <input
                  v-model="gameplaySettings.confirmRetirement"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveGameplaySettings"
                />
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Confirm Prestige</div>
                  <div class="text-sm text-gray-600">Ask for confirmation before prestiging heroes</div>
                </div>
                <input
                  v-model="gameplaySettings.confirmPrestige"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveGameplaySettings"
                />
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Quick Navigation</div>
                  <div class="text-sm text-gray-600">Skip confirmation dialogs for common actions</div>
                </div>
                <input
                  v-model="gameplaySettings.quickNavigation"
                  type="checkbox"
                  class="w-5 h-5"
                  @change="saveGameplaySettings"
                />
              </label>
            </div>
          </div>

          <!-- Account Tab -->
          <div v-if="activeTab === 'account'" class="space-y-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Account Settings</h2>

            <div class="border-2 border-gray-200 rounded-lg p-4 space-y-4">
              <div>
                <label class="block font-medium text-gray-800 mb-2">Email Address</label>
                <input
                  v-model="accountSettings.email"
                  type="email"
                  class="w-full border-2 border-gray-300 rounded px-4 py-2"
                  readonly
                />
                <p class="text-sm text-gray-600 mt-1">Contact support to change your email</p>
              </div>

              <div>
                <label class="block font-medium text-gray-800 mb-2">Display Name</label>
                <input
                  v-model="accountSettings.displayName"
                  type="text"
                  class="w-full border-2 border-gray-300 rounded px-4 py-2"
                />
              </div>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Email Notifications</div>
                  <div class="text-sm text-gray-600">Receive important game notifications via email</div>
                </div>
                <input
                  v-model="accountSettings.emailNotifications"
                  type="checkbox"
                  class="w-5 h-5"
                />
              </label>

              <label class="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div class="font-medium text-gray-800">Marketing Emails</div>
                  <div class="text-sm text-gray-600">Receive updates about new features and events</div>
                </div>
                <input
                  v-model="accountSettings.marketingEmails"
                  type="checkbox"
                  class="w-5 h-5"
                />
              </label>
            </div>

            <div class="border-2 border-red-300 bg-red-50 rounded-lg p-4">
              <h3 class="font-bold text-red-800 mb-2">Danger Zone</h3>
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded transition-colors"
                @click="alert('Account deletion coming soon')"
              >
                Delete Account
              </button>
              <p class="text-sm text-gray-600 mt-2">
                This action is permanent and cannot be undone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
