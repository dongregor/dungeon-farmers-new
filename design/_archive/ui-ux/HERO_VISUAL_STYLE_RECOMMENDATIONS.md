# Hero Visual Style Recommendations
**Dungeon Farmers - Randomized Hero Appearance System**

**Last Updated**: 2025-11-23
**Status**: Design Recommendations
**Phase**: Pre-Implementation (Visual Style Selection)

---

## 🎯 Design Goals & Constraints

### Requirements
1. **Randomized Visual System** - Heroes need unique appearances using matched layer combinations
2. **Corporate Aesthetic Compatibility** - Must work with muted professional colors and "business casual" fantasy theme
3. **Web Performance** - Efficient for browser rendering (PNG sprites, SVG, or Canvas)
4. **Variety** - Sufficient combinations to avoid visual repetition across 15+ heroes
5. **Archetype Recognition** - Visual distinction between Tank/Healer/DPS/etc. should be clear
6. **Tone Match** - Supports gaming parody (70%) and character personality (20%)

### Technical Constraints
- **Layer System**: Body → Clothing → Accessories → Equipment (optional)
- **Asset Pipeline**: Need to generate/manage hundreds of layer combinations
- **File Size**: Total hero assets should be < 5MB compressed for fast loading
- **Scalability**: Easy to add new layers/sets over time

---

## 🎨 Style Recommendations

### **RECOMMENDATION #1: High-Resolution Pixel Art / Modern Pixel Style** ⭐ (TOP CHOICE)

**Description**: Modern pixel art with higher resolution and smoother polish. Think **Dead Cells** meets **Hades** - pixel-based but with more detail and sophistication. Unique enough to stand out while maintaining the charm of pixel art.

#### Visual Characteristics
- **Resolution**: **128x128px or 192x192px base** (scaled 2-3x for display = 256-384px or 384-576px)
- **Style**: Pixel art foundation with optional smooth gradients, anti-aliasing, or painted detail overlays
- **Palette**: Muted corporate colors (grays, blues, subtle earth tones) with fantasy accents
- **Detail Level**: Medium-high detail - personality and nuance visible, still maintains pixel art aesthetic
- **Animation**: Optional idle animations (slight breathing, equipment sway)
- **AI-Friendly**: Higher resolution works better with AI generation tools (more detail to work with)

#### Layer System Structure
```
Layer Order (Back to Front):
1. Body Base (skin tone, basic silhouette)
2. Underwear/Layer 0 (base clothing)
3. Torso/Shirt (business casual - button-up, vest, blazer)
4. Pants/Legs (slacks, cargo pants, fantasy trousers)
5. Accessories (tie, scarf, badge, pocket watch)
6. Head/Hair (hairstyle + face)
7. Equipment Slot (weapon visible on body)
8. Equipment Slot (armor/helmet overlay)
```

#### Example Combinations
- **Tank**: Heavy frame, tactical vest over button-up, badge/clipboard
- **Healer**: Soft features, lab coat/medical vest, stethoscope accessory
- **Ranged DPS**: Lean frame, utility belt, goggles/headset
- **Caster**: Robes over business shirt, mystical accessory (crystal, wand holster)
- **Support**: Versatile mix, clipboard/tablet, multiple small accessories

#### Pros ✅
- **Unique Style**: Higher-res pixel art stands out in crowded indie market
- **Easy Layer System**: PNG sprites with alpha channels stack perfectly
- **AI Generation**: Higher resolution (128-192px) works excellently with AI tools (Midjourney, DALL-E, Stable Diffusion)
- **More Detail**: Can show personality, expressions, and corporate details clearly
- **Modern Appeal**: Satisfies players who want polish while keeping pixel charm
- **Corporate Aesthetic**: Can incorporate business casual easily (ties, badges, blazers)
- **Tone Match**: Pixel art inherently supports parody/humor (meme-friendly)
- **Performance**: Still GPU-friendly (128x128px is only ~16KB per layer compressed)
- **Extensibility**: Easy to add new layers/sets later
- **Production Speed**: AI can generate base assets quickly, then refine/pixelate if needed

#### Cons ❌
- **Larger File Sizes**: 128-192px sprites are ~10-25KB each (still manageable)
- **Art Direction**: Requires careful curation with AI tools or pixel artist
- **Consistency**: AI generation needs style control to maintain consistency
- **Mobile Data**: Slightly larger downloads, but still acceptable

#### Asset Pipeline

**Primary Method: AI-Assisted Generation** (Recommended for Speed)

