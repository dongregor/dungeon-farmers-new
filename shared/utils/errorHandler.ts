/**
 * Shared error handling utilities
 * Auto-imported across client and server
 */

import type { AppError } from '~~/shared/types/errors'

/**
 * Type-safe error handling for catch blocks
 */
export function toError(error: unknown): AppError {
  if (typeof error === 'string') {
    return { message: error }
  }

  if (error && typeof error === 'object') {
    const obj = error as Record<string, unknown>

    // FetchError from $fetch: check if message is NOT the formatted "[METHOD] /api/..." string
    // If it's not formatted, use it directly (H3 puts our error message here)
    if (typeof obj.message === 'string' && !obj.message.match(/^\[(GET|POST|PUT|PATCH|DELETE)\]/)) {
      return {
        message: obj.message,
        statusCode: typeof obj.statusCode === 'number' ? obj.statusCode : undefined,
        cause: error
      }
    }

    // Check nested data.message (alternative location for some error formats)
    const data = obj.data as Record<string, unknown> | undefined
    if (data?.message && typeof data.message === 'string') {
      return {
        message: data.message,
        statusCode: typeof obj.statusCode === 'number' ? obj.statusCode : undefined,
        cause: error
      }
    }

    // Fallback to statusMessage or generic message
    return {
      message: obj.statusMessage?.toString() || 'Unknown error',
      statusCode: typeof obj.statusCode === 'number' ? obj.statusCode : undefined,
      cause: error
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      cause: error
    }
  }

  return {
    message: 'Unknown error occurred',
    cause: error
  }
}

/**
 * Check if error has a specific status code
 */
export function hasStatusCode(error: unknown, code: number): boolean {
  const appError = toError(error)
  return appError.statusCode === code
}

/**
 * Get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  return toError(error).message
}
