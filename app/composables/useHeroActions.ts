import { useHeroStore } from '~/stores/heroes'
import type { Hero } from '~~/types'

/**
 * Composable for common hero actions
 * Provides convenient wrappers around hero store actions
 */
export function useHeroActions() {
  const heroStore = useHeroStore()

  /**
   * Toggle hero favorite status
   */
  async function toggleFavorite(heroId: string) {
    const hero = heroStore.getHeroById(heroId)
    if (!hero) {
      throw new Error(`Hero ${heroId} not found`)
    }

    await heroStore.updateHero({
      id: heroId,
      is_favorite: !hero.isFavorite
    })
  }

  /**
   * Prestige a hero (reset level, gain permanent bonuses)
   */
  async function prestigeHero(heroId: string) {
    const prestaged = await $fetch<Hero>(`/api/heroes/${heroId}/prestige`, {
      method: 'POST'
    })

    // Update hero in store using $patch to preserve reactivity
    const index = heroStore.heroes.findIndex(h => h.id === heroId)
    if (index !== -1) {
      heroStore.$patch({
        heroes: [
          ...heroStore.heroes.slice(0, index),
          prestaged,
          ...heroStore.heroes.slice(index + 1)
        ]
      })
    }

    return prestaged
  }

  /**
   * Retire a hero (permanent removal, optional trait transfer)
   */
  async function retireHero(heroId: string, transferTraitTo?: string) {
    await heroStore.retireHero(heroId, transferTraitTo)
  }

  /**
   * Update hero's display title
   */
  async function updateDisplayTitle(heroId: string, displayTitle: string | null) {
    await heroStore.updateHero({
      id: heroId,
      displayTitle
    })
  }

  /**
   * Check if hero can prestige
   */
import { useHeroStore } from '~/stores/heroes'
import type { Hero } from '~~/types'
import { MAX_HERO_LEVEL } from '~/utils/xpService'

function canPrestige(hero: Hero): boolean {
  return hero.level >= MAX_HERO_LEVEL && !hero.isOnExpedition && !hero.isStationed
}

  /**
   * Check if hero can be retired
   */
  function canRetire(hero: Hero): boolean {
    return !hero.isOnExpedition && !hero.isStationed
  }

  return {
    toggleFavorite,
    prestigeHero,
    retireHero,
    updateDisplayTitle,
    canPrestige,
    canRetire
  }
}
