import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { ref, computed, watch, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'

// Counter for generating unique IDs in tests
let idCounter = 0

// Mock Nuxt auto-imports that might be used in server routes
global.defineEventHandler = vi.fn((handler) => handler)
global.readBody = vi.fn()
global.getRouterParam = vi.fn()
global.getQuery = vi.fn(() => ({}))
global.createError = vi.fn((error) => {
  const err = new Error(error.message || error.statusMessage)
  ;(err as any).statusCode = error.statusCode
  ;(err as any).statusMessage = error.statusMessage
  ;(err as any).data = error.data
  throw err
})
global.toError = vi.fn((err: unknown) => {
  if (err instanceof Error) return err
  if (typeof err === 'string') return new Error(err)
  return new Error('Unknown error')
})

// Expose Vue composition API as globals (Nuxt auto-imports these)
global.ref = ref
global.computed = computed
global.watch = watch
global.watchEffect = watchEffect
global.onMounted = onMounted
global.onUnmounted = onUnmounted
global.nextTick = nextTick

// Mock useId() for SSR-safe ID generation
global.useId = () => `test-id-${++idCounter}`

// Configure Vue Test Utils global stubs
config.global.stubs = {
  // Stub teleport to prevent DOM issues
  Teleport: true,
  // Stub router-related components
  NuxtLink: {
    template: '<a><slot /></a>',
  },
  // Stub icons
  Icon: {
    template: '<span class="icon-stub"></span>',
  },
}
