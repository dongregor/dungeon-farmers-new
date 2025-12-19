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

    // Update hero in store
    const index = heroStore.heroes.findIndex(h => h.id === heroId)
    if (index !== -1) {
      heroStore.heroes[index] = prestaged
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
      display_title: displayTitle
    })
  }

  /**
   * Check if hero can prestige
   */
  function canPrestige(hero: Hero): boolean {
    return hero.level >= 60 && !hero.isOnExpedition && !hero.isStationed
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
