import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import Board from '~/components/challenges/Board.vue'
import type { Challenge } from '~/stores/challenges'

// Create reactive refs for the store state
const dailyChallengesRef = ref<Challenge[]>([])
const weeklyChallengesRef = ref<Challenge[]>([])
const unclaimedCountRef = ref(0)
const timeUntilDailyResetRef = ref(3600000) // 1 hour
const timeUntilWeeklyResetRef = ref(86400000) // 1 day
const dailyStatsRef = ref({ completed: 0, total: 3 })
const weeklyStatsRef = ref({ completed: 0, total: 2 })

// Mock the challenge store
const mockChallengeStore = {
  loading: false,
  get dailyChallenges() { return dailyChallengesRef.value },
  set dailyChallenges(v) { dailyChallengesRef.value = v },
  get weeklyChallenges() { return weeklyChallengesRef.value },
  set weeklyChallenges(v) { weeklyChallengesRef.value = v },
  get unclaimedCount() { return unclaimedCountRef.value },
  set unclaimedCount(v) { unclaimedCountRef.value = v },
  get timeUntilDailyReset() { return timeUntilDailyResetRef.value },
  set timeUntilDailyReset(v) { timeUntilDailyResetRef.value = v },
  get timeUntilWeeklyReset() { return timeUntilWeeklyResetRef.value },
  set timeUntilWeeklyReset(v) { timeUntilWeeklyResetRef.value = v },
  get dailyStats() { return dailyStatsRef.value },
  set dailyStats(v) { dailyStatsRef.value = v },
  get weeklyStats() { return weeklyStatsRef.value },
  set weeklyStats(v) { weeklyStatsRef.value = v },
  fetchChallenges: vi.fn(),
  claimReward: vi.fn(),
  claimAllRewards: vi.fn(),
}

vi.mock('~/stores/challenges', () => ({
  useChallengeStore: () => mockChallengeStore,
}))

vi.mock('pinia', () => ({
  storeToRefs: () => ({
    dailyChallenges: dailyChallengesRef,
    weeklyChallenges: weeklyChallengesRef,
    unclaimedCount: unclaimedCountRef,
    timeUntilDailyReset: timeUntilDailyResetRef,
    timeUntilWeeklyReset: timeUntilWeeklyResetRef,
    dailyStats: dailyStatsRef,
    weeklyStats: weeklyStatsRef,
  }),
}))

