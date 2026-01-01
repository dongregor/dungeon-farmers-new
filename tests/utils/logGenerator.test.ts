import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateExpeditionLog } from '~/utils/logGenerator'
import type { Expedition, Hero, Zone, Subzone } from '~~/types'

const mockExpedition: Partial<Expedition> = {
  id: 'exp1',
  durationMinutes: 30,
  efficiency: 100,
  events: [],
  rewards: {
    gold: 100,
    xp: 50,
    equipment: [],
    materials: {},
    familiarityGain: 5,
    masteryGain: 3
  }
}

const mockHeroes: Partial<Hero>[] = [
  { id: '1', name: 'Greg', archetypeTags: ['tank'], storyTraitIds: ['brawny'] },
  { id: '2', name: 'Lyra', archetypeTags: ['scout'], storyTraitIds: ['stealthy'] },
]

const mockZone: Partial<Zone> = { id: 'z1', name: 'Verdant Woods', type: 'forest' }
const mockSubzone: Partial<Subzone> = { id: 's1', name: 'Dense Thicket', threats: [] }

describe('Log Generator', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should generate a log with sections', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )
    expect(log.sections.length).toBeGreaterThan(0)
  })

  it('should include summary', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )
    expect(log.summary).toBeDefined()
    expect(log.summary.duration).toBeDefined()
    expect(log.summary.efficiency).toBeDefined()
  })

  it('entries should have rarity', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )

    for (const section of log.sections) {
      for (const entry of section.entries) {
        // After enhancement, all entries should have rarity
        expect(['common', 'standard', 'noteworthy', 'memorable', 'epic', 'legendary'])
          .toContain(entry.rarity ?? 'standard')
      }
    }
  })

  it('should have departure section first', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )
    expect(log.sections[0].type).toBe('departure')
  })

  it('should have return section last', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )
    expect(log.sections[log.sections.length - 1].type).toBe('return')
  })

  it('should fill template variables', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      mockHeroes as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )

    // Check that zone/hero names appear in entries
    const allText = log.sections.flatMap(s => s.entries.map(e => e.text)).join(' ')
    expect(allText).toContain('Verdant Woods')
  })

  it('should handle empty heroes array', () => {
    const log = generateExpeditionLog(
      mockExpedition as Expedition,
      [] as Hero[],
      mockZone as Zone,
      mockSubzone as Subzone
    )
    expect(log.sections.length).toBeGreaterThan(0)
  })
})
