export type NotificationType =
  | 'expedition_complete'
  | 'level_up'
  | 'prestige_available'
  | 'hero_tired'
  | 'inventory_full'
  | 'tavern_refresh'
  | 'auto_repeat_stopped'
  | 'achievement_unlocked'
  | 'title_earned'
  | 'rare_loot'
  | 'gazette_new_issue'
  | 'info'
  | 'warning'
  | 'error'
  | 'success'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  icon?: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionText?: string
  data?: Record<string, any>
  expiresAt?: string
}

export interface NotificationOptions {
  title: string
  message: string
  type?: NotificationType
  priority?: NotificationPriority
  icon?: string
  actionUrl?: string
  actionText?: string
  data?: Record<string, any>
  ttl?: number // Time to live in seconds
}

// In-memory notification store (would be replaced with Pinia store in production)
const notifications = ref<Notification[]>([])

/**
 * Create a new notification
 */
export function createNotification(options: NotificationOptions): Notification {
  const now = new Date()
  const expiresAt = options.ttl
    ? new Date(now.getTime() + options.ttl * 1000)
    : undefined

  const notification: Notification = {
    id: crypto.randomUUID(),
    type: options.type || 'info',
    priority: options.priority || 'medium',
    title: options.title,
    message: options.message,
    icon: options.icon,
    timestamp: now.toISOString(),
    read: false,
    actionUrl: options.actionUrl,
    actionText: options.actionText,
    data: options.data,
    expiresAt: expiresAt?.toISOString(),
  }

  notifications.value.push(notification)

  // Auto-dismiss low priority notifications after 5 seconds
  if (notification.priority === 'low') {
    setTimeout(() => {
      dismissNotification(notification.id)
    }, 5000)
  }

  return notification
}

/**
 * Dismiss a notification
 */
