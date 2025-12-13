# Solo Dev + AI Strategy - Dungeon Farmers

**Last Updated**: 2025-11-04
**Purpose**: Practical guide for building Dungeon Farmers as a solo developer with AI assistance

---

## 🎯 Core Philosophy

**"AI writes code, human provides vision"**

As a solo developer, your competitive advantage is:
- ✅ **AI handles boilerplate** (80% of code volume)
- ✅ **You focus on game feel** (20% of effort, 80% of value)
- ✅ **Ship fast, iterate based on feedback**
- ✅ **Avoid perfectionism, embrace "good enough"**

**Realistic Timeline**: 4-6 months to MVP with 15-20 hours/week

---

## 🛠️ Optimal Tech Stack for Solo Dev + AI

### Frontend: Nuxt 3 + TypeScript + Tailwind CSS

**Why Nuxt 3:**
- Single codebase for frontend + backend (Nitro server routes)
- File-based routing (no manual route configuration)
- Auto-imports (components, composables, utilities)
- SSR + SPA hybrid (best of both worlds)
- Excellent TypeScript support
- AI knows Nuxt 3 patterns well

**Why TypeScript:**
- Catch bugs at compile time, not runtime
- AI generates better code with types
- Refactoring is safer
- Documentation is built-in (types = documentation)

**Why Tailwind CSS:**
- No context switching (write styles in components)
- AI can generate Tailwind markup instantly
- Design system consistency without effort
- Mobile-first by default

### Backend: Supabase (PostgreSQL + Auth + Real-time)

**Why Supabase:**
- Eliminates 80% of backend work (auth, database, real-time, storage)
- PostgreSQL (battle-tested, powerful)
- Row Level Security (security built-in)
- Real-time subscriptions (WebSocket handled)
- AI can generate Supabase queries easily

**What You Don't Build:**
- ❌ Authentication system (Supabase Auth)
- ❌ Database connection pooling (Supabase handles)
- ❌ WebSocket server (Supabase Realtime)
- ❌ File storage (Supabase Storage)

### ORM: Drizzle ORM

**Why Drizzle:**
- Type-safe queries (TypeScript end-to-end)
- Migrations from schema (no manual SQL)
- Lightweight (no bloat)
- AI can generate Drizzle schemas easily

### State Management: Pinia

**Why Pinia:**
- Vue 3 native (official recommendation)
- Simple API (easier than Vuex)
- TypeScript support
- DevTools integration

### Deployment: Vercel + Supabase

**Why Vercel:**
- Zero-config deployment (git push = deploy)
- Edge functions (fast globally)
- Preview deployments (test before production)
- Free tier generous (perfect for MVP)

**Cost Estimate (MVP):**
- Vercel: $0 (free tier)
- Supabase: $0 (free tier, 500MB database, 2GB file storage)
- Domain: $12/year
- **Total: ~$1/month during development**

---

## 📐 Development Philosophy

### 1. Vertical Slices Over Horizontal Layers

**WRONG (Horizontal):**
```
Month 1: Build entire hero system
Month 2: Build entire expedition system
Month 3: Build entire equipment system
Month 4: Integrate everything (nightmare)
```

**RIGHT (Vertical Slices):**
```
Week 1-2: Single hero → single zone → basic rewards (PLAYABLE)
Week 3-4: Add recruitment → multiple heroes (IMPROVED)
Week 5-6: Add equipment → power scaling (DEEPER)
Week 7-8: Add monster capture → dungeons (UNIQUE HOOK)
```

Each slice is **playable, testable, and shippable**. You always have a working game.

### 2. AI-First, Human-Guided Workflow

**AI Handles:**
- Boilerplate code (components, API routes, utilities)
- CRUD operations (create, read, update, delete)
- Type definitions (TypeScript interfaces)
- Test generation (unit tests, E2E tests)
- Content generation (JSON data for zones, monsters, equipment)
- Documentation (JSDoc comments, README sections)

**Human Handles:**
- Architecture decisions (how systems fit together)
- Game feel and balance (fun factor)
- UX polish (animations, feedback, delight)
- System integration (connecting the pieces)
- Final quality control (playtesting, refinement)

