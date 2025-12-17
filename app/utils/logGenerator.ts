import type { Hero, Expedition, ExpeditionLog, LogSection, LogEntry, Zone, Subzone, ZoneType, ExpeditionEvent } from '~~/types'
import { getStoryTraitById } from '~/data/storyTraits'
import { THREATS } from '~~/types/threats'

// ========================================
// TEMPLATE DATA
// ========================================

// Departure templates by zone type
const DEPARTURE_TEMPLATES: Record<ZoneType, string[]> = {
  forest: [
    'The party gathered their supplies and headed into {zoneName}.',
    'With weapons ready, the group ventured beneath the forest canopy.',
    '{leaderName} led the way as the trees closed in around them.',
    'The forest beckoned as the party set forth into {subzoneName}.',
    'Leaves rustled overhead as the expedition began.',
  ],
  cave: [
    'The party lit their torches and descended into {zoneName}.',
    'Darkness enveloped them as they entered {subzoneName}.',
    '{leaderName} led the way into the cavern depths.',
    'The air grew cold and damp as the party ventured underground.',
    'Echoes of dripping water greeted the party as they entered the cave.',
  ],
  mountain: [
    'The party began their climb up {zoneName}.',
    'Wind whipped around them as they ascended toward {subzoneName}.',
    '{leaderName} checked the climbing gear before the ascent.',
    'The mountain loomed above as the expedition set out.',
    'Rocky paths led the party higher into the peaks.',
  ],
  swamp: [
    'The party waded into the murky waters of {zoneName}.',
    'Mist shrouded the path as they entered {subzoneName}.',
    '{leaderName} warned the others to watch their step.',
    'Strange sounds echoed from the wetlands as the party pressed on.',
    'The smell of decay hung heavy as they ventured into the swamp.',
  ],
  desert: [
    'The scorching sun beat down as the party entered {zoneName}.',
    'Sand stretched endlessly before them as they set out for {subzoneName}.',
    '{leaderName} distributed water rations before the trek.',
    'Heat waves shimmered on the horizon as the expedition began.',
    'The party wrapped their faces against the sandstorm.',
  ],
  ruins: [
    'Ancient stonework crumbled as the party entered {zoneName}.',
    'The remnants of a lost civilization lay before them in {subzoneName}.',
    '{leaderName} studied the weathered inscriptions.',
    'Mysterious symbols covered the walls as the party explored.',
    'Time-worn pillars marked the entrance to the ruins.',
  ],
}

// Return templates by efficiency
const RETURN_TEMPLATES = {
  high: [  // 120%+
    'The expedition was a resounding success!',
    'Spirits were high as the party returned triumphant.',
    'The party returned with tales of glory and plenty of loot.',
    '{leaderName} led the victorious party back to the guild hall.',
    'Not a scratch on them - a perfect expedition!',
  ],
  medium: [  // 80-120%
    'Tired but satisfied, the party made their way back.',
    'A solid expedition, all things considered.',
    'The party returned in good spirits.',
    '{leaderName} nodded approvingly at the day\'s work.',
    'Another successful day of adventuring.',
  ],
  low: [  // <80%
    'Battered and bruised, the group limped home.',
    'It could have gone better, but they survived.',
    'The party was grateful to make it back in one piece.',
    '{leaderName} vowed to better prepare next time.',
    'They would need rest before another expedition.',
  ],
}

