import { describe, it, expect } from 'vitest'
import type {
  LogEntryType,
  TraitReaction,
  TraitPairReaction,
  TemplateVariables,
  LogTemplate,
  HeroReaction,
  AITrigger,
  AILogRequest,
  AILogResponse
} from '~~/types/logs'

describe('Trait Reaction Types', () => {
  it('TraitReaction should have required fields', () => {
    const reaction: TraitReaction = {
      traitId: 'lootGoblin',
      triggers: { entryTypes: ['loot'] },
      reactions: ['Test reaction'],
      triggerChance: 0.7,
      rarityBoost: 1
    }
    expect(reaction.traitId).toBe('lootGoblin')
    expect(reaction.triggerChance).toBe(0.7)
  })

  it('TraitPairReaction should require two trait IDs', () => {
    const pairReaction: TraitPairReaction = {
      traitIds: ['coward', 'overconfident'],
      triggers: { entryTypes: ['combat'] },
      reactions: ['Test pair reaction'],
      triggerChance: 0.5,
      rarityBoost: 2
    }
    expect(pairReaction.traitIds).toHaveLength(2)
  })

  it('TraitReaction should support optional trigger conditions', () => {
    const reaction: TraitReaction = {
      traitId: 'pyromaniac',
      triggers: {
        entryTypes: ['combat', 'event'],
        zoneTypes: ['desert', 'ruins'],
        lootRarity: ['epic', 'legendary'],
        outcome: 'success'
      },
      reactions: ['Fire reaction'],
      triggerChance: 0.8,
      rarityBoost: 2
    }
    expect(reaction.triggers.zoneTypes).toContain('desert')
    expect(reaction.triggers.lootRarity).toContain('epic')
    expect(reaction.triggers.outcome).toBe('success')
  })

  it('TraitPairReaction should support eventIds trigger', () => {
    const pairReaction: TraitPairReaction = {
      traitIds: ['heroic', 'coward'],
      triggers: {
        entryTypes: ['combat'],
        eventIds: ['boss_fight', 'ambush']
      },
      reactions: ['Conflicting personality reaction'],
      triggerChance: 0.6,
      rarityBoost: 2
    }
    expect(pairReaction.triggers.eventIds).toContain('boss_fight')
  })
})

describe('LogEntryType', () => {
  it('should include all entry types', () => {
    const types: LogEntryType[] = ['departure', 'travel', 'combat', 'event', 'loot', 'return']
    expect(types).toHaveLength(6)
  })
})

describe('TemplateVariables', () => {
  it('should have zone context fields', () => {
    const vars: TemplateVariables = {
      zoneName: 'Dark Forest',
      zoneType: 'forest',
      subzoneName: 'Twisted Grove',
      randomHero: 'Bork',
      anotherHero: 'Grimm',
      leaderHero: 'Elara',
      tankHero: 'Bork',
      healerHero: 'Luna',
      scoutHero: 'Swift',
      casterHero: 'Arcana',
      enemyName: 'Goblin',
      enemyCount: '5',
      enemyPack: 'goblin warband',
      itemName: 'Rusty Sword',
      itemRarity: 'common',
      goldAmount: '150',
      timeOfDay: 'dusk',
      weather: 'foggy'
    }
    expect(vars.zoneName).toBe('Dark Forest')
    expect(vars.tankHero).toBe('Bork')
    expect(vars.weather).toBe('foggy')
  })
})

