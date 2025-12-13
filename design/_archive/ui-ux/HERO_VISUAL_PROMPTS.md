# Hero Visual Generation Prompts
**Dungeon Farmers - AI Prompt Library for Hero Sprite Generation**

**Last Updated**: 2025-11-23
**Purpose**: Ready-to-use prompts for testing and generating hero sprites in different art styles
**Tools**: Midjourney, DALL-E 3, Stable Diffusion, Adobe Firefly

---

## 🎯 How to Use This Library

1. **Style Testing**: Generate 3-5 variations per style to see what works best
2. **Archetype Variation**: Replace `[ARCHETYPE]` with Tank, Healer, Ranged DPS, Melee DPS, Caster, or Support
3. **Tool Adaptation**: Each prompt includes tool-specific notes
4. **Iteration**: Refine prompts based on results (add/remove modifiers as needed)

---

## 🎨 Style Category 1: High-Resolution Pixel Art (RECOMMENDED)

### Midjourney Prompts

#### Base Hero (Full Character - Style Reference)
```
pixel art style, hero character sprite, [ARCHETYPE] class, front-facing portrait, 
corporate fantasy RPG character, business casual clothing with fantasy elements, 
muted gray and slate blue color scheme, purple and gold accent colors, 
192x192px resolution, modern pixel art with smooth shading and anti-aliasing, 
clean transparent background, consistent proportions, game character sprite, 
high quality, detailed --style raw --ar 1:1 --v 6
```

#### Tank Archetype
```
pixel art style, Tank hero character sprite, front-facing, 
stocky wide body frame, tactical vest over business shirt, utility belt, 
corporate badge or clipboard accessory, confident expression, 
muted gray and navy blue colors, purple accent, 192x192px, 
modern pixel art, smooth shading, transparent background --style raw --ar 1:1 --v 6
```

#### Healer Archetype
```
pixel art style, Healer hero character sprite, front-facing, 
soft rounded body frame, lab coat or medical vest over shirt, 
stethoscope accessory, kind friendly expression, 
muted gray and soft blue colors, gold accent, 192x192px, 
modern pixel art, smooth shading, transparent background --style raw --ar 1:1 --v 6
```

#### Ranged DPS Archetype
```
pixel art style, Ranged DPS hero character sprite, front-facing, 
lean tall body frame, utility vest and cargo pants, 
goggles or headset accessory, crossbow visible on back, 
determined expression, muted gray and olive green colors, purple accent, 
192x192px, modern pixel art, smooth shading, transparent background --style raw --ar 1:1 --v 6
```

#### Caster Archetype
```
pixel art style, Caster hero character sprite, front-facing, 
medium body frame, robes over business shirt, mystical vest, 
crystal or scroll accessory, staff holster visible, mystical expression, 
muted gray and deep purple colors, gold accent, 192x192px, 
modern pixel art, smooth shading, transparent background --style raw --ar 1:1 --v 6
```

### DALL-E 3 Prompts

#### Base Hero (Full Character)
```
A pixel art style hero character sprite for a corporate fantasy RPG game. 
The character is front-facing, wearing business casual clothing with fantasy 
elements (like a tactical vest over a button-up shirt, or robes over corporate 
attire). Use a muted gray and slate blue color palette with purple and gold 
accents. The style should be modern pixel art at 192x192px resolution with 
smooth shading. Clean transparent background. Consistent proportions suitable 
for a game sprite.
```

#### Tank with Corporate Elements
```
Pixel art sprite of a Tank class hero, front-facing. Stocky wide build wearing 
tactical vest over business shirt, utility belt, corporate badge or clipboard 
accessory. Confident expression. Muted gray and navy blue colors with purple 
accent. 192x192px modern pixel art with smooth shading. Transparent background. 
Corporate fantasy RPG game character style.
```

### Stable Diffusion Prompts

#### Base Prompt Template (SD 1.5 / SDXL)
```
(pixel art:1.3), (high resolution pixel art:1.2), hero character sprite, 
front-facing portrait, [ARCHETYPE] class, corporate fantasy RPG character, 
business casual clothing with fantasy elements, muted gray and slate blue 
color scheme, purple and gold accent colors, 192x192px resolution, 
modern pixel art style with smooth shading, clean transparent background, 
consistent proportions, game character sprite, high quality, detailed, 
corporate aesthetic, professional fantasy

Negative prompt: realistic, photorealistic, 3d render, blurry, low quality, 
watermark, text, logo, low resolution pixel art, retro pixel art, 
chibi style, anime style
```

