import type { Hero, Zone, Subzone } from '~~/types'
import type { TemplateVariables } from '~~/types/logs'

const TIME_OF_DAY = ['dawn', 'morning', 'midday', 'afternoon', 'dusk', 'night']
const WEATHER = ['clear skies', 'light clouds', 'overcast', 'light rain', 'mist', 'strong wind']

/**
 * Build a complete variable context for template filling.
 *
 * Provides all template variables needed for log generation:
 * - Zone context (name, type, subzone)
 * - Hero references (random, role-based)
 * - Combat variables (enemy info)
 * - Loot variables (items, gold)
 * - Atmosphere (time, weather)
 *
 * @param zone - The zone where expedition takes place
 * @param subzone - The specific subzone
 * @param heroes - Party members
 * @param extra - Optional overrides for specific variables
 * @returns Complete TemplateVariables object
 */
export function buildVariableContext(
  zone: Zone,
  subzone: Subzone,
  heroes: Hero[],
  extra?: Partial<TemplateVariables>
): TemplateVariables {
  // Random hero selection
  const randomIndex = Math.floor(Math.random() * heroes.length)
  const anotherIndex = (randomIndex + 1) % heroes.length
  const randomHero = heroes[randomIndex]?.name ?? 'A hero'
  const anotherHero = heroes[anotherIndex]?.name ?? 'Another hero'
  const leaderHero = heroes[0]?.name ?? 'The leader'

  // Role-based hero selection
  const findHeroWithTag = (tag: string): string => {
    const hero = heroes.find(h => h.archetypeTags.includes(tag as any))
    return hero?.name ?? randomHero
  }

  return {
    // Zone context
    zoneName: zone.name,
    zoneType: zone.type,
    subzoneName: subzone.name,

    // Heroes - random
    randomHero,
    anotherHero,
    leaderHero,

    // Heroes - role-based
    tankHero: findHeroWithTag('tank'),
    healerHero: findHeroWithTag('healer'),
    scoutHero: findHeroWithTag('scout'),
    casterHero: findHeroWithTag('caster'),

    // Combat (filled later if needed)
    enemyName: extra?.enemyName ?? 'enemy',
    enemyCount: extra?.enemyCount ?? '3',
    enemyPack: extra?.enemyPack ?? 'a group of enemies',

    // Loot (filled later if needed)
    itemName: extra?.itemName ?? 'item',
    itemRarity: extra?.itemRarity ?? 'common',
    goldAmount: extra?.goldAmount ?? '50',

    // Atmosphere
    timeOfDay: TIME_OF_DAY[Math.floor(Math.random() * TIME_OF_DAY.length)],
    weather: WEATHER[Math.floor(Math.random() * WEATHER.length)],

    // Spread any extra overrides
    ...extra
  }
}

/**
 * Fill a template string with variables.
 *
 * Replaces all {variableName} placeholders with their values.
 * Unknown variables are left unchanged.
 *
 * @param template - Template string with {variable} placeholders
 * @param variables - Variable values to substitute
 * @returns Filled template string
 */
export function fillTemplateVariables(
  template: string,
  variables: TemplateVariables
): string {
  let result = template

  for (const [key, value] of Object.entries(variables)) {
    // Use split/join instead of regex for safety
    result = result.split(`{${key}}`).join(value)
  }

  return result
}

/**
 * Build enemy pack string from count and name.
 *
 * @param count - Number of enemies
 * @param name - Base enemy name (singular)
 * @returns Formatted string like "a Goblin", "a pair of Goblins", or "5 Goblins"
 */
export function buildEnemyPack(count: number, name: string): string {
  if (count === 1) return `a ${name}`
  if (count === 2) return `a pair of ${name}s`
  return `${count} ${name}s`
}
