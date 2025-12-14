export interface Title {
  id: string
  name: string
  description: string
  unlockCondition: string
  isUnlocked: boolean
  unlockDate?: string
}

export interface TitleCategory {
  id: string
  name: string
  titles: string[]
}