**Workflow Example:**
```
1. Human: "I need a hero recruitment system"
2. AI: Generates component boilerplate + API route + validation
3. Human: Reviews, tests, tweaks game feel (cost, animations)
4. AI: Generates tests for recruitment flow
5. Human: Runs tests, fixes edge cases, ships feature
```

### 3. JSON-Driven Content System

**Critical for Solo Dev**: Separate game logic from game content.

**Game Logic (Code):**
- Hero stat calculations
- Expedition efficiency formulas
- Equipment set bonus logic
- Monster capture mechanics

**Game Content (JSON):**
- 50+ zones with rewards
- 150+ monsters with stats
- 200+ equipment items
- 100+ hero traits
- 20+ dungeon schematics

**Example: zones.json**
```json
{
  "whispering_woods": {
    "id": "whispering_woods",
    "name": "Whispering Woods",
    "description": "A peaceful forest... or is it?",
    "level_requirement": 1,
    "recommended_power": 500,
    "duration_minutes": 15,
    "rewards": {
      "gold_base": 100,
      "xp_base": 50,
      "monster_pool": ["goblin_scout", "forest_spider", "wild_boar"],
      "schematic_drop_chance": 0.05
    },
    "unlock_conditions": {
      "tutorial_completed": true
    }
  }
}
```

**AI Prompt**: "Generate 50 zone definitions in JSON following this schema, with fantasy themes and progressive difficulty"

**Result**: AI generates entire content file in 30 seconds. Solo dev reviews, tweaks numbers, ships.

### 4. Testing Strategy for Solo Dev

**Don't Skip Testing** (it saves time long-term)

**Test Pyramid:**
```
        E2E Tests (5%)
       /           \
    Integration (15%)
   /                 \
  Unit Tests (80%)
```

**AI Generates Tests:**
```bash
# Unit tests (AI writes these instantly)
"Generate Vitest tests for hero stat calculation with edge cases"
"Write tests for expedition efficiency formula (60-150% range)"

# E2E tests (AI writes these with guidance)
"Create Playwright test for complete hero recruitment flow"
"Write E2E test for expedition start → timer → reward claim"
```

**Manual Testing (Human):**
- Game feel (is it fun?)
- Balance (is it too easy/hard?)
- UX flow (is it intuitive?)
- Visual polish (does it look good?)

---

## 🚀 Month-by-Month Roadmap

### Month 1: Project Setup + Hero System

**Week 1-2: Foundation**
- ✅ Set up Nuxt 3 project (AI generates boilerplate)
- ✅ Configure Supabase (auth, database schema)
- ✅ Create Drizzle schema for users, heroes, equipment
- ✅ Build authentication flow (login, register, logout)
- ✅ Deploy to Vercel (establish CI/CD pipeline)

**AI Prompts:**
```
"Create a Nuxt 3 project with TypeScript, Tailwind CSS, and Supabase integration"
"Generate Drizzle schema for users and heroes with proper relations"
"Create a Supabase Auth login/register flow using Nuxt composables"
"Set up Vercel deployment with environment variables"
```

**Week 3-4: Hero System Slice 1**
- ✅ Hero recruitment (spend gold, get random hero)
- ✅ Hero roster display (list heroes with stats)
- ✅ Hero detail page (view individual hero)
- ✅ Basic stat calculations (level scaling)

**AI Prompts:**
```
"Create a hero recruitment component that costs 100 gold and generates a random hero with traits"
"Build a hero roster page with filtering by archetype and sorting by level/power"
"Generate hero stat calculation utility using the formulas from HERO_SYSTEM.md"
"Write Vitest tests for hero creation and stat scaling"
```

**Deliverable**: You can recruit heroes, view your roster, see their stats. **PLAYABLE**.

---

### Month 2: Expedition System + Equipment

**Week 5-6: Expedition System Slice 1**
- ✅ Zone definitions (JSON data)
- ✅ Start expedition (assign heroes, start timer)
- ✅ Timer countdown (real-time or polling)
- ✅ Complete expedition (calculate rewards)

**AI Prompts:**
```
"Generate 15 zone definitions in JSON with progressive difficulty (level 1-15)"
"Create expedition start component with hero selection and validation"
"Build a countdown timer component that updates every second"
"Generate expedition efficiency calculation based on EXPEDITION_SYSTEM.md formula"
"Create expedition results modal showing gold, XP, and items earned"
```

