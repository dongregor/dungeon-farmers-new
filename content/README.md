# Game Content Directory

**Last Updated:** 2025-12-30
**Status:** Initial structure complete

This directory contains all static game content in JSON format. Content is loaded server-side and cached for optimal performance.

---

## Directory Structure

```
content/
├── zones/                  # Zone definitions
│   ├── index.json          # Zone registry
│   ├── forest.json         # Individual zone files
│   └── ...
├── monsters/               # Monster templates
│   ├── index.json          # Monster registry
│   ├── forest_sprite.json  # Individual monster files
│   └── ...
├── items/                  # Item templates
│   ├── index.json          # Item registry
│   ├── weapons/            # Weapon templates
│   ├── armor/              # Armor templates
│   ├── accessories/        # Accessory templates
│   └── sets/               # Set definitions
├── traits/                 # Hero/monster traits
│   └── index.json          # All traits (inline)
├── events/                 # Expedition event templates
│   ├── index.json          # Event registry
│   └── mysterious_chest.json
├── achievements/           # Achievement definitions
│   └── index.json          # All achievements
├── schematics/             # Dungeon schematic definitions
│   └── index.json          # All schematics
├── synergies/              # Monster synergy definitions
│   └── index.json          # All synergies
├── quests/                 # Quest templates
│   ├── daily.json          # Daily quest pool
│   ├── weekly.json         # Weekly quest pool
│   └── story.json          # Story quests
└── localization/           # Text strings (future)
    ├── en.json
    └── es.json
```

---

## Content Guidelines

### Naming Conventions

- **File names:** lowercase, hyphenated (e.g., `dark-forest.json`)
- **IDs:** lowercase, underscored with category prefix (e.g., `zone_forest`, `ach_hero_collector`)
- **Template IDs:** no prefix, underscored (e.g., `forest_sprite`, `iron_sword`)

### ID Prefixes

| Category | Prefix | Example |
|----------|--------|---------|
| Zones | `zone_` | `zone_forest` |
| Achievements | `ach_` | `ach_hero_collector` |
| Schematics | `schematic_` | `schematic_forest_den` |
| Events | none | `mysterious_chest` |
| Monsters | none | `forest_sprite` |
| Items | none | `iron_sword` |
| Traits | none | `forest_guide` |
| Sets | none (suffix: `_set`) | `forest_set` |

### Required Fields

Every content file should include:

```json
{
  "$schema": "../schemas/[type].schema.json",
  "id": "unique_identifier",
  "name": "Display Name",
  "description": "Short description"
}
```

---

## Validation

Run content validation before committing:

```bash
npx tsx scripts/validate-content.ts
```

This checks:
- Schema compliance for all files
- Cross-references (e.g., monsters referenced in zones exist)
- Duplicate ID detection
- Required file presence

---

## Adding New Content

### Adding a New Zone

1. Add entry to `zones/index.json`:
```json
{
  "id": "zone_new_area",
  "file": "new-area.json",
  "biome": "forest",
  "difficulty": 3,
  "order": 6
}
```

2. Create `zones/new-area.json` with full zone definition

3. Validate: `npx tsx scripts/validate-content.ts`

### Adding a New Monster

1. Add entry to `monsters/index.json`:
```json
{
  "id": "new_monster",
  "file": "new_monster.json",
  "biome": "forest",
  "category": "beast"
}
```

2. Create `monsters/new_monster.json` with full monster definition

3. Reference in zones that should spawn it

4. Validate

### Adding a New Item

1. Add template entry to `items/index.json`
2. Create item file in appropriate subdirectory
3. If part of a set, update set definition
4. Add to zone loot tables as needed
5. Validate

---

## Content Versioning

The `version` field in index files tracks content versions:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-12-30"
}
```

- **Major version:** Breaking changes (schema updates)
- **Minor version:** New content additions
- **Patch version:** Balance tweaks, bug fixes

---

## Loading Content

Content is loaded server-side at startup and cached:

```typescript
// In server code
import { getZone, getMonster, getTrait } from '~/server/utils/content'

const zone = getZone('zone_forest')
const monster = getMonster('forest_sprite')
const trait = getTrait('forest_guide')
```

See `server/utils/content.ts` for the full content loading system.

---

## Hot Reload (Development)

In development mode, content files are watched and automatically reloaded on changes. No server restart needed.

---

## Future Enhancements

- [ ] JSON Schema files for IDE autocompletion
- [ ] Content editor web UI
- [ ] Localization support
- [ ] Content migration scripts
- [ ] A/B testing content variants