describe('LogTemplate', () => {
  it('should have required fields', () => {
    const template: LogTemplate = {
      id: 'forest_travel_1',
      type: 'travel',
      templates: ['The party ventured deeper into {zoneName}.'],
      baseRarity: 'common'
    }
    expect(template.id).toBe('forest_travel_1')
    expect(template.type).toBe('travel')
    expect(template.baseRarity).toBe('common')
  })

  it('should support optional conditions', () => {
    const template: LogTemplate = {
      id: 'ruins_discovery',
      type: 'event',
      conditions: {
        zoneTypes: ['ruins'],
        minMastery: 50,
        requiresTags: ['exploration'],
        eventOutcome: 'success'
      },
      templates: ['Ancient writings revealed secrets.'],
      baseRarity: 'memorable',
      weight: 2
    }
    expect(template.conditions?.zoneTypes).toContain('ruins')
    expect(template.conditions?.minMastery).toBe(50)
    expect(template.weight).toBe(2)
  })

  it('should support subzoneIds condition', () => {
    const template: LogTemplate = {
      id: 'specific_subzone',
      type: 'event',
      conditions: {
        subzoneIds: ['hidden_grove', 'sacred_pool']
      },
      templates: ['A special moment in this sacred place.'],
      baseRarity: 'noteworthy'
    }
    expect(template.conditions?.subzoneIds).toContain('hidden_grove')
  })
})

describe('HeroReaction', () => {
  it('should have all required fields', () => {
    const reaction: HeroReaction = {
      heroId: 'hero_123',
      heroName: 'Bork the Bold',
      traitId: 'overconfident',
      text: '"I could do this blindfolded!"',
      rarityBoost: 1
    }
    expect(reaction.heroId).toBe('hero_123')
    expect(reaction.heroName).toBe('Bork the Bold')
    expect(reaction.traitId).toBe('overconfident')
    expect(reaction.rarityBoost).toBe(1)
  })
})

describe('AITrigger', () => {
  it('should include all trigger types', () => {
    const triggers: AITrigger[] = [
      'legendary_loot',
      'secret_discovery',
      'story_hook_start',
      'story_hook_payoff',
      'boss_first_kill',
      'trait_synergy'
    ]
    expect(triggers).toHaveLength(6)
  })
})

describe('AILogRequest', () => {
  it('should have all required fields', () => {
    const request: AILogRequest = {
      trigger: 'legendary_loot',
      zone: {
        name: 'Dark Forest',
        type: 'forest',
        subzone: 'Twisted Grove'
      },
      heroes: [
        { name: 'Bork', traits: ['brawny', 'overconfident'] },
        { name: 'Luna', traits: ['healer', 'cautious'] }
      ],
      triggerDetails: {
        itemName: 'Blade of Destiny'
      },
      previousEntries: ['The party entered the grove.'],
      tone: 'lighthearted_fantasy'
    }
    expect(request.trigger).toBe('legendary_loot')
    expect(request.heroes).toHaveLength(2)
    expect(request.tone).toBe('lighthearted_fantasy')
  })

  it('should support all triggerDetails fields', () => {
    const request: AILogRequest = {
      trigger: 'boss_first_kill',
      zone: { name: 'Cave', type: 'cave', subzone: 'Deep Hollow' },
      heroes: [{ name: 'Hero', traits: [] }],
      triggerDetails: {
        bossName: 'Dragon King',
        discoveryName: 'Ancient Shrine',
        hookName: 'The Prophecy',
        synergyTraits: ['pyromaniac', 'dragonSlayer']
      },
      previousEntries: [],
      tone: 'lighthearted_fantasy'
    }
    expect(request.triggerDetails.bossName).toBe('Dragon King')
    expect(request.triggerDetails.synergyTraits).toContain('pyromaniac')
  })
})

describe('AILogResponse', () => {
  it('should have required text field', () => {
    const response: AILogResponse = {
      text: 'The legendary blade gleamed in the dim light.'
    }
    expect(response.text).toBeDefined()
  })

  it('should support optional heroReactions', () => {
    const response: AILogResponse = {
      text: 'The dragon fell before them.',
      heroReactions: [
        { heroName: 'Bork', text: '"Is that all?"' },
        { heroName: 'Luna', text: 'She quietly tended to the wounded.' }
      ]
    }
    expect(response.heroReactions).toHaveLength(2)
    expect(response.heroReactions?.[0].heroName).toBe('Bork')
  })
})