**Week 7-8: Equipment System Slice 1**
- ✅ Equipment definitions (JSON data)
- ✅ Equipment inventory display
- ✅ Equip/unequip items on heroes
- ✅ Stat contribution calculation

**AI Prompts:**
```
"Generate 50 equipment items in JSON across 6 slots and 5 rarity tiers"
"Create equipment inventory component with rarity-based colors"
"Build equip/unequip flow with validation (correct slot, hero level requirements)"
"Generate equipment stat contribution calculation for power rating"
"Create set bonus detection utility (2/4/6-piece bonuses)"
```

**Deliverable**: You can send heroes on expeditions, earn equipment, equip items. **FUN LOOP ESTABLISHED**.

---

### Month 3: Monster Capture + Personal Dungeons (Phase 2)

**Week 9-10: Monster Capture System**
- ✅ Monster definitions (JSON data)
- ✅ Capture roll during expeditions (5-15% chance)
- ✅ Monster collection display
- ✅ Monster storage and management

**AI Prompts:**
```
"Generate 50 monster definitions in JSON with stats, families, and rarities"
"Add monster capture logic to expedition completion (5-15% base chance with modifiers)"
"Create monster collection page with filtering by family and rarity"
"Build captured monster detail view with stats and power level"
```

**Week 11-12: Personal Dungeon Building**
- ✅ Schematic definitions (JSON data)
- ✅ Dungeon builder UI (assign monsters to slots)
- ✅ Durability tracking (10-20 runs)
- ✅ Dungeon rewards calculation

**AI Prompts:**
```
"Generate 20 dungeon schematics in JSON with monster slot requirements"
"Create dungeon builder UI with drag-drop monster assignment to schematic slots"
"Build durability tracking system that decrements on each dungeon run"
"Generate dungeon reward calculation based on monster power and synergies"
"Create dungeon run component with timer and reward display"
```

**Deliverable**: You have the **UNIQUE HOOK** - capture monsters, build dungeons, farm resources. **CORE LOOP COMPLETE**.

---

### Month 4: Personality + Morale (Phase 2 continued)

**Week 13-14: Personality System**
- ✅ Personality generation (5 dimensions, 0-10 scale)
- ✅ Personality display in hero UI
- ✅ Personality conflicts/synergies detection
- ✅ Event probability modifiers

**AI Prompts:**
```
"Generate personality dimension scores (0-10) for heroes on recruitment"
"Create personality display component showing 5 axes with star ratings"
"Build personality conflict/synergy detection for party composition"
"Generate event probability modifiers based on personality scores"
```

**Week 15-16: Morale System**
- ✅ Morale tracking (0-100 scale)
- ✅ Morale state transitions (Burnout → Inspired)
- ✅ Morale gain/loss calculations
- ✅ Management actions (rest, motivational speech)

**AI Prompts:**
```
"Create morale tracking with state transitions based on thresholds (0-14, 15-34, etc.)"
"Generate morale change calculations with personality and activity modifiers"
"Build morale management UI with rest button and motivational speech action"
"Create morale warning notifications when heroes reach Stressed or Burnout states"
"Add morale stat modifiers to hero power calculation (-25% to +15%)"
```

**Deliverable**: Heroes have personality and morale, affecting performance and creating management gameplay. **DEPTH ADDED**.

---

### Month 5-6: Polish + Alliance System (Phase 3)

**Week 17-18: Emergent Story System**
- ✅ Event definitions (JSON data)
- ✅ Event probability engine
- ✅ Event outcome calculations
- ✅ Story log display (corporate framing)

**AI Prompts:**
```
"Generate 50 expedition event definitions in JSON with trait/personality triggers"
"Create event probability engine using formula from EMERGENT_STORY_SYSTEM.md"
"Build event outcome modal with corporate satire framing (HR reports)"
"Create story log page showing recent events with timestamps"
```

**Week 19-20: Alliance System Foundation**
- ✅ Alliance creation/joining
- ✅ Alliance roster and roles
- ✅ Alliance chat (text only)
- ✅ Shared bonuses (+5-15% gold, +3-10% XP)

