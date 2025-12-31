import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import NotificationCenter from '~/components/ui/NotificationCenter.vue'

// Create reactive refs for store state
const allRef = ref<any[]>([])
const unreadRef = ref<any[]>([])
const unreadCountRef = ref(0)
const urgentRef = ref<any[]>([])

// Mock notification store
const mockNotificationStore = {
  get all() { return allRef.value },
  set all(val) { allRef.value = val },
  get unread() { return unreadRef.value },
  set unread(val) { unreadRef.value = val },
  get unreadCount() { return unreadCountRef.value },
  set unreadCount(val) { unreadCountRef.value = val },
  get urgent() { return urgentRef.value },
  set urgent(val) { urgentRef.value = val },
  preferences: {
    expeditionComplete: true,
    autoRepeatStopped: true,
    rareDropFound: true,
    heroReadyToPrestige: true,
    heroLevelUp: true,
    dailyDigest: true,
    newZoneUnlocked: true,
  },
  loadPreferences: vi.fn(),
  dismiss: vi.fn(),
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
  clearAll: vi.fn(),
  clearRead: vi.fn(),
  updatePreferences: vi.fn(),
}

vi.mock('~/stores/notifications', () => ({
  useNotificationStore: () => mockNotificationStore,
}))

vi.mock('pinia', () => ({
  storeToRefs: () => ({
    all: allRef,
    unread: unreadRef,
    unreadCount: unreadCountRef,
    urgent: urgentRef,
  }),
}))

vi.mock('~/utils/notificationService', () => ({
  getNotificationIcon: (type: string) => '📢',
  getNotificationColor: (type: string) => 'blue',
}))

vi.mock('#imports', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    navigateTo: vi.fn(),
  }
})

