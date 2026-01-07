# Hero Portraits Design

**Date:** 2025-01-07
**Status:** Approved
**Phase:** Implementation Ready

---

## Overview

Procedural silhouette-based hero portraits that display visual personality without requiring external art assets. Visual traits are stored in the database for consistency and future customization features.

## Visual Trait Data Model

Add `visualTraits` object to Hero type, generated once at creation:

```typescript
interface HeroVisualTraits {
  // Physical
  skinTone: number      // 0-4 index into skin palette
  hairColor: number     // 0-7 index into hair palette
  hairStyle: number     // 0-5 per gender (short, medium, long, etc.)

  // Clothing (archetype-influenced)
  primaryColor: number  // 0-7 clothing palette
  secondaryColor: number

  // Face
  faceShape: number     // 0-3 variations
}
```

**Generation logic:**
- Seeded from hero ID for reproducibility
- Culture influences skin tone distribution
- Archetype influences clothing color palettes
- Gender determines available hair styles

**Storage:**
- New `visual_traits` JSONB column on heroes table
- Generated in `heroes/generate.post.ts`
- Included in Hero API responses

---

## Silhouette Rendering System

SVG-based silhouettes with layered colored regions. Each archetype has a distinct silhouette shape.

### Archetype Silhouettes

| Archetype | Shape | Visual Cues |
|-----------|-------|-------------|
| Tank | Wide shoulders, stocky | Heavy armor outline, shield hint |
| Healer | Soft rounded, medium | Robe/coat silhouette, gentle posture |
| Melee DPS | Athletic, forward-leaning | Weapon stance, dynamic pose |
| Ranged DPS | Lean, tall | Hood/cap, crossbow/bow hint |
| Caster | Medium, flowing | Robes, staff silhouette |
| Support | Versatile, approachable | Casual stance, utility belt hint |

### Layer Stack (back to front)

1. Background (rarity-colored gradient)
2. Body silhouette (skin tone)
3. Clothing base (primary color)
4. Clothing details (secondary color)
5. Hair shape (hair color)
6. Rarity border/glow effect

### Component API

```vue
<HeroPortrait :hero="hero" size="lg" />
```

- Sizes: `lg` (192px), `md` (96px), `sm` (48px)
- Props for showing/hiding rarity effects

---

## Color Palettes

### Skin Tones (5 values)

| Index | Hex | Description |
|-------|-----|-------------|
| 0 | #f4d5a0 | Light |
| 1 | #e6c385 | Light-medium |
| 2 | #d4a574 | Medium |
| 3 | #8b5a3c | Medium-dark |
| 4 | #5a3a2a | Dark |

### Hair Colors (8 values)

| Index | Hex | Description |
|-------|-----|-------------|
| 0 | #1a1a1a | Black |
| 1 | #4a3728 | Dark brown |
| 2 | #8b6914 | Brown |
| 3 | #c4a35a | Dirty blonde |
| 4 | #e8d5a3 | Blonde |
| 5 | #8b3a3a | Auburn |
| 6 | #4a4a4a | Gray |
| 7 | #f5f5f5 | White/silver |

### Clothing Palettes (per archetype)

- **Tank:** grays, browns, dark blues
- **Healer:** whites, light greens, soft blues
- **Melee DPS:** reds, blacks, dark purples
- **Ranged DPS:** greens, tans, forest colors
- **Caster:** purples, deep blues, gold accents
- **Support:** varied earth tones, professional colors

### Rarity Effects

| Rarity | Border Color | Effect |
|--------|--------------|--------|
| Common | #6b7280 (gray) | None |
| Uncommon | #22c55e (green) | Subtle glow |
| Rare | #3b82f6 (blue) | Medium glow |
| Epic | #a855f7 (purple) | Strong glow + shimmer |
| Legendary | #f59e0b (gold) | Animated glow + particles |

---

## Implementation Plan

### Files to Create

```
app/components/hero/Portrait.vue    # Main portrait component
app/utils/heroVisuals.ts            # Generation logic, palettes
shared/types/heroVisuals.ts         # TypeScript interfaces
```

### Files to Modify

```
types/hero.ts                       # Add visualTraits to Hero
server/api/heroes/generate.post.ts  # Generate traits on creation
server/api/tavern/recruit.post.ts   # Copy traits when recruiting
supabase/migrations/006_*.sql       # Add visual_traits column
```

### Implementation Order

1. Add types and generation utility
2. Database migration for `visual_traits` column
3. Update hero generation API to include visual traits
4. Build `<HeroPortrait>` component with SVG silhouettes
5. Replace existing hero displays with new component
6. Add rarity effects (borders, glows)

### SVG Strategy

- Hand-craft 6 archetype silhouettes as inline SVG in Vue component
- Each archetype ~50-100 lines of SVG paths
- Color regions use CSS custom properties for easy theming
- Silhouettes are stylized, not realistic

---

## Future Upgrades

This system is designed to be replaceable with real art assets:

1. **Layer-based art:** Swap SVG paths for PNG/WebP image layers
2. **AI-generated assets:** Use existing prompts in `design/_archive/ui-ux/HERO_VISUAL_PROMPTS.md`
3. **Customization UI:** Visual traits already stored, add "barber shop" feature
4. **Equipment overlays:** Add weapon/armor layers on top of base portrait

---

## Notes

- No external asset dependencies
- Works offline
- Instant rendering (no loading states)
- Consistent across sessions (traits stored in DB)
- Accessible (silhouettes have clear archetype distinction)
