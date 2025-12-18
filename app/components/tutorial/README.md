# Tutorial System

Implementation of Task 71: Create Tutorial Flow

## Overview

The tutorial system provides a hybrid approach to onboarding:
- **Mandatory Intro** (~2 minutes): Quick walkthrough of the core loop
- **Optional Mentor Quests**: Self-paced learning with rewards

## Files

### Data Layer
- **`app/data/mentorQuests.ts`**: Mentor quest definitions and helper functions
  - 14 quests total (5 early, 5 mid, 3 late, 1 final)
  - Quest unlock conditions
  - Reward definitions

### State Management
- **`app/stores/tutorial.ts`**: Pinia store for tutorial state
  - Tutorial intro state
  - Quest progress tracking
  - Player stats for unlock conditions
  - LocalStorage persistence

### Composable
- **`app/composables/useTutorial.ts`**: Easy access to tutorial functionality
  - Reactive state
  - Tracking methods for game events
  - Quest management

### Components
- **`TutorialIntro.vue`**: Mandatory intro flow (4 steps)
  1. Welcome screen
  2. Name your Guild Master
  3. Tutorial expedition
  4. View log and complete

- **`MentorQuestCard.vue`**: Individual quest display
  - Shows progress, rewards, unlock conditions
  - Handles claim actions
  - Visual states (locked, unlocked, completed, claimed)

- **`MentorQuestPanel.vue`**: Slide-in panel for quest management
  - Floating button with unclaimed count badge
  - Filter by: All, Available, Locked, Completed
  - Grouped by tier (Early, Mid, Late, Final)
  - Claim individual or claim all

## Usage

### Basic Setup

Add to your main layout or app.vue:

```vue
<template>
  <div>
    <!-- Your app content -->
    <NuxtPage />

    <!-- Tutorial components -->
    <TutorialTutorialIntro />
    <TutorialMentorQuestPanel />
  </div>
</template>

<script setup>
const { initializeTutorial } = useTutorial()

onMounted(() => {
  initializeTutorial()
})
</script>
```

### Tracking Game Events

Use the tracking methods in your game logic:

```typescript
const { trackHeroRecruited, trackExpeditionComplete } = useTutorial()

// When a hero is recruited
function recruitHero(hero) {
  // ... your recruitment logic
  trackHeroRecruited()
}

// When an expedition completes
function completeExpedition(expedition) {
  // ... your expedition logic
  trackExpeditionComplete(expedition.isTutorial)
}
```

### Available Tracking Methods

- `trackHeroRecruited()` - Hero recruitment
- `trackExpeditionComplete(isTutorial)` - Expedition completion
- `trackTavernVisit()` - Tavern visited
- `trackPartySent(partySize)` - Party sent on expedition
- `trackItemEquipped(heroId)` - Item equipped
- `trackFullSetEquipped(heroId)` - Full set equipped on hero
- `trackProfileRead(heroId)` - Hero profile viewed
- `trackTagMatched()` - Tag matched to threat
- `trackSubzoneDiscovered()` - Subzone discovered
- `trackHeroRecovered(heroId)` - Hero recovered from tired
- `trackPrestigeViewed()` - Prestige screen viewed
- `trackPresetSaved()` - Party preset saved
- `trackHeroRetired(heroId)` - Hero retired
- `trackZoneUnlocked()` - Zone unlocked
- `trackEquipmentObtained(count)` - Equipment obtained
- `trackHeroLevelUp(heroId, newLevel)` - Hero leveled up

## Mentor Quest Structure

### Quest Tiers

**Early Quests** (unlock: immediate)
- First Steps: Complete tutorial expedition → 100g
- Open for Business: Visit the tavern → 50g
- New Blood: Recruit your first hero → 150g + basic weapon
- Stronger Together: Send a 2+ hero party → 200g
- Spoils of War: Equip an item on any hero → Basic armor piece

**Mid Quests** (unlock: stat thresholds)
- Know Your Team: Recruit 3 heroes → Read profile → 250g
- Counter Play: Complete 5 expeditions → Match tag → Free refresh
- Explorer: Unlock 2 zones → Discover subzone → 300g + materials
- Dressed for Success: Own 5 equipment → Equip full set → Free recruit
- Rest & Recovery: Hero tired → Let recover → 200g

**Late Quests** (unlock: progression milestones)
- Veteran: Hero level 10 → View prestige → 500g
- Team Builder: Own 5+ heroes → Save preset → Free refresh
- Moving On: Own 6+ heroes → Retire hero → 300g + hero's gold

**Final Quest** (unlock: complete all others)
- Completionist: Complete all above → Title: "The Prepared"

### Unlock Conditions

Quests can unlock based on:
1. **Immediate**: Available from start
2. **Stat Threshold**: Player must reach certain stats (e.g., 3 heroes recruited)
3. **Quest Complete**: Must complete other quests first

## State Persistence

Tutorial state is saved to localStorage automatically:
- Tutorial intro progress
- Quest completion status
- Player stats
- Claimed rewards

## Testing

To reset the tutorial for testing:

```typescript
const { resetTutorial } = useTutorial()
resetTutorial()
```

## Philosophy

### Hybrid Approach
- Mandatory intro is quick (2 minutes) and shows the core loop
- Mentor quests are optional and teach deeper mechanics
- All quests visible from start (no hidden surprises)
- Self-directed learning at player's pace

### Reward Tiers
- Early quests: Resources (gold, gear)
- Mid quests: One-time boosts (free recruit, free refresh)
- Final quest: Exclusive title/cosmetic

### No Pressure
- No time limits
- No penalties for not completing
- Can skip tutorial intro
- Quest progress persists forever
