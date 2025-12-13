# Content JSON Structure - Data-Driven Game Design

**Purpose**: All game content (zones, monsters, equipment, heroes, schematics) defined in JSON files for easy extensibility without code changes.

**Philosophy**: Content creators (designers, writers, community) can add/modify content by editing JSON files, not touching code.

---

## 📋 Core Principles

1. **Data-Driven**: All content in JSON, code reads/interprets data
2. **Hot-Reloadable**: Changes to JSON files apply without server restart (dev mode)
3. **Version Controlled**: JSON files in git, track content changes like code
4. **Validated**: JSON schemas enforce structure, prevent breaking changes
5. **Modular**: Content files organized by type (zones/, monsters/, equipment/, etc.)
6. **Extensible**: New content types via new JSON schemas, no code changes

---

## 🗂️ File Structure

```
/content/
├── zones/
│   ├── zone_001_tutorial_plains.json
│   ├── zone_002_goblin_forest.json
│   └── zone_020_dragon_peaks.json
├── monsters/
│   ├── goblin_warrior.json
│   ├── dragon_juvenile.json
│   └── slime_caffeinated.json
├── equipment/
│   ├── sets/
│   │   ├── guardian_oath.json
│   │   ├── shadow_stalker.json
│   │   └── volcanic_fury.json
│   └── items/
│       ├── iron_sword.json
│       └── epic_helmet_dragon.json
├── heroes/
│   ├── archetypes/
│   │   ├── tank.json
│   │   ├── melee_dps.json
│   │   └── healer.json
│   └── traits/
│       ├── common/
│       │   ├── caffeine_dependent.json
│       │   └── team_player.json
│       └── legendary/
│           └── main_character_energy.json
├── schematics/
│   ├── common/
│   │   └── goblin_cave_basic.json
│   └── mythic/
│       └── dragon_lair_ultimate.json
├── missions/
│   ├── story/
│   │   ├── mission_001_goblin_trouble.json
│   │   └── mission_020_final_confrontation.json
│   └── events/
│       ├── halloween_2024.json
│       └── winter_festival_2024.json
└── schemas/
    ├── zone.schema.json
    ├── monster.schema.json
    ├── equipment.schema.json
    ├── hero.schema.json
    ├── schematic.schema.json
    └── mission.schema.json
```

---

## 📝 JSON Schemas

