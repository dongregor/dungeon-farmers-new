General art direction prompt (for AI image generators)
Use this as a master style prompt you paste at the top of every request, then append the specific subject.
MASTER STYLE PROMPT (Dungeon Farmers v2):
Lighthearted fantasy parody idle-RPG world, warm, charming, slightly goofy tone, but the world is real and internally consistent (no meta jokes, no corporate satire, no fourth-wall breaking). Visual style: stylized storybook fantasy illustration with clean readable shapes, confident linework, soft painterly shading, subtle texture, high clarity silhouettes, mild exaggeration (big hats, oversized tools, expressive faces) without becoming slapstick. Cozy adventurer vibe: taverns, guild halls, wooded paths, mossy ruins, friendly monsters, playful magic effects. Lighting: soft cinematic key light + gentle rim light, warm highlights with cool shadow accents. Color palette: earthy neutrals (leather browns, parchment beige, stone gray, moss green) + bright accent colors for rarity/magic (ruby red, sapphire blue, emerald green, gold). Materials: worn leather, chipped steel, embroidered cloth, carved wood, aged parchment, glowy runes. Mood keywords: “whimsical”, “adventurer’s handbook”, “cozy dungeon”, “quirky heroes”, “storybook parody done with love”.
STYLE ANCHORS (keep consistent across assets):
Shape language: rounded + chunky for “friendly”; sharper triangles reserved for danger/bosses
Line + rendering: readable outlines, limited micro-detail, soft gradients, hand-painted texture
UI-readability mindset: strong contrast, distinct silhouettes, avoid muddy midtones
Rarity signaling: subtle glow + accent color, not excessive particle spam
Humor: comes from character expression and gear quirks, not memes
Subject template (append after master prompt)
SUBJECT PROMPT TEMPLATE:
Create: [asset type] of [subject] in Dungeon Farmers style.
Pose/Action: [what they’re doing].
Personality/Traits: [2–3 adjectives or trait-flavored behaviors].
Outfit/Props: [gear/tools].
Environment: [simple background or scene].
Composition: [close-up / 3/4 / full body], [camera angle], [framing], clear silhouette.
Lighting/Color: warm key light, gentle rim light, earthy palette with [accent color].
Quality: high detail where it matters (face/hands/props), clean edges, consistent style.
Negative prompt (paste into “negative” / “avoid” field)
NEGATIVE:
photorealistic, ultra-real, gritty grimdark, horror, gore, dismemberment, edgy cynicism, meme text, logos, corporate satire, modern office imagery, fourth-wall jokes, chibi toddler proportions, anime screencap look, hypersexualized armor, overly busy background, unreadable clutter, muddy colors, excessive bloom, glitch, watermark, signature, low-res, blurry, deformed hands, extra fingers, incorrect anatomy, text artifacts.
Quick ready-to-use variants (common asset types)
Hero portrait (roster card)
PROMPT:
[MASTER STYLE PROMPT] Create a hero portrait (bust / shoulders up) of [name], [class archetype]. Expression: confident but a little ridiculous (raised eyebrow, smirk, determined glare). Add a small humorous detail (mismatched pauldron, too-big hat, tiny lucky charm). Background: simple parchment gradient with faint rune motifs, no scene clutter. Strong silhouette, crisp facial features, readable at small sizes.
Full-body hero (paper-doll / detail screen)
PROMPT:
[MASTER STYLE PROMPT] Create a full-body character turnaround (front view) of [hero] wearing distinct layered gear (weapon, armor, boots, accessories visible). Neutral stance, arms slightly away from body for readability. Background flat parchment. Clear separation of gear slots (readable shapes).
Zone illustration (expeditions list)
PROMPT:
[MASTER STYLE PROMPT] Create a zone key art illustration: [zone name]. Scene conveys “adventure-ready” not terror. Add small story hooks (signpost, abandoned pack, friendly critter). Composition: strong foreground frame, clear midground path, simple background. Palette: earthy with one accent color.
Item icons (inventory)
PROMPT:
[MASTER STYLE PROMPT] Create a clean item icon of [item] centered, 1:1, high contrast, bold silhouette, subtle texture, minimal background (soft vignette). Rarity indicated by subtle edge glow in [rarity color], not neon.

