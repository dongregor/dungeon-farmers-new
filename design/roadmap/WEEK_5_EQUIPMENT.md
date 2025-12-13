# Week 5-6: Equipment System

**Goal**: Implement gear drops, equipment slots, and gear score calculations
**Focus**: Enhance hero power through equipment and create meaningful progression

---

## Week 5: Equipment Foundation

### Day 29-30: Equipment Data Model
- [ ] Define `Item` interface:
  - `id: string`
  - `name: string`
  - `slot: "weapon" | "armor" | "helmet" | "boots" | "accessory1" | "accessory2"`
  - `rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"`
  - `level: number`
  - `stats: Record<string, number>`
  - `gearScore: number` (calculated)
- [ ] Define equipment slots enum
- [ ] Create `calculateGearScore()` function
- [ ] Implement item generation logic

### Day 31-32: Inventory System
- [ ] Define `Inventory` interface
- [ ] Implement `addItemToInventory()` function
- [ ] Create `removeItemFromInventory()` function
- [ ] Add inventory capacity limits
- [ ] Implement item stacking logic (for consumables)

### Day 33-34: Equipment UI
- [ ] Create inventory viewer
- [ ] Implement equipment slots display
- [ ] Add item details modal
- [ ] Create equip/unequip buttons
- [ ] Add item comparison feature

### Day 35: Basic Item Drops
- [ ] Integrate items into expedition rewards
- [ ] Create zone-specific drop tables
- [ ] Implement rarity-based drop chances
- [ ] Add item level scaling with zone difficulty

---

## Week 6: Equipment Integration & Polish

### Day 36-37: Equipping Logic
- [ ] Implement `equipItem()` function
- [ ] Add slot validation
- [ ] Create unequip logic (returns to inventory)
- [ ] Implement hero stat recalculation
- [ ] Add visual feedback for equipment changes

### Day 38-39: Gear Score Integration
- [ ] Update hero power calculation to include gear score
- [ ] Add gear score display in UI
- [ ] Implement gear score comparison
- [ ] Create "best available" equipment suggestion

### Day 40-41: Dev Tools for Equipment
- [ ] Add "add item" cheat
- [ ] Implement item editor
- [ ] Create gear score calculator
- [ ] Add inventory export/import
- [ ] Implement item duplication for testing

### Day 42: Testing & Integration
- [ ] Test full equipment loop
- [ ] Verify gear score calculations
- [ ] Test edge cases (full inventory, etc.)
- [ ] Integrate with expedition rewards
- [ ] Fix any bugs found

---

## Success Criteria

**Minimum Viable (Must Have)**:
- [ ] Heroes have 6 equipment slots
- [ ] Can equip/unequip items
- [ ] Gear score affects hero power
- [ ] Items drop from expeditions
- [ ] Basic inventory management

**Stretch Goals (Nice to Have)**:
- [ ] Item comparison tool
- [ ] "Best available" equipment suggestions
- [ ] Visual equipment indicators
- [ ] Item filtering/sorting

**Blockers to Watch For**:
- Inventory management complexity
- Gear score calculation bugs
- Equipment slot validation issues
- UI performance with many items

---

## Key Decisions to Make

1. **Item ID Generation**: How to uniquely identify items
2. **Gear Score Formula**: How to calculate from stats
3. **Inventory Limits**: Fixed vs expandable capacity
4. **Equipment Validation**: How strict to be with slot matching
5. **Item Storage**: How to handle large inventories

---

## Resources Needed

- Item templates and descriptions
- Equipment slot definitions
- Gear score calculation formulas
- Inventory UI components
- Testing scenarios

---

## Next Week Preview

Week 7-8 will focus on persistence and polish - implementing save/load functionality, adding basic animations, and preparing for the first playable demo.