import type { LogEntry } from '~~/types/expedition'
import type { AITrigger, AILogRequest } from '~~/types/logs'
import type { Hero, Zone, Subzone } from '~~/types'

export interface AIContext {
  previouslyDefeatedBosses?: string[]
  secretsDiscovered?: string[]
}

export interface ExtendedLogEntry extends LogEntry {
  lootRarity?: string
  isStoryHook?: boolean
  storyHookPhase?: 'start' | 'complete'
  isBossKill?: boolean
  bossId?: string
  isSecretDiscovery?: boolean
  reactionCount?: number
}

/**
 * Determine if an entry should trigger AI enhancement.
 *
 * AI enhancement is reserved for special moments:
 * - Mythic loot drops
 * - Secret discoveries
 * - Story hook triggers
 * - First boss kills
 * - Multiple trait synergies
 *
 * @param entry - The log entry to check
 * @param context - Expedition context for first-time checks
 * @returns The AI trigger type or null if no trigger
 */
export function shouldTriggerAI(entry: ExtendedLogEntry, context: AIContext): AITrigger | null {
  // Mythic loot
  if (entry.lootRarity === 'mythic') {
    return 'legendary_loot'
  }

  // Secret discovery
  if (entry.isSecretDiscovery) {
    return 'secret_discovery'
  }

  // Story hook
  if (entry.isStoryHook) {
    return entry.storyHookPhase === 'complete' ? 'story_hook_payoff' : 'story_hook_start'
  }

  // Boss first kill
  if (entry.isBossKill && entry.bossId) {
    const previouslyDefeated = context.previouslyDefeatedBosses ?? []
    if (!previouslyDefeated.includes(entry.bossId)) {
      return 'boss_first_kill'
    }
  }

  // Trait synergy (2+ reactions on same entry)
  if ((entry.reactionCount ?? 0) >= 2) {
    return 'trait_synergy'
  }

  return null
}

/**
 * Build a request for AI log enhancement.
 *
 * @param trigger - The trigger type
 * @param entry - The log entry to enhance
 * @param zone - Current zone
 * @param subzone - Current subzone
 * @param heroes - Party members
 * @param previousEntries - Previous log entries for context
 * @returns AILogRequest object
 */
export function buildAIRequest(
  trigger: AITrigger,
  entry: ExtendedLogEntry,
  zone: Zone,
  subzone: Subzone,
  heroes: Hero[],
  previousEntries: string[]
): AILogRequest {
  return {
    trigger,
    zone: {
      name: zone.name,
      type: zone.type,
      subzone: subzone.name
    },
    heroes: heroes.map(h => ({
      name: h.name,
      traits: h.storyTraitIds
    })),
    triggerDetails: {
      itemName: entry.lootRarity === 'mythic' ? 'Mythic Item' : undefined,
      bossName: entry.isBossKill ? entry.bossId : undefined,
    },
    previousEntries: previousEntries.slice(-3),
    tone: 'lighthearted_fantasy'
  }
}

/**
 * Fallback templates for when AI fails
 */
const AI_FALLBACK_TEMPLATES: Record<AITrigger, string[]> = {
  legendary_loot: [
    'A legendary treasure was discovered! The party stood in awe.',
    'Something extraordinary gleamed among the loot.',
    'This find would be remembered for generations.',
  ],
  secret_discovery: [
    'A hidden passage revealed itself to the worthy.',
    'The party stumbled upon something meant to stay hidden.',
    'Ancient secrets beckoned from the shadows.',
  ],
  story_hook_start: [
    'A mysterious discovery set events in motion.',
    'Something stirred that would change everything.',
    'The beginning of a greater adventure revealed itself.',
  ],
  story_hook_payoff: [
    'The pieces finally fell into place.',
    'The mystery reached its thrilling conclusion.',
    'Everything led to this moment.',
  ],
  boss_first_kill: [
    'The mighty foe fell before the party\'s combined might!',
    'A legendary victory was claimed this day.',
    'The beast\'s reign of terror ended here.',
  ],
  trait_synergy: [
    'The party\'s unique talents combined perfectly.',
    'Heroes worked together in unexpected harmony.',
    'Their combined quirks became their greatest strength.',
  ],
}

/**
 * Get a fallback template when AI fails.
 *
 * @param trigger - The AI trigger type
 * @returns A random fallback template string
 */
export function getAIFallback(trigger: AITrigger): string {
  const templates = AI_FALLBACK_TEMPLATES[trigger]
  return templates[Math.floor(Math.random() * templates.length)]
}

/**
 * Enhance an entry with AI (with fallback).
 *
 * Currently uses fallback templates. Can be extended to call
 * actual AI service when ready.
 *
 * @param entry - The log entry to enhance
 * @param trigger - The AI trigger type
 * @param request - The AI request object
 * @param timeout - Timeout in milliseconds
 * @returns Enhanced text
 */
export async function enhanceWithAI(
  entry: ExtendedLogEntry,
  trigger: AITrigger,
  request: AILogRequest,
  timeout: number = 3000
): Promise<string> {
  // TODO: Implement actual AI call when ready
  // For now, always use fallback
  return getAIFallback(trigger)
}
