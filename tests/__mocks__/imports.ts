// Mock for #imports - Nuxt auto-imports
import { vi } from 'vitest'

export const defineEventHandler = vi.fn((handler: Function) => handler)
export const readBody = vi.fn()
export const getRouterParam = vi.fn()
export const getQuery = vi.fn(() => ({}))
export const createError = vi.fn((error: { statusCode?: number; statusMessage?: string; message?: string; data?: unknown }) => {
  const err = new Error(error.message || error.statusMessage) as Error & { statusCode?: number; statusMessage?: string; data?: unknown }
  err.statusCode = error.statusCode
  err.statusMessage = error.statusMessage
  err.data = error.data
  throw err
})

export const useCookie = vi.fn()
export const useRuntimeConfig = vi.fn(() => ({
  public: {},
  supabaseUrl: '',
  supabaseKey: '',
}))