**Option A: AI-Generated + Post-Processed**
1. **Generate with AI**: Use Midjourney/DALL-E/Stable Diffusion to create hero layer assets
2. **Post-Process**: Convert to pixel art style (if needed), ensure consistent sizing, extract layers
3. **Refine**: Touch up in Aseprite/Photoshop for consistency and alignment

**Option B: AI Base + Pixel Art Overlay**
1. **Generate with AI**: Create high-res base illustrations (512x512px or 1024x1024px)
2. **Convert/Pixelate**: Use image processing tools to convert to pixel art style
3. **Extract Layers**: Separate into body, clothing, accessories
4. **Resize**: Downscale to target resolution (128x128px or 192x192px)

**Option C: Hybrid Workflow**
1. **Generate Full Heroes**: AI creates complete hero portraits (front-facing, consistent pose)
2. **Layer Extraction**: Use Photoshop/GIMP with masks to extract clothing layers
3. **Standardize**: Ensure all layers align to same base proportions
4. **Pixel Refinement**: Add pixel art polish, fix inconsistencies

**Software Stack**:
- **AI Generation**: Midjourney, DALL-E 3, Stable Diffusion (with ControlNet for consistency), Adobe Firefly
- **Post-Processing**: Aseprite, Pyxel Edit, Photoshop, GIMP
- **Layer Management**: Photoshop layers, or dedicated sprite sheet tools
- **Organization**: Separate sprite sheets per layer type (body variants, clothing sets, accessories)

**Naming Convention**: `hero_body_01.png`, `hero_clothing_business_01.png`, `hero_accessory_tie_01.png`

**Generation Tool**: Build Node.js/Python script to combine layers programmatically (for final hero sprites)

#### Implementation Example
```typescript
interface HeroVisualLayers {
  bodyBase: string;        // "body_01", "body_02" (skin tone variants)
  clothingTop: string;     // "shirt_business_01", "vest_tactical_01"
  clothingBottom: string;  // "pants_slacks_01", "pants_cargo_01"
  hair: string;            // "hair_short_01", "hair_long_02"
  face: string;            // "face_male_01", "face_female_02"
  accessory1?: string;     // "accessory_tie_01", "accessory_badge_01"
  accessory2?: string;     // "accessory_glasses_01", "accessory_watch_01"
  equipmentWeapon?: string; // Overlay for visible weapon
  equipmentArmor?: string;  // Overlay for armor/helmet
}

// Rendering: Composite layers in order, CSS z-index or Canvas API
```

#### Color Palette (Pixel Art)
```css
/* Corporate Base */
--pixel-gray-1: #1a1a1a;    /* Dark shadow */
--pixel-gray-2: #4a5568;    /* Primary gray */
--pixel-gray-3: #718096;    /* Mid gray */
--pixel-gray-4: #a0aec0;    /* Light gray */

/* Fantasy Accents */
--pixel-blue: #3182ce;      /* Professional blue */
--pixel-purple: #805ad5;    /* Brand purple */
--pixel-gold: #d69e2e;      /* Corporate gold */

/* Skin Tones (5 variants) */
--pixel-skin-1: #f4d5a0;    /* Light */
--pixel-skin-2: #e6c385;
--pixel-skin-3: #d4a574;
--pixel-skin-4: #8b5a3c;
--pixel-skin-5: #5a3a2a;    /* Dark */
```

**Variety Estimate**: 
- 5 body bases × 8 tops × 6 bottoms × 10 hair × 6 faces × 12 accessories = **172,800 combinations**
- Realistic subset: ~500 curated combinations = plenty of variety

---

### **RECOMMENDATION #2: Vector Illustration / Flat Design**

**Description**: Clean, modern vector illustrations with corporate-friendly flat colors. Similar to **Duolingo**, **Slack**, or **Discord** character styles.

#### Visual Characteristics
- **Style**: Flat 2D illustrations, minimal shading, geometric shapes
- **Palette**: Corporate muted colors with fantasy accents (matches UI perfectly)
- **Detail Level**: Medium-low detail, icon-like clarity
- **File Format**: SVG (scalable, small file sizes)

#### Layer System Structure
```
Layer Order:
1. Body Shape (simple silhouette, rounded rectangles)
2. Base Clothing (shirt, pants as vector shapes)
3. Accent Clothing (jacket, vest overlay)
4. Accessories (tie, badge, glasses - geometric shapes)
5. Head/Hair (simplified face, hair as geometric blocks)
6. Equipment (weapon/armor as simple vector icons)
```

#### Example Combinations
- **Tank**: Square/wide body, tactical vest, utility belt, clipboard
- **Healer**: Rounded/soft body, lab coat, stethoscope, friendly expression
- **Ranged DPS**: Lean/tall body, utility vest, goggles, crossbow visible
- **Caster**: Medium body, robes, staff holster, mystical crystal

