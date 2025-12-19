/**
 * Shared Zod validation schemas for server routes
 * Auto-imported in server context
 */
import { z } from 'zod'

/**
 * Validate UUID format for hero IDs
 */
export const heroIdSchema = z.string().uuid('Invalid hero ID format')

/**
 * Validate UUID format for equipment IDs
 */
export const equipmentIdSchema = z.string().uuid('Invalid equipment ID format')

/**
 * Validate UUID format for player IDs
 */
export const playerIdSchema = z.string().uuid('Invalid player ID format')

/**
 * Validate numeric index from route params
 * Ensures string contains only digits, transforms to number, and validates as non-negative integer
 */
export const indexParamSchema = z.string()
  .regex(/^\d+$/, 'Index must be a valid number')
  .transform(Number)
  .pipe(z.number().int().nonnegative('Index must be non-negative'))

