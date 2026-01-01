import { describe, it, expect } from 'vitest'
import { shouldTriggerAI, getAIFallback } from '~/utils/logs/ai'
import type { ExtendedLogEntry } from '~/utils/logs/ai'

describe('AI Trigger Detection', () => {
  it('should trigger for mythic loot', () => {
    const entry: Partial<ExtendedLogEntry> = {
      type: 'loot',
      text: 'Found loot',
      lootRarity: 'mythic'
    }
    const trigger = shouldTriggerAI(entry as ExtendedLogEntry, {})
    expect(trigger).toBe('legendary_loot')
  })

  it('should trigger for story hook start', () => {
    const entry: Partial<ExtendedLogEntry> = {
      type: 'narrative',
      text: 'Something happened',
      isStoryHook: true,
      storyHookPhase: 'start'
    }
    const trigger = shouldTriggerAI(entry as ExtendedLogEntry, {})
    expect(trigger).toBe('story_hook_start')
  })

  it('should trigger for story hook complete', () => {
    const entry: Partial<ExtendedLogEntry> = {
      type: 'narrative',
      text: 'The mystery concludes',
      isStoryHook: true,
      storyHookPhase: 'complete'
    }
    const trigger = shouldTriggerAI(entry as ExtendedLogEntry, {})
    expect(trigger).toBe('story_hook_payoff')
  })

  it('should trigger for secret discovery', () => {
    const entry: Partial<ExtendedLogEntry> = {
      type: 'narrative',
      text: 'Found a secret',
      isSecretDiscovery: true
    }
    const trigger = shouldTriggerAI(entry as ExtendedLogEntry, {})
    expect(trigger).toBe('secret_discovery')
  })

  it('should trigger for boss first kill', () => {
    const entry: Partial<ExtendedLogEntry> = {
      type: 'combat',
      text: 'Boss defeated',
      isBossKill: true,
      bossId: 'dragon1'
    }
    const trigger = shouldTriggerAI(entry as ExtendedLogEntry, { previouslyDefeatedBosses: [] })
    expect(trigger).toBe('boss_first_kill')
  })

  it('should not trigger for previously defeated boss', () => {
    const entry: Partial<ExtendedLogEntry> = {
      type: 'combat',
      text: 'Boss defeated again',
      isBossKill: true,
      bossId: 'dragon1'
    }
    const trigger = shouldTriggerAI(entry as ExtendedLogEntry, { previouslyDefeatedBosses: ['dragon1'] })
    expect(trigger).toBeNull()
  })

  it('should trigger for trait synergy', () => {
    const entry: Partial<ExtendedLogEntry> = {
      type: 'narrative',
      text: 'Multiple reactions',
      reactionCount: 2
    }
    const trigger = shouldTriggerAI(entry as ExtendedLogEntry, {})
    expect(trigger).toBe('trait_synergy')
  })

  it('should return null for standard entries', () => {
    const entry: Partial<ExtendedLogEntry> = {
      type: 'narrative',
      text: 'Normal event'
    }
    const trigger = shouldTriggerAI(entry as ExtendedLogEntry, {})
    expect(trigger).toBeNull()
  })
})

describe('AI Fallback', () => {
  it('should return fallback for legendary_loot', () => {
    const fallback = getAIFallback('legendary_loot')
    expect(fallback).toBeDefined()
    expect(fallback.length).toBeGreaterThan(0)
  })

  it('should return fallback for all trigger types', () => {
    const triggers = [
      'legendary_loot',
      'secret_discovery',
      'story_hook_start',
      'story_hook_payoff',
      'boss_first_kill',
      'trait_synergy'
    ] as const

    for (const trigger of triggers) {
      const fallback = getAIFallback(trigger)
      expect(fallback).toBeDefined()
      expect(fallback.length).toBeGreaterThan(0)
    }
  })
})