#### With Pixel Art LoRA (if using SD)
```
(pixel art:1.3), (high resolution pixel art:1.2), hero character sprite, 
front-facing, [ARCHETYPE], corporate fantasy RPG, business casual fantasy 
clothing, muted colors, 192x192px, modern pixel art style, 
<lora:pixel-art-diffusion:0.8>

Negative prompt: realistic, blurry, low quality
```

---

## 🎨 Style Category 2: Smooth Pixel Art (High-Res with Anti-Aliasing)

### Midjourney Prompts

#### Smooth Pixel Hero
```
smooth pixel art style, hero character sprite, [ARCHETYPE] class, 
front-facing portrait, corporate fantasy RPG character, business casual 
clothing, muted gray and blue colors, purple and gold accents, 
192x192px resolution, anti-aliased pixel art, smooth gradients, 
soft shading, clean background, game sprite --style raw --ar 1:1 --v 6
```

### DALL-E 3 Prompts

#### Smooth Pixel Style
```
A smooth pixel art hero character sprite with anti-aliasing and soft shading. 
Front-facing corporate fantasy RPG character in business casual clothing. 
Muted gray and blue color palette with purple and gold accents. 192x192px 
resolution. The pixel art should use smooth gradients rather than dithering. 
Clean transparent background.
```

---

## 🎨 Style Category 3: Painted Pixel Art (Hybrid Style)

### Midjourney Prompts

#### Painted Pixel Hybrid
```
pixel art base with painted detail overlay, hero character sprite, 
[ARCHETYPE] class, front-facing, corporate fantasy RPG character, 
business casual clothing with fantasy elements, muted gray and blue colors, 
purple and gold accents, 192x192px, painted textures on pixel art structure, 
sophisticated shading, clean background, game sprite --style raw --ar 1:1 --v 6
```

### DALL-E 3 Prompts

#### Hybrid Painted Style
```
A hero character sprite combining pixel art structure with painted detail 
overlay. Think pixel art foundation but with painted textures for hair, 
clothing, and accessories. Front-facing corporate fantasy RPG character in 
business casual clothing. Muted gray and blue colors with purple and gold 
accents. 192x192px. Sophisticated yet maintains pixel art charm. Transparent 
background.
```

---

## 🎨 Style Category 4: Vector Illustration / Flat Design

### Midjourney Prompts

#### Vector Flat Style
```
vector illustration style, flat design, hero character, [ARCHETYPE] class, 
front-facing portrait, corporate fantasy RPG character, business casual 
clothing, geometric shapes, clean lines, muted gray and blue color palette, 
purple and gold accents, 192x192px, flat colors, minimal shading, 
corporate aesthetic, game character --style raw --ar 1:1 --v 6
```

### DALL-E 3 Prompts

#### Vector Illustration
```
A flat vector illustration of a hero character sprite. Front-facing corporate 
fantasy RPG character in business casual clothing. Geometric shapes, clean 
lines, flat colors with minimal shading. Muted gray and blue palette with 
purple and gold accents. 192x192px. Corporate aesthetic similar to Duolingo 
or Slack character styles. Transparent background.
```

---

## 🎨 Style Category 5: Hand-Drawn Cartoon / Paper Cutout

### Midjourney Prompts

#### Hand-Drawn Cartoon
```
hand-drawn cartoon style, hero character sprite, [ARCHETYPE] class, 
front-facing portrait, corporate fantasy RPG character, business casual 
clothing, expressive line art, muted gray and blue colors, purple and gold 
accents, 192x192px, whimsical personality, paper cutout aesthetic, 
game character sprite --style raw --ar 1:1 --v 6
```

### DALL-E 3 Prompts

#### Cartoon Paper Cutout
```
A hand-drawn cartoon hero character sprite with paper cutout aesthetic. 
Front-facing corporate fantasy RPG character in business casual clothing. 
Expressive line art, whimsical personality, muted gray and blue colors with 
purple and gold accents. 192x192px. Similar style to Paper Mario or Don't 
Starve. Clean transparent background.
```

---

## 🎨 Style Category 6: High-Contrast Pixel Art (Sharp, Bold)