#### Pros ✅
- **Perfect UI Match**: Vector style aligns with modern corporate UI aesthetic
- **Scalability**: SVG scales perfectly on any screen (mobile to 4K)
- **File Size**: SVG compresses very well (< 2KB per layer)
- **Flexibility**: Easy to recolor, animate, or modify programmatically
- **Accessibility**: High contrast, clear shapes (color-blind friendly)
- **Web-Native**: SVG renders natively in browsers, no image decoding
- **Tone Match**: Modern, professional look supports corporate theme

#### Cons ❌
- **Character Appeal**: May feel "corporate" rather than "gaming" (too safe?)
- **Personality**: Harder to show character quirks/humor in flat design
- **Variety Limitations**: Geometric shapes limit body/face variation
- **Art Direction**: Requires skilled vector illustrator (or consistent asset library)

#### Asset Pipeline
- **Software**: Figma, Adobe Illustrator, or Inkscape
- **Export**: SVG with consistent viewBox (e.g., 200x200px)
- **Organization**: Separate SVG files per layer, combine via CSS or JavaScript
- **Color System**: CSS variables for corporate palette (easy theming)

#### Implementation Example
```typescript
interface HeroVisualLayers {
  bodyBase: string;        // SVG path or component
  clothing: string[];
  accessories: string[];
  hair: string;
  equipment: string[];
}

// Rendering: Inline SVG with <g> groups, or Vue component composition
```

**Variety Estimate**: 
- 4 body shapes × 6 clothing sets × 5 hair × 4 faces × 10 accessories = **4,800 combinations**
- More limited than pixel art, but sufficient for 15-30 heroes

---

### **RECOMMENDATION #3: Hand-Drawn Cartoon / Paper Cutout Style**

**Description**: Whimsical, hand-drawn cartoon style with paper cutout aesthetic. Similar to **Paper Mario**, **Don't Starve**, or **Overcooked**.

#### Visual Characteristics
- **Style**: Hand-drawn line art with flat colors, paper texture optional
- **Palette**: Muted corporate colors with quirky fantasy accents
- **Detail Level**: Medium detail, expressive faces, personality-driven
- **File Format**: PNG with transparency, or SVG with hand-drawn paths

#### Layer System Structure
```
Layer Order:
1. Body Base (hand-drawn silhouette)
2. Clothing Layer 1 (base - shirt/pants)
3. Clothing Layer 2 (overlay - jacket, vest)
4. Accessories (hand-drawn details - tie, badge, quirky items)
5. Head/Hair (expressive face, unique hair)
6. Equipment (drawn weapons/armor with personality)
```

#### Example Combinations
- **Tank**: Stocky frame, oversized tactical vest, grumpy expression, clipboard as weapon
- **Healer**: Soft round body, lab coat, kind expression, coffee mug accessory
- **Ranged DPS**: Lanky frame, utility belt, mischievous grin, oversized crossbow
- **Support**: Varied body types, multiple accessories (glasses, badge, tablet), friendly face

#### Pros ✅
- **Personality**: Hand-drawn style supports character quirks and humor perfectly
- **Tone Match**: Inherently playful, supports gaming parody (70%) tone
- **Memorable**: Unique style stands out in crowded market
- **Expression**: Can show emotion/personality easily (faces, poses)
- **Corporate Twist**: Can incorporate business casual with cartoon exaggeration

#### Cons ❌
- **Consistency**: Harder to maintain visual consistency across artists/stylists
- **File Size**: Hand-drawn PNGs may be larger (~10-20KB per layer)
- **Layer Alignment**: Hand-drawn layers may not align perfectly (requires careful registration)
- **Scalability**: PNG doesn't scale well (needs multiple resolutions)
- **Production Time**: Takes longer to create than pixel art or vector

#### Asset Pipeline
- **Software**: Procreate, Clip Studio Paint, or Photoshop with hand-drawn brushes
- **Organization**: Separate PNG files per layer, careful registration marks
- **Color System**: Colorize line art to match corporate palette
- **Consistency**: Create style guide with proportions, line weights, color swatches

**Variety Estimate**: 
- 5 body types × 8 clothing × 8 hair × 6 faces × 10 accessories = **19,200 combinations**
- More expressive variation possible with hand-drawn style

---

### **RECOMMENDATION #4: Low-Poly 3D / Isometric Sprites** (Not Recommended)

**Description**: 3D rendered models exported as 2D sprites, or low-poly isometric style.

