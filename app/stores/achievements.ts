import { defineStore } from 'pinia'
import type { Achievement } from '~/data/achievements'
import { getAllAchievements, getAchievementById, calculateTotalPoints, calculateCompletionPercentage } from '~/data/achievements'

export interface PlayerAchievement {
  achievementId: string
  unlockedAt: string
  showcased: boolean
}

export interface AchievementProgress {
  achievementId: string
  currentValue: number
  targetValue: number
  lastUpdated: string
}

export const useAchievementStore = defineStore('achievements', {
  state: () => ({
    unlocked: [] as PlayerAchievement[],
    progress: [] as AchievementProgress[],
    showcased: [] as string[], // Up to 6 achievement IDs to display
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Get all unlocked achievement IDs
     */
    unlockedIds: (state): string[] => {
      return state.unlocked.map(a => a.achievementId)
    },

    /**
     * Get showcased achievements
     */
    showcasedAchievements(): Achievement[] {
      return this.showcased
        .map(id => getAchievementById(id))
        .filter((a): a is Achievement => a !== undefined)
    },

    /**
     * Get total achievement points
     */
    totalPoints(): number {
      return calculateTotalPoints(this.unlockedIds)
    },

    /**
     * Get completion percentage
     */
    completionPercentage(): number {
      return calculateCompletionPercentage(this.unlockedIds)
    },

    /**
     * Get all achievements with unlock status
     */
    allWithStatus(): Array<Achievement & { isUnlocked: boolean; unlockedAt?: string; progress?: AchievementProgress }> {
      return getAllAchievements().map(achievement => {
        const unlocked = this.unlocked.find(u => u.achievementId === achievement.id)
        const progress = this.progress.find(p => p.achievementId === achievement.id)

        return {
          ...achievement,
          isUnlocked: !!unlocked,
          unlockedAt: unlocked?.unlockedAt,
          progress,
        }
      })
    },

    /**
     * Get achievements by category with status
     */
    byCategory: (state) => (category: string) => {
      return getAllAchievements()
        .filter(a => a.category === category)
        .map(achievement => {
          const unlocked = state.unlocked.find(u => u.achievementId === achievement.id)
          const progress = state.progress.find(p => p.achievementId === achievement.id)

          return {
            ...achievement,
            isUnlocked: !!unlocked,
            unlockedAt: unlocked?.unlockedAt,
            progress,
          }
        })
    },

    /**
     * Get recently unlocked achievements
     */
    recentlyUnlocked: (state) => {
      return [...state.unlocked]
        .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
        .slice(0, 5)
        .map(u => getAchievementById(u.achievementId))
        .filter((a): a is Achievement => a !== undefined)
    },

    /**
     * Get hidden achievements count (unlocked but hidden)
     */
    hiddenUnlockedCount(): number {
      return this.unlockedIds.filter(id => {
        const achievement = getAchievementById(id)
        return achievement?.isHidden
      }).length
    },
  },

  actions: {
    /**
     * Fetch all achievements and progress from server
     */
    async fetchAchievements() {
      this.loading = true
      this.error = null

      try {
        const data = await $fetch<{
          unlocked: PlayerAchievement[]
          progress: AchievementProgress[]
          showcased: string[]
        }>('/api/achievements')

        this.unlocked = data.unlocked
        this.progress = data.progress
        this.showcased = data.showcased
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch achievements'
        console.error('Error fetching achievements:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Check and unlock achievements based on current stats
     */
    async checkAchievements(stats: Record<string, number>) {
      try {
        const data = await $fetch<{
          newlyUnlocked: PlayerAchievement[]
        }>('/api/achievements/check', {
          method: 'POST',
          body: { stats },
        })

        // Add newly unlocked achievements
        for (const achievement of data.newlyUnlocked) {
          if (!this.unlocked.find(u => u.achievementId === achievement.achievementId)) {
            this.unlocked.push(achievement)
          }
        }

        return data.newlyUnlocked
      } catch (error: any) {
        console.error('Error checking achievements:', error)
        return []
      }
    },

    /**
     * Update achievement progress
     */
    updateProgress(achievementId: string, currentValue: number, targetValue: number) {
      const existing = this.progress.find(p => p.achievementId === achievementId)

      if (existing) {
        existing.currentValue = currentValue
        existing.targetValue = targetValue
        existing.lastUpdated = new Date().toISOString()
      } else {
        this.progress.push({
          achievementId,
          currentValue,
          targetValue,
          lastUpdated: new Date().toISOString(),
        })
      }
    },

    /**
     * Showcase achievements (select up to 6 for display)
     */
    async updateShowcased(achievementIds: string[]) {
      if (achievementIds.length > 6) {
        throw new Error('Can only showcase up to 6 achievements')
      }

      // Verify all are unlocked
      const allUnlocked = achievementIds.every(id => this.unlockedIds.includes(id))
      if (!allUnlocked) {
        throw new Error('Can only showcase unlocked achievements')
      }

      try {
        await $fetch('/api/achievements/showcased', {
          method: 'PATCH',
          body: { showcased: achievementIds },
        })

        this.showcased = achievementIds
      } catch (error: any) {
        console.error('Error updating showcased achievements:', error)
        throw error
      }
    },

    /**
     * Manually unlock an achievement (for testing/admin)
     */
    async unlockAchievement(achievementId: string) {
      try {
        const data = await $fetch<PlayerAchievement>('/api/achievements/unlock', {
          method: 'POST',
          body: { achievementId },
        })

        this.unlocked.push(data)
        return data
      } catch (error: any) {
        console.error('Error unlocking achievement:', error)
        throw error
      }
    },
  },
})
