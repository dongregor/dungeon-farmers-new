<script setup lang="ts">
import { useNotificationStore } from '~/stores/notifications'
import { storeToRefs } from 'pinia'
import { getNotificationIcon, getNotificationColor } from '~/utils/notificationService'

const notificationStore = useNotificationStore()
const { all, unread, unreadCount, urgent } = storeToRefs(notificationStore)

const showPanel = ref(false)
const showPreferences = ref(false)

onMounted(() => {
  notificationStore.loadPreferences()
})

const handleDismiss = (id: string) => {
  notificationStore.dismiss(id)
}

const handleMarkAsRead = (id: string) => {
  notificationStore.markAsRead(id)
}

const handleMarkAllAsRead = () => {
  notificationStore.markAllAsRead()
}

const handleClearAll = () => {
  notificationStore.clearAll()
  showPanel.value = false
}

const handleClearRead = () => {
  notificationStore.clearRead()
}

const handleNotificationClick = (notification: any) => {
  handleMarkAsRead(notification.id)

  if (notification.actionUrl) {
    navigateTo(notification.actionUrl)
    showPanel.value = false
  }
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

const togglePreferences = () => {
  showPreferences.value = !showPreferences.value
}

const updatePreference = (key: string, value: boolean) => {
  notificationStore.updatePreferences({ [key]: value })
}
</script>

<template>
  <div class="relative">
    <!-- Notification bell button -->
    <button
      class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      @click="showPanel = !showPanel"
    >
      <span class="text-2xl">🔔</span>
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Notification panel -->
    <div
      v-if="showPanel"
      class="fixed inset-0 z-50"
      @click.self="showPanel = false"
    >
      <div class="absolute top-16 right-4 w-96 max-w-full bg-white rounded-lg shadow-2xl max-h-[80vh] flex flex-col">
        <!-- Header -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-bold text-gray-800">Notifications</h3>
            <button
              class="text-gray-500 hover:text-gray-700 text-2xl"
              @click="showPanel = false"
            >
              ×
            </button>
          </div>

          <div class="flex items-center gap-2 text-sm">
            <button
              class="text-blue-600 hover:text-blue-700 font-medium"
              @click="handleMarkAllAsRead"
            >
              Mark all read
            </button>
            <span class="text-gray-400">•</span>
            <button
              class="text-blue-600 hover:text-blue-700 font-medium"
              @click="handleClearRead"
            >
              Clear read
            </button>
            <span class="text-gray-400">•</span>
            <button
              class="text-blue-600 hover:text-blue-700 font-medium"
              @click="togglePreferences"
            >
              Settings
            </button>
          </div>
        </div>

        <!-- Preferences panel -->
        <div v-if="showPreferences" class="p-4 border-b border-gray-200 bg-gray-50 overflow-y-auto max-h-64">
          <h4 class="font-bold text-gray-800 mb-3">Notification Preferences</h4>

          <div class="space-y-3">
            <!-- Expedition events -->
            <div>
              <p class="text-sm font-medium text-gray-700 mb-2">Expedition Events</p>
              <div class="space-y-1 text-sm">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="notificationStore.preferences.expeditionComplete"
                    @change="updatePreference('expeditionComplete', ($event.target as HTMLInputElement).checked)"
                  />
                  <span>Expedition complete</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="notificationStore.preferences.autoRepeatStopped"
                    @change="updatePreference('autoRepeatStopped', ($event.target as HTMLInputElement).checked)"
                  />
                  <span>Auto-repeat stopped</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="notificationStore.preferences.rareDropFound"
                    @change="updatePreference('rareDropFound', ($event.target as HTMLInputElement).checked)"
                  />
                  <span>Rare drop found</span>
                </label>
              </div>
            </div>

            <!-- Hero events -->
            <div>
              <p class="text-sm font-medium text-gray-700 mb-2">Hero Events</p>
              <div class="space-y-1 text-sm">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="notificationStore.preferences.heroReadyToPrestige"
                    @change="updatePreference('heroReadyToPrestige', ($event.target as HTMLInputElement).checked)"
                  />
                  <span>Hero ready to prestige</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="notificationStore.preferences.heroLevelUp"
                    @change="updatePreference('heroLevelUp', ($event.target as HTMLInputElement).checked)"
                  />
                  <span>Hero level up</span>
                </label>
              </div>
            </div>

            <!-- System events -->
            <div>
              <p class="text-sm font-medium text-gray-700 mb-2">System Events</p>
              <div class="space-y-1 text-sm">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="notificationStore.preferences.dailyDigest"
                    @change="updatePreference('dailyDigest', ($event.target as HTMLInputElement).checked)"
                  />
                  <span>Daily digest</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="notificationStore.preferences.newZoneUnlocked"
                    @change="updatePreference('newZoneUnlocked', ($event.target as HTMLInputElement).checked)"
                  />
                  <span>New zone unlocked</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications list -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="all.length > 0" class="divide-y divide-gray-200">
            <div
              v-for="notification in all"
              :key="notification.id"
              class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              :class="{ 'bg-blue-50': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start gap-3">
                <div class="text-2xl">
                  {{ notification.icon || getNotificationIcon(notification.type) }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h4 class="font-bold text-gray-800 text-sm">
                      {{ notification.title }}
                    </h4>
                    <button
                      class="text-gray-400 hover:text-gray-600 text-lg leading-none"
                      @click.stop="handleDismiss(notification.id)"
                    >
                      ×
                    </button>
                  </div>

                  <p class="text-sm text-gray-600 mb-2 whitespace-pre-line">
                    {{ notification.message }}
                  </p>

                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500">
                      {{ formatTimestamp(notification.timestamp) }}
                    </span>

                    <span
                      v-if="notification.actionText"
                      class="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {{ notification.actionText }} →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="p-12 text-center text-gray-500">
            <div class="text-6xl mb-4">🔔</div>
            <p class="text-lg mb-2">No notifications</p>
            <p class="text-sm">You're all caught up!</p>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="all.length > 0" class="p-4 border-t border-gray-200">
          <button
            class="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium"
            @click="handleClearAll"
          >
            Clear All Notifications
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