// Travel reaction templates by zone type
const ZONE_REACTIONS: Record<ZoneType, string[]> = {
  forest: [
    '{heroName} admired the ancient trees.',
    '{heroName} noticed animal tracks along the path.',
    '{heroName} seemed at home among the greenery.',
    '{heroName} pointed out edible plants.',
  ],
  cave: [
    '{heroName} marveled at the rock formations.',
    '{heroName} heard echoes bouncing off the walls.',
    '{heroName} found the darkness unsettling.',
    '{heroName} examined the mineral deposits.',
  ],
  mountain: [
    '{heroName} paused to catch their breath.',
    '{heroName} enjoyed the view from this height.',
    '{heroName} struggled with the thin air.',
    '{heroName} spotted a mountain goat in the distance.',
  ],
  swamp: [
    '{heroName} swatted at the mosquitoes.',
    '{heroName} carefully avoided the deeper waters.',
    '{heroName} wrinkled their nose at the smell.',
    '{heroName} identified poisonous fungi.',
  ],
  desert: [
    '{heroName} shielded their eyes from the sun.',
    '{heroName} rationed their water carefully.',
    '{heroName} spotted an oasis in the distance.',
    '{heroName} felt the heat sapping their strength.',
  ],
  ruins: [
    '{heroName} tried to decipher the ancient writing.',
    '{heroName} wondered who built this place.',
    '{heroName} found the ruins fascinating.',
    '{heroName} searched for valuable artifacts.',
  ],
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value)
  }
  return result
}

function getEfficiencyCategory(efficiency: number): 'high' | 'medium' | 'low' {
  if (efficiency >= 120) return 'high'
  if (efficiency >= 80) return 'medium'
  return 'low'
}

// Find hero countering a specific threat
function findHeroCountering(heroes: Hero[], threatId: string): Hero | undefined {
  const threat = THREATS[threatId]
  if (!threat) return undefined

  // Find hero with matching counter tag
  return heroes.find(hero =>
    hero.archetypeTags.some(tag => threat.counteredBy.includes(tag))
  )
}

// Get hero reactions based on zone type and story traits
function getHeroZoneReactions(heroes: Hero[], zone: Zone, subzone: Subzone): LogEntry[] {
  const entries: LogEntry[] = []
  const maxReactions = 2 + Math.floor(Math.random() * 2) // 2-3 reactions

  for (const hero of heroes) {
    if (entries.length >= maxReactions) break
    if (Math.random() > 0.3) continue // 30% chance per hero

    // Check for zone-type specific story trait reactions
    let reaction: string | null = null

    // First check story traits for zone-specific reactions
    for (const traitId of hero.storyTraitIds) {
      const trait = getStoryTraitById(traitId)
      if (!trait?.reactions?.onZoneType) continue

      const zoneReactions = trait.reactions.onZoneType[zone.type]
      if (zoneReactions && zoneReactions.length > 0) {
        reaction = randomElement(zoneReactions).replace('{hero}', hero.name)
        entries.push({
          text: reaction,
          type: 'reaction',
          heroId: hero.id,
          traitId,
        })
        break
      }
    }

    // If no trait reaction, use generic zone reaction
    if (!reaction) {
      const zoneTemplates = ZONE_REACTIONS[zone.type]
      reaction = fillTemplate(randomElement(zoneTemplates), { heroName: hero.name })
      entries.push({
        text: reaction,
        type: 'narrative',
        heroId: hero.id,
      })
    }
  }

  return entries
}

// ========================================
// MAIN LOG GENERATOR
// ========================================

