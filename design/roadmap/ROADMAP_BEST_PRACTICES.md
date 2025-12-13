# Roadmap Best Practices (Nuxt 3 / Vue 3 / TS)

**Scope:** Applies to `design/roadmap/*` (Phase 1 MVP: heroes → expeditions → equipment → persistence).

This is a practical, “do-this-now” set of conventions that aligns your roadmap with current best practices from Nuxt/Vue/Pinia/Tailwind/Vitest/Playwright/Zod docs.

---

## 1) Architecture practices that de-risk Weeks 1–8

### Keep the roadmap’s “domain-first” rule, but adapt it to Nuxt
- **Domain layer is pure**: no Vue/Nuxt imports, no storage, no timers, no `Date.now()`, no unseeded randomness. (Matches your `design/PHASE_1_TDD_PLAN.md`.)
- **Nuxt/Vue layer is impure**: rendering, persistence I/O, real clock, user interaction, routing.

### Avoid naming collisions with Nuxt’s `app/` directory
Your Week 1 note suggests a custom folder structure like `/domain`, `/app`, `/content`.

- **Best practice (Nuxt-specific)**: avoid using a custom top-level `app/` folder name for “UI layer” because Nuxt’s `app/` directory has special meaning (entry files like `app.vue`, `app.config.ts`).
- **Recommended**: keep `domain/` and `content/` as you planned, but rename the UI layer folder to something like `features/`, `ui/`, or `modules/`.

### Prefer static catalogs + validation early
You already call out catalogs and validation in the TDD plan.
- Put **traits/zones/items** in `content/` as data-first definitions.
- Add a **catalog validation test** that runs in CI/dev (duplicate IDs, dangling refs, invalid durations).

### State boundaries: store *game state*, keep domain logic *stateless*
- Use Pinia stores for state, but keep most gameplay rules as pure functions.
- Treat store actions as coordinators that call domain functions and persist.

---

## 2) Nuxt 3 best practices that matter for this roadmap

### Runtime config and “server-only” secrets
If/when you add server routes (even in MVP), use runtime config instead of hardcoding tokens.
- Nuxt shows accessing config in server handlers via `useRuntimeConfig(event)` and using `$fetch` with headers.

### Prefer Nuxt composables for app concerns; keep them out of domain
- Nuxt composables like `useFetch`, `useAsyncData`, `useRuntimeConfig`, `useState` are for app integration. Keep them out of `domain/`.

### API route structuring
- Nuxt supports namespacing API routes with `server/api/**/index.[method].ts` patterns.

(From Nuxt docs examples: runtime config access in server routes; composables list; API namespacing.)

---

## 3) Vue 3 best practices that matter for this roadmap

### Composition API + composables for reuse
- Prefer Composition API patterns and composables for shared UI logic.
- Vue docs highlight using `ref()` / `reactive()` for reactive state and using composables for clean logic reuse.

### Centralize mutations into intention-revealing actions
Vue’s state-management guidance notes that **state-mutating logic should be centralized** and named by intent.

---

## 4) Pinia best practices for “game state”

### Prefer setup stores, but respect SSR rules
- Setup stores are flexible (watchers/composables), but composables in stores get more complex with SSR.

### Do not create “private” store state
Pinia warns:
- In setup stores, you **must return all state properties** for Pinia to track them; not returning them or making them readonly can break SSR/devtools/plugins.

### Don’t destructure stores directly
Pinia notes the store is wrapped with `reactive`, and destructuring breaks reactivity. Use `storeToRefs()` when you need refs.

---

## 5) Tailwind CSS best practices for the UI weeks

### Build a small design system instead of “magic numbers”
Tailwind’s docs emphasize utilities as constraints from a predefined theme (consistency, states, responsive variants).

### Don’t over-abstract too early
Tailwind explicitly calls out that sometimes the best solution is **editing duplicated class lists with multi-cursor**, rather than inventing abstractions prematurely.

