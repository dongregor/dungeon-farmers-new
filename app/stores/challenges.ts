import { defineStore } from 'pinia'

export type ChallengeType = 'daily' | 'weekly'

export type ChallengeRequirementType =
  | 'expedition_count'
  | 'hero_stat_threshold'
  | 'subzone_discovery'
  | 'expedition_duration'
  | 'full_party'
  | 'recruit_count'
  | 'level_up_count'
  | 'unique_zones'
  | 'gold_earned'

export interface ChallengeRequirement {
  type: ChallengeRequirementType
  target: number
  metadata?: Record<string, any>
}

export interface ChallengeReward {
  gold?: number
  materials?: Array<{ id: string; count: number }>
  freeRefresh?: boolean
  description: string
}

export interface Challenge {
  id: string
  type: ChallengeType
  title: string
  description: string
  requirement: ChallengeRequirement
  reward: ChallengeReward
  icon: string
}

export interface ChallengeProgress {
  challengeId: string
  current: number
  target: number
  completed: boolean
  claimed: boolean
  completedAt?: string
}

export interface ChallengeSet {
  daily: Challenge[]
  weekly: Challenge[]
  dailyResetAt: string
  weeklyResetAt: string
}

export const useChallengeStore = defineStore('challenges', {
  state: () => ({
    currentChallenges: {
      daily: [] as Challenge[],
      weekly: [] as Challenge[],
      dailyResetAt: '',
      weeklyResetAt: '',
    } as ChallengeSet,
    progress: [] as ChallengeProgress[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    /**
     * Get all daily challenges with progress
     */
    dailyChallenges(): Array<Challenge & { progress?: ChallengeProgress }> {
      return this.currentChallenges.daily.map(challenge => ({
        ...challenge,
        progress: this.progress.find(p => p.challengeId === challenge.id),
      }))
    },

    /**
     * Get all weekly challenges with progress
     */
    weeklyChallenges(): Array<Challenge & { progress?: ChallengeProgress }> {
      return this.currentChallenges.weekly.map(challenge => ({
        ...challenge,
        progress: this.progress.find(p => p.challengeId === challenge.id),
      }))
    },

    /**
     * Get completed but unclaimed challenges
     */
    unclaimedRewards(): ChallengeProgress[] {
      return this.progress.filter(p => p.completed && !p.claimed)
    },

    /**
     * Get count of unclaimed rewards
     */
    unclaimedCount(): number {
      return this.unclaimedRewards.length
    },

    /**
     * Get time until daily reset
     */
    timeUntilDailyReset(): number {
      if (!this.currentChallenges.dailyResetAt) return 0
      return new Date(this.currentChallenges.dailyResetAt).getTime() - Date.now()
    },

    /**
     * Get time until weekly reset
     */
    timeUntilWeeklyReset(): number {
      if (!this.currentChallenges.weeklyResetAt) return 0
      return new Date(this.currentChallenges.weeklyResetAt).getTime() - Date.now()
    },

    /**
     * Get daily completion stats
     */
    dailyStats(): { completed: number; total: number; claimed: number } {
      const dailyIds = this.currentChallenges.daily.map(c => c.id)
      const dailyProgress = this.progress.filter(p => dailyIds.includes(p.challengeId))
      return {
        completed: dailyProgress.filter(p => p.completed).length,
        total: this.currentChallenges.daily.length,
        claimed: dailyProgress.filter(p => p.claimed).length,
      }
    },

    /**
     * Get weekly completion stats
     */
    weeklyStats(): { completed: number; total: number; claimed: number } {
      const weeklyIds = this.currentChallenges.weekly.map(c => c.id)
      const weeklyProgress = this.progress.filter(p => weeklyIds.includes(p.challengeId))
      return {
        completed: weeklyProgress.filter(p => p.completed).length,
        total: this.currentChallenges.weekly.length,
        claimed: weeklyProgress.filter(p => p.claimed).length,
      }
    },
  },

  actions: {
    /**
     * Fetch current challenges and progress from server
     */
    async fetchChallenges() {
      this.loading = true
      this.error = null

      try {
        const data = await $fetch<{
          challenges: ChallengeSet
          progress: ChallengeProgress[]
        }>('/api/challenges')

        this.currentChallenges = data.challenges
        this.progress = data.progress
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch challenges'
        console.error('Error fetching challenges:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Update progress for a challenge
     */
    updateProgress(challengeId: string, current: number, target: number) {
      const existing = this.progress.find(p => p.challengeId === challengeId)

      if (existing) {
        existing.current = Math.min(current, target)
        if (existing.current >= target && !existing.completed) {
          existing.completed = true
          existing.completedAt = new Date().toISOString()
        }
      } else {
        const completed = current >= target
        this.progress.push({
          challengeId,
          current: Math.min(current, target),
          target,
          completed,
          claimed: false,
          completedAt: completed ? new Date().toISOString() : undefined,
        })
      }
    },

    /**
     * Claim rewards for a completed challenge
     */
    async claimReward(challengeId: string) {
      const progress = this.progress.find(p => p.challengeId === challengeId)
      if (!progress || !progress.completed || progress.claimed) {
        throw new Error('Cannot claim this challenge')
      }

      try {
        const data = await $fetch<{
          rewards: ChallengeReward
          goldTotal: number
        }>('/api/challenges/claim', {
          method: 'POST',
          body: { challengeId },
        })

        // Mark as claimed
        progress.claimed = true

        return data
      } catch (error: any) {
        console.error('Error claiming challenge reward:', error)
        throw error
      }
    },

    /**
     * Claim all completed challenges
     */
    async claimAllRewards() {
      const unclaimed = this.unclaimedRewards
      if (unclaimed.length === 0) return

      try {
        const data = await $fetch<{
          totalGold: number
          totalMaterials: Array<{ id: string; count: number }>
          claimedCount: number
        }>('/api/challenges/claim-all', {
          method: 'POST',
        })

        // Mark all as claimed
        unclaimed.forEach(p => {
          p.claimed = true
        })

        return data
      } catch (error: any) {
        console.error('Error claiming all rewards:', error)
        throw error
      }
    },

    /**
     * Track expedition completion
     */
    trackExpeditionComplete(duration: number, party: any[], zoneId: string) {
      // Find relevant challenges
      this.currentChallenges.daily.forEach(challenge => {
        if (challenge.requirement.type === 'expedition_count') {
          const progress = this.progress.find(p => p.challengeId === challenge.id)
          const current = (progress?.current || 0) + 1
          this.updateProgress(challenge.id, current, challenge.requirement.target)
        }

        if (challenge.requirement.type === 'expedition_duration' && duration <= challenge.requirement.target) {
          this.updateProgress(challenge.id, 1, 1)
        }

        if (challenge.requirement.type === 'full_party' && party.length === 4) {
          const progress = this.progress.find(p => p.challengeId === challenge.id)
          const current = (progress?.current || 0) + 1
          this.updateProgress(challenge.id, current, challenge.requirement.target)
        }

        if (challenge.requirement.type === 'hero_stat_threshold' && challenge.requirement.metadata?.stat) {
          const hasStat = party.some((hero: any) => {
            const stat = hero.stats[challenge.requirement.metadata!.stat]
            return stat >= challenge.requirement.target
          })
          if (hasStat) {
            this.updateProgress(challenge.id, 1, 1)
          }
        }
      })

      // Check weekly challenges
      this.currentChallenges.weekly.forEach(challenge => {
        if (challenge.requirement.type === 'expedition_count') {
          const progress = this.progress.find(p => p.challengeId === challenge.id)
          const current = (progress?.current || 0) + 1
          this.updateProgress(challenge.id, current, challenge.requirement.target)
        }
      })
    },

    /**
     * Track hero recruitment
     */
    trackHeroRecruited() {
      this.currentChallenges.weekly.forEach(challenge => {
        if (challenge.requirement.type === 'recruit_count') {
          const progress = this.progress.find(p => p.challengeId === challenge.id)
          const current = (progress?.current || 0) + 1
          this.updateProgress(challenge.id, current, challenge.requirement.target)
        }
      })
    },

    /**
     * Track hero level up
     */
    trackHeroLevelUp() {
      this.currentChallenges.weekly.forEach(challenge => {
        if (challenge.requirement.type === 'level_up_count') {
          const progress = this.progress.find(p => p.challengeId === challenge.id)
          const current = (progress?.current || 0) + 1
          this.updateProgress(challenge.id, current, challenge.requirement.target)
        }
      })
    },

    /**
     * Track subzone discovery
     */
    trackSubzoneDiscovered() {
      this.currentChallenges.daily.forEach(challenge => {
        if (challenge.requirement.type === 'subzone_discovery') {
          this.updateProgress(challenge.id, 1, 1)
        }
      })
    },

    /**
     * Track gold earned
     */
    trackGoldEarned(amount: number) {
      this.currentChallenges.weekly.forEach(challenge => {
        if (challenge.requirement.type === 'gold_earned') {
          const progress = this.progress.find(p => p.challengeId === challenge.id)
          const current = (progress?.current || 0) + amount
          this.updateProgress(challenge.id, current, challenge.requirement.target)
        }
      })
    },

    /**
     * Track unique zone exploration
     */
    trackZoneExplored(zoneId: string) {
      this.currentChallenges.weekly.forEach(challenge => {
        if (challenge.requirement.type === 'unique_zones') {
          const progress = this.progress.find(p => p.challengeId === challenge.id)
          const metadata = progress?.metadata || { zones: [] }
          if (!metadata.zones.includes(zoneId)) {
            metadata.zones.push(zoneId)
            this.updateProgress(challenge.id, metadata.zones.length, challenge.requirement.target)
          }
        }
      })
    },
  },
})
