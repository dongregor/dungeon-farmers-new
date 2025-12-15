import { defineStore } from 'pinia'
import type { Notification, NotificationType, NotificationPriority } from '~/utils/notificationService'

export interface NotificationPreferences {
  // Expedition events
  expeditionComplete: boolean
  choicesWaiting: boolean
  autoRepeatStopped: boolean
  rareDropFound: boolean

  // Hero events
  heroExhausted: boolean
  heroLevelUp: boolean
  heroReadyToPrestige: boolean
  stationedHeroTired: boolean

  // Tavern events
  freeRefreshAvailable: boolean
  rareHeroAppeared: boolean
  lockedHeroExpiring: boolean

  // System events
  dailyDigest: boolean
  questCompleted: boolean
  newZoneUnlocked: boolean
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    preferences: {
      // Expedition events
      expeditionComplete: true,
      choicesWaiting: true,
      autoRepeatStopped: true,
      rareDropFound: false,

      // Hero events
      heroExhausted: false,
      heroLevelUp: false,
      heroReadyToPrestige: true,
      stationedHeroTired: false,

      // Tavern events
      freeRefreshAvailable: false,
      rareHeroAppeared: true,
      lockedHeroExpiring: true,

      // System events
      dailyDigest: true,
      questCompleted: false,
      newZoneUnlocked: true,
    } as NotificationPreferences,
  }),

  getters: {
    /**
     * Get all notifications
     */
    all: (state) => {
      // Clear expired notifications
      const now = new Date()
      state.notifications = state.notifications.filter(n => {
        if (!n.expiresAt) return true
        return new Date(n.expiresAt) > now
      })
      return state.notifications
    },

    /**
     * Get unread notifications
     */
    unread: (state) => {
      return state.notifications.filter(n => !n.read)
    },

    /**
     * Get unread count
     */
    unreadCount(): number {
      return this.unread.length
    },

    /**
     * Get notifications by priority
     */
    byPriority: (state) => (priority: NotificationPriority) => {
      return state.notifications.filter(n => n.priority === priority)
    },

    /**
     * Get notifications by type
     */
    byType: (state) => (type: NotificationType) => {
      return state.notifications.filter(n => n.type === type)
    },

    /**
     * Get urgent notifications (high or urgent priority)
     */
    urgent(): Notification[] {
      return this.all.filter(n => n.priority === 'high' || n.priority === 'urgent')
    },
  },

  actions: {
    /**
     * Add a new notification
     */
    add(notification: Notification) {
      // Check if this notification type is enabled in preferences
      if (!this.isNotificationEnabled(notification.type)) {
        return
      }

      this.notifications.unshift(notification)

      // Auto-dismiss low priority after 5 seconds
      if (notification.priority === 'low') {
        setTimeout(() => {
          this.dismiss(notification.id)
        }, 5000)
      }
    },

    /**
     * Dismiss a notification
     */
    dismiss(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },

    /**
     * Mark notification as read
     */
    markAsRead(id: string) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    },

    /**
     * Mark all as read
     */
    markAllAsRead() {
      this.notifications.forEach(n => {
        n.read = true
      })
    },

    /**
     * Clear all notifications
     */
    clearAll() {
      this.notifications = []
    },

    /**
     * Clear read notifications
     */
    clearRead() {
      this.notifications = this.notifications.filter(n => !n.read)
    },

    /**
     * Update notification preferences
     */
    updatePreferences(preferences: Partial<NotificationPreferences>) {
      this.preferences = { ...this.preferences, ...preferences }
      // Persist to localStorage or server
      this.savePreferences()
    },

    /**
     * Load preferences from storage
     */
    loadPreferences() {
      const stored = localStorage.getItem('notification_preferences')
      if (stored) {
        try {
          this.preferences = JSON.parse(stored)
        } catch (error) {
          console.error('Failed to load notification preferences:', error)
        }
      }
    },

    /**
     * Save preferences to storage
     */
    savePreferences() {
      localStorage.setItem('notification_preferences', JSON.stringify(this.preferences))
    },

    /**
     * Check if a notification type is enabled
     */
    isNotificationEnabled(type: NotificationType): boolean {
      // Map notification types to preference keys
      const typeToPreference: Partial<Record<NotificationType, keyof NotificationPreferences>> = {
        expedition_complete: 'expeditionComplete',
        level_up: 'heroLevelUp',
        prestige_available: 'heroReadyToPrestige',
        hero_tired: 'heroExhausted',
        inventory_full: 'autoRepeatStopped',
        tavern_refresh: 'freeRefreshAvailable',
        auto_repeat_stopped: 'autoRepeatStopped',
        achievement_unlocked: 'questCompleted',
        title_earned: 'newZoneUnlocked',
        rare_loot: 'rareDropFound',
      }

      const preferenceKey = typeToPreference[type]
      if (!preferenceKey) {
        return true // Default to enabled for unmapped types
      }

      return this.preferences[preferenceKey]
    },

    /**
     * Create daily digest notification
     */
    createDailyDigest(stats: {
      expeditionsCompleted: number
      levelUps: number
      rareDrops: number
      pendingChoices: number
    }) {
      if (!this.preferences.dailyDigest) return

      const parts: string[] = []
      if (stats.expeditionsCompleted > 0) {
        parts.push(`${stats.expeditionsCompleted} expeditions`)
      }
      if (stats.levelUps > 0) {
        parts.push(`${stats.levelUps} level-ups`)
      }
      if (stats.rareDrops > 0) {
        parts.push(`${stats.rareDrops} rare drops`)
      }

      let message = `Yesterday: ${parts.join(', ')}`
      if (stats.pendingChoices > 0) {
        message += `\n⚠️ ${stats.pendingChoices} choice(s) waiting for your decision`
      }

      this.add({
        id: crypto.randomUUID(),
        type: 'info',
        priority: 'medium',
        title: 'Daily Summary',
        message,
        icon: '📊',
        timestamp: new Date().toISOString(),
        read: false,
        ttl: 86400, // 24 hours
      })
    },
  },
})