export function dismissNotification(id: string): void {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

/**
 * Mark notification as read
 */
export function markAsRead(id: string): void {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

/**
 * Mark all notifications as read
 */
export function markAllAsRead(): void {
  notifications.value.forEach(n => {
    n.read = true
  })
}

/**
 * Clear all notifications
 */
export function clearAllNotifications(): void {
  notifications.value = []
}

/**
 * Clear expired notifications
 */
export function clearExpiredNotifications(): void {
  const now = new Date()
  notifications.value = notifications.value.filter(n => {
    if (!n.expiresAt) return true
    return new Date(n.expiresAt) > now
  })
}

/**
 * Get all notifications
 */
export function getNotifications(): Notification[] {
  clearExpiredNotifications()
  return notifications.value
}

/**
 * Get unread notifications count
 */
export function getUnreadCount(): number {
  return notifications.value.filter(n => !n.read).length
}

/**
 * Get notifications by type
 */
export function getNotificationsByType(type: NotificationType): Notification[] {
  return notifications.value.filter(n => n.type === type)
}

/**
 * Get notifications by priority
 */
export function getNotificationsByPriority(priority: NotificationPriority): Notification[] {
  return notifications.value.filter(n => n.priority === priority)
}

// ===== PRESET NOTIFICATION CREATORS =====

/**
 * Expedition complete notification
 */
export function notifyExpeditionComplete(
  expeditionId: string,
  zoneName: string,
  heroNames: string[]
): Notification {
  return createNotification({
    type: 'expedition_complete',
    priority: 'medium',
    title: 'Expedition Complete!',
    message: `${heroNames.join(', ')} returned from ${zoneName}`,
    icon: '🎉',
    actionUrl: `/expeditions/${expeditionId}/log`,
    actionText: 'View Log',
    data: { expeditionId, zoneName, heroNames },
    ttl: 300, // 5 minutes
  })
}

/**
 * Level up notification
 */
export function notifyLevelUp(
  heroId: string,
  heroName: string,
  oldLevel: number,
  newLevel: number
): Notification {
  return createNotification({
    type: 'level_up',
    priority: 'high',
    title: 'Level Up!',
    message: `${heroName} reached level ${newLevel}!`,
    icon: '⭐',
    actionUrl: `/heroes/${heroId}`,
    actionText: 'View Hero',
    data: { heroId, heroName, oldLevel, newLevel },
    ttl: 600, // 10 minutes
  })
}

/**
 * Prestige available notification
 */
export function notifyPrestigeAvailable(heroId: string, heroName: string): Notification {
  return createNotification({
    type: 'prestige_available',
    priority: 'high',
    title: 'Prestige Available!',
    message: `${heroName} has reached level 60 and can prestige`,
    icon: '👑',
    actionUrl: `/heroes/${heroId}`,
    actionText: 'Prestige',
    data: { heroId, heroName },
  })
}

/**
 * Hero tired notification
 */
export function notifyHeroTired(heroId: string, heroName: string): Notification {
  return createNotification({
    type: 'hero_tired',
    priority: 'medium',
    title: 'Hero Needs Rest',
    message: `${heroName} is exhausted and needs to rest`,
    icon: '😴',
    actionUrl: `/heroes/${heroId}`,
    actionText: 'View Hero',
    data: { heroId, heroName },
    ttl: 600,
  })
}

/**
 * Inventory full notification
 */
export function notifyInventoryFull(pendingItemCount: number): Notification {
  return createNotification({
    type: 'inventory_full',
    priority: 'high',
    title: 'Inventory Full!',
    message: `${pendingItemCount} items are waiting. Make room to claim them.`,
    icon: '🎒',
    actionUrl: '/inventory',
    actionText: 'Manage Inventory',
    data: { pendingItemCount },
  })
}

/**
 * Tavern refresh notification
 */
export function notifyTavernRefresh(newHeroCount: number): Notification {
  return createNotification({
    type: 'tavern_refresh',
    priority: 'low',
    title: 'Tavern Refreshed',
    message: `${newHeroCount} new heroes are available for recruitment`,
    icon: '🍺',
    actionUrl: '/tavern',
    actionText: 'Visit Tavern',
    data: { newHeroCount },
    ttl: 300,
  })
}

/**
 * Auto-repeat stopped notification
 */
export function notifyAutoRepeatStopped(
  expeditionId: string,
  reason: string
): Notification {
  return createNotification({
    type: 'auto_repeat_stopped',
    priority: 'medium',
    title: 'Auto-Repeat Stopped',
    message: reason,
    icon: '⏸️',
    actionUrl: `/expeditions/${expeditionId}`,
    actionText: 'View Details',
    data: { expeditionId, reason },
    ttl: 600,
  })
}

/**
 * Title earned notification
 */
export function notifyTitleEarned(
  heroId: string,
  heroName: string,
  titleName: string
): Notification {
  return createNotification({
    type: 'title_earned',
    priority: 'high',
    title: 'Title Earned!',
    message: `${heroName} earned the title "${titleName}"`,
    icon: '🏆',
    actionUrl: `/heroes/${heroId}`,
    actionText: 'View Hero',
    data: { heroId, heroName, titleName },
    ttl: 600,
  })
}

/**
 * Rare loot notification
 */
export function notifyRareLoot(
  expeditionId: string,
  itemName: string,
  rarity: string
): Notification {
  return createNotification({
    type: 'rare_loot',
    priority: 'high',
    title: 'Rare Loot!',
    message: `Found ${rarity} item: ${itemName}`,
    icon: '✨',
    actionUrl: `/expeditions/${expeditionId}/log`,
    actionText: 'View Log',
    data: { expeditionId, itemName, rarity },
    ttl: 600,
  })
}

/**
 * Achievement unlocked notification
 */
export function notifyAchievementUnlocked(
  achievementId: string,
  achievementName: string,
  description: string
): Notification {
  return createNotification({
    type: 'achievement_unlocked',
    priority: 'high',
    title: 'Achievement Unlocked!',
    message: achievementName,
    icon: '🎖️',
    actionUrl: '/achievements',
    actionText: 'View Achievements',
    data: { achievementId, achievementName, description },
    ttl: 600,
  })
}

/**
 * Gazette new issue notification
 */
export function notifyGazetteNewIssue(headline: string): Notification {
  return createNotification({
    type: 'gazette_new_issue',
    priority: 'low',
    title: 'The Daily Grind',
    message: `Today's edition is out! ${headline}`,
    icon: '📰',
    actionUrl: '/gazette',
    actionText: 'Read Now',
    ttl: 86400, // 24 hours
  })
}

/**
 * Get notification icon by type
 */
export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    expedition_complete: '🎉',
    level_up: '⭐',
    prestige_available: '👑',
    hero_tired: '😴',
    inventory_full: '🎒',
    tavern_refresh: '🍺',
    auto_repeat_stopped: '⏸️',
    achievement_unlocked: '🎖️',
    title_earned: '🏆',
    rare_loot: '✨',
    gazette_new_issue: '📰',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✓',
  }
  return icons[type] || 'ℹ️'
}

/**
 * Get notification color by priority
 */
export function getNotificationColor(priority: NotificationPriority): string {
  const colors: Record<NotificationPriority, string> = {
    low: 'text-gray-600 bg-gray-50 border-gray-200',
    medium: 'text-blue-600 bg-blue-50 border-blue-200',
    high: 'text-purple-600 bg-purple-50 border-purple-200',
    urgent: 'text-red-600 bg-red-50 border-red-200',
  }
  return colors[priority]
}
