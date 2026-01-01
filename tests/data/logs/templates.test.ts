import { describe, it, expect } from 'vitest'
import { GENERIC_TEMPLATES, getTemplatesForType } from '~/data/logs/templates/generic'

describe('Generic Templates', () => {
  it('should have templates for all entry types', () => {
    const types = ['departure', 'travel', 'combat', 'event', 'loot', 'return']
    for (const type of types) {
      const templates = getTemplatesForType(type as any)
      expect(templates.length).toBeGreaterThan(0)
    }
  })

  it('templates should have required fields', () => {
    for (const template of GENERIC_TEMPLATES) {
      expect(template.id).toBeDefined()
      expect(template.type).toBeDefined()
      expect(template.templates.length).toBeGreaterThan(0)
      expect(template.baseRarity).toBeDefined()
    }
  })

  it('templates should contain valid placeholders', () => {
    const validPlaceholders = [
      'zoneName', 'zoneType', 'subzoneName',
      'randomHero', 'anotherHero', 'leaderHero',
      'tankHero', 'healerHero', 'scoutHero', 'casterHero',
      'enemyName', 'enemyCount', 'enemyPack',
      'itemName', 'itemRarity', 'goldAmount',
      'timeOfDay', 'weather'
    ]

    for (const template of GENERIC_TEMPLATES) {
      for (const text of template.templates) {
        const matches = text.match(/{(\w+)}/g) || []
        for (const match of matches) {
          const placeholder = match.slice(1, -1)
          expect(validPlaceholders).toContain(placeholder)
        }
      }
    }
  })
})
