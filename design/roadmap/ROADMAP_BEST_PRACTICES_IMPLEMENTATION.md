# Roadmap Best Practices Implementation

**Purpose**: Apply Nuxt/Vue/Pinia/Tailwind best practices to the Phase 1 roadmap
**Source**: Based on `ROADMAP_BEST_PRACTICES.md` and existing roadmap files

---

## Architecture Adjustments

### Folder Structure (Updated)
```
design/roadmap/
├── WEEK_1_CORE_SYSTEMS.md
├── WEEK_3_EXPEDITIONS.md
├── WEEK_5_EQUIPMENT.md
├── WEEK_7_PERSISTENCE.md
├── ROADMAP_SUMMARY.md
└── ROADMAP_BEST_PRACTICES_IMPLEMENTATION.md

src/
├── domain/          # Pure domain logic (no Vue/Nuxt imports)
├── features/        # UI components and feature modules (replaces app/)
├── content/         # Static catalogs (traits, zones, items)
├── stores/          # Pinia stores (game state)
├── composables/     # Vue composables (reusable UI logic)
├── server/          # API routes (future expansion)
└── utils/           # Shared utilities
```

**Key Changes**:
- Renamed `app/` to `features/` to avoid Nuxt naming collision
- Added explicit `stores/` directory for Pinia
- Added `composables/` for Vue composition functions

---

## Week 1-2: Core Systems (Updated Implementation)

### Domain Layer (Pure Functions)
```typescript
// src/domain/heroes.ts
export interface Hero {
  id: string;
  name: string;
  rarity: Rarity;
  level: number;
  xp: number;
  traits: string[];
}

export function generateHero(options: {
  rng: () => number;
  clock: { now: () => number };
  content: ContentCatalog;
}): Hero {
  // Pure function - no side effects, no Date.now(), uses injected rng/clock
}
```

### Content Catalogs with Validation
```typescript
// src/content/traits.ts
export const TRAITS = {
  "brawny": { id: "brawny", name: "Brawny", effect: "+10% ATK" },
  "pyromaniac": { id: "pyromaniac", name: "Pyromaniac", effect: "+25% in fire zones" }
} as const;

// src/content/validation.ts
export function validateTraits() {
  // Check for duplicate IDs, validate effects, etc.
}
```

### Pinia Store (Thin Coordinator)
```typescript
// src/stores/heroes.ts
export const useHeroStore = defineStore('heroes', () => {
  const heroes = ref<Hero[]>([]);
  const gold = ref<number>(1000);
  
  function recruitHero(rarity: Rarity) {
    // Call domain function, update state
    const newHero = generateHero({ rng, clock, content });
    heroes.value.push(newHero);
    gold.value -= getRecruitmentCost(rarity);
  }
  
  return { heroes, gold, recruitHero };
});
```

### Vue Composables
```typescript
// src/composables/useHeroRecruitment.ts
export function useHeroRecruitment() {
  const heroStore = useHeroStore();
  const { recruitHero } = storeToRefs(heroStore);
  
  const canRecruit = computed(() => heroStore.gold >= MIN_RECRUIT_COST);
  
  return { recruitHero, canRecruit };
}
```

### Tailwind Implementation
```vue
<!-- src/features/heroes/HeroRoster.vue -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    <HeroCard 
      v-for="hero in heroes" 
      :key="hero.id" 
      :hero="hero" 
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
    />
  </div>
</template>
```

### Dev Tools Implementation
```vue
<!-- src/features/dev/DevPanel.vue -->
<template>
  <div v-if="devMode" class="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded">
    <button @click="addGold(1000)" class="btn btn-primary">Add 1000 Gold</button>
    <button @click="recruitRandomHero()" class="btn btn-secondary">Recruit Hero</button>
  </div>
</template>
```

---

## Week 3-4: Expeditions (Updated Implementation)

### Time Management with Vitest
```typescript
// src/domain/expeditions.ts
export function startExpedition(options: {
  party: string[];
  zoneId: string;
  now: number;  // Injected clock
  seed: number; // For determinism
}): Expedition {
  return {
    id: generateId(),
    party,
    zoneId,
    startedAt: options.now,
    duration: getZoneDuration(zoneId),
    endsAt: options.now + getZoneDuration(zoneId) * 1000,
    seed: options.seed,
    status: 'pending'
  };
}
```

### Expedition Resolution with Fake Timers
```typescript
// Test example using Vitest fake timers
import { describe, it, expect, vi } from 'vitest';

describe('expedition resolution', () => {
  it('should not resolve before endsAt', () => {
    vi.useFakeTimers();
    
    const now = Date.now();
    const expedition = startExpedition({ 
      party: ['hero1'], 
      zoneId: 'forest', 
      now, 
      seed: 123 
    });
    
    // Fast-forward time
    vi.setSystemTime(now + expedition.duration - 1000);
    expect(canResolve(expedition, Date.now())).toBe(false);
    
    // Complete expedition
    vi.setSystemTime(now + expedition.duration);
    expect(canResolve(expedition, Date.now())).toBe(true);
    
    vi.useRealTimers();
  });
});
```

### E2E Test IDs
```vue
<!-- Add test IDs to critical buttons -->
<button 
  data-testid="start-expedition-button"
  @click="startExpedition"
  :disabled="!canStart"
  class="btn btn-primary"
>
  Start Expedition
</button>
```

---

## Week 5-6: Equipment (Updated Implementation)