### Midjourney Prompts

#### High-Contrast Pixel
```
pixel art style, hero character sprite, [ARCHETYPE] class, front-facing, 
corporate fantasy RPG character, business casual clothing, high contrast, 
bold colors, strong shadows, muted gray and blue palette, purple and gold 
accents, 128x128px resolution, clean pixel art, no anti-aliasing, 
sharp edges, game sprite --style raw --ar 1:1 --v 6
```

### DALL-E 3 Prompts

#### Bold Pixel Art
```
A high-contrast pixel art hero character sprite with bold colors and strong 
shadows. Front-facing corporate fantasy RPG character in business casual 
clothing. Sharp pixel edges, no anti-aliasing. Muted gray and blue palette 
with purple and gold accents. 128x128px resolution. Clean, accessible, 
clear at any size. Transparent background.
```

---

## 🎨 Style Category 7: Isometric Pixel Art (3/4 View)

### Midjourney Prompts

#### Isometric Pixel
```
isometric pixel art style, hero character sprite, [ARCHETYPE] class, 
3/4 view angle, corporate fantasy RPG character, business casual clothing, 
muted gray and blue colors, purple and gold accents, 192x192px, 
modern pixel art, game character sprite --style raw --ar 1:1 --v 6
```

---

## 🎨 Style Category 8: Retro Pixel Art (Classic 8-bit/16-bit)

### Midjourney Prompts

#### Classic Retro Pixel
```
8-bit pixel art style, hero character sprite, [ARCHETYPE] class, 
front-facing, corporate fantasy RPG character, business casual clothing, 
limited color palette, muted gray and blue, purple accent, 
64x64px or 96x96px resolution, classic retro pixel art, dithering, 
game character sprite, nostalgic --style raw --ar 1:1 --v 6
```

---

## 🔧 Layer-Specific Prompts

### Body Base Layer (For Layer Compositing System)

#### Midjourney
```
pixel art, hero character body base layer, front-facing sprite, 
no clothing, no accessories, [slim/average/stocky/wide/lean] body type, 
[light/medium/tan/dark] skin tone, 192x192px, transparent background, 
corporate fantasy RPG style, consistent proportions, body layer sprite, 
suitable for layer compositing --style raw --ar 1:1 --v 6
```

#### DALL-E 3
```
A pixel art body base layer for a hero character sprite system. Front-facing, 
no clothing or accessories visible. [BODY TYPE] build with [SKIN TONE]. 
192x192px resolution. Transparent background. This is a layer that will be 
composited with clothing and accessories, so proportions must be consistent. 
Corporate fantasy RPG style.
```

### Clothing Top Layer

#### Midjourney
```
pixel art, hero clothing layer sprite, [BUSINESS SHIRT / TACTICAL VEST / 
LAB COAT / ROBES], front-facing, [COLOR], 192x192px, transparent background, 
matches standard hero body proportions, corporate fantasy RPG style, 
layer sprite for compositing, no body visible --style raw --ar 1:1 --v 6
```

### Accessories Layer

#### Midjourney
```
pixel art, hero accessory layer, [TIE / BADGE / CLIPBOARD / GOGGLES / 
STETHOSCOPE / CRYSTAL], front-facing, positioned correctly on character, 
192x192px, transparent background, corporate fantasy RPG style, 
matches hero proportions, accessory layer sprite --style raw --ar 1:1 --v 6
```

---

## 🎭 Archetype-Specific Variations

### Tank Hero Variations
- **Body**: Stocky, wide shoulders, muscular
- **Clothing**: Tactical vest, utility belt, heavy armor overlay
- **Accessories**: Badge, clipboard, shield emblem
- **Colors**: Navy blue, dark gray, steel accents

### Healer Hero Variations
- **Body**: Soft, rounded, approachable
- **Clothing**: Lab coat, medical vest, clean white/light blue
- **Accessories**: Stethoscope, coffee mug, healing crystal
- **Colors**: Light blue, white, soft gold accents

### Ranged DPS Hero Variations
- **Body**: Lean, tall, agile
- **Clothing**: Utility vest, cargo pants, lightweight gear
- **Accessories**: Goggles, headset, quiver/crossbow visible
- **Colors**: Olive green, gray, purple accents

