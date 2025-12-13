# Week 3-4: Expedition System

**Goal**: Implement the core gameplay loop - sending heroes on expeditions
**Focus**: Create the expedition start/resolve cycle with basic rewards

---

## Week 3: Expedition Foundation

### Day 15-16: Expedition Data Model
- [ ] Define `Expedition` interface:
  - `id: string`
  - `zoneId: string`
  - `party: string[]` (hero IDs)
  - `startedAt: Date`
  - `duration: number` (seconds)
  - `endsAt: Date`
  - `seed: number` (for determinism)
  - `status: "pending" | "completed" | "claimed"`
- [ ] Define `Zone` interface:
  - `id: string`
  - `name: string`
  - `description: string`
  - `duration: number`
  - `requirement: number` (power)
  - `tags: string[]`
  - `baseRewards: Reward[]`
- [ ] Create 3-5 placeholder zones

### Day 17-18: Expedition Start Logic
- [ ] Implement `startExpedition()` function
- [ ] Add party validation (2-4 heroes)
- [ ] Implement power requirement check
- [ ] Create expedition seed generation
- [ ] Add expedition to state
- [ ] Mark heroes as "on expedition"

### Day 19-20: Expedition UI
- [ ] Create expedition selection interface
- [ ] Add zone browser with requirements
- [ ] Implement party selection UI
- [ ] Add expedition status display
- [ ] Create "start expedition" button with validation

### Day 21: Basic Reward System
- [ ] Define `Reward` interface
- [ ] Create `generateRewards()` function
- [ ] Implement basic reward types:
  - Gold
  - XP
  - Basic items
- [ ] Add reward calculation based on expedition duration

---

## Week 4: Expedition Resolution & Integration

### Day 22-23: Expedition Resolution
- [ ] Implement `resolveExpedition()` function
- [ ] Add time-based completion check
- [ ] Create reward distribution logic
- [ ] Implement hero return to available pool
- [ ] Add expedition history tracking

### Day 24-25: Expedition Logs (Basic)
- [ ] Create `ExpeditionLog` interface
- [ ] Implement `generateLog()` function
- [ ] Add basic log templates:
  - Zone introduction
  - Encounter summary
  - Reward listing
- [ ] Create log viewer UI

### Day 26-27: Dev Tools for Expeditions
- [ ] Add "instant complete" button
- [ ] Implement time acceleration
- [ ] Create expedition editor
- [ ] Add reward preview functionality
- [ ] Implement seed debugging tools

### Day 28: Testing & Integration
- [ ] Test full expedition loop
- [ ] Verify reward distribution
- [ ] Test edge cases (invalid parties, etc.)
- [ ] Integrate with hero system
- [ ] Fix any bugs found

---

## Success Criteria

**Minimum Viable (Must Have)**:
- [ ] Can start expeditions with valid parties
- [ ] Expeditions complete after duration
- [ ] Heroes return with rewards
- [ ] Basic logs show what happened
- [ ] Dev tools allow rapid testing

**Stretch Goals (Nice to Have)**:
- [ ] Multiple zone types with different rewards
- [ ] Basic efficiency calculation
- [ ] Visual expedition progress indicators
- [ ] Sound effects for expedition events

**Blockers to Watch For**:
- Time management complexity
- State synchronization issues
- Reward calculation bugs
- UI integration problems

---

## Key Decisions to Make

1. **Expedition ID Generation**: How to uniquely identify expeditions
2. **Time Management**: Real-time vs server-time vs game-time
3. **Reward Structure**: How to balance different reward types
4. **Log Storage**: How much history to keep
5. **Error Handling**: What happens if expedition data is corrupted

---

## Resources Needed

- Zone definitions and descriptions
- Basic reward templates
- Log message templates
- Expedition UI components
- Testing scenarios

---

## Next Week Preview

Week 5-6 will focus on the equipment system - adding gear drops, equipment slots, and gear score calculations to enhance hero power.