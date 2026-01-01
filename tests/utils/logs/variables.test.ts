import { describe, it, expect } from 'vitest'
import { fillTemplateVariables, buildVariableContext } from '~/utils/logs/variables'
import type { Hero, Zone, Subzone } from '~~/types'

const mockZone: Partial<Zone> = { id: 'forest1', name: 'Verdant Woods', type: 'forest' }
const mockSubzone: Partial<Subzone> = { id: 'sub1', name: 'Dense Thicket' }
const mockHeroes: Partial<Hero>[] = [
  { id: '1', name: 'Greg', archetypeTags: ['tank'] },
  { id: '2', name: 'Lyra', archetypeTags: ['scout'] },
]

describe('Variable Filler', () => {
  describe('buildVariableContext', () => {
    it('should include zone variables', () => {
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      expect(ctx.zoneName).toBe('Verdant Woods')
      expect(ctx.subzoneName).toBe('Dense Thicket')
      expect(ctx.zoneType).toBe('forest')
    })

    it('should include hero variables', () => {
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      expect(ctx.leaderHero).toBe('Greg')
      expect(['Greg', 'Lyra']).toContain(ctx.randomHero)
    })

    it('should map role-based heroes', () => {
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      expect(ctx.tankHero).toBe('Greg')
      expect(ctx.scoutHero).toBe('Lyra')
    })

    it('should include atmosphere variables', () => {
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      expect(ctx.timeOfDay).toBeDefined()
      expect(ctx.weather).toBeDefined()
    })

    it('should use extra overrides when provided', () => {
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[],
        { goldAmount: '1000', itemName: 'Epic Sword' }
      )
      expect(ctx.goldAmount).toBe('1000')
      expect(ctx.itemName).toBe('Epic Sword')
    })
  })

  describe('fillTemplateVariables', () => {
    it('should replace all variables', () => {
      const template = '{leaderHero} led the party into {zoneName}.'
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      const result = fillTemplateVariables(template, ctx)
      expect(result).toBe('Greg led the party into Verdant Woods.')
    })

    it('should handle missing variables gracefully', () => {
      const template = '{unknownVar} did something.'
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      const result = fillTemplateVariables(template, ctx)
      expect(result).toBe('{unknownVar} did something.')
    })

    it('should replace multiple occurrences of same variable', () => {
      const template = '{randomHero} saw {randomHero} in the mirror.'
      const ctx = buildVariableContext(
        mockZone as Zone,
        mockSubzone as Subzone,
        mockHeroes as Hero[]
      )
      const result = fillTemplateVariables(template, ctx)
      // Should have hero name twice
      const heroName = ctx.randomHero
      expect(result).toBe(`${heroName} saw ${heroName} in the mirror.`)
    })
  })
})
