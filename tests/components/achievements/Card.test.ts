import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '~/components/achievements/Card.vue'
import type { Achievement } from '~/data/achievements'

describe('AchievementCard', () => {
  const createAchievement = (overrides: Partial<Achievement> = {}): Achievement => ({
    id: 'ach-1',
    name: 'First Steps',
    description: 'Complete your first expedition',
    icon: '🏅',
    category: 'explorer',
    tier: 'bronze',
    points: 10,
    reward: {
      type: 'gold',
      amount: 100,
      description: '100 Gold',
    },
    requirement: {
      type: 'expeditions_completed',
      target: 1,
    },
    isHidden: false,
    ...overrides,
  })

  describe('Basic Rendering', () => {
    it('should display achievement name', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
        },
      })

      expect(wrapper.text()).toContain('First Steps')
    })

    it('should display achievement icon', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
        },
      })

      expect(wrapper.text()).toContain('🏅')
    })

    it('should display achievement description', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
        },
      })

      expect(wrapper.text()).toContain('Complete your first expedition')
    })

    it('should display points badge', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
        },
      })

      expect(wrapper.text()).toContain('10p')
    })

    it('should display category', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
        },
      })

      expect(wrapper.text()).toContain('Explorer')
    })

    it('should display tier', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
        },
      })

      expect(wrapper.text()).toContain('bronze')
    })

    it('should display reward', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
        },
      })

      expect(wrapper.text()).toContain('Reward')
      expect(wrapper.text()).toContain('100 Gold')
    })
  })

  describe('Tier Styling', () => {
    it('should have orange border for bronze tier', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement({ tier: 'bronze' }),
        },
      })

      expect(wrapper.find('.border-orange-500').exists()).toBe(true)
    })

    it('should have gray border for silver tier', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement({ tier: 'silver' }),
        },
      })

      expect(wrapper.find('.border-gray-400').exists()).toBe(true)
    })

    it('should have yellow border for gold tier', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement({ tier: 'gold' }),
        },
      })

      expect(wrapper.find('.border-yellow-500').exists()).toBe(true)
    })

    it('should have purple border for platinum tier', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement({ tier: 'platinum' }),
        },
      })

      expect(wrapper.find('.border-purple-500').exists()).toBe(true)
    })

    it('should have gradient header bar', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
        },
      })

      expect(wrapper.find('.h-2.bg-gradient-to-r').exists()).toBe(true)
    })
  })

  describe('Unlocked State', () => {
    it('should show checkmark in reward section when unlocked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
        },
      })

      expect(wrapper.text()).toContain('✓')
    })

    it('should show unlock date when provided', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
          unlockedAt: '2024-01-15T12:00:00Z',
        },
      })

      expect(wrapper.text()).toContain('Unlocked on')
    })

    it('should have green reward styling when unlocked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
        },
      })

      expect(wrapper.find('.bg-green-50.border-green-300').exists()).toBe(true)
    })
  })

  describe('Locked State', () => {
    it('should show gift icon in reward section when locked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: false,
        },
      })

      expect(wrapper.text()).toContain('🎁')
    })

    it('should have gray reward styling when locked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: false,
        },
      })

      expect(wrapper.find('.bg-gray-50.border-gray-200').exists()).toBe(true)
    })
  })

  describe('Hidden Achievements', () => {
    it('should show question mark icon for hidden achievements when locked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement({ isHidden: true }),
          isUnlocked: false,
        },
      })

      expect(wrapper.text()).toContain('❓')
    })

    it('should show ??? for name of hidden achievements when locked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement({ isHidden: true }),
          isUnlocked: false,
        },
      })

      expect(wrapper.text()).toContain('???')
    })

    it('should show hidden description when locked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement({ isHidden: true }),
          isUnlocked: false,
        },
      })

      expect(wrapper.text()).toContain('Hidden achievement - complete to reveal!')
    })

    it('should have reduced opacity for hidden locked achievements', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement({ isHidden: true }),
          isUnlocked: false,
        },
      })

      expect(wrapper.find('.opacity-50').exists()).toBe(true)
    })

    it('should show actual content when hidden achievement is unlocked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement({ isHidden: true }),
          isUnlocked: true,
        },
      })

      expect(wrapper.text()).toContain('First Steps')
      expect(wrapper.text()).toContain('🏅')
    })
  })

  describe('Progress', () => {
    it('should show progress bar when not unlocked and has progress', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: false,
          progress: {
            currentValue: 5,
            targetValue: 10,
          },
        },
      })

      expect(wrapper.text()).toContain('Progress')
      expect(wrapper.text()).toContain('5 / 10')
    })

    it('should calculate progress percentage correctly', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: false,
          progress: {
            currentValue: 3,
            targetValue: 10,
          },
        },
      })

      const progressBar = wrapper.find('.h-2.rounded-full.transition-all')
      expect(progressBar.attributes('style')).toContain('width: 30%')
    })

    it('should cap progress at 100%', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: false,
          progress: {
            currentValue: 15,
            targetValue: 10,
          },
        },
      })

      const progressBar = wrapper.find('.h-2.rounded-full.transition-all')
      expect(progressBar.attributes('style')).toContain('width: 100%')
    })

    it('should not show progress bar when unlocked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
          progress: {
            currentValue: 10,
            targetValue: 10,
          },
        },
      })

      expect(wrapper.text()).not.toContain('Progress')
    })
  })

  describe('Showcase', () => {
    it('should show showcase toggle when unlocked and can toggle', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
          canToggleShowcase: true,
        },
      })

      expect(wrapper.text()).toContain('☆')
    })

    it('should show filled star when showcased', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
          canToggleShowcase: true,
          isShowcased: true,
        },
      })

      expect(wrapper.text()).toContain('⭐')
    })

    it('should emit toggleShowcase when clicked', async () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
          canToggleShowcase: true,
        },
      })

      const toggleBtn = wrapper.find('button')
      await toggleBtn.trigger('click')

      expect(wrapper.emitted('toggleShowcase')).toBeTruthy()
    })

    it('should not show toggle when locked', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: false,
          canToggleShowcase: true,
        },
      })

      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('should not show toggle when canToggleShowcase is false', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
          isUnlocked: true,
          canToggleShowcase: false,
        },
      })

      expect(wrapper.find('button').exists()).toBe(false)
    })
  })

  describe('Card Styling', () => {
    it('should have white background', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
        },
      })

      expect(wrapper.find('.bg-white').exists()).toBe(true)
    })

    it('should have rounded corners', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
        },
      })

      expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    })

    it('should have shadow', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
        },
      })

      expect(wrapper.find('.shadow-md').exists()).toBe(true)
    })

    it('should have hover shadow effect', () => {
      const wrapper = mount(Card, {
        props: {
          achievement: createAchievement(),
        },
      })

      expect(wrapper.find('.hover\\:shadow-lg').exists()).toBe(true)
    })
  })
})