describe('ChallengeBoard', () => {
  const createChallenge = (overrides: Partial<Challenge> = {}): Challenge => ({
    id: 'challenge-1',
    title: 'Complete 3 Expeditions',
    description: 'Send heroes on 3 expeditions today',
    icon: '🗺️',
    type: 'daily',
    requirement: {
      type: 'expeditions_completed',
      target: 3,
    },
    reward: {
      type: 'gold',
      amount: 100,
      description: '100 Gold',
    },
    progress: {
      current: 1,
      completed: false,
      claimed: false,
    },
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    dailyChallengesRef.value = []
    weeklyChallengesRef.value = []
    unclaimedCountRef.value = 0
    timeUntilDailyResetRef.value = 3600000 // 1 hour
    timeUntilWeeklyResetRef.value = 86400000 // 1 day
    dailyStatsRef.value = { completed: 0, total: 3 }
    weeklyStatsRef.value = { completed: 0, total: 2 }
  })

  describe('Header', () => {
    it('should display title', () => {
      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Challenge Board')
    })

    it('should fetch challenges on mount', () => {
      mount(Board)

      expect(mockChallengeStore.fetchChallenges).toHaveBeenCalled()
    })

    it('should show claim all button when unclaimed rewards exist', () => {
      unclaimedCountRef.value = 2

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Claim All (2)')
    })

    it('should not show claim all when no unclaimed rewards', () => {
      unclaimedCountRef.value = 0

      const wrapper = mount(Board)

      expect(wrapper.text()).not.toContain('Claim All')
    })

    it('should call claimAllRewards when claim all clicked', async () => {
      unclaimedCountRef.value = 2

      const wrapper = mount(Board)

      const claimAllBtn = wrapper.find('button.bg-green-500')
      await claimAllBtn.trigger('click')

      expect(mockChallengeStore.claimAllRewards).toHaveBeenCalled()
    })
  })

  describe('Tabs', () => {
    it('should show daily tab', () => {
      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Daily Challenges')
    })

    it('should show weekly tab', () => {
      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Weekly Challenges')
    })

    it('should show daily stats', () => {
      dailyStatsRef.value = { completed: 1, total: 3 }

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('1/3 Complete')
    })

    it('should show weekly stats', () => {
      weeklyStatsRef.value = { completed: 2, total: 5 }

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('2/5 Complete')
    })

    it('should have daily tab active by default', () => {
      const wrapper = mount(Board)

      const dailyTab = wrapper.findAll('button').find(b => b.text().includes('Daily Challenges'))
      expect(dailyTab?.classes()).toContain('bg-blue-500')
    })

    it('should switch to weekly tab on click', async () => {
      const wrapper = mount(Board)

      const weeklyTab = wrapper.findAll('button').find(b => b.text().includes('Weekly Challenges'))
      await weeklyTab?.trigger('click')

      expect(weeklyTab?.classes()).toContain('bg-purple-500')
    })
  })

  describe('Daily Challenges', () => {
    it('should show daily challenges header', () => {
      const wrapper = mount(Board)

      expect(wrapper.text()).toContain("Today's Challenges")
    })

    it('should show reset timer', () => {
      timeUntilDailyResetRef.value = 3600000 // 1 hour

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Resets in:')
      expect(wrapper.text()).toContain('1h 0m')
    })

    it('should display challenge title', () => {
      dailyChallengesRef.value = [createChallenge()]

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Complete 3 Expeditions')
    })

    it('should display challenge icon', () => {
      dailyChallengesRef.value = [createChallenge()]

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('🗺️')
    })

    it('should display challenge description', () => {
      dailyChallengesRef.value = [createChallenge()]

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Send heroes on 3 expeditions today')
    })

    it('should show progress bar', () => {
      dailyChallengesRef.value = [
        createChallenge({ progress: { current: 1, completed: false, claimed: false } }),
      ]

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Progress')
      expect(wrapper.text()).toContain('1 / 3')
    })

    it('should show reward', () => {
      dailyChallengesRef.value = [createChallenge()]

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Reward:')
      expect(wrapper.text()).toContain('100 Gold')
    })

    it('should show empty state when no challenges', () => {
      dailyChallengesRef.value = []

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('No daily challenges available')
    })
  })

  describe('Weekly Challenges', () => {
    it('should show weekly challenges when tab selected', async () => {
      weeklyChallengesRef.value = [
        createChallenge({
          id: 'weekly-1',
          title: 'Weekly Goal',
          type: 'weekly',
        }),
      ]

      const wrapper = mount(Board)

      const weeklyTab = wrapper.findAll('button').find(b => b.text().includes('Weekly Challenges'))
      await weeklyTab?.trigger('click')

      expect(wrapper.text()).toContain("This Week's Challenges")
      expect(wrapper.text()).toContain('Weekly Goal')
    })

    it('should show weekly reset timer', async () => {
      timeUntilWeeklyResetRef.value = 172800000 // 48 hours

      const wrapper = mount(Board)

      const weeklyTab = wrapper.findAll('button').find(b => b.text().includes('Weekly Challenges'))
      await weeklyTab?.trigger('click')

      expect(wrapper.text()).toContain('48h 0m')
    })
  })

  describe('Challenge States', () => {
    it('should show claim button when completed but not claimed', () => {
      dailyChallengesRef.value = [
        createChallenge({
          progress: { current: 3, completed: true, claimed: false },
        }),
      ]

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Claim')
    })

    it('should show claimed status when already claimed', () => {
      dailyChallengesRef.value = [
        createChallenge({
          progress: { current: 3, completed: true, claimed: true },
        }),
      ]

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('✓')
      expect(wrapper.text()).toContain('Claimed')
    })

    it('should have green background when completed', () => {
      dailyChallengesRef.value = [
        createChallenge({
          progress: { current: 3, completed: true, claimed: false },
        }),
      ]

      const wrapper = mount(Board)

      expect(wrapper.find('.bg-green-50').exists()).toBe(true)
    })

    it('should call claimReward when claim clicked', async () => {
      dailyChallengesRef.value = [
        createChallenge({
          id: 'test-challenge',
          progress: { current: 3, completed: true, claimed: false },
        }),
      ]

      const wrapper = mount(Board)

      const claimBtn = wrapper.findAll('button').find(b => b.text() === 'Claim')
      await claimBtn?.trigger('click')

      expect(mockChallengeStore.claimReward).toHaveBeenCalledWith('test-challenge')
    })

    it('should not show progress bar when completed', () => {
      dailyChallengesRef.value = [
        createChallenge({
          progress: { current: 3, completed: true, claimed: false },
        }),
      ]

      const wrapper = mount(Board)

      expect(wrapper.text()).not.toContain('Progress')
    })
  })

  describe('Styling', () => {
    it('should have blue border for daily challenges', () => {
      dailyChallengesRef.value = [createChallenge()]

      const wrapper = mount(Board)

      expect(wrapper.find('.border-blue-500').exists()).toBe(true)
    })

    it('should have purple border for weekly challenges', async () => {
      weeklyChallengesRef.value = [createChallenge({ type: 'weekly' })]

      const wrapper = mount(Board)

      const weeklyTab = wrapper.findAll('button').find(b => b.text().includes('Weekly Challenges'))
      await weeklyTab?.trigger('click')

      expect(wrapper.find('.border-purple-500').exists()).toBe(true)
    })

    it('should have white background', () => {
      const wrapper = mount(Board)

      expect(wrapper.find('.bg-white').exists()).toBe(true)
    })

    it('should have rounded corners', () => {
      const wrapper = mount(Board)

      expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    })

    it('should have shadow', () => {
      const wrapper = mount(Board)

      expect(wrapper.find('.shadow-lg').exists()).toBe(true)
    })
  })

  describe('Time Formatting', () => {
    it('should format hours and minutes', () => {
      timeUntilDailyResetRef.value = 7200000 // 2 hours

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('2h 0m')
    })

    it('should format minutes only when less than an hour', () => {
      timeUntilDailyResetRef.value = 1800000 // 30 minutes

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('30m')
    })

    it('should show resetting when time is zero', () => {
      timeUntilDailyResetRef.value = 0

      const wrapper = mount(Board)

      expect(wrapper.text()).toContain('Resetting...')
    })
  })
})
