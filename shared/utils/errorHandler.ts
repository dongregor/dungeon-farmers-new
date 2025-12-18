/**
 * Shared error handling utilities
 * Auto-imported across client and server
 */

export interface AppError {
  message: string
  statusCode?: number
  cause?: unknown
}

/**
 * Type-safe error handling for catch blocks
 */
export function toError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      cause: error
    }
  }

  if (typeof error === 'string') {
    return { message: error }
  }

  if (error && typeof error === 'object') {
    const obj = error as Record<string, unknown>
    return {
      message: obj.message?.toString() || obj.statusMessage?.toString() || 'Unknown error',
      statusCode: typeof obj.statusCode === 'number' ? obj.statusCode : undefined,
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
