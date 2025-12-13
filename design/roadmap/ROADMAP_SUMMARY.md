# Phase 1 (MVP) Development Roadmap

**Overview**: 8-week plan to build the Minimum Viable Product for Dungeon Farmers
**Goal**: Complete core gameplay loop with heroes, expeditions, equipment, and persistence

---

## Roadmap Structure

```
design/roadmap/
├── WEEK_1_CORE_SYSTEMS.md      # Hero generation & UI foundation
├── WEEK_3_EXPEDITIONS.md       # Expedition system & rewards
├── WEEK_5_EQUIPMENT.md         # Gear system & inventory
├── WEEK_7_PERSISTENCE.md       # Save/load & polish
└── ROADMAP_SUMMARY.md          # This file
```

---

## Weekly Breakdown

### Week 1-2: Core Systems (Heroes + Basic UI)
**Focus**: Hero generation, recruitment, and basic UI framework
**Key Deliverables**:
- Hero data model with traits and rarity
- Recruitment system with gold economy
- Basic hero roster UI
- Dev tools for rapid testing

**Success Criteria**: Can recruit heroes of different rarities and view them in roster

### Week 3-4: Expedition System
**Focus**: Core gameplay loop - sending heroes on adventures
**Key Deliverables**:
- Zone definitions and expedition logic
- Start/resolve expedition cycle
- Basic reward system (gold, XP, items)
- Expedition logs with trait reactions
- Dev tools for time manipulation

**Success Criteria**: Complete expedition loop works - send heroes, wait, get rewards

### Week 5-6: Equipment System
**Focus**: Gear progression and hero power enhancement
**Key Deliverables**:
- 6 equipment slots per hero
- Inventory management system
- Gear score calculation
- Item drops from expeditions
- Equip/unequip functionality

**Success Criteria**: Heroes can equip gear that affects their power and drops from expeditions

### Week 7-8: Persistence & Polish
**Focus**: Save/load functionality and demo preparation
**Key Deliverables**:
- Local storage save/load system
- Auto-save functionality
- Basic animations and transitions
- First-time user experience
- Playable demo build

**Success Criteria**: Game persists across sessions and is ready for user testing

---

## Development Philosophy

### 1. Vertical Slice Approach
Build complete features rather than horizontal layers. Each week delivers a playable increment.

### 2. Dev Tools First
Invest in developer tools early to accelerate iteration throughout the project.

### 3. Minimal Viable Content
Start with placeholder content and expand later. Focus on systems first.

### 4. Progressive Polish
Add polish incrementally rather than all at once at the end.

### 5. Test-Driven Development
Write tests for critical functions, but don't let testing slow down early iteration.

---

## Key Milestones

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| 1-2 | Hero System Complete | Recruit heroes, view roster, basic UI |
| 3-4 | Expedition Loop Working | Send heroes on adventures, get rewards |
| 5-6 | Equipment Integration | Gear affects power, drops from expeditions |
| 7-8 | Playable Demo | Save/load works, basic polish, ready for testing |

---

## Risk Assessment

### High Risk Areas
1. **Expedition System Complexity** (Week 3-4)
   - Time management and state synchronization
   - Reward calculation and distribution

2. **Save System Reliability** (Week 7)
   - Data corruption and migration issues
   - Cross-browser compatibility

3. **Performance Scaling** (Ongoing)
   - Handling many heroes and items
   - Expedition history growth

### Mitigation Strategies
- Build dev tools early for testing
- Implement comprehensive error handling
- Use progressive loading where needed
- Regular performance testing

---

## Resource Requirements

### Technical Stack
- Nuxt 3 + Vue 3 + TypeScript
- Pinia for state management
- Tailwind CSS for styling
- LocalStorage for persistence (MVP)

### Content Requirements
- 5-10 hero traits
- 3-5 zones
- 10-20 equipment items
- Basic UI components
- Placeholder names/descriptions

### Tooling Requirements
- Dev cheat tools (gold, items, time)
- State export/import
- Expedition editor
- Item editor

---

## Success Metrics

### Technical Success
- [ ] All core systems implemented
- [ ] Game persists across sessions
- [ ] No critical bugs in core loop
- [ ] Dev tools functional

### User Experience Success
- [ ] Recruitment feels satisfying
- [ ] Expeditions feel rewarding
- [ ] Equipment progression is meaningful
- [ ] UI is intuitive and responsive

### Business Success
- [ ] Demo ready for user testing
- [ ] Foundation for Phase 2 features
- [ ] Codebase maintainable and extensible
- [ ] Development velocity sustainable

---

## Post-MVP Roadmap

After completing Phase 1 (MVP), the development continues with:

### Phase 2: The Differentiator
- Monster capture system
- Schematic collection
- Dungeon building (basic)
- Dungeon farming loop

### Phase 3: Depth & Polish
- Synergy system
- Prestige system
- Procedural events
- Set bonuses
- Premium currency

### Phase 4: Content & AI
- AI-generated rare events
- More zones, dungeons, schematics
- Expanded trait catalog
- Balance tuning

---

## Getting Started

1. **Read the weekly plans** in order
2. **Start with Week 1** - core systems
3. **Focus on one week at a time**
4. **Use the success criteria** to stay on track
5. **Adjust as needed** based on progress and learnings

The roadmap is designed to be flexible - each week builds on the previous one, but can be adjusted based on actual development progress and discoveries.