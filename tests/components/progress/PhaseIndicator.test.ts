import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PhaseIndicator from '~/components/progress/PhaseIndicator.vue'

describe('PhaseIndicator', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('should render phase indicator', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 0, totalPhases: 3 },
      })

      expect(wrapper.find('[role="list"]').exists()).toBe(true)
    })

    it('should render correct number of phases', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 0, totalPhases: 5 },
      })

      const phases = wrapper.findAll('[role="listitem"]')
      expect(phases.length).toBe(5)
    })

    it('should show phase summary', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 1, totalPhases: 4 },
      })

      expect(wrapper.text()).toContain('Phase 2 of 4')
    })
  })

  describe('Default Phase Names', () => {
    it('should generate default phase names', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 0, totalPhases: 3 },
      })

      expect(wrapper.text()).toContain('Phase 1')
      expect(wrapper.text()).toContain('Phase 2')
      expect(wrapper.text()).toContain('Phase 3')
    })
  })

  describe('Custom Phase Names', () => {
    it('should use custom phase names when provided', () => {
      const phases = [
        { name: 'Travel', status: 'completed' as const },
        { name: 'Combat', status: 'current' as const },
        { name: 'Loot', status: 'pending' as const },
      ]

      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 1, totalPhases: 3, phases },
      })

      expect(wrapper.text()).toContain('Travel')
      expect(wrapper.text()).toContain('Combat')
      expect(wrapper.text()).toContain('Loot')
    })
  })

  describe('Phase Status Styling', () => {
    it('should apply completed styles to completed phases', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 2, totalPhases: 3 },
      })

      // First two phases should be completed
      const dots = wrapper.findAll('.rounded-full.border-2')
      expect(dots[0].classes()).toContain('bg-green-500')
    })

    it('should apply current styles to current phase', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 1, totalPhases: 3 },
      })

      const dots = wrapper.findAll('.rounded-full.border-2')
      expect(dots[1].classes()).toContain('bg-blue-500')
      expect(dots[1].classes()).toContain('ring-4')
    })

    it('should apply pending styles to pending phases', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 0, totalPhases: 3 },
      })

      const dots = wrapper.findAll('.rounded-full.border-2')
      expect(dots[2].classes()).toContain('bg-white')
      expect(dots[2].classes()).toContain('border-gray-300')
    })

    it('should show checkmark for completed phases', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 2, totalPhases: 3 },
      })

      // First phase should have checkmark
      expect(wrapper.text()).toContain('✓')
    })
  })

  describe('Connecting Lines', () => {
    it('should render connecting lines between phases', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 0, totalPhases: 3 },
      })

      // Should have 2 connecting lines for 3 phases
      const lines = wrapper.findAll('[aria-hidden="true"].h-0\\.5')
      expect(lines.length).toBe(2)
    })

    it('should style completed lines differently', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 2, totalPhases: 3 },
      })

      const lines = wrapper.findAll('[aria-hidden="true"].h-0\\.5')
      expect(lines[0].classes()).toContain('bg-green-500')
    })
  })

  describe('Accessibility', () => {
    it('should have aria-label for expedition phases', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 0, totalPhases: 3 },
      })

      expect(wrapper.find('[aria-label="Expedition phases"]').exists()).toBe(true)
    })

    it('should mark current phase with aria-current', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 1, totalPhases: 3 },
      })

      const currentItem = wrapper.find('[aria-current="step"]')
      expect(currentItem.exists()).toBe(true)
    })

    it('should have live region for progress summary', () => {
      const wrapper = mount(PhaseIndicator, {
        props: { currentPhase: 0, totalPhases: 3 },
      })

      const summary = wrapper.find('[role="status"]')
      expect(summary.attributes('aria-live')).toBe('polite')
    })
  })

  describe('Boundary Validation', () => {
    it('should warn when currentPhase is out of bounds', () => {
      mount(PhaseIndicator, {
        props: { currentPhase: 5, totalPhases: 3 },
      })

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('out of bounds')
      )
    })

    it('should warn when currentPhase is negative', () => {
      mount(PhaseIndicator, {
        props: { currentPhase: -1, totalPhases: 3 },
      })

      expect(console.warn).toHaveBeenCalled()
    })

    it('should not warn when currentPhase is valid', () => {
      mount(PhaseIndicator, {
        props: { currentPhase: 1, totalPhases: 3 },
      })

      expect(console.warn).not.toHaveBeenCalled()
    })
  })
})
