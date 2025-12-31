import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import Intro from '~/components/tutorial/Intro.vue'

// Create reactive tutorial state
const mockTutorial = reactive({
  isActive: true,
  currentStep: 'welcome',
  guildMasterName: 'Sir Test',
})

const mockNextTutorialStep = vi.fn()
const mockSetGuildMasterName = vi.fn()
const mockCompleteTutorialExpedition = vi.fn()
const mockSkipTutorial = vi.fn()

// Use stubGlobal for Nuxt auto-import
vi.stubGlobal('useTutorial', () => ({
  tutorial: mockTutorial,
  nextTutorialStep: mockNextTutorialStep,
  setGuildMasterName: mockSetGuildMasterName,
  completeTutorialExpedition: mockCompleteTutorialExpedition,
  skipTutorial: mockSkipTutorial,
}))

describe('Intro', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockTutorial.isActive = true
    mockTutorial.currentStep = 'welcome'
    mockTutorial.guildMasterName = 'Sir Test'
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Visibility', () => {
    it('should render when tutorial is active', () => {
      mockTutorial.isActive = true

      const wrapper = mount(Intro)

      expect(wrapper.find('.fixed').exists()).toBe(true)
    })

    it('should not render when tutorial is inactive', () => {
      mockTutorial.isActive = false

      const wrapper = mount(Intro)

      expect(wrapper.find('.fixed').exists()).toBe(false)
    })
  })

  describe('Welcome Step', () => {
    it('should show welcome content', () => {
      mockTutorial.currentStep = 'welcome'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Welcome to Dungeon Farmers!')
      expect(wrapper.text()).toContain('👋')
    })

    it('should show what you\'ll learn list', () => {
      mockTutorial.currentStep = 'welcome'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('What You\'ll Learn')
      expect(wrapper.text()).toContain('Name your Guild Master')
      expect(wrapper.text()).toContain('Send your first expedition')
      expect(wrapper.text()).toContain('See expedition logs')
    })

    it('should have get started button', () => {
      mockTutorial.currentStep = 'welcome'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Let\'s Get Started!')
    })

    it('should call nextTutorialStep on get started', async () => {
      mockTutorial.currentStep = 'welcome'

      const wrapper = mount(Intro)

      const startBtn = wrapper.find('button.bg-blue-500')
      await startBtn.trigger('click')

      expect(mockNextTutorialStep).toHaveBeenCalled()
    })
  })

  describe('Name Guild Step', () => {
    it('should show name input', () => {
      mockTutorial.currentStep = 'name_guild'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Name Your Guild Master')
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })

    it('should show character count', () => {
      mockTutorial.currentStep = 'name_guild'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('/30 characters')
    })

    it('should show tip about guild master', () => {
      mockTutorial.currentStep = 'name_guild'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Tip:')
      expect(wrapper.text()).toContain('randomly generated hero')
    })

    it('should have disabled continue button when empty', () => {
      mockTutorial.currentStep = 'name_guild'

      const wrapper = mount(Intro)

      const continueBtn = wrapper.find('button.bg-blue-500')
      expect(continueBtn.attributes('disabled')).toBeDefined()
    })

    it('should call setGuildMasterName on submit', async () => {
      mockTutorial.currentStep = 'name_guild'

      const wrapper = mount(Intro)

      const input = wrapper.find('input[type="text"]')
      await input.setValue('Sir Galahad')

      const continueBtn = wrapper.find('button.bg-blue-500')
      await continueBtn.trigger('click')

      expect(mockSetGuildMasterName).toHaveBeenCalledWith('Sir Galahad')
      expect(mockNextTutorialStep).toHaveBeenCalled()
    })

    it('should submit on enter key', async () => {
      mockTutorial.currentStep = 'name_guild'

      const wrapper = mount(Intro)

      const input = wrapper.find('input[type="text"]')
      await input.setValue('Sir Galahad')
      await input.trigger('keyup.enter')

      expect(mockSetGuildMasterName).toHaveBeenCalled()
    })

    it('should trim whitespace from name', async () => {
      mockTutorial.currentStep = 'name_guild'

      const wrapper = mount(Intro)

      const input = wrapper.find('input[type="text"]')
      await input.setValue('  Sir Galahad  ')

      const continueBtn = wrapper.find('button.bg-blue-500')
      await continueBtn.trigger('click')

      expect(mockSetGuildMasterName).toHaveBeenCalledWith('Sir Galahad')
    })
  })

  describe('Tutorial Expedition Step', () => {
    it('should show expedition details', () => {
      mockTutorial.currentStep = 'tutorial_expedition'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Your First Expedition')
      expect(wrapper.text()).toContain('🗺️')
    })

    it('should display guild master name', () => {
      mockTutorial.currentStep = 'tutorial_expedition'
      mockTutorial.guildMasterName = 'Sir Lancelot'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Sir Lancelot')
    })

    it('should show zone info', () => {
      mockTutorial.currentStep = 'tutorial_expedition'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('The Starting Meadow')
      expect(wrapper.text()).toContain('Instant (tutorial only!)')
      expect(wrapper.text()).toContain('Easy')
    })

    it('should show info about normal expedition duration', () => {
      mockTutorial.currentStep = 'tutorial_expedition'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Normally expeditions take 15 minutes to 2 hours')
    })

    it('should have start expedition button', () => {
      mockTutorial.currentStep = 'tutorial_expedition'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Start Expedition!')
      expect(wrapper.text()).toContain('🚀')
    })

    it('should complete expedition after delay', async () => {
      mockTutorial.currentStep = 'tutorial_expedition'

      const wrapper = mount(Intro)

      const startBtn = wrapper.find('button.bg-green-500')
      await startBtn.trigger('click')

      vi.advanceTimersByTime(500)

      expect(mockCompleteTutorialExpedition).toHaveBeenCalled()
      expect(mockNextTutorialStep).toHaveBeenCalled()
    })
  })

  describe('View Log Step', () => {
    it('should show expedition complete', () => {
      mockTutorial.currentStep = 'view_log'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Expedition Complete!')
      expect(wrapper.text()).toContain('📜')
    })

    it('should show mock expedition log', () => {
      mockTutorial.currentStep = 'view_log'
      mockTutorial.guildMasterName = 'Sir Test'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Expedition Log')
      expect(wrapper.text()).toContain('Sir Test')
      expect(wrapper.text()).toContain('Slime')
      expect(wrapper.text()).toContain('50 gold')
      expect(wrapper.text()).toContain('Basic Sword')
    })

    it('should show core loop explanation', () => {
      mockTutorial.currentStep = 'view_log'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('The Core Loop')
      expect(wrapper.text()).toContain('Send heroes')
    })

    it('should have got it button', () => {
      mockTutorial.currentStep = 'view_log'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Got It!')
    })

    it('should call nextTutorialStep on got it', async () => {
      mockTutorial.currentStep = 'view_log'

      const wrapper = mount(Intro)

      const gotItBtn = wrapper.find('button.bg-blue-500')
      await gotItBtn.trigger('click')

      expect(mockNextTutorialStep).toHaveBeenCalled()
    })
  })

  describe('Complete Step', () => {
    it('should show completion message', () => {
      mockTutorial.currentStep = 'complete'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('You\'re Ready!')
      expect(wrapper.text()).toContain('🎉')
    })

    it('should mention mentor quests', () => {
      mockTutorial.currentStep = 'complete'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Mentor Quests Available!')
      expect(wrapper.text()).toContain('All quests visible from the start')
      expect(wrapper.text()).toContain('No time limits')
    })

    it('should show quick tips', () => {
      mockTutorial.currentStep = 'complete'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Quick Tips')
      expect(wrapper.text()).toContain('tavern')
      expect(wrapper.text()).toContain('traits')
    })

    it('should have start playing button', () => {
      mockTutorial.currentStep = 'complete'

      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Start Playing!')
      expect(wrapper.text()).toContain('🎮')
    })

    it('should call nextTutorialStep on start playing', async () => {
      mockTutorial.currentStep = 'complete'

      const wrapper = mount(Intro)

      const startBtn = wrapper.find('button.bg-green-500')
      await startBtn.trigger('click')

      expect(mockNextTutorialStep).toHaveBeenCalled()
    })
  })

  describe('Skip Tutorial', () => {
    it('should have skip button in header', () => {
      const wrapper = mount(Intro)

      expect(wrapper.text()).toContain('Skip Tutorial')
    })

    it('should show skip confirmation on click', async () => {
      const wrapper = mount(Intro)

      const skipBtn = wrapper.find('button.text-gray-500')
      await skipBtn.trigger('click')

      expect(wrapper.text()).toContain('Skip Tutorial?')
      expect(wrapper.text()).toContain('Are you sure')
    })

    it('should have cancel button in confirmation', async () => {
      const wrapper = mount(Intro)

      await wrapper.find('button.text-gray-500').trigger('click')

      const cancelBtn = wrapper.find('.bg-gray-200')
      expect(cancelBtn.text()).toBe('Cancel')
    })

    it('should close confirmation on cancel', async () => {
      const wrapper = mount(Intro)

      await wrapper.find('button.text-gray-500').trigger('click')
      expect(wrapper.text()).toContain('Skip Tutorial?')

      const cancelBtn = wrapper.find('.bg-gray-200')
      await cancelBtn.trigger('click')

      // Confirmation should be gone
      expect(wrapper.findAll('.absolute').filter(el => el.text().includes('Skip Tutorial?')).length).toBe(0)
    })

    it('should call skipTutorial on confirm', async () => {
      const wrapper = mount(Intro)

      await wrapper.find('button.text-gray-500').trigger('click')

      const confirmBtn = wrapper.find('.bg-red-500')
      await confirmBtn.trigger('click')

      expect(mockSkipTutorial).toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    it('should have modal overlay', () => {
      const wrapper = mount(Intro)

      expect(wrapper.find('.bg-black.bg-opacity-50').exists()).toBe(true)
    })

    it('should have white modal container', () => {
      const wrapper = mount(Intro)

      expect(wrapper.find('.bg-white.rounded-lg').exists()).toBe(true)
    })

    it('should have sticky header', () => {
      const wrapper = mount(Intro)

      expect(wrapper.find('.sticky.top-0').exists()).toBe(true)
    })

    it('should be centered in viewport', () => {
      const wrapper = mount(Intro)

      expect(wrapper.find('.flex.items-center.justify-center').exists()).toBe(true)
    })
  })
})
