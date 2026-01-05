# Dungeon Farmers - Claude Context

**Last Updated:** 2026-01-04
**Status:** Phase 1 MVP ~98% complete (42/43 tasks)
**Design Doc:** [design/GAME_DESIGN_V2.md](design/GAME_DESIGN_V2.md)
**Task Tracking:** [TASKS.md](TASKS.md)

---

## Quick Summary

**Dungeon Farmers** is a browser-based idle RPG where players manage a guild of quirky, randomly-generated heroes. Send them on expeditions, capture monsters, and build your own farmable dungeons.

**The Hook:** Capture monsters during expeditions, collect dungeon schematics, build personal dungeons stocked with your monsters. Each monster has a loot table - build the dungeon you need to farm the gear you want.

**Tone:** Lighthearted fantasy parody. Loving mockery of RPG/MMO/gacha tropes. Heroes have personality through traits. No corporate satire.

**Monetization:** F2P + Supporter Pack ($15-20). Supporters progress faster, not further. No pay-to-win.

---

## Three Core Pillars

1. **Quirky Heroes** - Randomly generated with traits affecting gameplay and stories
2. **Player-Built Dungeons** - Capture monsters, collect schematics, optimize farming
3. **Emergent Stories** - Expedition logs with trait-flavored reactions

---

## Documentation

**Active Design:**
- `design/GAME_DESIGN_V2.md` - Complete game design (START HERE)
- `design/content/` - Content catalogs (monsters, equipment, zones, traits)
- `design/TONE_AND_WRITING.md` - Writing style guide

**Implementation:**
- `TASKS.md` - Current task tracking (SOURCE OF TRUTH for progress)
- `docs/plans/IMPLEMENTATION_PLAN.md` - Master implementation plan
- `docs/plans/BEST_PRACTICES_REVIEW.md` - Nuxt 4 best practices
- `docs/tech-stack-recommendation.md` - Tech stack architecture

**Reference:**
- `docs/user-stories/` - Feature requirements (187+ stories)
- `docs/api-breakdown/` - API specification (140+ endpoints)
- `docs/ui-breakdown/` - UI components and pages

**Archived:**
- `design/_archive/` - Legacy design docs (superseded by V2)
- `docs/plans/_archive/` - Superseded plan versions

---

## Key Systems (Summary)

**Heroes:**
- Random generation with traits (flat bonuses, conditional, tags)
- Rarity affects trait count (Common 1-2 → Legendary 3-4)
- Prestige at max level (per-hero, soft reset)

**Expeditions:**
- Active: Zones (15min-2hr), Story Missions (30min-1hr), Dungeons (2-6hr)
- Passive: Station heroes in zones for idle income
- No failure states - efficiency 60-150% based on power

**Dungeon Building:**
- Capture monsters → collect schematics → build dungeons
- Three optimization layers: slot matching → monster power → synergies
- Monster loot tables enable targeted farming

**Scaling:**
- Power scaling (levels, gear)
- Rarity tiers (Common → Mythic versions)
- Per-hero prestige (reset level, keep monsters/schematics)

---

## Development Phases

1. **Phase 1:** MVP core loop (heroes, zones, equipment, logs) - **98% complete**
2. **Phase 2:** Dungeon building (monsters, schematics, passive assignments)
3. **Phase 3:** Depth (synergies, prestige, procedural events, sets)
4. **Phase 4:** Content & AI (generated events, more content)
5. **Phase 5:** Social (alliances, raids, leaderboards) - post-launch

---

## Current Implementation Status

**What's Built (Phase 1):**
- ✅ Hero system (generation, traits, leveling, prestige, retire)
- ✅ Tavern (recruitment, refresh, lock/unlock)
- ✅ Expeditions (start, cancel, complete, choice events)
- ✅ Equipment (equip, upgrade, inventory)
- ✅ Auth (login, register, Supabase integration)
- ✅ Unit tests (151 passing)
- ✅ 80+ Vue components, 21 API routes

**Remaining (Phase 1):**
- ❌ E2E tests (Playwright not set up)
- ❌ JSDoc documentation for complex components