**AI Prompts:**
```
"Create alliance creation and join flow with max 30 members"
"Build alliance roster page with member roles and contribution tracking"
"Add alliance chat component with real-time messages (Supabase Realtime)"
"Generate alliance bonus calculations that apply to all member activities"
```

**Week 21-22: Alliance Raids (MVP version)**
- ✅ Alliance raid definitions (JSON data)
- ✅ 3-5 player raid coordination
- ✅ Raid difficulty scaling (3p=100%, 5p=150%)
- ✅ Raid rewards (ascension materials, premium loot)

**AI Prompts:**
```
"Generate 10 alliance raid definitions with 3-5 player scaling"
"Create raid lobby component with player ready status"
"Build raid difficulty scaling calculation (3p=100%, 4p=120%, 5p=150%)"
"Generate raid reward distribution based on contribution and success"
```

**Week 23-24: UI/UX Polish + Beta Testing**
- ✅ Tutorial flow refinement
- ✅ Loading states and animations
- ✅ Mobile responsive polish
- ✅ Performance optimization
- ✅ Bug fixes from beta testing

**Deliverable**: **MVP READY FOR LAUNCH** - Core loop + unique features + social layer.

---

## 💡 AI Collaboration Best Practices

### Prompt Engineering for Game Development

**Bad Prompt:**
> "Create a hero system"

**Good Prompt:**
> "Create a Vue 3 component for hero recruitment that:
> - Costs 100 gold (validate user has enough)
> - Generates a random hero from 6 archetypes (Tank, Healer, DPS, etc.)
> - Assigns 3-5 random traits from a trait pool (weighted by rarity)
> - Saves hero to Supabase using Drizzle ORM
> - Shows success animation and updates hero roster
> - Uses Tailwind CSS for styling
> - Follows the data structure defined in types/hero.ts"

**Better Prompt (with context):**
> "I'm building an idle RPG using Nuxt 3 + Supabase. I need a hero recruitment component.
>
> Reference files:
> - types/hero.ts (hero data structure)
> - data/traits.json (available traits)
> - composables/useGold.ts (gold management)
>
> Requirements:
> - Cost: 100 gold (validate and deduct)
> - Generate random hero (archetype, traits, base stats)
> - Save to Supabase via Drizzle
> - Show result modal with hero details
> - Corporate satire tone ('Employee Recruitment Portal')
>
> Follow existing component patterns from EquipmentShop.vue"

### Effective AI Workflows

**1. Iterative Development**
```
Step 1: "Create basic hero recruitment with just archetype selection"
        → AI generates minimal version
        → Test, verify it works

Step 2: "Add random trait generation to hero recruitment"
        → AI adds traits
        → Test, verify traits work

Step 3: "Add gold cost validation and deduction"
        → AI adds economy integration
        → Test, verify gold system works

Step 4: "Add success animation and result modal"
        → AI adds polish
        → Test, ship feature
```

**2. Reference Existing Code**
```
"Create a monster collection page similar to EquipmentInventory.vue but:
- Show monsters instead of equipment
- Filter by family instead of slot
- Display capture date instead of equip status"
```

AI reuses patterns you've already established = consistency.

**3. Provide Schemas/Types First**
```typescript
// types/hero.ts (you define this)
export interface Hero {
  id: string
  user_id: string
  archetype: Archetype
  traits: Trait[]
  personality: PersonalityScores
  morale: number
  level: number
  base_stats: BaseStats
  equipment: EquippedGear
}

// Now AI can generate ANYTHING that uses Hero type
"Create a hero detail page component" → AI knows exact structure
"Generate Drizzle schema for heroes" → AI knows exact fields
"Write tests for hero stat calculation" → AI knows exact inputs
```

**4. Test Generation Workflow**
```
1. You write feature code (with AI help)
2. AI generates comprehensive tests:
   "Write Vitest tests for this hero recruitment function with:
   - Happy path (successful recruitment)
   - Edge case (insufficient gold)
   - Edge case (max heroes reached)
   - Edge case (database error handling)"
3. Run tests, fix failures, ship
```

---

## ⚠️ Common Pitfalls for Solo Dev

### Pitfall 1: Perfect Code Syndrome

**WRONG:**
> "I need to refactor this hero stat calculation to be perfectly elegant before moving on"
> *Spends 3 days on 50 lines of code*