#### Visual Characteristics
- **Style**: 3D models with low polygon count, rendered to 2D sprites
- **Palette**: Corporate colors applied as textures
- **Detail Level**: Low-medium detail, geometric aesthetic

#### Pros ✅
- **Modern Look**: Feels current and polished
- **Consistent**: 3D models ensure perfect layer alignment

#### Cons ❌
- **Overkill**: 3D pipeline is unnecessary for 2D web game
- **File Size**: 3D models or high-res renders are large
- **Complexity**: Requires 3D artist and rendering pipeline
- **Tone Mismatch**: Too "serious" for gaming parody tone
- **Mobile Performance**: 3D assets may impact mobile performance

**Recommendation**: ❌ **SKIP** - Not worth the complexity for this project.

---

## 🤖 AI-Assisted Asset Generation Strategy

### Recommended Tools & Workflows

#### **Option 1: Midjourney** (Best Quality, Fast Iteration)
**Strengths**: Excellent style consistency with `--style` parameter, high-quality output
**Workflow**:
1. Create style reference image (1-2 hero prototypes)
2. Use `--style raw` or custom style parameters for consistency
3. Generate hero layers with prompts like:
   - `"hero body, front-facing sprite, pixel art style, 192x192px, corporate fantasy RPG character, muted colors, business casual --style raw --ar 1:1"`
   - `"hero clothing layer, business shirt with tie, pixel art, 192x192px, front-facing, consistent proportions --style raw"`
4. Batch generate 20-30 variants per layer type
5. Post-process: Extract consistent layers, align to base, pixel-perfect cleanup

**Cost**: ~$10-30/month for basic plan (enough for asset generation)

#### **Option 2: Stable Diffusion + ControlNet** (Best Consistency, Free)
**Strengths**: Free, open-source, ControlNet ensures perfect layer alignment
**Workflow**:
1. **Create Base Template**: Design one reference hero sprite with clear layer separation
2. **ControlNet Setup**: Use OpenPose or Canny edge detection to maintain pose/alignment
3. **Generate Variants**: 
   - Use same base pose for all body layers
   - Generate clothing/accessories with same control map
   - Ensures perfect layer stacking compatibility
4. **Model Recommendations**: 
   - `pixel-art-diffusion` (pixel art specific)
   - `Stable Diffusion 1.5` or `SDXL` with pixel art LoRA
5. **Batch Processing**: Generate 50+ variations quickly

**Cost**: Free (runs locally) or ~$0.01-0.05 per image on cloud services

#### **Option 3: DALL-E 3** (Best Prompt Following, Easy Integration)
**Strengths**: Excellent at following detailed prompts, corporate aesthetic easy to describe
**Workflow**:
1. Create detailed prompt templates per layer type
2. Use consistent style descriptors: `"pixel art, corporate fantasy RPG, muted colors, business casual"`
3. Generate variations by changing specific elements (hair color, clothing item, accessory)
4. Post-process: Extract layers, align, pixel-perfect cleanup

**Cost**: ~$0.04-0.08 per image, pay-as-you-go

#### **Option 4: Adobe Firefly** (Integration with Creative Suite)
**Strengths**: Integrated with Photoshop, good for post-processing workflow
**Workflow**:
1. Generate base hero illustrations in Firefly
2. Import to Photoshop for layer extraction
3. Use Photoshop's pixel art tools for refinement
4. Export as PNG sprites

**Cost**: Included with Adobe Creative Cloud ($20-50/month)

### AI Prompt Templates for Hero Generation

#### Base Hero Prompt Template
```
[PIXEL ART / HIGH-RES PIXEL ART STYLE]
A [ARCHETYPE] hero character, front-facing sprite,
[RESOLUTION]px resolution, RPG character,
corporate fantasy aesthetic, muted [COLOR SCHEME] colors,
business casual clothing, [SPECIFIC CLOTHING ITEMS],
[DETAILS: hair, accessories, expression],
clean background, transparent or solid color background,
consistent proportions, game sprite style

Style modifiers: [pixel art / high-resolution pixel art / modern pixel art],
--style raw (Midjourney) or equivalent
```

#### Layer-Specific Prompts

**Body Base Layer**:
```
High-resolution pixel art, hero character body base,
front-facing, [BODY TYPE: slim/average/stocky/wide/lean],
[SKIN TONE], no clothing, no accessories,
192x192px, transparent background,
consistent proportions, corporate fantasy RPG style
```

**Clothing Top Layer**:
```
High-resolution pixel art, hero clothing layer,
[CLOTHING TYPE: business shirt / tactical vest / lab coat / robes],
front-facing, 192x192px, transparent background,
corporate fantasy aesthetic, [COLOR],
matches hero body proportions, layer sprite
```

