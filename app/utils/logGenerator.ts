import type { Hero, Expedition, ExpeditionLog, LogSection, LogEntry, Zone, Subzone } from '~~/types'

/**
 * Generates a narrative expedition log from expedition results
 */
export function generateExpeditionLog(
  expedition: Expedition,
  heroes: Hero[],
  zone: Zone,
  subzone: Subzone
): ExpeditionLog {
  const sections: LogSection[] = []

  // 1. DEPARTURE
  sections.push(generateDepartureSection(heroes, zone, subzone))

  // 2. TRAVEL (if expedition had events)
  if (expedition.events && expedition.events.length > 0) {
    sections.push(generateTravelSection(expedition, heroes))
  }

  // 3. ENCOUNTER (combat/challenges)
  sections.push(generateEncounterSection(expedition, heroes, subzone))

  // 4. DISCOVERY (if found loot/collectibles)
  if (expedition.rewards && (expedition.rewards.equipment.length > 0 || expedition.rewards.familiarityGain > 0)) {
    sections.push(generateDiscoverySection(expedition, heroes))
  }

  // 5. RETURN
  sections.push(generateReturnSection(expedition, heroes))

  return {
    summary: {
      duration: `${expedition.durationMinutes} minutes`,
      efficiency: `${expedition.efficiency ?? 100}%`,
      rewards: {
        gold: expedition.rewards?.gold ?? 0,
        xp: expedition.rewards?.xp ?? 0,
        itemCount: expedition.rewards?.equipment.length ?? 0,
        rareItems: expedition.rewards?.equipment.slice(0, 3) ?? [],
        familiarityGain: expedition.rewards?.familiarityGain ?? 0,
        masteryGain: expedition.rewards?.masteryGain ?? 0
      }
    },
    sections
  }
}

function generateDepartureSection(heroes: Hero[], zone: Zone, subzone: Subzone): LogSection {
  const entries: LogEntry[] = []

  // Opening narrative
  entries.push({
    text: `The party departs for ${subzone.name} in the ${zone.name}.`,
    type: 'narrative'
  })

  // Party composition
  const heroNames = heroes.map(h => h.name).join(', ')
  entries.push({
    text: `Party: ${heroNames}`,
    type: 'narrative'
  })

  // Random flavor based on zone type
  const flavorTexts = getZoneFlavorText(zone.type)
  const randomFlavor = flavorTexts[Math.floor(Math.random() * flavorTexts.length)]
  entries.push({
    text: randomFlavor,
    type: 'narrative'
  })

  return {
    type: 'departure',
    title: 'Departure',
    entries
  }
}

function generateTravelSection(expedition: Expedition, heroes: Hero[]): LogSection {
  const entries: LogEntry[] = []

  // Process expedition events
  for (const event of expedition.events) {
    if (event.type === 'flavor') {
      entries.push({
        text: event.data.text ?? 'The party encounters something interesting.',
        type: 'narrative',
        eventId: event.id
      })
    } else if (event.type === 'skill_check') {
      const hero = heroes.find(h => h.id === event.data.heroId)
      const passed = event.data.passed ? 'succeeds' : 'fails'
      entries.push({
        text: `${hero?.name ?? 'A hero'} ${passed} a ${event.data.stat} check.`,
        type: 'reaction',
        heroId: event.data.heroId,
        eventId: event.id
      })
    }
  }

  return {
    type: 'travel',
    title: 'Journey',
    entries
  }
}