### Item Generation with Deterministic IDs
```typescript
// src/domain/items.ts
export function generateItem(options: {
  zoneId: string;
  rarity: Rarity;
  level: number;
  seed: number;
  rng: () => number;
}): Item {
  // Use seed + inputs for deterministic ID generation
  const id = `item-${options.zoneId}-${options.seed}-${options.rarity}`;
  
  return {
    id,
    name: getItemName(options),
    slot: getRandomSlot(options.rng),
    rarity: options.rarity,
    level: options.level,
    stats: generateStats(options)
  };
}
```

### Equipment Slots with Validation
```typescript
// src/domain/equipment.ts
export function equipItem(state: GameState, heroId: string, itemId: string, slot: EquipmentSlot) {
  // Validate slot match
  const item = state.inventory.find(i => i.id === itemId);
  if (item?.slot !== slot) {
    throw new Error(`Item slot mismatch: ${item?.slot} !== ${slot}`);
  }
  
  // Pure function - returns new state
  return produce(state, draft => {
    // Unequip current item if exists
    const currentItem = draft.heroes[heroId].equipment[slot];
    if (currentItem) {
      draft.inventory.push(currentItem);
    }
    
    // Equip new item
    draft.heroes[heroId].equipment[slot] = item;
    draft.inventory = draft.inventory.filter(i => i.id !== itemId);
  });
}
```

---

## Week 7-8: Persistence (Updated Implementation)

### Zod Schema with Safe Parsing
```typescript
// src/stores/save.ts
import { z } from 'zod';

const SaveGameV1 = z.object({
  version: z.literal('v1'),
  heroes: z.array(HeroSchema),
  inventory: z.array(ItemSchema),
  expeditions: z.array(ExpeditionSchema),
  gold: z.number().int().nonnegative(),
  settings: GameSettingsSchema
});

export function loadGame(saveData: string): SaveGame | null {
  try {
    const parsed = JSON.parse(saveData);
    const result = SaveGameV1.safeParse(parsed);
    
    if (!result.success) {
      console.error('Save validation failed:', result.error);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Save load failed:', error);
    return null;
  }
}
```

### Auto-save with Debouncing
```typescript
// src/stores/save.ts
export const useSaveStore = defineStore('save', () => {
  const autoSaveEnabled = ref(true);
  const lastSaveTime = ref<number | null>(null);
  
  // Debounced auto-save
  const debouncedSave = debounce(() => {
    if (autoSaveEnabled.value) {
      const gameState = extractGameState();
      localStorage.setItem('dungeonFarmersSave', JSON.stringify(gameState));
      lastSaveTime.value = Date.now();
    }
  }, 1000);
  
  // Watch for state changes
  watch(
    () => useHeroStore().heroes,
    debouncedSave,
    { deep: true }
  );
  
  return { autoSaveEnabled, lastSaveTime };
});
```

### Migration System
```typescript
// src/stores/migrations.ts
export function migrateSave(saveData: any): SaveGame {
  // Check version and apply migrations
  if (!saveData.version || saveData.version === 'v0') {
    return migrateV0toV1(saveData);
  }
  
  return saveData;
}

function migrateV0toV1(v0Data: any): SaveGame {
  // Convert old format to new format
  return {
    version: 'v1',
    heroes: v0Data.heroes || [],
    inventory: v0Data.items || [],
    expeditions: v0Data.expeditions || [],
    gold: v0Data.gold || 0,
    settings: {}
  };
}
```

---

## Best Practices Checklist

### Architecture
- [ ] Domain layer is pure (no Vue/Nuxt imports)
- [ ] UI layer uses `features/` instead of `app/`
- [ ] Content catalogs are validated
- [ ] Pinia stores are thin coordinators

### Testing
- [ ] Vitest fake timers for time-dependent logic
- [ ] Playwright test IDs for E2E stability
- [ ] Zod safe parsing for save validation
- [ ] Unit tests for critical domain functions

### Performance
- [ ] Debounced auto-save
- [ ] Efficient state updates with Immer
- [ ] Lazy loading for large inventories
- [ ] Memory management for expedition history

### Code Quality
- [ ] TypeScript interfaces for all data models
- [ ] Consistent naming conventions
- [ ] Error handling for critical operations
- [ ] Documentation for complex systems

---

## Implementation Recommendations

### 1. Start with Core Systems
Focus on Week 1-2 first - get the hero system working before adding complexity.

### 2. Build Dev Tools Early
Invest in dev tools during Week 1 - they'll save time throughout the project.

### 3. Test Critical Paths
Write unit tests for:
- Hero generation
- Expedition start/resolve
- Equipment equip/unequip
- Save/load functionality

### 4. Use Progressive Enhancement
Start with basic functionality, then add polish incrementally.

### 5. Monitor Performance
Watch for:
- State update performance
- Memory usage with many heroes/items
- Save/load speed
- UI rendering performance

---

## Resources

### Nuxt 3
- Runtime config: `useRuntimeConfig()`
- API routes: `server/api/` naming
- Composables: `useFetch`, `useAsyncData`

### Vue 3
- Composition API: `ref()`, `reactive()`, `computed()`
- Composables for logic reuse
- `storeToRefs()` for Pinia stores

### Pinia
- Setup stores with proper state return
- Actions as coordinators
- Avoid store destructuring

### Tailwind
- Utility-first approach
- Design system constraints
- Avoid premature abstraction

### Testing
- Vitest fake timers: `vi.useFakeTimers()`
- Playwright locators: `getByTestId()`
- Zod validation: `safeParse()`

This implementation guide applies the best practices to the existing roadmap while maintaining the original scope and timeline.