**Accessories Layer**:
```
High-resolution pixel art, hero accessory,
[ACCESSORY: tie / badge / goggles / stethoscope / clipboard],
front-facing, 192x192px, transparent background,
corporate fantasy style, matches hero proportions,
layer sprite, positioned correctly on character
```

### Maintaining Consistency with AI Generation

#### Strategy 1: Reference Images
- Generate 2-3 "master" hero references in exact style
- Use as image prompts for all subsequent generations
- Ensures color palette, proportions, and style stay consistent

#### Strategy 2: ControlNet (Stable Diffusion)
- Create one perfect base template with layer guides
- Use ControlNet's Canny or OpenPose to maintain structure
- All generated layers will align perfectly

#### Strategy 3: Style Seeds
- Generate with consistent style seed or style parameters
- Use same artist/style references across all generations
- Document successful prompt formulas for reuse

#### Strategy 4: Post-Processing Pipeline
1. **Batch Resize**: Ensure all layers are same resolution
2. **Alignment Check**: Verify layers align to base template
3. **Color Correction**: Normalize colors to corporate palette
4. **Pixel Cleanup**: Remove anti-aliasing, ensure pixel-perfect edges
5. **Layer Validation**: Test layer stacking before approval

### Production Timeline with AI

**Traditional Pixel Art**: 2-4 weeks for complete hero asset set
**AI-Assisted Workflow**: 3-5 days for complete hero asset set

**Breakdown**:
- Day 1: Style exploration, generate 5-10 test heroes, refine prompts
- Day 2: Batch generate all body bases (50+ variations)
- Day 3: Batch generate clothing layers (100+ variations)
- Day 4: Batch generate accessories (50+ variations)
- Day 5: Post-process, align layers, create sprite sheets, test compositing

**Quality Check**: Spend 1-2 days curating best combinations, fixing alignment issues, pixel-perfect cleanup

---

## 🎯 Final Recommendation: **High-Resolution Pixel Art (128-192px) with AI-Assisted Generation**

### Why High-Resolution Pixel Art + AI is the Best Fit

1. **Unique Visual Identity**:
   - Higher-res pixel art (128-192px) is distinctive in indie market
   - Modern polish while maintaining pixel art charm
   - Stands out from both retro pixel games and full illustrations

2. **AI Generation Speed**:
   - Generate 100+ layer variations in days, not weeks
   - Batch processing with consistent style
   - Iterate quickly on style until perfect

3. **Perfect Technical Match**:
   - Still easy layer compositing (PNG with alpha)
   - File sizes manageable (10-25KB per layer)
   - Simple rendering (Canvas or CSS stacking)

4. **Aesthetic Alignment**:
   - Corporate colors work excellently in high-res pixel art
   - Can incorporate business casual details clearly (ties, badges, blazers)
   - More detail = better personality expression

5. **Tone Support**:
   - Pixel art inherently supports parody/humor
   - Higher detail allows for subtle character quirks
   - Meme-friendly (players appreciate the style)

6. **Production Efficiency**:
   - AI handles bulk generation (80% of work)
   - Human focuses on curation and polish (20% of work)
   - Fast iteration and experimentation

7. **Extensibility**:
   - Easy to add new layer sets over time
   - Compatible with equipment overlays (Phase 1+)
   - Works well for animations (idle, equipment effects)

### Style Direction: **Modern Corporate Pixel Art**

**Inspiration References**:
- **Dead Cells** (high-res pixel art, smooth animations, great layering)
- **Hades** (pixel art with painted detail overlay)
- **Eastward** (modern pixel art with sophisticated color work)
- **Papers, Please** (corporate bureaucracy aesthetic)
- **Darkest Dungeon** (muted palette, character personality)

**Key Visual Principles**:
- **Resolution**: 128x128px or 192x192px base (scaled 2-3x = 256-576px display size)
- **Style**: Pixel art foundation with optional smooth gradients or painted detail overlays
- **Palette**: Muted grays/blues with fantasy purple/gold accents
- **Business Casual**: Ties, button-ups, blazers, tactical vests, badges (clear detail at higher res)
- **Personality**: Expressive faces, quirky accessories (coffee mug, clipboard, tablet) - visible detail
- **Archetype Hints**: Clear visual cues (Tank = wider frame, Healer = softer features)

### Unique Style Variations to Consider

#### Variation A: "Smooth Pixel Art"
- 192x192px base with anti-aliasing enabled
- Smooth gradients instead of dithering
- Pixel-perfect edges, but smoother shading
- More modern, less retro

