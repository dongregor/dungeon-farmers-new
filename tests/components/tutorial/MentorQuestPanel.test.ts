import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import MentorQuestPanel from '~/components/tutorial/MentorQuestPanel.vue'
import type { MentorQuest } from '~~/types'

// Create reactive refs for composable state
const allQuestsRef = ref<MentorQuest[]>([])
const unlockedQuestsRef = ref<MentorQuest[]>([])
const lockedQuestsRef = ref<MentorQuest[]>([])
const unclaimedQuestsRef = ref<MentorQuest[]>([])
const unclaimedCountRef = ref(0)
const completionStatsRef = ref({ completed: 0, total: 0, percentage: 0 })
const areMentorQuestsAvailableRef = ref(true)
const showMentorPanelRef = ref(false)

// Mock tutorial composable
const mockTutorialComposable = {
  allQuests: allQuestsRef,
  unlockedQuests: unlockedQuestsRef,
  lockedQuests: lockedQuestsRef,
  unclaimedQuests: unclaimedQuestsRef,
  unclaimedCount: unclaimedCountRef,
  completionStats: completionStatsRef,
  areMentorQuestsAvailable: areMentorQuestsAvailableRef,
  showMentorPanel: showMentorPanelRef,
  toggleMentorPanel: vi.fn(),
  claimQuestReward: vi.fn(),
  claimAllRewards: vi.fn(),
  getUnlockText: vi.fn(() => ''),
}

// Use stubGlobal for Nuxt auto-import
vi.stubGlobal('useTutorial', () => mockTutorialComposable)

// Mock the child component
vi.mock('~/components/tutorial/MentorQuestCard.vue', () => ({
  default: {
    name: 'TutorialMentorQuestCard',
    props: ['quest', 'unlockText'],
    emits: ['claim'],
    template: '<div class="mock-quest-card">{{ quest.title }}</div>',
  },
}))

