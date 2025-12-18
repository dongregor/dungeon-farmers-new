/**
 * useTutorial Composable
 *
 * Provides easy access to tutorial functionality throughout the app
 */

import { storeToRefs } from 'pinia'
import { useTutorialStore } from '~/stores/tutorial'

export const useTutorial = () => {
  const tutorialStore = useTutorialStore()

  // Reactive state
  const {
    tutorial,
    allQuests,
    unlockedQuests,
    lockedQuests,
    unclaimedQuests,
    unclaimedCount,
    completionStats,
    isTutorialIntroComplete,
    areMentorQuestsAvailable,
    showMentorPanel,
    loading,
    error,
  } = storeToRefs(tutorialStore)

  // Actions
  const {
    startTutorial,
    nextTutorialStep,
    setGuildMasterName,
    completeTutorialExpedition,
    completeTutorial,
    skipTutorial,
    resetTutorial,
    updatePlayerStat,
    incrementPlayerStat,
    checkQuestProgress,
    updateQuestProgress,
    completeQuest,
    claimQuestReward,
    claimAllRewards,
    toggleMentorPanel,
    showMentorQuestPanel,
    hideMentorQuestPanel,
    getUnlockText,
    saveTutorialState,
    loadTutorialState,
    fetchTutorialState,
  } = tutorialStore

  /**
   * Track hero recruitment
   */
  const trackHeroRecruited = () => {
    incrementPlayerStat('heroes_recruited')
    incrementPlayerStat('heroes_owned')
    checkQuestProgress('recruit_hero')
  }

  /**
   * Track expedition completion
   */
  const trackExpeditionComplete = (isTutorial: boolean = false) => {
    incrementPlayerStat('expeditions_completed')
    checkQuestProgress('expedition_complete', { isTutorial })
  }

  /**
   * Track tavern visit
   */
  const trackTavernVisit = () => {
    checkQuestProgress('visit_tavern')
  }

  /**
   * Track party sent
   */
  const trackPartySent = (partySize: number) => {
    if (partySize >= 2) {
      checkQuestProgress('send_party')
    }
  }

  /**
   * Track item equipped
   */
  const trackItemEquipped = (heroId: string) => {
    checkQuestProgress('equip_item')
  }

  /**
   * Track full set equipped
   */
  const trackFullSetEquipped = (heroId: string) => {
    checkQuestProgress('equip_full_set')
  }

  /**
   * Track profile read
   */
  const trackProfileRead = (heroId: string) => {
    checkQuestProgress('read_profile')
  }

  /**
   * Track tag matched
   */
  const trackTagMatched = () => {
    checkQuestProgress('match_tag')
  }

  /**
   * Track subzone discovered
   */
  const trackSubzoneDiscovered = () => {
    checkQuestProgress('discover_subzone')
  }

  /**
   * Track hero recovery
   */
  const trackHeroRecovered = (heroId: string) => {
    checkQuestProgress('hero_recover')
  }

  /**
   * Track prestige view
   */
  const trackPrestigeViewed = () => {
    checkQuestProgress('view_prestige')
  }

  /**
   * Track party preset saved
   */
  const trackPresetSaved = () => {
    checkQuestProgress('save_preset')
  }

  /**
   * Track hero retired
   */
  const trackHeroRetired = (heroId: string) => {
    incrementPlayerStat('heroes_owned', -1)
    checkQuestProgress('retire_hero')
  }

  /**
   * Track zone unlocked
   */
  const trackZoneUnlocked = () => {
    incrementPlayerStat('zones_unlocked')
  }

  /**
   * Track equipment obtained
   */
  const trackEquipmentObtained = (count: number = 1) => {
    incrementPlayerStat('equipment_owned', count)
  }

  /**
   * Track hero level up
   */
  const trackHeroLevelUp = (heroId: string, newLevel: number) => {
    const currentMax = tutorialStore.playerStats.max_hero_level || 1
    if (newLevel > currentMax) {
      updatePlayerStat('max_hero_level', newLevel)
    }
  }

  /**
   * Initialize tutorial on app start
   */
  const initializeTutorial = async () => {
    try {
      await fetchTutorialState()
    } catch (error) {
      console.error('Failed to load tutorial state:', error)
      // Still allow tutorial to start for new players even if fetch fails
    }

    // If no tutorial state exists, start tutorial for new players
    if (!tutorial.value.isComplete && !tutorial.value.isActive) {
      // Could show a prompt here asking if they want to start the tutorial
      // For now, auto-start for new players
      startTutorial()
    }
  }

  /**
   * Check if should show tutorial intro
   */
  const shouldShowTutorialIntro = computed(() => {
    return tutorial.value.isActive && !tutorial.value.isComplete
  })

  /**
   * Check if should show mentor quest badge
   */
  const shouldShowMentorQuestBadge = computed(() => {
    return isTutorialIntroComplete.value && unclaimedCount.value > 0
  })

  return {
    // State
    tutorial,
    allQuests,
    unlockedQuests,
    lockedQuests,
    unclaimedQuests,
    unclaimedCount,
    completionStats,
    isTutorialIntroComplete,
    areMentorQuestsAvailable,
    showMentorPanel,
    loading,
    error,

    // Computed
    shouldShowTutorialIntro,
    shouldShowMentorQuestBadge,

    // Tutorial flow actions
    startTutorial,
    nextTutorialStep,
    setGuildMasterName,
    completeTutorialExpedition,
    completeTutorial,
    skipTutorial,
    resetTutorial,

    // Quest actions
    claimQuestReward,
    claimAllRewards,
    toggleMentorPanel,
    showMentorQuestPanel,
    hideMentorQuestPanel,
    getUnlockText,

    // Tracking actions
    trackHeroRecruited,
    trackExpeditionComplete,
    trackTavernVisit,
    trackPartySent,
    trackItemEquipped,
    trackFullSetEquipped,
    trackProfileRead,
    trackTagMatched,
    trackSubzoneDiscovered,
    trackHeroRecovered,
    trackPrestigeViewed,
    trackPresetSaved,
    trackHeroRetired,
    trackZoneUnlocked,
    trackEquipmentObtained,
    trackHeroLevelUp,

    // Initialization
    initializeTutorial,
  }
}