### Zone Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Zone",
  "type": "object",
  "required": ["id", "name", "level_range", "rewards", "monsters"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^zone_[0-9]{3}$",
      "description": "Unique zone identifier (e.g., zone_001)"
    },
    "name": {
      "type": "string",
      "description": "Display name (e.g., 'Tutorial Plains')"
    },
    "description": {
      "type": "string",
      "description": "Flavor text with parody elements"
    },
    "level_range": {
      "type": "object",
      "properties": {
        "min": { "type": "integer", "minimum": 1 },
        "max": { "type": "integer", "maximum": 50 },
        "recommended": { "type": "integer" }
      },
      "required": ["min", "max", "recommended"]
    },
    "difficulty": {
      "type": "string",
      "enum": ["easy", "normal", "hard", "very_hard", "nightmare"]
    },
    "duration_minutes": {
      "type": "integer",
      "minimum": 5,
      "maximum": 180,
      "description": "Expedition duration in minutes"
    },
    "rewards": {
      "type": "object",
      "properties": {
        "gold": {
          "type": "object",
          "properties": {
            "min": { "type": "integer" },
            "max": { "type": "integer" }
          }
        },
        "experience": {
          "type": "object",
          "properties": {
            "min": { "type": "integer" },
            "max": { "type": "integer" }
          }
        },
        "materials": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": { "type": "string" },
              "amount_min": { "type": "integer" },
              "amount_max": { "type": "integer" },
              "drop_rate": { "type": "number", "minimum": 0, "maximum": 1 }
            }
          }
        }
      }
    },
    "monsters": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "monster_id": { "type": "string" },
          "spawn_rate": { "type": "number", "minimum": 0, "maximum": 1 },
          "capture_rate": { "type": "number", "minimum": 0, "maximum": 0.25 }
        }
      }
    },
    "parody_elements": {
      "type": "object",
      "properties": {
        "loading_tips": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Parody loading screen tips (e.g., 'Remember: Slimes are not edible, despite what the LitRPG said')"
        },
        "flavor_text": {
          "type": "string",
          "description": "Zone description with pop culture references"
        }
      }
    }
  }
}
```

**Example**: `content/zones/zone_001_tutorial_plains.json`

```json
{
  "id": "zone_001",
  "name": "Tutorial Plains",
  "description": "A suspiciously convenient field of low-level monsters. Almost like someone designed it for beginners...",
  "level_range": {
    "min": 1,
    "max": 5,
    "recommended": 3
  },
  "difficulty": "easy",
  "duration_minutes": 5,
  "rewards": {
    "gold": { "min": 20, "max": 50 },
    "experience": { "min": 50, "max": 100 },
    "materials": [
      {
        "type": "wood",
        "amount_min": 3,
        "amount_max": 8,
        "drop_rate": 0.8
      },
      {
        "type": "leather",
        "amount_min": 1,
        "amount_max": 3,
        "drop_rate": 0.5
      }
    ]
  },
  "monsters": [
    {
      "monster_id": "slime_basic",
      "spawn_rate": 0.7,
      "capture_rate": 0.15
    },
    {
      "monster_id": "goblin_scout",
      "spawn_rate": 0.3,
      "capture_rate": 0.10
    }
  ],
  "parody_elements": {
    "loading_tips": [
      "Tip: Slimes are the tutorial enemy in 87% of RPGs. We're part of a proud tradition.",
      "Tip: Goblins respawn infinitely. Don't think about the ethics.",
      "Fun Fact: These plains have been 'Tutorial Plains' for 47 years. Previous names include 'Beginner Meadow' and 'Noob Field'."
    ],
    "flavor_text": "The Tutorial Plains have been meticulously balanced by the Game Masters (TM) for optimal New Adventurer Experience (TM). Complaints about lack of challenge should be directed to HR."
  }
}
```

---

### Monster Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Monster",
  "type": "object",
  "required": ["id", "name", "archetype", "base_stats", "loot_table"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique monster identifier"
    },
    "name": {
      "type": "string",
      "description": "Display name"
    },
    "description": {
      "type": "string",
      "description": "Flavor text with parody"
    },
    "archetype": {
      "type": "string",
      "enum": ["melee", "ranged", "caster", "tank", "support"],
      "description": "Monster combat role"
    },
    "rarity": {
      "type": "string",
      "enum": ["common", "uncommon", "rare", "epic", "legendary", "mythic"]
    },
    "base_stats": {
      "type": "object",
      "properties": {
        "hp": { "type": "integer" },
        "atk": { "type": "integer" },
        "def": { "type": "integer" },
        "spd": { "type": "integer" }
      },
      "required": ["hp", "atk", "def", "spd"]
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Monster ability tags (fire, poison, flying, etc.)"
    },
    "loot_table": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "item_id": { "type": "string" },
          "drop_rate": { "type": "number", "minimum": 0, "maximum": 1 }
        }
      }
    },
    "parody_traits": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Parody personality traits (e.g., 'Aware it's a tutorial monster', 'Unionized')"
    },
    "subspecies": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "variant_name": { "type": "string" },
          "stat_modifier": { "type": "number" },
          "special_effect": { "type": "string" },
          "parody_description": { "type": "string" }
        }
      },
      "description": "Procedural variants (Caffeinated Slime, Ancient Goblin, Shiny Slime)"
    }
  }
}
```

**Example**: `content/monsters/slime_basic.json`