describe('NotificationCenter', () => {
  const createNotification = (overrides = {}) => ({
    id: 'notif-1',
    title: 'Expedition Complete',
    message: 'Your heroes have returned!',
    type: 'expedition_complete',
    timestamp: new Date().toISOString(),
    read: false,
    icon: '🗺️',
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    allRef.value = []
    unreadRef.value = []
    unreadCountRef.value = 0
    urgentRef.value = []
  })

  describe('Bell Button', () => {
    it('should render notification bell', () => {
      const wrapper = mount(NotificationCenter)

      expect(wrapper.text()).toContain('🔔')
    })

    it('should show unread count badge', () => {
      unreadCountRef.value = 5

      const wrapper = mount(NotificationCenter)

      expect(wrapper.find('.bg-red-500').text()).toBe('5')
    })

    it('should show 9+ for more than 9 unread', () => {
      unreadCountRef.value = 15

      const wrapper = mount(NotificationCenter)

      expect(wrapper.find('.bg-red-500').text()).toBe('9+')
    })

    it('should not show badge when no unread', () => {
      unreadCountRef.value = 0

      const wrapper = mount(NotificationCenter)

      expect(wrapper.find('.bg-red-500').exists()).toBe(false)
    })

    it('should toggle panel on click', async () => {
      const wrapper = mount(NotificationCenter)

      await wrapper.find('button').trigger('click')

      expect(wrapper.find('.absolute.top-16').exists()).toBe(true)
    })
  })

  describe('Panel Header', () => {
    it('should show title', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('Notifications')
    })

    it('should have close button', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('×')
    })

    it('should close panel on close button click', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      const closeBtn = wrapper.find('.text-2xl')
      await closeBtn.trigger('click')

      expect(wrapper.find('.absolute.top-16').exists()).toBe(false)
    })

    it('should have mark all read button', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('Mark all read')
    })

    it('should have clear read button', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('Clear read')
    })

    it('should have settings button', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('Settings')
    })
  })

  describe('Actions', () => {
    it('should call markAllAsRead', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      const markAllBtn = wrapper.findAll('button').find(b => b.text() === 'Mark all read')
      await markAllBtn?.trigger('click')

      expect(mockNotificationStore.markAllAsRead).toHaveBeenCalled()
    })

    it('should call clearRead', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      const clearReadBtn = wrapper.findAll('button').find(b => b.text() === 'Clear read')
      await clearReadBtn?.trigger('click')

      expect(mockNotificationStore.clearRead).toHaveBeenCalled()
    })
  })

  describe('Notifications List', () => {
    it('should display notification title', async () => {
      allRef.value = [createNotification()]

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('Expedition Complete')
    })

    it('should display notification message', async () => {
      allRef.value = [createNotification()]

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('Your heroes have returned!')
    })

    it('should display notification icon', async () => {
      allRef.value = [createNotification()]

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('🗺️')
    })

    it('should highlight unread notifications', async () => {
      allRef.value = [createNotification({ read: false })]

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.find('.bg-blue-50').exists()).toBe(true)
    })

    it('should display timestamp', async () => {
      allRef.value = [createNotification()]

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('Just now')
    })

    it('should show action text when provided', async () => {
      allRef.value = [
        createNotification({ actionText: 'View Details', actionUrl: '/details' }),
      ]

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('View Details →')
    })

    it('should call dismiss when X clicked', async () => {
      allRef.value = [createNotification({ id: 'test-id' })]

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      const dismissBtn = wrapper.findAll('button').find(b => b.text() === '×' && b.classes().includes('text-gray-400'))
      await dismissBtn?.trigger('click')

      expect(mockNotificationStore.dismiss).toHaveBeenCalledWith('test-id')
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no notifications', async () => {
      allRef.value = []

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('No notifications')
      expect(wrapper.text()).toContain("You're all caught up!")
    })
  })

  describe('Clear All', () => {
    it('should show clear all button when has notifications', async () => {
      allRef.value = [createNotification()]

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).toContain('Clear All Notifications')
    })

    it('should not show clear all when no notifications', async () => {
      allRef.value = []

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.text()).not.toContain('Clear All Notifications')
    })

    it('should call clearAll and close panel', async () => {
      allRef.value = [createNotification()]

      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      const clearAllBtn = wrapper.findAll('button').find(b => b.text().includes('Clear All'))
      await clearAllBtn?.trigger('click')

      expect(mockNotificationStore.clearAll).toHaveBeenCalled()
    })
  })

  describe('Preferences', () => {
    it('should toggle preferences panel', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      const settingsBtn = wrapper.findAll('button').find(b => b.text() === 'Settings')
      await settingsBtn?.trigger('click')

      expect(wrapper.text()).toContain('Notification Preferences')
    })

    it('should show expedition event preferences', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      const settingsBtn = wrapper.findAll('button').find(b => b.text() === 'Settings')
      await settingsBtn?.trigger('click')

      expect(wrapper.text()).toContain('Expedition Events')
      expect(wrapper.text()).toContain('Expedition complete')
      expect(wrapper.text()).toContain('Auto-repeat stopped')
      expect(wrapper.text()).toContain('Rare drop found')
    })

    it('should show hero event preferences', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      const settingsBtn = wrapper.findAll('button').find(b => b.text() === 'Settings')
      await settingsBtn?.trigger('click')

      expect(wrapper.text()).toContain('Hero Events')
      expect(wrapper.text()).toContain('Hero ready to prestige')
      expect(wrapper.text()).toContain('Hero level up')
    })

    it('should show system event preferences', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      const settingsBtn = wrapper.findAll('button').find(b => b.text() === 'Settings')
      await settingsBtn?.trigger('click')

      expect(wrapper.text()).toContain('System Events')
      expect(wrapper.text()).toContain('Daily digest')
      expect(wrapper.text()).toContain('New zone unlocked')
    })
  })

  describe('Styling', () => {
    it('should have white background for panel', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.find('.bg-white').exists()).toBe(true)
    })

    it('should have shadow on panel', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.find('.shadow-2xl').exists()).toBe(true)
    })

    it('should have rounded corners', async () => {
      const wrapper = mount(NotificationCenter)
      await wrapper.find('button').trigger('click')

      expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    })
  })
})