**Not Started:**
- Phase 2: Dungeon building system
- Phase 3+: Advanced features

See `TASKS.md` for detailed task tracking.

---

## Tech Stack

**Current Setup:** ✅
- **Frontend:** Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS + Pinia
- **Testing:** Vitest

**Recommended Additions:**
- **Backend:** Nuxt Server Routes (MVP) → Supabase (Production)
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **Real-time:** Server-Sent Events (MVP) → Supabase Realtime (Production)
- **Payments:** Stripe
- **Hosting:** Vercel (Frontend) + Supabase (Database/Auth)
- **E2E Testing:** Playwright

**Why This Stack:**
- ✅ Matches current setup (Nuxt 4, Vue 3, Pinia, Tailwind)
- ✅ Rapid development for solo dev
- ✅ Cost-effective (free tiers sufficient for MVP)
- ✅ Scales to production without major rewrites
- ✅ Supports all game requirements (timers, offline progress, real-time)

**Full Details:** See [docs/tech-stack-recommendation.md](docs/tech-stack-recommendation.md)

---

## Implementation Notes (Nuxt 4)

### Directory Structure

```
app/                    # Client-side (srcDir)
├── components/         # Auto-imported Vue components
├── composables/        # Auto-imported Vue composables (use*)
├── stores/             # Pinia stores (use*Store)
├── utils/              # Auto-imported utility functions
├── pages/              # File-based routing
├── layouts/            # Page layouts
└── app.vue             # Root component
server/                 # Server-side (at root)
├── api/                # API routes (/api/*)
├── routes/             # Non-API routes
└── utils/              # Server utilities (auto-imported in server/)
types/                  # Shared TypeScript types (at root)
shared/                 # Shared client+server code
├── utils/              # Auto-imported everywhere
└── types/              # Auto-imported everywhere
```

### Auto-Imports (No `import` needed)

| Directory | What's Auto-Imported |
|-----------|---------------------|
| `app/components/` | Vue components (in templates) |
| `app/composables/` | Composables (`.vue`, `.ts`, `.js`) |
| `app/utils/` | Utility functions (`.vue`, `.ts`, `.js`) |
| `server/utils/` | Server utilities (in `server/` only) |
| `shared/utils/` | Shared utilities (everywhere) |

**Note:** Only top-level files are scanned. Nested files must be re-exported from `index.ts`.

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Composables | `use*` prefix | `useHero.ts` → `useHero()` |
| Stores | `use*Store` | `useHeroStore` in `stores/heroes.ts` |
| Components | PascalCase, path-based | `hero/Card.vue` → `<HeroCard />` |
| Server routes | `[method].ts` suffix | `index.get.ts`, `[id].patch.ts` |

### Key Rules

1. **Pinia Stores:** Use `$fetch` in actions (NOT `useFetch`)
   ```typescript
   const heroes = await $fetch<Hero[]>('/api/heroes')
   ```

2. **Type Imports:** Use `~~/types` for root-level types
   ```typescript
   import type { Hero } from '~~/types'
   ```

3. **Composable Context:** Call Nuxt composables INSIDE functions
   ```typescript
   // ✅ Correct
   export const useMyThing = () => {
     const config = useRuntimeConfig()
   }
   ```

4. **Store Destructuring:** Use `storeToRefs()` for state
   ```typescript
   const store = useHeroStore()
   const { heroes } = storeToRefs(store)  // Reactive
   const { fetchHeroes } = store          // Actions ok to destructure
   ```

**Full Reference:** See [docs/plans/BEST_PRACTICES_REVIEW.md](docs/plans/BEST_PRACTICES_REVIEW.md)

---

## What's NOT in This Game

- Energy systems
- Gacha mechanics
- Pay-to-win
- VIP tiers
- FOMO mechanics
- Corporate satire tone (removed in v2)
- Personality dimensions (cut - traits are enough)
- Morale/happiness system (cut - overcomplicated)

---

## Open Questions

See `design/GAME_DESIGN_V2.md` section "Open Questions" for implementation details to resolve.

---

**For full design details, read:** [design/GAME_DESIGN_V2.md](design/GAME_DESIGN_V2.md)