# Phase 1 — Screen & UI Design List

**Phase 1 scope basis:** `design/GAME_DESIGN_V2.md` (heroes, zones-only expeditions, equipment, logs, core UI)

## Core screens
### Dashboard / Home
- Active expeditions (status, remaining time)
- Completed expedition collection (single + “collect all”)
- Recent logs preview
- Currency summary (gold) + quick links

**Prompt description (AI):** Design a responsive web **dashboard** for a whimsical storybook fantasy idle-RPG called “Dungeon Farmers”. Layout: top bar with title + gold, left nav with icons, main area shows **Active Expeditions** as cards with timers and party portraits, a **Completed** panel with “Collect” and “Collect All” buttons, and a **Recent Logs** preview (2–3 entries). Visual style: parchment panels, warm cozy colors, subtle rune motifs, clear card hierarchy, readable typography, friendly micro-illustrations (tiny backpack, compass).

### Heroes — Roster
- Hero cards/list (name, rarity, level, power)
- Filters/sort (rarity, level, power)
- CTA: Recruit hero

**Prompt description (AI):** Design a **hero roster** screen for a cozy fantasy guild manager. Main area: grid/list of **Hero Cards** (portrait, name, rarity color accent, level, power). Top controls: search, filters (rarity, level), sort dropdown. Primary CTA: “Recruit Hero”. Style: clean readable cards, rarity color accents (subtle glow), lighthearted fantasy UI on parchment with wood/iron trim; keep plenty of whitespace and strong silhouettes for portraits.

### Hero Detail
- Hero summary (rarity, level/xp, power breakdown)
- Traits list (effects + tags)
- Equipment slots (6): Weapon, Armor, Helmet, Boots, Accessory 1, Accessory 2
- Actions: equip/unequip; jump to inventory filtered by slot

**Prompt description (AI):** Design a **hero detail** screen. Left column: large hero portrait with rarity frame, level + XP bar, “Total Power” with expandable breakdown (level, gear score, traits). Right column: **Traits** section with pill tags and short effect lines; **Equipment** section showing 6 slot tiles with icons, empty-state placeholders, and “Equip” buttons. Tone: charming adventurer handbook, parchment + stitched leather accents, tooltips for traits, minimal clutter.

### Recruitment
- Recruitment offers/roll
- Cost display + confirm
- Preview: rarity + initial traits
- If insufficient gold: disabled state + hint

**Prompt description (AI):** Design a **recruitment** screen like a guild noticeboard. Center: 1–3 recruit “cards” pinned to parchment with wax seals. Each card shows portrait silhouette, rarity badge, 1–3 trait pills, and a short comedic tagline. Bottom: gold cost + confirm button, with disabled state and clear hint when insufficient. Visual style: playful fantasy UI, warm lighting, readable buttons, gentle humor without memes.

### Expeditions — Zones List
- Zone cards with: duration range, requirement, reward preview
- CTA: Select zone

**Prompt description (AI):** Design a **zones list** screen for expeditions. Show 5–7 **Zone Cards** in a vertical list or grid: zone name, small illustrated thumbnail (forest path, mine entrance), duration range, recommended power, reward preview icons (gold, XP, gear). Each card has a clear “Select” CTA. Style: storybook fantasy map vibe, parchment background with subtle map lines, strong contrast, easy scanning.

### Party Select (Start Expedition)
- Choose 2–4 heroes
- Team power + predicted efficiency band (clamped 60–150%)
- Zone info summary
- CTA: Start expedition

