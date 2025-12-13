# Phase 1 (MVP) — TDD Development Plan (Nuxt/Vue)

**Source of scope:** `design/GAME_DESIGN_V2.md`

## Phase 1 scope (explicit)
- Hero generation (rarity, traits, recruitment)
- Basic expeditions (**zones only**)
- Equipment system (drops, 6 slots, gear score)
- Simple progression (leveling, basic scaling)
- Expedition logs with trait reactions
- Core UI (hero roster, expedition select, inventory)

**Out of scope (Phase 2+):** monster capture, schematics, dungeon building, passive assignments, story missions, set bonuses, prestige, procedural events, premium currency/supporter pack, AI text, social.

---

## Tech baseline (Phase 1 recommendation)
- **App**: Nuxt 3 + Vue 3 + TypeScript
- **State**: Pinia
- **UI**: Tailwind CSS (+ optional Nuxt UI)
- **Validation**: Zod (save schema + payload validation)
- **Tests**: Vitest (unit), Playwright (smoke E2E)
- **Persistence**: Local-first save (IndexedDB preferred) + export/import JSON

---

## TDD conventions (non-negotiables)
### Domain-first architecture
- **Domain layer is pure**: no Vue/Nuxt imports, no direct `Date.now()`, no unseeded randomness.
- **App/UI layer is impure**: rendering, timers, persistence I/O, user interaction.

### Determinism
- Inject `clock.now()` and `rng` into domain functions.
- Expeditions store `seed` so outcomes/logs are reproducible.

### Testing strategy
- Every behavior starts as a failing unit test in `tests/domain/*`.
- Implement minimal code to pass tests.
- Refactor safely under test coverage.
- Keep E2E tests few (1–2) and stable.

---

## Definition of Done (Phase 1)
A player can:
- Recruit heroes of different rarities/traits
- Equip gear from drops; see gear score/power improve
- Start a zone expedition with 2–4 heroes; wait/return later; collect rewards
- See XP/gold/items applied, and a readable expedition log referencing traits
- Refresh/close tab and retain state (local save)

---

## Epic 0 — Project foundation (TDD harness)
### Tests (write first)
- `vitest` runs (sanity test)
- App shell renders (Playwright smoke)

### Implementation
- Nuxt 3 + TS + Pinia + Tailwind
- Vitest config
- Playwright config
- ESLint/Prettier + strict TS

### Acceptance
- `pnpm test` and `pnpm test:e2e` green.

---

## Epic 1 — Save system (local-first) + versioning
### Tests
- Save roundtrip: serialize → deserialize produces identical state
- Zod schema rejects invalid save with clear errors
- Migration hook exists (even if only V0→V1 placeholder)

### Implementation
- `SaveGameV1` types + Zod schema
- `saveRepository` (IndexedDB/localStorage adapter)
- Export save JSON / Import save JSON

### Acceptance
- Refresh restores exact progress; export/import restores exact progress.

---

## Epic 2 — Content catalogs (static definitions)
### Tests
- All ids unique (traits/zones/items)
- No dangling references (e.g., zone tags referenced by traits exist)
- Basic sanity checks (durations > 0, requirement monotonic)

### Implementation
- `content/traits`, `content/zones`, `content/items` (exact paths TBD)
- Content validator used in tests (and optionally dev runtime)

### Acceptance
- Invalid content breaks tests immediately.

---

## Epic 3 — Heroes + recruitment
### Tests
- Rarity → trait count follows spec ranges
- Hero ids unique
- Generated traits are valid ids
- Recruitment costs gold; prevented when insufficient

### Implementation
- `generateHero({ rng, content })`
- `recruitHero(state, ...)` reducer
- Minimal name generator (curated lists ok)

### Acceptance
- Player can recruit heroes; roster persists.

---

## Epic 4 — Equipment + inventory + gear score
### Tests
- Item generation deterministic for a given seed
- Gear score monotonic with item level/rarity
- Equip rules enforced (slot match)
- Swap behavior returns previous item to inventory

### Implementation
- `generateItem({ rng, zone, rarity })`
- `equipItem(state, heroId, itemId, slot)`
- Inventory reducers (add/remove)

### Acceptance
- Gear drops appear; equipping updates hero power/gear score.

---

## Epic 5 — Power + efficiency model (zones-only)
### Tests
- Hero power includes: level + gear + flat trait bonuses
- Conditional traits apply only when zone tags match
- Efficiency always clamped to **60–150%**
- Team power = sum effective powers

### Implementation
- `calcHeroPower(hero, items, zone)`
- `calcTeamPower(party, ...)`
- `calcEfficiency(teamPower, zoneRequirement)`

### Acceptance
- Expedition preview can show team power + expected efficiency.

---

## Epic 6 — Expeditions (start → resolve → rewards)
### Tests
- Start expedition validates party size (2–4) and hero availability
- Resolve only after `endsAt`
- Rewards scale with efficiency
- Catch-up: on load after `endsAt`, expedition resolves
- No failure states: every expedition produces rewards

### Implementation
- `startExpedition(state, zoneId, partyIds, now, seed)`
- `resolveExpedition(state, expeditionId, now)` (pure)
- App timer loop (resolve completed, persist)

### Acceptance
- End-to-end loop works reliably across refresh/idle time.

---

## Epic 7 — Expedition logs + trait reactions (template-based)
### Tests
- Every resolved expedition creates a log
- Log contains: zone intro + encounter + rewards summary
- Includes ≥1 trait-based reaction when applicable
- Deterministic output for same seed + inputs

### Implementation
- `generateLog({ seed, zone, party, rewards, traits })`
- Log storage + UI viewer

### Acceptance
- Logs are readable, fun, and consistently reference traits.

---

## Epic 8 — UI integration + MVP polish
### Tests (E2E smoke)
- Recruit → start expedition → resolve via dev helper → see rewards + log

### Implementation
- Routing + empty/loading states
- Minimal onboarding checklist
- Dev-only “fast-forward time” helper for testing

### Acceptance
- A new player completes the loop in ~5–10 minutes and understands progression.