#### Variation B: "Painted Pixel Art" (Hybrid)
- 192x192px base pixel art structure
- Painted detail overlay for faces/hair/clothing texture
- Best of both worlds: pixel charm + painted sophistication
- Similar to Hades' style approach

#### Variation C: "High-Contrast Pixel Art"
- 128x128px base, very clean pixel art
- Strong contrast, clear shapes
- Bold corporate colors
- Accessible, clear at any size

---

## 📋 Implementation Roadmap

### Phase 1: Style Selection & AI Setup (Days 1-2)
1. ✅ Review recommendations (this document)
2. Select AI tool (Midjourney, Stable Diffusion, or DALL-E)
3. Generate 10-20 test heroes with AI, explore styles
4. Refine prompts, establish style parameters
5. Create 2-3 final hero prototypes as style references
6. Document successful prompt formulas

### Phase 2: AI Pipeline Setup (Days 3-4)
1. Set up batch generation workflow
2. Create prompt templates for each layer type
3. Test layer alignment (use ControlNet if Stable Diffusion)
4. Build base template/reference for consistency
5. Create post-processing scripts (resize, align, extract layers)

### Phase 3: Asset Production with AI (Days 5-7)
1. **Day 5**: Batch generate body bases (50+ variations)
2. **Day 6**: Batch generate clothing layers (100+ variations)
3. **Day 7**: Batch generate accessories and hair (50+ variations)

### Phase 4: Post-Processing & Curation (Days 8-9)
1. Extract layers from AI outputs
2. Align all layers to base template
3. Normalize colors to corporate palette
4. Pixel-perfect cleanup (if needed)
5. Curate best combinations (remove duplicates, select variety)
6. Export sprite sheets or individual PNGs
7. Optimize file sizes (compress PNGs, remove metadata)

### Phase 4: Technical Implementation (Week 5)
1. Build layer compositing system (TypeScript utility)
2. Create hero visual generation function
3. Integrate with hero creation system
4. Test randomization and variety

### Phase 5: Polish & Testing (Week 6)
1. Review visual variety (ensure no duplicate-looking heroes)
2. Test on mobile (scaling, performance)
3. Test color-blind accessibility
4. Add equipment overlay system (if Phase 1 includes equipment visuals)

---

## 🎨 Visual Style Guide Template (Pixel Art)

### Resolution & Scaling
- **Base Sprite Size**: **128x128px or 192x192px** (recommended: 192x192px for better detail)
- **Display Size**: 256-384px (2x scaling) or 384-576px (3x scaling) via CSS or Canvas
- **Mobile Scaling**: 192-256px (1.5-2x) for smaller screens, still clear
- **Pixel Perfect**: 
  - **Smooth Pixel Art**: Use `image-rendering: auto` or `crisp-edges` (allows smoothing)
  - **Sharp Pixel Art**: Use `image-rendering: pixelated` or nearest-neighbor (no smoothing)

### Color Palette
```css
/* Corporate Base (Primary) */
--hero-bg: #1a202c;         /* Dark background */
--hero-gray-1: #2d3748;     /* Dark gray */
--hero-gray-2: #4a5568;     /* Mid gray */
--hero-gray-3: #718096;     /* Light gray */

/* Corporate Accents */
--hero-blue: #3182ce;       /* Professional blue */
--hero-purple: #805ad5;     /* Brand purple */
--hero-gold: #d69e2e;       /* Corporate gold */

/* Fantasy Accents (Rare) */
--hero-red: #e53e3e;        /* Epic/Legendary rarity */
--hero-orange: #f59e0b;     /* Legendary rarity */

/* Skin Tones (5 variants) */
--hero-skin-1: #f4d5a0;     /* Light */
--hero-skin-2: #e6c385;
--hero-skin-3: #d4a574;
--hero-skin-4: #8b5a3c;
--hero-skin-5: #5a3a2a;     /* Dark */
```

### Layer Categories & Counts

#### Body Base (5 variants)
- Different body shapes: Slim, Average, Stocky, Wide, Lean
- Skin tone variations: 5 options per body type

#### Clothing - Top (10-12 variants)
- Business Casual: Button-up shirt (3 colors), Blazer, Vest
- Tactical: Tactical vest, Utility shirt, Cargo shirt
- Fantasy: Robes, Tunic, Cloak
- Accessory Layer: Tie (4 colors), Bow tie, Scarf

#### Clothing - Bottom (6-8 variants)
- Business: Slacks (3 colors), Dress pants
- Casual: Cargo pants, Utility pants
- Fantasy: Robes, Fantasy trousers

#### Hair (8-10 variants)
- Short: Business cut, Buzz cut, Crew cut
- Medium: Wavy, Straight, Messy
- Long: Ponytail, Braid, Loose
- Bald option