```json
{
  "id": "slime_basic",
  "name": "Basic Slime",
  "description": "The OG tutorial enemy. Has appeared in more RPGs than it can count (it can't count).",
  "archetype": "melee",
  "rarity": "common",
  "base_stats": {
    "hp": 50,
    "atk": 10,
    "def": 5,
    "spd": 5
  },
  "tags": ["physical", "weak_to_fire"],
  "loot_table": [
    { "item_id": "slime_gel", "drop_rate": 0.8 },
    { "item_id": "common_helmet", "drop_rate": 0.1 }
  ],
  "parody_traits": [
    "Self-Aware Tutorial Enemy",
    "Unionized (demands 15-minute breaks)",
    "Existential Dread (knows it's cannon fodder)"
  ],
  "subspecies": [
    {
      "variant_name": "Caffeinated Slime",
      "stat_modifier": 1.15,
      "special_effect": "+15% SPD, jittery animation, drops Energy Potion",
      "parody_description": "Absorbed a coffee spill. Vibrating at concerning frequency."
    },
    {
      "variant_name": "Shiny Slime",
      "stat_modifier": 1.5,
      "special_effect": "+50% stats, golden glow, parody of 'shiny Pokemon'",
      "parody_description": "1/8192 spawn rate. Collectors will lose their minds."
    },
    {
      "variant_name": "Ancient Slime",
      "stat_modifier": 1.3,
      "special_effect": "+30% HP/DEF, slower, drops Rare materials (+10% quality)",
      "parody_description": "Has been here since Beta. Remembers when drop rates were good."
    }
  ]
}
```

---

### Equipment Set Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Equipment Set",
  "type": "object",
  "required": ["id", "name", "rarity", "archetype_affinity", "pieces", "bonuses"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "description": { "type": "string" },
    "rarity": {
      "type": "string",
      "enum": ["common", "uncommon", "rare", "epic", "legendary", "mythic"]
    },
    "archetype_affinity": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Best for which hero archetypes"
    },
    "pieces": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "slot": { "type": "string", "enum": ["weapon", "armor", "helmet", "boots", "accessory_1", "accessory_2"] },
          "item_id": { "type": "string" },
          "base_stats": {
            "type": "object",
            "properties": {
              "hp": { "type": "integer" },
              "atk": { "type": "integer" },
              "def": { "type": "integer" },
              "spd": { "type": "integer" }
            }
          }
        }
      }
    },
    "bonuses": {
      "type": "object",
      "properties": {
        "two_piece": {
          "type": "object",
          "properties": {
            "stat_multiplier": { "type": "number" },
            "affected_stat": { "type": "string" },
            "description": { "type": "string" }
          }
        },
        "four_piece": {
          "type": "object",
          "properties": {
            "stat_multiplier": { "type": "number" },
            "special_effect": { "type": "string" },
            "description": { "type": "string" },
            "parody_element": { "type": "string" }
          }
        },
        "six_piece": {
          "type": "object",
          "properties": {
            "stat_multiplier": { "type": "number" },
            "ultimate_effect": { "type": "string" },
            "description": { "type": "string" },
            "parody_element": { "type": "string" }
          }
        }
      }
    },
    "lore": {
      "type": "string",
      "description": "Flavor text with parody elements"
    }
  }
}
```

**Example**: `content/equipment/sets/shadow_stalker.json`

```json
{
  "id": "shadow_stalker",
  "name": "Shadow Stalker",
  "description": "For the edgy rogue archetype. Guaranteed 50% more brooding.",
  "rarity": "epic",
  "archetype_affinity": ["ranged_dps", "melee_dps"],
  "pieces": [
    {
      "slot": "weapon",
      "item_id": "shadow_stalker_daggers",
      "base_stats": { "atk": 70, "spd": 15, "crit_chance": 0.10 }
    },
    {
      "slot": "armor",
      "item_id": "shadow_stalker_cloak",
      "base_stats": { "def": 40, "spd": 10, "evasion": 0.05 }
    }
  ],
  "bonuses": {
    "two_piece": {
      "stat_multiplier": 1.10,
      "affected_stat": "atk",
      "description": "+10% Attack (you're edgier now)"
    },
    "four_piece": {
      "stat_multiplier": 1.25,
      "special_effect": "critical_hit_bonus",
      "description": "+25% Attack, +10% Crit Chance",
      "parody_element": "Unlock 'Teleports Behind You' emote"
    },
    "six_piece": {
      "stat_multiplier": 1.50,
      "ultimate_effect": "assassinate",
      "description": "+50% Attack. Crits deal +100% damage and apply 'Nothing Personnel, Kid' debuff.",
      "parody_element": "Full set grants anime protagonist hair physics"
    }
  },
  "lore": "Forged in the Shadow Realm (citation needed). Comes with built-in tragic backstory generator. Warning: May cause sudden urge to stand dramatically on rooftops."
}
```

---

### Hero Trait Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Hero Trait",
  "type": "object",
  "required": ["id", "name", "rarity", "effect"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "description": { "type": "string" },
    "rarity": {
      "type": "string",
      "enum": ["common", "uncommon", "rare", "epic", "legendary"]
    },
    "effect": {
      "type": "object",
      "properties": {
        "type": { "type": "string", "enum": ["stat_modifier", "proc_effect", "passive_bonus", "synergy"] },
        "value": { "type": "number" },
        "condition": { "type": "string" },
        "description": { "type": "string" }
      }
    },
    "parody_category": {
      "type": "string",
      "enum": ["gacha_trope", "mmo_grind", "litrpg_reference", "pop_culture", "meta_humor"]
    },
    "flavor_text": {
      "type": "string",
      "description": "Parody description"
    },
    "conflicts_with": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Trait IDs that conflict with this trait"
    },
    "synergizes_with": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Trait IDs that combo well"
    }
  }
}
```

