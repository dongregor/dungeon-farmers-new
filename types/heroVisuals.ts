import type { Archetype, Gender, Culture } from './base'

// Visual trait indices into color palettes
export interface HeroVisualTraits {
  skinTone: number      // 0-4 index into SKIN_TONES
  hairColor: number     // 0-7 index into HAIR_COLORS
  hairStyle: number     // 0-5 index (per gender)
  primaryColor: number  // 0-7 index into archetype clothing palette
  secondaryColor: number // 0-7 index into archetype clothing palette
  faceShape: number     // 0-3 variations
}

// Color palettes
export const SKIN_TONES = [
  '#f4d5a0', // 0: Light
  '#e6c385', // 1: Light-medium
  '#d4a574', // 2: Medium
  '#8b5a3c', // 3: Medium-dark
  '#5a3a2a', // 4: Dark
] as const

export const HAIR_COLORS = [
  '#1a1a1a', // 0: Black
  '#4a3728', // 1: Dark brown
  '#8b6914', // 2: Brown
  '#c4a35a', // 3: Dirty blonde
  '#e8d5a3', // 4: Blonde
  '#8b3a3a', // 5: Auburn
  '#4a4a4a', // 6: Gray
  '#f5f5f5', // 7: White/silver
] as const

// Clothing palettes per archetype (8 colors each)
export const CLOTHING_PALETTES: Record<Archetype, readonly string[]> = {
  tank: ['#4a5568', '#2d3748', '#1a365d', '#744210', '#5a3e2b', '#374151', '#1f2937', '#4b5563'],
  healer: ['#f0fff4', '#c6f6d5', '#9ae6b4', '#e6fffa', '#b2f5ea', '#bee3f8', '#ffffff', '#e2e8f0'],
  debuffer: ['#553c9a', '#6b46c1', '#44337a', '#1a202c', '#2d3748', '#4a5568', '#322659', '#5a3e85'],
  melee_dps: ['#c53030', '#9b2c2c', '#742a2a', '#1a202c', '#2d3748', '#6b21a8', '#831843', '#4a1d1d'],
  ranged_dps: ['#276749', '#2f855a', '#38a169', '#744210', '#975a16', '#4a5568', '#5a3e2b', '#2d3748'],
  caster: ['#6b46c1', '#553c9a', '#44337a', '#1a365d', '#2c5282', '#d69e2e', '#b7791f', '#744210'],
} as const

// Rarity border colors and glow intensities
export const RARITY_COLORS = {
  common: { border: '#6b7280', glow: 'none' },
  uncommon: { border: '#22c55e', glow: '0 0 8px #22c55e40' },
  rare: { border: '#3b82f6', glow: '0 0 12px #3b82f660' },
  epic: { border: '#a855f7', glow: '0 0 16px #a855f780' },
  legendary: { border: '#f59e0b', glow: '0 0 20px #f59e0ba0' },
} as const

// Hair style counts per gender
export const HAIR_STYLE_COUNT: Record<Gender, number> = {
  male: 6,
  female: 6,
  nonbinary: 6,
}

// Culture influences skin tone distribution (weighted)
export const CULTURE_SKIN_WEIGHTS: Record<Culture, number[]> = {
  northfolk: [0.4, 0.3, 0.2, 0.08, 0.02],
  coastborn: [0.15, 0.25, 0.35, 0.15, 0.1],
  woodwalkers: [0.1, 0.2, 0.3, 0.25, 0.15],
  crownlanders: [0.2, 0.25, 0.3, 0.15, 0.1],
}