#### Face (6 variants)
- Male: 3 expressions (neutral, confident, serious)
- Female: 3 expressions (neutral, friendly, determined)

#### Accessories (12-15 variants)
- Corporate: Badge, Clipboard, Tablet, Coffee mug
- Tactical: Goggles, Headset, Utility belt
- Fantasy: Crystal, Amulet, Scroll
- Personality: Glasses, Monocle, Pocket watch

### Archetype Visual Cues

| Archetype | Body Shape | Clothing | Accessories |
|-----------|------------|----------|-------------|
| **Tank** | Wide/Stocky | Tactical vest, Heavy armor overlay | Badge, Clipboard |
| **Healer** | Soft/Rounded | Lab coat, Medical vest | Stethoscope, Coffee mug |
| **Ranged DPS** | Lean/Tall | Utility vest, Cargo pants | Goggles, Crossbow visible |
| **Melee DPS** | Muscular | Tactical shirt, Armor overlay | Weapon holster, Badge |
| **Caster** | Medium | Robes over shirt, Mystical vest | Crystal, Scroll, Staff |
| **Support** | Varied | Business casual, Versatile | Tablet, Multiple accessories |

---

## 🔧 Technical Implementation Overview

### Layer Compositing System

**Option A: CSS Stacking (Simple)**
```typescript
// Generate CSS classes for each layer
function generateHeroVisual(hero: Hero): string {
  return `
    <div class="hero-sprite">
      <div class="hero-layer body-${hero.visualLayers.bodyBase}"></div>
      <div class="hero-layer clothing-top-${hero.visualLayers.clothingTop}"></div>
      <div class="hero-layer clothing-bottom-${hero.visualLayers.clothingBottom}"></div>
      <div class="hero-layer hair-${hero.visualLayers.hair}"></div>
      <div class="hero-layer face-${hero.visualLayers.face}"></div>
      ${hero.visualLayers.accessory1 ? `<div class="hero-layer accessory-${hero.visualLayers.accessory1}"></div>` : ''}
      ${hero.visualLayers.accessory2 ? `<div class="hero-layer accessory-${hero.visualLayers.accessory2}"></div>` : ''}
    </div>
  `;
}

// CSS
.hero-sprite {
  position: relative;
  width: 192px;
  height: 192px;
}

.hero-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain;
  image-rendering: pixelated; /* Pixel-perfect scaling */
}
```

**Option B: Canvas API (Advanced)**
```typescript
function drawHeroSprite(canvas: HTMLCanvasElement, hero: Hero): void {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false; // Pixel-perfect
  
  const layers = [
    `body_${hero.visualLayers.bodyBase}`,
    `clothing_top_${hero.visualLayers.clothingTop}`,
    `clothing_bottom_${hero.visualLayers.clothingBottom}`,
    `hair_${hero.visualLayers.hair}`,
    `face_${hero.visualLayers.face}`,
    hero.visualLayers.accessory1 && `accessory_${hero.visualLayers.accessory1}`,
    hero.visualLayers.accessory2 && `accessory_${hero.visualLayers.accessory2}`,
  ].filter(Boolean);
  
  layers.forEach(layer => {
    const img = loadImage(`/hero-assets/${layer}.png`);
    ctx.drawImage(img, 0, 0, 192, 192);
  });
}
```

**Option C: SVG Sprites (If using vector style)**
```typescript
// Combine SVG layers into single SVG element
function generateHeroSVG(hero: Hero): string {
  return `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g id="body">${getBodySVG(hero.visualLayers.bodyBase)}</g>
      <g id="clothing">${getClothingSVG(hero.visualLayers.clothingTop)}</g>
      <g id="hair">${getHairSVG(hero.visualLayers.hair)}</g>
      <g id="accessories">${getAccessoriesSVG(hero.visualLayers.accessory1)}</g>
    </svg>
  `;
}
```

---

## ✅ Next Steps

1. **Review & Approve**: Confirm high-resolution pixel art style recommendation
2. **Choose AI Tool**: Select AI generation tool (Midjourney recommended for quality, Stable Diffusion for consistency)
3. **Style Exploration**: Generate 5-10 test heroes with AI, refine prompts and style
4. **Create Prototype**: Design 2-3 final hero examples, establish style guide
5. **Build AI Pipeline**: Set up batch generation workflow, create prompt templates
6. **Test Layer System**: Build proof-of-concept layer compositing (CSS or Canvas)
7. **Production Sprint**: Batch generate all hero assets (3-5 days with AI)
8. **Quality Pass**: Curate best combinations, fix alignment, pixel-perfect cleanup
9. **Integration**: Implement layer compositing system, integrate with hero creation
10. **Polish & Testing**: Test variety, mobile scaling, accessibility