### Melee DPS Hero Variations
- **Body**: Muscular, balanced build
- **Clothing**: Tactical shirt, armored pants, combat gear
- **Accessories**: Weapon holster, badge, utility knife
- **Colors**: Dark gray, black, steel accents

### Caster Hero Variations
- **Body**: Medium build, mystical presence
- **Clothing**: Robes over business shirt, mystical vest
- **Accessories**: Crystal, scroll, staff holster, amulet
- **Colors**: Deep purple, dark gray, gold accents

### Support Hero Variations
- **Body**: Varied, versatile
- **Clothing**: Business casual, versatile mix
- **Accessories**: Tablet, multiple accessories, utility items
- **Colors**: Balanced mix, corporate colors

---

## 🔄 Prompt Modification Guide

### To Add More Detail
- Add: `detailed, intricate, high quality, professional`
- Add: `expressive face, personality visible, character expression`

### To Adjust Color Saturation
- Muted: `muted colors, desaturated, subtle palette`
- Vibrant: `vibrant colors, saturated, rich palette`

### To Change Shading Style
- Smooth: `smooth shading, soft gradients, anti-aliased`
- Sharp: `sharp shadows, high contrast, bold shading`
- Pixel-perfect: `no anti-aliasing, pixel-perfect edges, dithering`

### To Adjust Resolution
- Change `192x192px` to `128x128px`, `256x256px`, etc.
- Note: Midjourney may not honor exact pixel dimensions, but the ratio is important

### To Add Corporate Elements
- Add: `corporate badge, business attire, professional uniform`
- Add: `clipboard, tablet, office supplies`

### To Add Fantasy Elements
- Add: `fantasy armor, magical accessories, mystical items`
- Add: `staff, crystal, scroll, potion`

---

## 🧪 Testing Workflow

### Step 1: Generate Style Tests
1. Pick 2-3 style categories from above
2. Generate 5 variations per style using base hero prompts
3. Compare results and select favorite style direction

### Step 2: Refine Style
1. Generate 3-5 heroes in chosen style
2. Test different archetypes (Tank, Healer, DPS, etc.)
3. Refine prompts based on what works

### Step 3: Create Style Reference
1. Select 2-3 best hero examples as style references
2. Use image prompts (Midjourney: `/imagine prompt + image URL`)
3. Generate variations maintaining style consistency

### Step 4: Test Layer System
1. Generate body base layers
2. Generate clothing layers
3. Generate accessories
4. Test compositing (manually or with tool)

### Step 5: Batch Production
1. Use refined prompts to generate 20-50 variations
2. Curate best results
3. Post-process and align layers

---

## 📝 Prompt Tips & Best Practices

### For Midjourney
- Use `--style raw` for more control and consistency
- Use `--v 6` for latest model (best quality)
- Use `--ar 1:1` for square sprites
- Add image URLs for style consistency: `[image URL] + prompt`
- Use `--seed [number]` to maintain consistency across generations

### For DALL-E 3
- Be very specific about style and colors
- Mention "corporate fantasy" explicitly
- Specify transparent background if needed
- Can use style modifiers like "pixel art style, game sprite"

### For Stable Diffusion
- Use negative prompts to exclude unwanted elements
- Load pixel art LoRA models for better results
- Use ControlNet with reference images for consistency
- Adjust CFG scale (7-12) for balance between prompt following and creativity

### General Tips
1. **Start Broad**: Generate full characters first, then refine to layers
2. **Iterate**: Each generation teaches you what works in prompts
3. **Document**: Save successful prompts and parameters
4. **Batch Test**: Generate 10+ variations, pick best 2-3
5. **Post-Process**: AI output always needs cleanup/alignment

---

## 🎯 Recommended Starting Points

### Quick Style Test (Generate 3-5 of each)
1. **High-Res Pixel Art** (192x192px, smooth shading)
2. **Smooth Pixel Art** (192x192px, anti-aliased)
3. **Vector Illustration** (192x192px, flat design)

### Archetype Test (Pick best style, generate all 6)
1. Tank
2. Healer
3. Ranged DPS
4. Melee DPS
5. Caster
6. Support

### Production Ready (After style selection)
1. Generate 50+ body base variations
2. Generate 100+ clothing variations
3. Generate 50+ accessory variations

---

**Document Status**: ✅ Ready for Use
**Next Step**: Generate style tests and select direction
**Tool Preference**: Adjust prompts based on chosen AI tool


