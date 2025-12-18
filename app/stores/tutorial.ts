import { defineStore } from 'pinia'
import type { MentorQuest } from '~/data/mentorQuests'
import {
  getAllMentorQuests,
  getMentorQuestById,
  isQuestUnlocked,
  getUnlockedQuests,
  getLockedQuests,
  getUnlockConditionText,
} from '~/data/mentorQuests'

export type TutorialStep = 'welcome' | 'name_guild' | 'tutorial_expedition' | 'view_log' | 'complete'

export interface TutorialState {
  isActive: boolean
  isComplete: boolean
  currentStep: TutorialStep
  guildMasterName: string
  tutorialExpeditionComplete: boolean
}

export interface MentorQuestProgress {
  questId: string
  isUnlocked: boolean
  isComplete: boolean
  isClaimed: boolean
  completedAt?: string
  claimedAt?: string
  progress?: {
    current: number
    target: number
  }
}

export interface PlayerStats {
  heroes_recruited: number
  expeditions_completed: number
  zones_unlocked: number
  equipment_owned: number
  heroes_owned: number
  max_hero_level: number
  [key: string]: number
}

export const useTutorialStore = defineStore('tutorial', {
  state: () => ({
    // Tutorial intro state
    tutorial: {
      isActive: false,
      isComplete: false,
      currentStep: 'welcome' as TutorialStep,
      guildMasterName: '',
      tutorialExpeditionComplete: false,
    } as TutorialState,

    // Mentor quest state
    questProgress: [] as MentorQuestProgress[],
    completedQuestIds: [] as string[],

    // Player stats for quest unlock conditions
    playerStats: {
      heroes_recruited: 0,
      expeditions_completed: 0,
      zones_unlocked: 1, // Start with zone 1 unlocked
      equipment_owned: 0,
      heroes_owned: 1, // Start with Guild Master
      max_hero_level: 1,
    } as PlayerStats,

    // UI state
    showMentorPanel: false,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Get all mentor quests with progress
     */
    allQuests(): Array<MentorQuest & MentorQuestProgress> {
      return getAllMentorQuests().map(quest => {
        const progress = this.questProgress.find(p => p.questId === quest.id)
        const isUnlocked = isQuestUnlocked(quest, this.playerStats, this.completedQuestIds)

        return {
          ...quest,
          isUnlocked,
          isComplete: progress?.isComplete || false,
          isClaimed: progress?.isClaimed || false,
          completedAt: progress?.completedAt,
          claimedAt: progress?.claimedAt,
          progress: progress?.progress,
        }
      })
    },

    /**
     * Get unlocked mentor quests
     */
    unlockedQuests(): Array<MentorQuest & MentorQuestProgress> {
      return this.allQuests.filter(q => q.isUnlocked)
    },

    /**
     * Get locked mentor quests
     */
    lockedQuests(): Array<MentorQuest & MentorQuestProgress> {
      return this.allQuests.filter(q => !q.isUnlocked)
    },

    /**
     * Get completed but unclaimed quests
     */
    unclaimedQuests(): Array<MentorQuest & MentorQuestProgress> {
      return this.allQuests.filter(q => q.isComplete && !q.isClaimed)
    },

    /**
     * Get count of unclaimed quest rewards
     */
    unclaimedCount(): number {
      return this.unclaimedQuests.length
    },

    /**
     * Get completion stats
     */
    completionStats(): { completed: number; total: number; percentage: number } {
      const total = getAllMentorQuests().length
      const completed = this.completedQuestIds.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

      return { completed, total, percentage }
    },

    /**
     * Check if tutorial intro is done
     */
    isTutorialIntroComplete(): boolean {
      return this.tutorial.isComplete
    },

    /**
     * Check if mentor quests are available
     */
    areMentorQuestsAvailable(): boolean {
      return this.tutorial.isComplete
    },
  },

  actions: {
    /**
     * Start the tutorial
     */
    startTutorial() {
      this.tutorial.isActive = true
      this.tutorial.isComplete = false
      this.tutorial.currentStep = 'welcome'
    },

    /**
     * Advance to next tutorial step
     */
    nextTutorialStep() {
      const steps: TutorialStep[] = ['welcome', 'name_guild', 'tutorial_expedition', 'view_log', 'complete']
      const currentIndex = steps.indexOf(this.tutorial.currentStep)

      if (currentIndex < steps.length - 1) {
        this.tutorial.currentStep = steps[currentIndex + 1]
      }

      if (this.tutorial.currentStep === 'complete') {
        this.completeTutorial()
      }
    },

    /**
     * Set Guild Master name
     */
    setGuildMasterName(name: string) {
      this.tutorial.guildMasterName = name
    },

    /**
     * Mark tutorial expedition as complete
     */
    completeTutorialExpedition() {
      this.tutorial.tutorialExpeditionComplete = true
      this.updatePlayerStat('expeditions_completed', 1)
      this.checkQuestProgress('expedition_complete', { isTutorial: true })
    },

    /**
     * Complete the tutorial intro
     */
    completeTutorial() {
      this.tutorial.isActive = false
      this.tutorial.isComplete = true
      this.tutorial.currentStep = 'complete'

      // Persist to server or localStorage
      this.saveTutorialState()
    },

    /**
     * Skip tutorial (for returning players)
     */
    skipTutorial() {
      this.tutorial.isActive = false
      this.tutorial.isComplete = true
      this.tutorial.currentStep = 'complete'
      this.saveTutorialState()
    },

    /**
     * Reset tutorial (for testing)
     */
    resetTutorial() {
      this.tutorial = {
        isActive: false,
        isComplete: false,
        currentStep: 'welcome',
        guildMasterName: '',
        tutorialExpeditionComplete: false,
      }
      this.questProgress = []
      this.completedQuestIds = []
      this.saveTutorialState()
    },

    /**
     * Update player stat
     */
    updatePlayerStat(stat: string, value: number) {
      this.playerStats[stat] = value
    },

    /**
     * Increment player stat
     */
    incrementPlayerStat(stat: string, amount: number = 1) {
      this.playerStats[stat] = (this.playerStats[stat] || 0) + amount
    },

    /**
     * Track quest progress
     */
    checkQuestProgress(actionType: string, metadata?: Record<string, any>) {
      const quests = getAllMentorQuests()

      for (const quest of quests) {
        // Skip if already complete
        const progress = this.questProgress.find(p => p.questId === quest.id)
        if (progress?.isComplete) continue

        // Check if quest is unlocked
        if (!isQuestUnlocked(quest, this.playerStats, this.completedQuestIds)) continue

        // Check if action matches quest requirement
        if (quest.requirement.type === actionType) {
          // Check metadata if needed
          if (metadata && quest.requirement.metadata) {
            const metadataMatches = Object.keys(quest.requirement.metadata).every(
              key => metadata[key] === quest.requirement.metadata![key]
            )
            if (!metadataMatches) continue
          }

          // Update or create progress
          this.updateQuestProgress(quest.id, actionType)
        }
      }
    },

    /**
     * Update quest progress
     */
    updateQuestProgress(questId: string, actionType: string) {
      const quest = getMentorQuestById(questId)
      if (!quest) return

      let progress = this.questProgress.find(p => p.questId === questId)
      if (!progress) {
        progress = {
          questId,
          isUnlocked: true,
          isComplete: false,
          isClaimed: false,
        }
        this.questProgress.push(progress)
      }

      // Increment progress
      if (quest.requirement.count) {
        if (!progress.progress) {
          progress.progress = { current: 0, target: quest.requirement.count }
        }
        progress.progress.current = Math.min(
          progress.progress.current + 1,
          progress.progress.target
        )

        // Check if complete
        if (progress.progress.current >= progress.progress.target) {
          this.completeQuest(questId)
        }
      } else {
        // Quest has no count requirement, complete immediately
        this.completeQuest(questId)
      }
    },

    /**
     * Manually complete a quest
     */
    completeQuest(questId: string) {
      let progress = this.questProgress.find(p => p.questId === questId)
      if (!progress) {
        progress = {
          questId,
          isUnlocked: true,
          isComplete: false,
          isClaimed: false,
        }
        this.questProgress.push(progress)
      }

      if (!progress.isComplete) {
        progress.isComplete = true
        progress.completedAt = new Date().toISOString()
        this.completedQuestIds.push(questId)

        // Check if final quest is now unlocked
        const finalQuest = getMentorQuestById('completionist')
        if (finalQuest && isQuestUnlocked(finalQuest, this.playerStats, this.completedQuestIds)) {
          this.completeQuest('completionist')
        }
      }
    },

    /**
     * Claim quest reward
     */
    async claimQuestReward(questId: string) {
      const quest = getMentorQuestById(questId)
      if (!quest) {
        throw new Error('Quest not found')
      }

      const progress = this.questProgress.find(p => p.questId === questId)
      if (!progress || !progress.isComplete || progress.isClaimed) {
        throw new Error('Cannot claim this quest reward')
      }

      try {
        // In a real implementation, this would call the server
        // const data = await $fetch('/api/mentor-quests/claim', {
        //   method: 'POST',
        //   body: { questId },
        // })

        // Mark as claimed
        progress.isClaimed = true
        progress.claimedAt = new Date().toISOString()

        return quest.reward
      } catch (error: any) {
        console.error('Error claiming quest reward:', error)
        throw error
      }
    },

    /**
     * Claim all unclaimed rewards
     */
    async claimAllRewards() {
      const unclaimed = this.unclaimedQuests
      if (unclaimed.length === 0) return

      const rewards: any[] = []

      for (const quest of unclaimed) {
        try {
          const reward = await this.claimQuestReward(quest.id)
          rewards.push(reward)
        } catch (error) {
          console.error(`Failed to claim reward for ${quest.id}:`, error)
        }
      }

      return rewards
    },

    /**
     * Toggle mentor quest panel
     */
    toggleMentorPanel() {
      this.showMentorPanel = !this.showMentorPanel
    },

    /**
     * Show mentor quest panel
     */
    showMentorQuestPanel() {
      this.showMentorPanel = true
    },

    /**
     * Hide mentor quest panel
     */
    hideMentorQuestPanel() {
      this.showMentorPanel = false
    },

    /**
     * Get unlock condition text for a quest
     */
    getUnlockText(quest: MentorQuest): string {
      return getUnlockConditionText(quest, this.playerStats)
    },

    /**
     * Save tutorial state to localStorage
     */
    saveTutorialState() {
      try {
        localStorage.setItem('tutorial_state', JSON.stringify(this.tutorial))
        localStorage.setItem('quest_progress', JSON.stringify(this.questProgress))
        localStorage.setItem('completed_quest_ids', JSON.stringify(this.completedQuestIds))
        localStorage.setItem('player_stats', JSON.stringify(this.playerStats))
      } catch (error) {
        console.error('Failed to save tutorial state:', error)
      }
    },

    /**
     * Load tutorial state from localStorage
     */
    loadTutorialState() {
      try {
        const tutorialState = localStorage.getItem('tutorial_state')
        if (tutorialState) {
          this.tutorial = JSON.parse(tutorialState)
        }

        const questProgress = localStorage.getItem('quest_progress')
        if (questProgress) {
          this.questProgress = JSON.parse(questProgress)
        }

        const completedQuestIds = localStorage.getItem('completed_quest_ids')
        if (completedQuestIds) {
          this.completedQuestIds = JSON.parse(completedQuestIds)
        }

        const playerStats = localStorage.getItem('player_stats')
        if (playerStats) {
          this.playerStats = JSON.parse(playerStats)
        }
      } catch (error) {
        console.error('Failed to load tutorial state:', error)
      }
    },

    /**
     * Fetch tutorial state from server
     */
    async fetchTutorialState() {
      this.loading = true
      this.error = null

      try {
        // In a real implementation, this would fetch from server
        // const data = await $fetch<{
        //   tutorial: TutorialState
        //   questProgress: MentorQuestProgress[]
        //   completedQuestIds: string[]
        //   playerStats: PlayerStats
        // }>('/api/tutorial')

        // For now, load from localStorage
        this.loadTutorialState()
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch tutorial state'
        console.error('Error fetching tutorial state:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