---

## 📝 Questions for Discussion

1. **AI Tool Selection**: Which AI tool should we use? (Midjourney for quality, Stable Diffusion for consistency/cost, DALL-E for ease)
2. **Resolution Final Choice**: 128x128px (smaller files) or 192x192px (more detail)? Recommended: 192x192px
3. **Style Variant**: Smooth pixel art, painted pixel art, or high-contrast? Need to decide for consistency
4. **Equipment Visuals**: Should equipment (weapons, armor) be visible on heroes in Phase 1, or deferred to Phase 2?
5. **Animation**: Do we want idle animations (breathing, equipment sway) in Phase 1, or static sprites?
6. **Rarity Visuals**: Should higher rarity heroes have unique visual treatments (golden glow, particle effects, special accessories)?
7. **Post-Processing Budget**: Do we have time/budget for pixel-perfect cleanup, or use AI output as-is?
8. **Layer Alignment Strategy**: Use ControlNet for perfect alignment, or manual post-processing?

---

---

## 🎨 Practical AI Prompt Examples

### Ready-to-Use Prompts for Midjourney

#### Base Hero (Full Character, for Style Reference)
```
pixel art style, hero character sprite, front-facing, RPG character, 
corporate fantasy aesthetic, business casual clothing, muted gray and blue colors, 
purple and gold accents, 192x192px resolution, clean background, 
modern pixel art with smooth shading, consistent proportions, 
game character sprite --style raw --ar 1:1 --v 6
```

#### Body Base Layer
```
pixel art, hero character body base, front-facing sprite, 
no clothing, no accessories, [slim/average/stocky/wide/lean] body type, 
[light/medium/dark] skin tone, 192x192px, transparent background, 
corporate fantasy RPG style, consistent proportions, body layer sprite --ar 1:1 --v 6
```

#### Clothing Top (Business Shirt)
```
pixel art, hero clothing layer, business button-up shirt, front-facing, 
[gray/navy/white] color, tie included, 192x192px, transparent background, 
matches hero body proportions, corporate fantasy style, layer sprite --ar 1:1 --v 6
```

#### Clothing Top (Tactical Vest)
```
pixel art, hero clothing layer, tactical vest over shirt, front-facing, 
utility pockets, [gray/olive/tan] color, 192x192px, transparent background, 
matches hero body proportions, corporate fantasy RPG style, layer sprite --ar 1:1 --v 6
```

#### Accessories (Badge/Clipboard)
```
pixel art, hero accessory, corporate badge or clipboard, front-facing, 
positioned on character chest/shoulder, 192x192px, transparent background, 
corporate fantasy style, matches hero proportions, accessory layer sprite --ar 1:1 --v 6
```

### Ready-to-Use Prompts for Stable Diffusion

#### Base Prompt (SD 1.5)
```
(pixel art:1.3), (high resolution:1.2), hero character sprite, 
front-facing, RPG character, corporate fantasy aesthetic, 
business casual clothing, muted gray and blue colors, 
192x192px resolution, clean background, 
modern pixel art style, consistent proportions, 
game character sprite, high quality, detailed

Negative prompt: realistic, photorealistic, 3d render, blurry, low quality
```

#### With ControlNet (for Layer Alignment)
```
Use Canny edge detection or OpenPose controlnet with base template.
Same prompt as above, but add: [same pose as reference, 
same proportions as reference]
```

### Tips for AI Generation Success

1. **Start with Style References**: Generate 5-10 full heroes first, pick best 2-3 as style references
2. **Use Image Prompts**: Feed style references back into AI for consistency
3. **Batch Variations**: Generate 10-20 variations per prompt, pick best 3-5
4. **Iterate Prompts**: Refine prompts based on results (too pixelated? too smooth?)
5. **Post-Process Always**: AI output needs alignment/color correction/pixel cleanup
6. **Document Success**: Save winning prompts in a prompt library for reuse

### Post-Processing Checklist

After AI generation, always:
- [ ] Resize to exact dimensions (128x128px or 192x192px)
- [ ] Align to base template (use guides/overlays)
- [ ] Normalize colors (match corporate palette)
- [ ] Remove background (extract to transparency)
- [ ] Fix pixel artifacts (clean up stray pixels)
- [ ] Verify layer stacking (test compositing)
- [ ] Optimize file size (compress PNG, remove metadata)

---

**Document Owner**: Design Team
**Status**: ✅ Recommendations Complete → Awaiting Approval
**Next Review**: After style selection and prototype review