**Prompt description (AI):** Design a **party selection** screen. Left panel: selected zone summary (thumbnail, duration, requirement, reward preview). Center/right: hero roster picker with selectable hero cards; selection limit 2–4 with clear state. Bottom/side: **Team Power** and **Predicted Efficiency** meter labeled 60%–150% with a highlighted range. Primary CTA: “Start Expedition”. Style: clean UX, obvious selection states, cozy fantasy parchment UI.

### Active Expedition Detail
- Countdown timer, party display
- Zone details + expected rewards
- Completion state + CTA: Collect

**Prompt description (AI):** Design an **active expedition detail** screen. Hero party portraits in a row with tiny trait badges. Big countdown timer and progress bar. Zone description and expected rewards. When completed, swap to a celebratory “Ready to Collect” state with a prominent **Collect** button and reward preview. Visual tone: warm, adventurous, gentle sparkles/glow only on completion; keep it readable and not flashy.

### Inventory
- Item grid/list
- Filters: slot, rarity, (optional) item level
- Item selection → detail panel

**Prompt description (AI):** Design an **inventory** screen. Left: filters (slot icons, rarity chips, item level range). Main: item grid with icons, rarity borders, gear score. Right: item inspect panel (stats, equip button, compare). Include clear empty states and sorting. Style: clean, high-contrast, parchment panels with subtle texture; icons must be readable at small size.

### Item Detail (modal or page)
- Slot, rarity, item level, stats, gear score
- CTA: Equip to hero (hero picker)
- If equipping swaps: show comparison/swap preview

**Prompt description (AI):** Design an **item detail modal**. Large item icon, name, rarity glow, slot, item level, gear score, stat list. Include **comparison** vs currently equipped item (green/red deltas) and a swap preview. Action: “Equip to…” opens hero picker. Style: polished RPG tooltip feel but modern and uncluttered; parchment + minimal ornamentation.

### Logs
- Log list (most recent first), filters (zone, hero)
- Log detail viewer (readable formatting)
- Reward summary at top/bottom

**Prompt description (AI):** Design an **expedition logs** screen styled like an adventurer’s journal. Left: log list with timestamps, zone tag, party mini-portraits. Right: log detail viewer with readable typography, small inline icons (gold, sword), and highlighted **trait reactions** as callouts. Include reward summary box. Style: cozy storybook journal on parchment, strong line spacing, minimal clutter.

## Utility / UX (still Phase 1)
### Settings
- Export save (JSON)
- Import save (JSON)
- Reset save (guarded)
- (Optional) UI toggles: compact mode, reduced motion

**Prompt description (AI):** Design a simple **settings** screen for a fantasy web game. Sections: Save Management (Export/Import buttons), Danger Zone (Reset with confirmation), and UI toggles. Use clear warnings and confirmation modal. Style: clean modern settings layout wrapped in parchment/wood fantasy theme; accessibility-forward (high contrast, readable labels).

### First-time onboarding (overlay or dedicated screen)
- Short checklist:
  - Recruit a hero
  - Equip an item
  - Run your first zone expedition

**Prompt description (AI):** Design a friendly **first-time onboarding** overlay. A small checklist card with 3 steps (recruit, equip, expedition) and progress ticks. Include short one-line guidance per step and a “Got it” button. Style: warm, welcoming fantasy UI, subtle mascot-like icon (tiny backpack/compass), non-intrusive overlay with clear focus highlights.

## Global UI components to design (Phase 1)
- App shell layout (top bar + nav)
- HeroCard, TraitPill, EquipmentSlot, ItemCard
- ZoneCard, ExpeditionCard
- LogViewer (typography, readability)
- Modals (recruit, item detail, import/export)
- Toast/notifications (expedition complete, item equipped)
- Empty states (no heroes, no items, no logs)

**Prompt description (AI):** Create a component sheet for a whimsical storybook fantasy UI: top navigation, side nav, cards, buttons (primary/secondary/danger), pills/tags, progress bars, rarity frames, item tiles, toast notifications, modals, and empty states. Keep consistent spacing, rounded corners, parchment textures, subtle rune accents, and excellent readability.