---

## 6) Testing best practices (maps directly to your TDD plan)

### Unit tests: Vitest timers + time-dependent systems
Your expeditions and autosave are time-based.
- Use Vitest fake timers when testing timer/Date behavior: `vi.useFakeTimers()` wraps timers and `Date` until `vi.useRealTimers()`.
- Use `vi.setSystemTime()` to control “now”.
- Vitest docs stress clearing/restoring mocks between tests for isolation.

### E2E smoke: Playwright locators + stable test contracts
Keep E2E tests few (your plan says 1–2) and stable:
- Playwright docs recommend using **locators** (auto-waiting, retryability).
- Avoid CSS/XPath for resilience; prefer user-facing locators (role/text) or define explicit contracts with **test ids** (`getByTestId`).

### Validation: Zod safe parsing for saves/import
- Zod docs recommend `safeParse()` to avoid exceptions and return a discriminated union (`success` + `data` or `error`).
- Use `z.preprocess()` for “coerce then validate” cases (e.g., numbers from JSON/import).

---

## 7) Apply these practices to your weekly roadmap

### Week 1–2 (Heroes + UI + Dev Tools)
- **Foldering**: keep `domain/` (pure), `content/` (catalogs), and put UI/features in `features/` (not `app/`).
- **Hero generation**: inject `rng` and `clock` into `generateHero()` (you already require this in the TDD plan).
- **Pinia stores**: keep stores thin; actions call domain reducers.
- **UI**: start with Tailwind utilities; avoid early component-library adoption unless it accelerates.
- **Dev tools**: keep dev-only controls behind a single “dev mode” flag so they can be stripped/hidden.

### Week 3–4 (Expeditions)
- **Time model**: store timestamps/durations as primitives in domain state (e.g., epoch ms) and format in UI.
- **Determinism**: keep `seed` on expeditions (your roadmap already includes this) and resolve rewards/logs from `(seed + inputs)`.
- **Tests**: use Vitest fake timers / system time to test “resolve only after endsAt”.
- **E2E**: add stable test ids to core buttons (Recruit, Start Expedition, Collect) so Playwright smoke tests don’t flake.

### Week 5–6 (Equipment)
- **Item IDs**: treat item identity as stable (don’t recompute from stats). Prefer deterministic generation when using a seed.
- **Equip swap**: make equip/unequip reducers pure and heavily unit tested (slot validation, inventory full, swap returns item).
- **UI performance**: for inventory grids, prefer simple lists early; optimize later if needed.

### Week 7–8 (Persistence + Polish)
- **Zod schemas**: versioned save schema + `safeParse()` on load/import; surface readable errors.
- **Migrations**: keep a migration pipeline even if only `v0 → v1` placeholder at first.
- **Autosave**: debounce/throttle writes; test with controlled clocks.
- **Corruption recovery**: keep last-known-good backup (roadmap mentions backup/restore—good).

---

## 8) Source notes (what this doc is based on)

- **Nuxt 3 docs (Context7)**: runtime config in server routes (`useRuntimeConfig(event)`), API route namespacing patterns, composables list (e.g., `useFetch`, `useAsyncData`, `useState`).
- **Vue 3 docs (Context7)**: Composition API overview, simple state management recommendations, composables as reuse mechanism.
- **Pinia docs (Context7)**: setup store caveats (must return all state), SSR considerations, don’t destructure stores.
- **Tailwind docs (Context7)**: utilities as constraints and a recommendation to avoid premature abstraction.
- **Vitest docs (Context7)**: fake timers (`vi.useFakeTimers`, `vi.setSystemTime`) and best practice to reset/restore mocks.
- **Playwright docs (Context7)**: prefer locators and user-facing/test-id selectors; avoid brittle CSS/XPath selectors.
- **Zod docs (Context7)**: `safeParse()` for non-throwing validation; `z.preprocess()` and `refine()` patterns.
