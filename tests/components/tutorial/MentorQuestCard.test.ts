import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MentorQuestCard from '~/components/tutorial/MentorQuestCard.vue'

describe('MentorQuestCard', () => {
  const createQuest = (overrides = {}) => ({
    id: 'quest-1',
    title: 'First Steps',
    description: 'Complete your first expedition to learn the basics.',
    icon: '🗡️',
    tier: 'early' as const,
    reward: {
      type: 'gold',
      amount: 100,
      description: '100 Gold',
    },
    unlockCondition: null,
    progress: {
      type: 'count' as const,
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

  describe('Basic Rendering', () => {
    it('should display quest title', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest() },
      })

      expect(wrapper.text()).toContain('First Steps')
    })

    it('should display quest description', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest() },
      })

      expect(wrapper.text()).toContain('Complete your first expedition')
    })

    it('should display quest icon', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest() },
      })

      expect(wrapper.text()).toContain('🗡️')
    })

    it('should display tier badge', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest() },
      })

      expect(wrapper.text()).toContain('Early Quest')
    })

    it('should display reward description', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest() },
      })

      expect(wrapper.text()).toContain('100 Gold')
    })
  })

  describe('Tier Styling', () => {
    it('should have green border for early tier', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest({ tier: 'early' }) },
      })

      expect(wrapper.find('.border-green-500').exists()).toBe(true)
    })

    it('should have blue border for mid tier', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest({ tier: 'mid' }) },
      })

      expect(wrapper.find('.border-blue-500').exists()).toBe(true)
    })

    it('should have purple border for late tier', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest({ tier: 'late' }) },
      })

      expect(wrapper.find('.border-purple-500').exists()).toBe(true)
    })

    it('should have yellow border for final tier', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest({ tier: 'final' }) },
      })

      expect(wrapper.find('.border-yellow-500').exists()).toBe(true)
    })

    it('should display correct tier labels', () => {
      const tiers = ['early', 'mid', 'late', 'final'] as const
      const labels = ['Early Quest', 'Mid Quest', 'Late Quest', 'Final Quest']

      tiers.forEach((tier, i) => {
        const wrapper = mount(MentorQuestCard, {
          props: { quest: createQuest({ tier }) },
        })
        expect(wrapper.text()).toContain(labels[i])
      })
    })
  })

  describe('Locked State', () => {
    it('should show lock icon when not unlocked', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest({ isUnlocked: false }) },
      })

      expect(wrapper.text()).toContain('🔒')
    })

    it('should have reduced opacity when locked', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest({ isUnlocked: false }) },
      })

      expect(wrapper.find('.opacity-60').exists()).toBe(true)
    })

    it('should show unlock text when provided', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({ isUnlocked: false }),
          unlockText: 'Complete 5 expeditions to unlock',
        },
      })

      expect(wrapper.text()).toContain('Complete 5 expeditions to unlock')
    })

    it('should show default locked text when no unlock text', () => {
      const wrapper = mount(MentorQuestCard, {
        props: { quest: createQuest({ isUnlocked: false }) },
      })

      expect(wrapper.text()).toContain('Locked')
    })
  })

  describe('Progress Display', () => {
    it('should show progress bar when unlocked and not complete', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isUnlocked: true,
            isComplete: false,
            progress: { type: 'count', current: 2, target: 5 },
          }),
        },
      })

      expect(wrapper.text()).toContain('2 / 5')
      expect(wrapper.text()).toContain('Progress')
    })

    it('should calculate progress percentage correctly', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isUnlocked: true,
            isComplete: false,
            progress: { type: 'count', current: 3, target: 6 },
          }),
        },
      })

      const progressBar = wrapper.find('.h-2.rounded-full.transition-all')
      expect(progressBar.attributes('style')).toContain('width: 50%')
    })

    it('should cap progress at 100%', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isUnlocked: true,
            isComplete: false,
            progress: { type: 'count', current: 10, target: 5 },
          }),
        },
      })

      const progressBar = wrapper.find('.h-2.rounded-full.transition-all')
      expect(progressBar.attributes('style')).toContain('width: 100%')
    })

    it('should not show progress bar when locked', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isUnlocked: false,
            progress: { type: 'count', current: 2, target: 5 },
          }),
        },
      })

      expect(wrapper.text()).not.toContain('Progress')
    })
  })

  describe('Complete State', () => {
    it('should have green background when complete but not claimed', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: false,
            completedAt: new Date().toISOString(),
          }),
        },
      })

      expect(wrapper.find('.bg-green-50').exists()).toBe(true)
    })

    it('should show completed date', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: false,
            completedAt: '2024-01-15T12:00:00Z',
          }),
        },
      })

      expect(wrapper.text()).toContain('Completed')
    })

    it('should show gift icon when complete but not claimed', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: false,
          }),
        },
      })

      expect(wrapper.text()).toContain('🎁')
    })

    it('should show claim button when complete but not claimed', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: false,
          }),
        },
      })

      expect(wrapper.text()).toContain('Claim')
    })
  })

  describe('Claimed State', () => {
    it('should have gray background when claimed', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: true,
            claimedAt: new Date().toISOString(),
          }),
        },
      })

      expect(wrapper.find('.bg-gray-50').exists()).toBe(true)
    })

    it('should show claimed date', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: true,
            claimedAt: '2024-01-16T12:00:00Z',
          }),
        },
      })

      expect(wrapper.text()).toContain('Claimed')
    })

    it('should not show claim button when claimed', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: true,
          }),
        },
      })

      expect(wrapper.findAll('button').filter(b => b.text() === 'Claim').length).toBe(0)
    })

    it('should show checkmark icon when claimed', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: true,
          }),
        },
      })

      // First icon in reward section should be checkmark
      const rewardSection = wrapper.find('.rounded-lg.p-3.border-2')
      expect(rewardSection.text()).toContain('✓')
    })
  })

  describe('Claim Action', () => {
    it('should emit claim when claim button clicked', async () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: false,
          }),
        },
      })

      const claimBtn = wrapper.find('button.bg-green-500')
      await claimBtn.trigger('click')

      expect(wrapper.emitted('claim')).toBeTruthy()
    })
  })

  describe('Reward Section Styling', () => {
    it('should have blue styling when in progress', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isUnlocked: true,
            isComplete: false,
          }),
        },
      })

      expect(wrapper.find('.bg-blue-50.border-blue-200').exists()).toBe(true)
    })

    it('should have green styling when complete', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: false,
          }),
        },
      })

      expect(wrapper.find('.bg-green-50.border-green-300').exists()).toBe(true)
    })

    it('should have gray styling when claimed', () => {
      const wrapper = mount(MentorQuestCard, {
        props: {
          quest: createQuest({
            isComplete: true,
            isClaimed: true,
          }),
        },
      })

      expect(wrapper.find('.bg-gray-100.border-gray-300').exists()).toBe(true)
    })
  })
})
