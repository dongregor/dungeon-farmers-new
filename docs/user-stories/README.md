# Dungeon Farmers - User Stories

**Last Updated:** 2025-12-29
**Status:** Comprehensive user journey and gameplay documentation
**Total Stories:** 150+

---

## Overview

This directory contains comprehensive user stories covering the entire player journey and all gameplay systems in Dungeon Farmers. Each story follows the standard format:

```
As a [user type], I want to [action], so that [benefit].

Acceptance Criteria:
- Specific testable criteria

Notes:
- Implementation hints
```

---

## User Story Categories

| File | Category | Stories | Phase |
|------|----------|---------|-------|
| [01-onboarding.md](./01-onboarding.md) | Onboarding & First-Time UX | 27 | Phase 1 |
| [02-hero-management.md](./02-hero-management.md) | Hero Management System | 30 | Phase 1-2 |
| [03-expeditions.md](./03-expeditions.md) | Expeditions & Content | 35 | Phase 1-2 |
| [04-dungeon-building.md](./04-dungeon-building.md) | Dungeon Building System | 33 | Phase 2 |
| [05-equipment-inventory.md](./05-equipment-inventory.md) | Equipment & Inventory | 27 | Phase 1-2 |
| [06-progression-monetization.md](./06-progression-monetization.md) | Progression & Monetization | 35+ | Phase 1-3 |

---

## Implementation Priority

### Phase 1: MVP Core Loop
- Onboarding: US-OB-001 to US-OB-017 (core tutorial)
- Heroes: US-1 to US-8, US-11, US-12, US-15, US-16, US-20-22, US-28
- Expeditions: Zone exploration, basic completion, logs
- Equipment: Basic inventory, equipping, stats

### Phase 2: The Differentiator
- Dungeon Building: Monster capture, schematics, basic building
- Expeditions: Story missions, passive assignments, dungeons
- Heroes: Prestige, trait rerolls, advanced management

### Phase 3: Depth & Polish
- Synergies: Discovery, codex, optimization
- Equipment: Set bonuses, gear recommendations
- Monetization: Supporter pack, premium features
- Cosmetics: Themes, skins, badges

### Phase 4+: Content & Social
- AI-generated events
- Achievements system
- Social features (post-launch)

---

## Story ID Conventions

| Prefix | Category |
|--------|----------|
| US-OB- | Onboarding |
| US-HM- | Hero Management |
| US-EX- | Expeditions |
| US-DB- | Dungeon Building |
| US-EQ- | Equipment & Inventory |
| US-PM- | Progression & Monetization |

---

## Key Design Principles

These stories reflect the game's core design philosophy:

1. **No Pay-to-Win** - Supporters progress faster, not further
2. **No Failure States** - Expeditions always complete (60-150% efficiency)
3. **Respect Player Time** - Tutorials skippable, hints optional
4. **Transparent Systems** - Show calculations, explain mechanics
5. **Emergent Personality** - Traits drive both gameplay and stories
6. **Targeted Farming** - Build dungeons for specific loot needs

---

## Related Documentation

- [Game Design v2](../../design/GAME_DESIGN_V2.md) - Complete game design
- [Tech Stack](../tech-stack-recommendation.md) - Technical architecture
- [Implementation Plans](../plans/) - Phase-by-phase development plans