export function generateExpeditionLog(
  expedition: Expedition,
  heroes: Hero[],
  zone: Zone,
  subzone: Subzone
): ExpeditionLog {
  const sections: LogSection[] = []

  // 1. DEPARTURE
  sections.push(generateDepartureSection(heroes, zone, subzone))

  // 2. TRAVEL (with trait reactions)
  const travelSection = generateTravelSection(expedition, heroes, zone, subzone)
  if (travelSection.entries.length > 0) {
    sections.push(travelSection)
  }

  // 3. ENCOUNTERS (from events)
  for (const event of expedition.events) {
    if (event.type === 'skill_check' || event.type === 'rare' || event.type === 'story_hook') {
      sections.push(generateEncounterSection(event, heroes, subzone))
    }
  }

  // 4. COMBAT (main encounter)
  sections.push(generateCombatSection(expedition, heroes, subzone))

  // 5. DISCOVERY (if found loot/collectibles)
  if (expedition.rewards && (expedition.rewards.equipment.length > 0 || expedition.rewards.familiarityGain > 0)) {
    sections.push(generateDiscoverySection(expedition, heroes, zone))
  }

  // 6. RETURN
  sections.push(generateReturnSection(expedition, heroes))

  return {
    summary: {
      duration: `${expedition.durationMinutes} minutes`,
      efficiency: `${Math.round(expedition.efficiency ?? 100)}%`,
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

// ========================================
// SECTION GENERATORS
// ========================================

function generateDepartureSection(heroes: Hero[], zone: Zone, subzone: Subzone): LogSection {
  const entries: LogEntry[] = []
  const leader = heroes[0]

  // Opening narrative
  const template = randomElement(DEPARTURE_TEMPLATES[zone.type])
  const narrative = fillTemplate(template, {
    zoneName: zone.name,
    subzoneName: subzone.name,
    leaderName: leader.name,
  })

  entries.push({
    text: narrative,
    type: 'narrative'
  })

  // Party composition
  const heroNames = heroes.map(h => h.name).join(', ')
  entries.push({
    text: `Party: ${heroNames}`,
    type: 'narrative'
  })

  // Random party member comment
  if (heroes.length > 1 && Math.random() < 0.5) {
    const commentingHero = heroes[1 + Math.floor(Math.random() * (heroes.length - 1))]
    const comments = [
      `${commentingHero.name} checked their equipment one last time.`,
      `${commentingHero.name} seemed eager to get started.`,
      `${commentingHero.name} shared a few words of encouragement.`,
      `${commentingHero.name} stayed alert as they set out.`,
    ]
    entries.push({
      text: randomElement(comments),
      type: 'narrative',
      heroId: commentingHero.id,
    })
  }

  return {
    type: 'departure',
    title: 'Departure',
    entries
  }
}

function generateTravelSection(expedition: Expedition, heroes: Hero[], zone: Zone, subzone: Subzone): LogSection {
  const entries: LogEntry[] = []

  // Add zone-based reactions
  const zoneReactions = getHeroZoneReactions(heroes, zone, subzone)
  entries.push(...zoneReactions)

  // Process flavor and choice events during travel
  for (const event of expedition.events) {
    if (event.type === 'flavor') {
      entries.push({
        text: event.data.text ?? 'Something interesting happened.',
        type: 'narrative',
        eventId: event.id
      })

      // Add any trait reactions to this event
      if (event.data.reactions) {
        for (const reaction of event.data.reactions) {
          entries.push({
            text: reaction.text,
            type: 'reaction',
            heroId: reaction.heroId,
            traitId: reaction.traitId,
            eventId: event.id,
          })
        }
      }
    } else if (event.type === 'choice') {
      entries.push({
        text: event.data.prompt ?? 'The party faced a decision.',
        type: 'narrative',
        eventId: event.id
      })

      // If choice was made, show result
      if (event.data.selectedOption !== undefined) {
        const option = event.data.options?.find(o => o.id === event.data.selectedOption)
        if (option) {
          entries.push({
            text: `They decided to: ${option.text}`,
            type: 'choice_result',
            eventId: event.id
          })
          entries.push({
            text: option.outcome,
            type: 'choice_result',
            eventId: event.id
          })
        }
      }
    }
  }

  return {
    type: 'travel',
    title: 'Journey',
    entries
  }
}

function generateEncounterSection(event: ExpeditionEvent, heroes: Hero[], subzone: Subzone): LogSection {
  const entries: LogEntry[] = []

  if (event.type === 'skill_check') {
    const hero = heroes.find(h => h.id === event.data.heroId)
    const heroName = hero?.name ?? 'A hero'

    // Describe the challenge
    if (event.data.requiredTag) {
      entries.push({
        text: `The party encountered a challenge requiring special skills.`,
        type: 'narrative',
        eventId: event.id
      })
    } else if (event.data.requiredTrait) {
      entries.push({
        text: `A situation arose that tested the party's unique abilities.`,
        type: 'narrative',
        eventId: event.id
      })
    } else {
      const statName = event.data.stat === 'combat' ? 'combat prowess' :
                       event.data.stat === 'utility' ? 'clever thinking' : 'survival instincts'
      entries.push({
        text: `The party faced a challenge requiring ${statName}.`,
        type: 'narrative',
        eventId: event.id
      })
    }

    // Result
    if (event.data.passed) {
      entries.push({
        text: `${heroName} successfully handled the situation!`,
        type: 'combat',
        heroId: event.data.heroId,
        eventId: event.id
      })

      if (event.data.reward) {
        entries.push({
          text: `The party gained ${event.data.reward.gold} gold and ${event.data.reward.xp} experience.`,
          type: 'loot',
          eventId: event.id
        })
      }
    } else {
      entries.push({
        text: `${heroName} struggled with the challenge.`,
        type: 'combat',
        heroId: event.data.heroId,
        eventId: event.id
      })

      if (event.data.injury) {
        entries.push({
          text: `${heroName} sustained a ${event.data.injury.type} injury!`,
          type: 'combat',
          heroId: event.data.heroId,
          eventId: event.id
        })
      }
    }

    // Add trait reactions
    if (event.data.reactions) {
      for (const reaction of event.data.reactions) {
        entries.push({
          text: reaction.text,
          type: 'reaction',
          heroId: reaction.heroId,
          traitId: reaction.traitId,
          eventId: event.id,
        })
      }
    }
  } else if (event.type === 'rare') {
    entries.push({
      text: event.data.text ?? 'Something remarkable happened!',
      type: 'narrative',
      eventId: event.id
    })

    if (event.data.heroId) {
      const hero = heroes.find(h => h.id === event.data.heroId)
      if (hero) {
        entries.push({
          text: `${hero.name} was at the center of this moment.`,
          type: 'narrative',
          heroId: event.data.heroId,
          eventId: event.id
        })
      }
    }

    if (event.data.reward) {
      entries.push({
        text: `Fortune favors the bold! The party gained ${event.data.reward.gold} gold and ${event.data.reward.xp} experience.`,
        type: 'loot',
        eventId: event.id
      })
    }
  } else if (event.type === 'story_hook') {
    const hero = heroes.find(h => h.id === event.data.heroId)
    entries.push({
      text: event.data.text ?? 'A mysterious discovery was made.',
      type: 'narrative',
      heroId: event.data.heroId,
      eventId: event.id
    })

    if (hero && event.data.hookProgress) {
      const progress = event.data.hookProgress
      if (progress.type === 'collection') {
        entries.push({
          text: `${hero.name} found ${progress.current} of ${progress.required} ${progress.itemName}.`,
          type: 'narrative',
          heroId: event.data.heroId,
          eventId: event.id
        })
      } else if (progress.type === 'delayed') {
        entries.push({
          text: `The mystery will unfold over the next ${progress.expeditionsRemaining} expeditions...`,
          type: 'narrative',
          eventId: event.id
        })
      }
    }
  }

  return {
    type: 'encounter',
    title: event.type === 'skill_check' ? 'Challenge' :
           event.type === 'rare' ? 'Remarkable Event' : 'Discovery',
    entries
  }
}

function generateCombatSection(expedition: Expedition, heroes: Hero[], subzone: Subzone): LogSection {
  const entries: LogEntry[] = []

  // Combat encounter
  entries.push({
    text: `The party engages enemies in ${subzone.name}!`,
    type: 'combat'
  })

  // Threat countering
  const threatsCountered: string[] = []
  const threatsNotCountered: string[] = []

  for (const threatId of subzone.threats) {
    const counteringHero = findHeroCountering(heroes, threatId)
    const threat = THREATS[threatId]
    if (!threat) continue

    if (counteringHero) {
      threatsCountered.push(threatId)
      entries.push({
        text: `${counteringHero.name} expertly counters the ${threat.name} threat!`,
        type: 'combat',
        heroId: counteringHero.id
      })
    } else {
      threatsNotCountered.push(threatId)
      entries.push({
        text: `The party struggles against ${threat.name}.`,
        type: 'combat'
      })
    }
  }

  // Combat result based on efficiency
  const efficiency = expedition.efficiency ?? 100
  const efficiencyCategory = getEfficiencyCategory(efficiency)

  let resultText: string
  if (efficiencyCategory === 'high') {
    resultText = 'The party dominates the encounter!'
  } else if (efficiencyCategory === 'medium') {
    resultText = 'Victory! The enemies are defeated.'
  } else {
    resultText = 'A hard-fought battle ends in victory, but at a cost.'
  }

  entries.push({
    text: resultText,
    type: 'combat'
  })

  // Random hero moment in combat
  if (Math.random() < 0.4 && heroes.length > 0) {
    const hero = heroes[Math.floor(Math.random() * heroes.length)]
    const moments = [
      `${hero.name} struck a decisive blow!`,
      `${hero.name}'s quick thinking turned the tide!`,
      `${hero.name} protected the party from harm!`,
      `${hero.name} found an opening in the enemy's defense!`,
    ]
    entries.push({
      text: randomElement(moments),
      type: 'combat',
      heroId: hero.id
    })
  }

  return {
    type: 'encounter',
    title: 'Combat',
    entries
  }
}

function generateDiscoverySection(expedition: Expedition, heroes: Hero[], zone: Zone): LogSection {
  const entries: LogEntry[] = []

  // Loot discovery
  if (expedition.rewards && expedition.rewards.equipment.length > 0) {
    entries.push({
      text: `The party discovers loot among the defeated enemies!`,
      type: 'loot'
    })

    // Random hero finds loot
    const finder = heroes[Math.floor(Math.random() * heroes.length)]
    const itemCount = expedition.rewards.equipment.length
    const plural = itemCount === 1 ? 'item' : 'items'
    entries.push({
      text: `${finder.name} finds ${itemCount} ${plural}.`,
      type: 'loot',
      heroId: finder.id
    })

    // Highlight rare items
    const rareItems = expedition.rewards.equipment.slice(0, 2) // Show top 2
    if (rareItems.length > 0) {
      entries.push({
        text: `Notable finds include rare equipment!`,
        type: 'loot'
      })
    }
  }

  // Zone progress
  if (expedition.rewards && expedition.rewards.familiarityGain > 0) {
    entries.push({
      text: `The party grows more familiar with ${zone.name} (+${expedition.rewards.familiarityGain}% familiarity).`,
      type: 'narrative'
    })
  }

  // Subzone mastery
  if (expedition.rewards && expedition.rewards.masteryGain > 0) {
    entries.push({
      text: `Their mastery of the area deepens (+${expedition.rewards.masteryGain}% mastery).`,
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
  const leader = heroes[0]

  const efficiency = expedition.efficiency ?? 100
  const category = getEfficiencyCategory(efficiency)

  // Main return message
  const template = randomElement(RETURN_TEMPLATES[category])
  const returnMessage = fillTemplate(template, { leaderName: leader.name })
  entries.push({
    text: returnMessage,
    type: 'narrative'
  })

  // XP and gold gains
  if (expedition.rewards) {
    const totalGold = expedition.rewards.gold
    const totalXp = expedition.rewards.xp

    entries.push({
      text: `All heroes gain ${totalXp} XP and the party collects ${totalGold} gold.`,
      type: 'narrative'
    })

    // Individual hero reactions to rewards
    if (Math.random() < 0.3 && heroes.length > 1) {
      const reactingHero = heroes[1 + Math.floor(Math.random() * (heroes.length - 1))]
      const reactions = [
        `${reactingHero.name} is pleased with the haul.`,
        `${reactingHero.name} already planning the next expedition.`,
        `${reactingHero.name} counts their share of the gold.`,
        `${reactingHero.name} seems eager for more adventure.`,
      ]
      entries.push({
        text: randomElement(reactions),
        type: 'reaction',
        heroId: reactingHero.id
      })
    }
  }

  return {
    type: 'return',
    title: 'Return',
    entries
  }
}