**Example**: `content/heroes/traits/legendary/main_character_energy.json`

```json
{
  "id": "main_character_energy",
  "name": "Main Character Energy",
  "description": "Convinced they're the protagonist. Statistically, they're probably right.",
  "rarity": "legendary",
  "effect": {
    "type": "passive_bonus",
    "value": 0.25,
    "condition": "always",
    "description": "+25% to all stats. Plot armor not included (this isn't that kind of game)."
  },
  "parody_category": "litrpg_reference",
  "flavor_text": "Heroes with this trait mysteriously survive encounters that should be lethal. Game Masters hate them. Click here to learn their secret.",
  "conflicts_with": ["npc_awareness", "tutorial_skipper"],
  "synergizes_with": ["chosen_one_complex", "anime_protagonist_hair"]
}
```

**Example**: `content/heroes/traits/common/npc_awareness.json`

```json
{
  "id": "npc_awareness",
  "name": "NPC Awareness",
  "description": "Knows they're in a game. It's... not helping.",
  "rarity": "uncommon",
  "effect": {
    "type": "stat_modifier",
    "value": 0.10,
    "condition": "when_talking_to_player",
    "description": "+10% XP gain (from existential dread-fueled efficiency)"
  },
  "parody_category": "meta_humor",
  "flavor_text": "Constantly questions why they respawn. HR has stopped answering their emails.",
  "conflicts_with": ["main_character_energy", "immersive_roleplayer"],
  "synergizes_with": ["fourth_wall_breaker", "quest_log_reader"]
}
```

---

## 🔧 Technical Implementation

### Content Loader System

```typescript
// content/content-loader.ts
import { z } from 'zod'
import zoneSchema from './schemas/zone.schema.json'
import monsterSchema from './schemas/monster.schema.json'

// Type-safe content loading
export class ContentLoader {
  private static cache = new Map<string, any>()

  // Load and validate zone
  static async loadZone(zoneId: string): Promise<Zone> {
    const cached = this.cache.get(`zone_${zoneId}`)
    if (cached) return cached

    const data = await import(`./zones/${zoneId}.json`)
    const validated = z.object(zoneSchema).parse(data)

    this.cache.set(`zone_${zoneId}`, validated)
    return validated
  }

  // Load all zones (for content management)
  static async loadAllZones(): Promise<Zone[]> {
    const zoneFiles = import.meta.glob('./zones/*.json')
    const zones = await Promise.all(
      Object.keys(zoneFiles).map(path => zoneFiles[path]())
    )

    return zones.map(z => z.object(zoneSchema).parse(z))
  }

  // Hot reload in development
  static enableHotReload() {
    if (import.meta.hot) {
      import.meta.hot.on('content-update', (data) => {
        this.cache.delete(data.contentId)
        console.log(`[Content] Hot reloaded: ${data.contentId}`)
      })
    }
  }
}
```

### Content Validation API

