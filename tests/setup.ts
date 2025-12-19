import { vi } from 'vitest'

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
