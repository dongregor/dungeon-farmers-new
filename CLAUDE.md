# Dungeon Farmers - Claude Context

**Last Updated:** 2025-12-13
**Status:** Design v2 complete, ready for implementation
**Design Doc:** [design/GAME_DESIGN_V2.md](design/GAME_DESIGN_V2.md)

---

## Quick Summary

**Dungeon Farmers** is a browser-based idle RPG where players manage a guild of quirky, randomly-generated heroes. Send them on expeditions, capture monsters, and build your own farmable dungeons.

**The Hook:** Capture monsters during expeditions, collect dungeon schematics, build personal dungeons stocked with your monsters. Each monster has a loot table - build the dungeon you need to farm the gear you want.

**Tone:** Lighthearted fantasy parody. Loving mockery of RPG/MMO/gacha tropes. Heroes have personality through traits. No corporate satire.

**Monetization:** F2P + Supporter Pack ($15-20). Supporters progress faster, not further. No pay-to-win.

---

## Three Core Pillars

1. **Quirky Heroes** - Randomly generated with traits affecting gameplay and stories
2. **Player-Built Dungeons** - Capture monsters, collect schematics, optimize farming
3. **Emergent Stories** - Expedition logs with trait-flavored reactions

---

## Documentation

**Active:**
- `design/GAME_DESIGN_V2.md` - Complete game design (START HERE)

**Archived:**
- `design/_archive/` - Legacy documentation (reference only)

---

## Key Systems (Summary)

**Heroes:**
- Random generation with traits (flat bonuses, conditional, tags)
- Rarity affects trait count (Common 1-2 → Legendary 3-4)
- Prestige at max level (per-hero, soft reset)

**Expeditions:**
- Active: Zones (15min-2hr), Story Missions (30min-1hr), Dungeons (2-6hr)
- Passive: Station heroes in zones for idle income
- No failure states - efficiency 60-150% based on power

**Dungeon Building:**
- Capture monsters → collect schematics → build dungeons
- Three optimization layers: slot matching → monster power → synergies
- Monster loot tables enable targeted farming

**Scaling:**
- Power scaling (levels, gear)
- Rarity tiers (Common → Mythic versions)
- Per-hero prestige (reset level, keep monsters/schematics)

---

## Development Phases

1. **Phase 1:** MVP core loop (heroes, zones, equipment, logs)
2. **Phase 2:** Dungeon building (monsters, schematics, passive assignments)
3. **Phase 3:** Depth (synergies, prestige, procedural events, sets)
4. **Phase 4:** Content & AI (generated events, more content)
5. **Phase 5:** Social (alliances, raids, leaderboards) - post-launch

---

## Tech Stack (Planned)

- **Frontend:** Nuxt 3 + Vue 3 + TypeScript + Tailwind
- **Backend:** Nuxt Server Routes (MVP) → Supabase (scale)
- **Database:** PostgreSQL
- **Hosting:** Vercel + Supabase

---

## What's NOT in This Game

- Energy systems
- Gacha mechanics
- Pay-to-win
- VIP tiers
- FOMO mechanics
- Corporate satire tone (removed in v2)
- Personality dimensions (cut - traits are enough)
- Morale/happiness system (cut - overcomplicated)

---

## Open Questions

See `design/GAME_DESIGN_V2.md` section "Open Questions" for implementation details to resolve.

---

**For full design details, read:** [design/GAME_DESIGN_V2.md](design/GAME_DESIGN_V2.md)
