export interface PartyPreset {
  id: string
  playerId: string
  name: string
  description: string
  heroIds: string[]
  
  // Metadata
  createdAt: string
  updatedAt: string
  lastUsed?: string
}

export interface PresetCategory {
  id: string
  name: string
  presets: string[]
}