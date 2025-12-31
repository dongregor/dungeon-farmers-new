import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SearchBar from '~/components/input/SearchBar.vue'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('should render search input', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    })

    it('should render search icon', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('svg').exists()).toBe(true)
    })

    it('should use provided placeholder', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '', placeholder: 'Find heroes...' },
      })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Find heroes...')
    })

    it('should use default placeholder when not provided', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Search...')
    })
  })

  describe('Clear Button', () => {
    it('should not show clear button when value is empty', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
      })

      expect(wrapper.findAll('button').length).toBe(0)
    })

    it('should show clear button when value is not empty', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'test' },
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('should clear value when clear button clicked', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'test' },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    })

    it('should emit search event with empty string when cleared', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'test' },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search')![0]).toEqual([''])
    })
  })

  describe('Debounce', () => {
    it('should debounce input events', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '', debounce: 300 },
      })

      const input = wrapper.find('input')
      await input.setValue('test')

      // Should not emit immediately
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()

      // Advance timer
      vi.advanceTimersByTime(300)
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('should use custom debounce time', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '', debounce: 500 },
      })

      const input = wrapper.find('input')
      await input.setValue('test')

      vi.advanceTimersByTime(300)
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()

      vi.advanceTimersByTime(200)
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  describe('Suggestions', () => {
    it('should not show suggestions when empty', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '', suggestions: ['Apple', 'Banana'] },
      })

      expect(wrapper.find('ul').exists()).toBe(false)
    })

    it('should show filtered suggestions when typing', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'ap', suggestions: ['Apple', 'Banana', 'Apricot'] },
      })

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      expect(wrapper.find('ul').exists()).toBe(true)
      expect(wrapper.findAll('li').length).toBe(2) // Apple, Apricot (both contain "ap")
    })

    it('should limit suggestions to 5', async () => {
      const wrapper = mount(SearchBar, {
        props: {
          modelValue: 'a',
          suggestions: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],
        },
      })

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      expect(wrapper.findAll('li').length).toBe(5)
    })

    it('should select suggestion on click', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'app', suggestions: ['Apple', 'Apricot'] },
      })

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      await wrapper.findAll('li').at(0)?.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Apple'])
    })
  })

  describe('Keyboard Navigation', () => {
    it('should navigate down with ArrowDown', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'a', suggestions: ['Apple', 'Apricot'] },
      })

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      const firstSuggestion = wrapper.findAll('li').at(0)
      expect(firstSuggestion?.classes()).toContain('bg-blue-50')
    })

    it('should navigate up with ArrowUp', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'a', suggestions: ['Apple', 'Apricot'] },
      })

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      // Navigate down twice
      await input.trigger('keydown', { key: 'ArrowDown' })
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      // Navigate up once
      await input.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()

      const firstSuggestion = wrapper.findAll('li').at(0)
      expect(firstSuggestion?.classes()).toContain('bg-blue-50')
    })

    it('should select suggestion with Enter', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'a', suggestions: ['Apple', 'Apricot'] },
      })

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      await input.trigger('keydown', { key: 'ArrowDown' })
      await input.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Apple'])
    })

    it('should close suggestions with Escape', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'a', suggestions: ['Apple', 'Apricot'] },
      })

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      expect(wrapper.find('ul').exists()).toBe(true)

      await input.trigger('keydown', { key: 'Escape' })
      await nextTick()

      expect(wrapper.find('ul').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('should have combobox role', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('input').attributes('role')).toBe('combobox')
    })

    it('should have aria-expanded attribute', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('input').attributes('aria-expanded')).toBeDefined()
    })

    it('should have listbox role on suggestions', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'a', suggestions: ['Apple'] },
      })

      await wrapper.find('input').trigger('focus')
      await nextTick()

      expect(wrapper.find('ul').attributes('role')).toBe('listbox')
    })

    it('should have option role on suggestion items', async () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'a', suggestions: ['Apple'] },
      })

      await wrapper.find('input').trigger('focus')
      await nextTick()

      expect(wrapper.find('li').attributes('role')).toBe('option')
    })

    it('should have aria-label on clear button', () => {
      const wrapper = mount(SearchBar, {
        props: { modelValue: 'test' },
      })

      expect(wrapper.find('button').attributes('aria-label')).toBe('Clear search')
    })
  })
})
