/**
 * Shared error types
 * Auto-imported across client and server
 */

export interface AppError {
  message: string
  statusCode?: number
  cause?: unknown
}

export type ErrorContext = {
  operation: string
  data?: Record<string, unknown>
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public query?: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    super(id ? `${resource} with id ${id} not found` : `${resource} not found`)
    this.name = 'NotFoundError'
  }
}