function generateEncounterSection(expedition: Expedition, heroes: Hero[], subzone: Subzone): LogSection {
  const entries: LogEntry[] = []

  // Combat encounter
  entries.push({
    text: `The party engages enemies in combat!`,
    type: 'combat'
  })

  // Add threat reactions
  for (const threat of subzone.threats) {
    const counteringHero = findHeroCountering(heroes, threat)
    if (counteringHero) {
      entries.push({
        text: `${counteringHero.name} counters the ${threat} threat.`,
        type: 'combat',
        heroId: counteringHero.id
      })
    }
  }

  // Combat result
  const efficiency = expedition.efficiency ?? 100
  if (efficiency >= 120) {
    entries.push({
      text: `The party dominates the encounter!`,
      type: 'combat'
    })
  } else if (efficiency >= 100) {
    entries.push({
      text: `Victory! The enemies are defeated.`,
      type: 'combat'
    })
  } else if (efficiency >= 80) {
    entries.push({
      text: `A hard-fought battle ends in victory.`,
      type: 'combat'
    })
  } else {
    entries.push({
      text: `The party barely survives the encounter.`,
      type: 'combat'
    })
  }

  return {
    type: 'encounter',
    title: 'Combat',
    entries
  }
}

function generateDiscoverySection(expedition: Expedition, heroes: Hero[]): LogSection {
  const entries: LogEntry[] = []

  // Loot discovery
  if (expedition.rewards && expedition.rewards.equipment.length > 0) {
    entries.push({
      text: `The party discovers loot!`,
      type: 'loot'
    })

    // Random hero finds loot
    const finder = heroes[Math.floor(Math.random() * heroes.length)]
    entries.push({
      text: `${finder.name} finds ${expedition.rewards.equipment.length} item(s).`,
      type: 'loot',
      heroId: finder.id
    })
  }

  // Zone progress
  if (expedition.rewards && expedition.rewards.familiarityGain > 0) {
    entries.push({
      text: `The party grows more familiar with the area (+${expedition.rewards.familiarityGain}% familiarity).`,
      type: 'narrative'
    })
  }

  return {
    type: 'discovery',
    title: 'Discovery',
    entries
  }
}

function generateReturnSection(expedition: Expedition, heroes: Hero[]): LogSection {
  const entries: LogEntry[] = []

  entries.push({
    text: `The party returns safely to the guild hall.`,
    type: 'narrative'
  })

  // XP gains
  if (expedition.rewards) {
    entries.push({
      text: `All heroes gain ${expedition.rewards.xp} XP and ${expedition.rewards.gold} gold.`,
      type: 'narrative'
    })
  }

  return {
    type: 'return',
    title: 'Return',
    entries
  }
}

// Helper functions
function getZoneFlavorText(zoneType: string): string[] {
  const flavorTexts: Record<string, string[]> = {
    forest: [
      'The trees loom overhead, their branches creating a canopy of shadows.',
      'Birds chirp in the distance as the party pushes deeper into the woods.',
      'Sunlight filters through the leaves, creating dappled patterns on the forest floor.'
    ],
    cave: [
      'The darkness of the cave engulfs the party as they venture inside.',
      'Echoes bounce off the stone walls, making every sound seem amplified.',
      'The air grows cold and damp as the party descends deeper.'
    ],
    swamp: [
      'Thick fog obscures the path ahead through the murky wetlands.',
      'Strange sounds echo from the murky waters.',
      'The smell of decay hangs heavy in the humid air.'
    ],
    mountain: [
      'The wind howls across the rocky peaks.',
      'The air grows thin as the party climbs higher.',
      'Snow begins to fall as the elevation increases.'
    ],
    desert: [
      'The scorching sun beats down mercilessly.',
      'Heat waves shimmer on the horizon.',
      'Sand stretches endlessly in all directions.'
    ],
    ruins: [
      'Ancient stonework crumbles at the slightest touch.',
      'The remnants of a lost civilization lie scattered about.',
      'Mysterious symbols cover the weathered walls.'
    ]
  }

  return flavorTexts[zoneType] ?? ['The party ventures into the unknown.']
}

function findHeroCountering(heroes: Hero[], threat: string): Hero | undefined {
  // This would check hero tags against threat
  // Simplified for now
  return heroes[Math.floor(Math.random() * heroes.length)]
}
