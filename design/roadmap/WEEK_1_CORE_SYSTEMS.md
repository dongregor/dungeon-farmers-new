# Week 1-2: Core Systems (Heroes + Basic UI)

**Goal**: Establish the foundation with hero generation and basic UI
**Focus**: Get something visible on screen that demonstrates core hero mechanics

---

## Week 1: Hero Generation & Recruitment

### Day 1-2: Project Setup & Basic Architecture
- [ ] Initialize Nuxt 3 + Vue 3 + TypeScript project
- [ ] Set up basic folder structure (`/domain`, `/app`, `/content`)
- [ ] Create minimal Pinia store for game state
- [ ] Implement basic Tailwind setup (minimal styling)
- [ ] Create dev environment with hot reloading

### Day 3-4: Hero Data Model
- [ ] Define `Hero` interface with core properties:
  - `id: string`
  - `name: string`
  - `rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"`
  - `level: number`
  - `xp: number`
  - `traits: string[]`
  - `power: number` (calculated)
- [ ] Create `generateHero()` function with basic logic
- [ ] Implement trait system with 5-10 placeholder traits
- [ ] Write unit tests for hero generation

### Day 5-6: Hero Recruitment System
- [ ] Create recruitment UI component
- [ ] Implement gold currency system
- [ ] Add recruitment cost logic by rarity
- [ ] Create hero roster display
- [ ] Add basic hero details panel

### Day 7: Basic State Management
- [ ] Implement hero addition/removal from state
- [ ] Create hero selection logic
- [ ] Add basic error handling
- [ ] Test recruitment flow end-to-end

---

## Week 2: UI Foundation & Dev Tools

### Day 8-9: UI Framework
- [ ] Create main layout with navigation
- [ ] Implement hero roster view
- [ ] Add hero detail modal
- [ ] Create recruitment interface
- [ ] Add basic responsive design

### Day 10-11: Dev Tools & Cheats
- [ ] Create dev mode toggle
- [ ] Implement "add gold" cheat
- [ ] Add "instant recruit" button
- [ ] Create hero editor for testing
- [ ] Add state export/import functionality

### Day 12-13: Hero Management Features
- [ ] Implement hero dismissal (remove from roster)
- [ ] Add hero filtering by rarity/traits
- [ ] Create hero sorting options
- [ ] Implement basic hero power calculation
- [ ] Add visual indicators for hero stats

### Day 14: Testing & Polish
- [ ] Write unit tests for core functions
- [ ] Test recruitment flow thoroughly
- [ ] Fix any UI bugs
- [ ] Add basic animations/transitions
- [ ] Prepare for Week 3 expedition system

---

## Success Criteria

**Minimum Viable (Must Have)**:
- [ ] Can recruit heroes of different rarities
- [ ] Heroes have traits that affect display
- [ ] Basic UI shows hero roster and details
- [ ] Dev tools allow rapid testing

**Stretch Goals (Nice to Have)**:
- [ ] Hero power calculation with traits
- [ ] Basic animations
- [ ] Mobile-responsive layout
- [ ] Hero comparison feature

**Blockers to Watch For**:
- Vue/Nuxt setup issues
- State management complexity
- UI component integration
- Time spent on perfecting visuals

---

## Key Decisions to Make

1. **Hero ID Generation**: UUID vs incremental vs name-based
2. **Trait Implementation**: String IDs vs objects vs enums
3. **State Structure**: Single store vs modular stores
4. **UI Framework**: Tailwind classes vs component library
5. **Dev Tools Scope**: How much to build vs manual testing

---

## Resources Needed

- Hero name lists (can start with placeholder data)
- Basic trait definitions
- Simple UI components (buttons, cards, modals)
- Testing utilities setup

---

## Next Week Preview

Week 3-4 will focus on the expedition system - the core gameplay loop where heroes go on adventures and return with rewards.