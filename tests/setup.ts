import { vi } from 'vitest'

// Mock Nuxt auto-imports that might be used in server routes
global.defineEventHandler = vi.fn((handler) => handler)
global.readBody = vi.fn()
global.getRouterParam = vi.fn()
global.createError = vi.fn((error) => {
  const err = new Error(error.message)
  ;(err as any).statusCode = error.statusCode
  return err
})
