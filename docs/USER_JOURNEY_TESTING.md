# User Journey Testing Checklist

**Date:** 2026-01-04
**URL:** http://localhost:3001

---

## 1. Landing/Auth Flow

- [ ] Landing page (`/`) loads without errors
- [ ] Can navigate to `/login`
- [ ] Can navigate to `/register`
- [ ] Login form validates inputs
- [ ] Register form validates inputs
- [ ] (If Supabase configured) Auth actually works
- [ ] `/welcome` page accessible after auth

---

## 2. Tavern & Recruitment

- [ ] `/tavern` page loads
- [ ] Shows 3-5 hero slots to recruit
- [ ] Each hero shows: name, rarity, archetype, traits, stats
- [ ] Can lock/unlock a hero slot
- [ ] Refresh button regenerates heroes (costs gold?)
- [ ] Recruit button adds hero to roster
- [ ] Gold deducted after recruitment

---

## 3. Hero Management

- [ ] `/heroes` page shows roster
- [ ] Can click hero to see detail (`/heroes/[heroId]`)
- [ ] Hero detail shows: stats, traits, equipment slots, level, XP
- [ ] Level up button works when XP sufficient
- [ ] Prestige button appears at max level
- [ ] Retire button removes hero (with confirmation?)
- [ ] Can toggle favorite on heroes
- [ ] Filter/sort heroes works

---

## 4. Expeditions

- [ ] `/expeditions` page shows available zones
- [ ] Zone cards show: name, threats, rewards, requirements
- [ ] Clicking zone shows subzones
- [ ] Can select heroes for party
- [ ] Party power/efficiency preview shown
- [ ] Start expedition button works
- [ ] `/expeditions/active` shows running expeditions
- [ ] Timer counts down
- [ ] Can cancel expedition
- [ ] Expedition completes with results
- [ ] `/expeditions/results/[id]` shows log and rewards

---

## 5. Equipment & Inventory

- [ ] `/inventory` page loads
- [ ] Shows all equipment items
- [ ] Can filter by slot/rarity
- [ ] Clicking item shows details
- [ ] Can equip item to a hero
- [ ] Can upgrade item
- [ ] Set bonuses display correctly

---

## 6. General UI

- [ ] Navigation works (header/nav component)
- [ ] No console errors during normal use
- [ ] Loading states show properly
- [ ] Error states handled gracefully
- [ ] Notifications appear for actions

---

## Issues Found

| Section | Issue | Severity | Notes |
|---------|-------|----------|-------|
| | | | |

---

## Notes

_Add any observations or suggestions here_