```typescript
// server/api/content/validate.post.ts
import { defineEventHandler, readBody } from 'h3'
import Ajv from 'ajv'

export default defineEventHandler(async (event) => {
  const { contentType, data } = await readBody(event)

  const ajv = new Ajv()
  const schema = await import(`~/content/schemas/${contentType}.schema.json`)
  const validate = ajv.compile(schema)

  const valid = validate(data)

  return {
    valid,
    errors: validate.errors || []
  }
})
```

---

## 🎨 Parody Content Guidelines

### Tone Examples

**Good Parody** (self-aware, light-hearted):
- "This slime has been the tutorial enemy in 47 RPGs. It's union-mandated at this point."
- "Congratulations! You've unlocked the 'Grind 1000 Slimes' achievement. Your reward: A sense of pride and accomplishment (and 50 gold)."
- "Warning: Dungeon contains JRPG-standard treasure chests. May include: Potion, Phoenix Down, or Megalixir you'll never use."

**Bad Parody** (cynical, mean-spirited):
- ❌ "This game is just another cash grab like all the rest."
- ❌ "You're wasting your time, these mechanics are copied from [other game]."
- ❌ "Why are you even playing this?"

### Parody Categories

1. **Gacha Tropes**: 0.6% SSR rates, "limited time" banners, pity systems
2. **MMO Grinds**: Kill 1000 rats quests, daily login rewards, weekly lockouts
3. **LitRPG References**: [System] messages, stat screens, skill trees
4. **Pop Culture**: Anime protagonist tropes, meme references (tasteful), gaming culture
5. **Meta Humor**: NPCs aware they're in a game, quest log jokes, tutorial skippers

---

## 📊 Content Management UI (Phase 2)

### Simple Admin Dashboard

**Features**:
- Upload new JSON files (validated against schemas)
- Edit existing content in web form
- Preview changes before publishing
- Version history (git integration)
- Bulk operations (adjust all zone gold rewards by 10%)

**Example UI** (pseudocode):
```vue
<template>
  <div class="content-manager">
    <h2>Zone Editor</h2>
    <select v-model="selectedZone">
      <option v-for="zone in zones" :value="zone.id">{{ zone.name }}</option>
    </select>

    <div class="editor">
      <label>Name: <input v-model="zoneData.name" /></label>
      <label>Gold Reward (Min): <input type="number" v-model="zoneData.rewards.gold.min" /></label>
      <label>Gold Reward (Max): <input type="number" v-model="zoneData.rewards.gold.max" /></label>

      <!-- Parody Elements -->
      <h3>Parody Loading Tips</h3>
      <div v-for="(tip, index) in zoneData.parody_elements.loading_tips" :key="index">
        <textarea v-model="zoneData.parody_elements.loading_tips[index]" />
      </div>

      <button @click="validateAndSave">Validate & Save</button>
    </div>
  </div>
</template>
```

---

## ✅ Benefits of JSON-Driven Content

1. **Non-Programmers Can Contribute**: Writers, designers add content without touching code
2. **Rapid Iteration**: Tweak drop rates, add loading tips without redeployment
3. **Version Control**: Track content changes via git, review via PRs
4. **A/B Testing**: Multiple versions of zones for testing
5. **Community Contributions**: Accept fan-made monsters, traits, parody text via PRs
6. **Seasonal Events**: JSON files for holiday content, easy to enable/disable
7. **Localization Prep**: Translate JSON strings, not hardcoded code
8. **Balance Changes**: Adjust numbers globally (all Epic gear +10% ATK) via scripts

---

## See Also

- [CONTENT_MANAGEMENT_SYSTEM.md](gap_analysis_recommendation.md#content-management-system) - Admin dashboard design (Phase 2)
- [DATABASE_SCHEMA.md](systems/DATABASE_SCHEMA.md) - How JSON content maps to database
- [RNG_SYSTEM.md](systems/RNG_SYSTEM.md) - Drop rates defined in JSON
- [HERO_SYSTEM.md](systems/HERO_SYSTEM.md) - Trait system extensibility
- [MONSTER_DUNGEON_SYSTEM.md](systems/MONSTER_DUNGEON_SYSTEM.md) - Schematic JSON structure