**RIGHT:**
> "This calculation works and has tests. Ship it. Refactor later if it becomes a problem."
> *Moves on to next feature*

**AI Help**: Ask AI "Is this code good enough for MVP?" - AI can validate fitness-for-purpose.

### Pitfall 2: Building Custom Everything

**WRONG:**
- Custom authentication system (2 weeks)
- Custom database layer (1 week)
- Custom state management (3 days)
- Custom deployment pipeline (2 days)

**RIGHT:**
- Supabase Auth (1 hour setup)
- Drizzle ORM (1 hour setup)
- Pinia (30 min setup)
- Vercel (git push = deploy)

**AI Help**: "Should I build this custom or use a library?" - AI recommends established solutions.

### Pitfall 3: Premature Optimization

**WRONG:**
> "I need to optimize these database queries before I have any users"
> *Adds caching, indexing, denormalization without data*

**RIGHT:**
> "Ship MVP, measure performance with real users, optimize bottlenecks with data"

**AI Help**: "When should I optimize this code?" - AI assesses optimization timing.

### Pitfall 4: Feature Creep

**WRONG:**
> "Before MVP launch, let's add guild housing, pet system, fishing minigame, and PvP arena"

**RIGHT:**
> "Ship Phase 1 MVP with core loop. Add features based on player feedback and data."

**AI Help**: "Is this feature essential for MVP?" - AI evaluates scope fitness.

### Pitfall 5: No Testing Until End

**WRONG:**
> "I'll build all features then test everything at once"
> *Disaster at integration time*

**RIGHT:**
> "Test each vertical slice as I build. Always have a working game."

**AI Help**: "Generate E2E test for this user flow" - AI writes tests quickly.

---

## 🎯 Success Metrics for Solo Dev

**Month 1 Goal**: Playable hero recruitment + basic progression
**Month 2 Goal**: Full expedition loop with equipment
**Month 3 Goal**: Monster capture + personal dungeon building (unique hook working)
**Month 4 Goal**: Personality + morale systems integrated
**Month 5-6 Goal**: Alliance system + story events + polish

**MVP Success** = All Phase 1 + Phase 2 features playable:
- ✅ Hero recruitment, leveling, equipment
- ✅ Expeditions with efficiency variance
- ✅ Monster capture + personal dungeon building
- ✅ Personality + morale management
- ✅ Emergent story events
- ✅ Basic alliance system

**Post-MVP** = Launch free demo, gather feedback, iterate based on data.

---

## 📚 Recommended AI Tools

**Primary AI (Code Generation):**
- **Claude** (you!) - Architecture, complex logic, system design
- **GitHub Copilot** - In-editor code completion
- **Cursor** - AI-powered code editor

**AI for Content:**
- **Claude** - Generate JSON data (zones, monsters, equipment, traits)
- **Midjourney/DALL-E** - Generate placeholder art (hero portraits, monster sprites)

**AI for Testing:**
- **Claude** - Generate test suites
- **GitHub Copilot** - Test case suggestions

**AI for Documentation:**
- **Claude** - Generate README, API docs, JSDoc comments

---

## 🚀 Final Advice for Solo Dev

**1. Ship Small, Ship Often**
- Deploy every Friday (even if it's broken)
- Get feedback early and often
- Don't wait for perfection

**2. Let AI Do the Boring Work**
- AI writes boilerplate → You focus on fun
- AI generates content → You balance gameplay
- AI creates tests → You polish UX

**3. Build for Fun First, Monetization Second**
- If it's not fun for you, it won't be fun for players
- Monetization is Phase 4, gameplay is Phase 1-3

**4. Track Your Time**
- Log hours spent on each feature
- Identify what takes longest
- Optimize your workflow with AI

**5. Avoid Burnout**
- 15-20 hours/week is sustainable
- Take breaks between sprints
- Celebrate shipped features

**6. Leverage the Community**
- Share progress on Twitter/Reddit
- Get feedback from players early
- Build in public (motivating + marketing)

---

**Remember**: With AI, you're not competing with AAA studios. You're competing with other indie devs. AI gives you a 2-3x productivity multiplier. Use it wisely, ship fast, iterate based on feedback.

**You can absolutely build Dungeon Farmers solo in 4-6 months. Let's do this.** 🚀