describe('MentorQuestPanel', () => {
  const createQuest = (overrides: Partial<MentorQuest> = {}): MentorQuest => ({
    id: 'quest-1',
    title: 'Test Quest',
    description: 'A test quest description',
    icon: '🎯',
    tier: 'early',
    reward: {
      type: 'gold',
      amount: 100,
      description: '100 Gold',
    },
    unlockCondition: null,
    progress: {
      type: 'count',
      current: 0,
      target: 1,
    },
    isUnlocked: true,
    isComplete: false,
    isClaimed: false,
    completedAt: null,
    claimedAt: null,
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    areMentorQuestsAvailableRef.value = true
    showMentorPanelRef.value = false
    allQuestsRef.value = []
    unlockedQuestsRef.value = []
    lockedQuestsRef.value = []
    unclaimedQuestsRef.value = []
    unclaimedCountRef.value = 0
    completionStatsRef.value = { completed: 0, total: 0, percentage: 0 }
  })

  describe('Visibility', () => {
    it('should not render when mentor quests not available', () => {
      areMentorQuestsAvailableRef.value = false

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.find('.fixed').exists()).toBe(false)
    })

    it('should render toggle button when available', () => {
      areMentorQuestsAvailableRef.value = true

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('Mentor Quests')
      expect(wrapper.text()).toContain('📚')
    })
  })

  describe('Toggle Button', () => {
    it('should be fixed at bottom right', () => {
      const wrapper = mount(MentorQuestPanel)

      const toggleBtn = wrapper.find('button.fixed.bottom-6.right-6')
      expect(toggleBtn.exists()).toBe(true)
    })

    it('should call toggleMentorPanel on click', async () => {
      const wrapper = mount(MentorQuestPanel)

      const toggleBtn = wrapper.find('button.fixed')
      await toggleBtn.trigger('click')

      expect(mockTutorialComposable.toggleMentorPanel).toHaveBeenCalled()
    })

    it('should show unclaimed count badge', () => {
      unclaimedCountRef.value = 3

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('3')
      expect(wrapper.find('.bg-red-500').exists()).toBe(true)
    })

    it('should not show badge when no unclaimed', () => {
      unclaimedCountRef.value = 0

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.find('.bg-red-500').exists()).toBe(false)
    })
  })

  describe('Panel', () => {
    it('should not show panel when closed', () => {
      showMentorPanelRef.value = false

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.find('.fixed.right-0.top-0').exists()).toBe(false)
    })

    it('should show panel when open', () => {
      showMentorPanelRef.value = true

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.find('.fixed.right-0.top-0').exists()).toBe(true)
    })

    it('should show header with title', () => {
      showMentorPanelRef.value = true

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('Mentor Quests')
      expect(wrapper.text()).toContain('Optional tasks to learn and earn rewards')
    })

    it('should have close button', () => {
      showMentorPanelRef.value = true

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('×')
    })

    it('should call toggleMentorPanel on close', async () => {
      showMentorPanelRef.value = true

      const wrapper = mount(MentorQuestPanel)

      // Find the close button (×)
      const closeBtn = wrapper.findAll('button').find(b => b.text() === '×')
      await closeBtn?.trigger('click')

      expect(mockTutorialComposable.toggleMentorPanel).toHaveBeenCalled()
    })
  })

  describe('Progress Stats', () => {
    it('should show completion stats', () => {
      showMentorPanelRef.value = true
      completionStatsRef.value = { completed: 5, total: 10, percentage: 50 }

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('Progress')
      expect(wrapper.text()).toContain('5 / 10')
    })

    it('should show progress bar', () => {
      showMentorPanelRef.value = true
      completionStatsRef.value = { completed: 3, total: 10, percentage: 30 }

      const wrapper = mount(MentorQuestPanel)

      const progressBar = wrapper.find('.h-3.rounded-full.bg-white.transition-all')
      expect(progressBar.attributes('style')).toContain('width: 30%')
    })
  })

  describe('Claim All Button', () => {
    it('should show claim all when unclaimed rewards exist', () => {
      showMentorPanelRef.value = true
      unclaimedCountRef.value = 2

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('Claim All Rewards')
      expect(wrapper.text()).toContain('(2)')
    })

    it('should not show claim all when no unclaimed', () => {
      showMentorPanelRef.value = true
      unclaimedCountRef.value = 0

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).not.toContain('Claim All Rewards')
    })

    it('should call claimAllRewards on click', async () => {
      showMentorPanelRef.value = true
      unclaimedCountRef.value = 2

      const wrapper = mount(MentorQuestPanel)

      const claimAllBtn = wrapper.find('button.bg-green-500')
      await claimAllBtn.trigger('click')

      expect(mockTutorialComposable.claimAllRewards).toHaveBeenCalled()
    })
  })

  describe('Filters', () => {
    it('should show all filter buttons', () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest()]

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('All')
      expect(wrapper.text()).toContain('Available')
      expect(wrapper.text()).toContain('Locked')
      expect(wrapper.text()).toContain('Completed')
    })

    it('should show counts in filter buttons', () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [
        createQuest({ id: '1', isComplete: false }),
        createQuest({ id: '2', isComplete: true }),
      ]
      unlockedQuestsRef.value = [createQuest({ id: '1' })]
      lockedQuestsRef.value = []

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('All (2)')
    })

    it('should highlight active filter', () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest()]

      const wrapper = mount(MentorQuestPanel)

      // All should be active by default
      const allBtn = wrapper.findAll('button').find(b => b.text().includes('All'))
      expect(allBtn?.classes()).toContain('bg-purple-500')
    })

    it('should change filter on click', async () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest()]
      lockedQuestsRef.value = []

      const wrapper = mount(MentorQuestPanel)

      const lockedBtn = wrapper.findAll('button').find(b => b.text().includes('Locked'))
      await lockedBtn?.trigger('click')

      expect(lockedBtn?.classes()).toContain('bg-purple-500')
    })
  })

  describe('Quest Grouping by Tier', () => {
    it('should show early quests section', () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest({ tier: 'early' })]

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('Early Quests')
      expect(wrapper.text()).toContain('🌱')
    })

    it('should show mid quests section', () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest({ tier: 'mid' })]

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('Mid Quests')
      expect(wrapper.text()).toContain('⚡')
    })

    it('should show late quests section', () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest({ tier: 'late' })]

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('Late Quests')
      expect(wrapper.text()).toContain('👑')
    })

    it('should show final quest section', () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest({ tier: 'final' })]

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('Final Quest')
      expect(wrapper.text()).toContain('🏆')
    })

    it('should not show section for empty tier', () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest({ tier: 'early' })]

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).not.toContain('Mid Quests')
      expect(wrapper.text()).not.toContain('Late Quests')
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no quests match filter', async () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest({ isComplete: false })]
      lockedQuestsRef.value = []

      const wrapper = mount(MentorQuestPanel)

      // Click on Locked filter
      const lockedBtn = wrapper.findAll('button').find(b => b.text().includes('Locked'))
      await lockedBtn?.trigger('click')

      expect(wrapper.text()).toContain('No quests in this category')
      expect(wrapper.text()).toContain('Try a different filter!')
    })
  })

  describe('Footer Info', () => {
    it('should show tip in footer', () => {
      showMentorPanelRef.value = true
      allQuestsRef.value = [createQuest()]

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.text()).toContain('Tip:')
      expect(wrapper.text()).toContain('optional')
      expect(wrapper.text()).toContain('no time limits')
    })
  })

  describe('Backdrop', () => {
    it('should show backdrop when panel is open', () => {
      showMentorPanelRef.value = true

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.find('.fixed.inset-0.bg-black.bg-opacity-50.z-40').exists()).toBe(true)
    })

    it('should close panel when backdrop clicked', async () => {
      showMentorPanelRef.value = true

      const wrapper = mount(MentorQuestPanel)

      const backdrop = wrapper.find('.fixed.inset-0.bg-black.bg-opacity-50.z-40')
      await backdrop.trigger('click')

      expect(mockTutorialComposable.toggleMentorPanel).toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    it('should have gradient header', () => {
      showMentorPanelRef.value = true

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.find('.bg-gradient-to-r.from-purple-500.to-blue-500').exists()).toBe(true)
    })

    it('should have slide-in panel from right', () => {
      showMentorPanelRef.value = true

      const wrapper = mount(MentorQuestPanel)

      expect(wrapper.find('.fixed.right-0.top-0.bottom-0').exists()).toBe(true)
    })

    it('should be responsive width', () => {
      showMentorPanelRef.value = true

      const wrapper = mount(MentorQuestPanel)

      const panel = wrapper.find('.fixed.right-0.top-0')
      expect(panel.classes()).toContain('w-full')
      expect(panel.classes()).toContain('md:w-[600px]')
    })
  })
})
