# Trait System Expanded - Dungeon Farmers

**Every Trait Has Trade-Offs | Gaming Parody | Actually Playable**

---

## 🎯 Core Philosophy

**Every trait is gaming/character parody first, mechanics second, but MUST be balanced for actual gameplay.**

**Design Pillars**:
1. **All Traits Have Positives AND Negatives** - Meaningful trade-offs, not punishments
2. **Gaming/Character Humor Primary** - Mock gaming culture, embrace personality
3. **Actually Playable** - No instant death, no 80% fail rates, no soft-locks
4. **Heroes Have 3-10+ Traits** - Trait slots scale with rarity AND level
5. **Relationship Traits** - Dynamic traits based on team composition
6. **Trait Interactions** - Synergies and conflicts create emergent gameplay

**Balance Rule**: Total Numeric Power (TNP) ≈ 0 for all traits
- Calculate: (Sum of positives) - (Sum of negatives) ≈ 0
- Events/flavor don't count toward TNP (cosmetic chaos is free)

**Philosophy Example**:

❌ **Bad Design (Unplayable)**: "Caffeine Elemental" = +100% stats, 1% chance instant death per mission
→ Why: Random instant death ruins runs, creates save-scum behavior

✅ **Good Design (Gaming Parody + Balanced)**: "Caffeine Elemental" = +50% SPD, +30% crit chance, -20% HP, costs 50 gold/expedition (coffee budget), +200% "coffee crisis" events
→ Why: Strong offensive trade-off (SPD/crit for HP), gold cost creates choice, events are funny not punishing

---

## 👥 Heroes Have 3-10+ Traits (Scales with Rarity + Level)

### Trait Slot Scaling System

**Trait slots = Base (by rarity) + Level Bonus**

| Hero Rarity | Base Slots | Level Milestones | Max Slots |
|-------------|------------|------------------|-----------|
| **Common** (100g recruit) | 3 | +1 at Lvl 20, 40 | **5 slots** |
| **Veteran** (500g recruit) | 4 | +1 at Lvl 15, 30, 45 | **7 slots** |
| **Elite** (1500g recruit) | 5 | +1 at Lvl 10, 20, 30, 40, 50 | **10 slots** |
| **Story Hero** (guaranteed) | 4-6 | +1 at Lvl 10, 25, 40 | **7-9 slots** |

**Relationship Traits** (Dynamic, don't count toward slot limit):
- Heroes gain 0-3 relationship traits based on team composition
- Appear/disappear dynamically based on current team
- Shown separately in UI ("Active Relationships" section)

**Example Progression**:
```
THRAIN "DISASTER" IRONFIST (Elite Tank, Level 50)

Permanent Traits (10):
├─ Brave (Common): +20% vs bosses, -10% evasion
├─ ADHD Chaos (Common): +30% multitask, +25% creativity, -30% focus
├─ Last Stand (Rare): +50% stats <25% HP, -15% at full HP
├─ Coffee Addict (Uncommon): +25% SPD, costs 50g/expedition
├─ Disaster Bisexual (Uncommon): +25% charm, +200% romantic chaos events
├─ Autism Coded (Uncommon): +50% in special interest (tanking), -25% elsewhere
├─ Feral Gremlin (Common): +35% damage at night, -30% reputation
├─ Former HR Rep (Uncommon): +35% morale management, -25% combat
├─ Theater Kid Energy (Uncommon): +30% drama rewards, -15% efficiency
└─ Tactician (Rare): +40% strategy, -20% impulsive actions

Relationship Traits (3):
├─ Power Couple with Morrigan (+30% stats together, -30% when apart)
├─ Mentor to Grimble (+30% Grimble XP, -25% own XP)
└─ Workplace Nemesis with Lyra (+20% damage, -25% cooperation)

Total: 10 permanent + 3 relationship = 13 active traits
```

---

## 🎭 Trait Design Template

**Every trait must have**:
- ✅ **Positive Effect(s)** - Valuable mechanical benefit
- ❌ **Negative Effect(s)** - Balanced drawback (NOT instant death/soft-locks)
- 📖 **Flavor Text** - Gaming/character parody voice
- 🎲 **Events** (Optional) - Funny events that don't break gameplay
- 🏰 **System Hooks** (Optional) - Monster/dungeon/equipment interactions
- 💕 **Relationship Impact** (Optional) - How this affects team dynamics

**TNP Calculation Example**:
```
Coffee Addict:
✅ +25% SPD = +25 TNP
❌ -50 gold/expedition = -15 TNP (gold has ~0.3x stat value)
❌ +150% "coffee crisis" events = 0 TNP (events are cosmetic)
Total TNP: +25 -15 = +10 TNP (slightly positive, acceptable)
```

---

## 💕 Relationship Traits (Dynamic, 50 total)

**These traits appear ONLY when specific heroes are on the same team**

### Romantic Relationship Traits

**Secret Crush** (Dynamic, 10% chance to develop per 10 missions together)
- ✅ +20% stats when near crush (trying to impress)
- ✅ +25% to protect crush (takes hits for them)
- ❌ -15% focus (staring at crush mid-combat)
- ❌ -10% stats if crush takes damage (worried)
- 📖 "Has massive crush on [CRUSH]. Everyone knows except [CRUSH]. It's painful."
- 🎲 Events: "Awkward Love Confession", "Accidentally Saved Crush", "Jealousy Drama"
- 💕 Can confess (success = Power Couple, fail = Awkward Rejection, neutral = stays Secret Crush)

**Power Couple** (Dynamic, successful confession from Secret Crush)
- ✅ +30% stats when together
- ✅ +20% team morale (relationship goals)
- ✅ +25% synergy bonuses
- ✅ Share buffs and healing
- ❌ -30% stats when separated (miss each other)
- ❌ -15% if partner takes damage (worry)
- 📖 "[HERO_A] and [HERO_B] are disgustingly in love. Team wants to vomit. Also effective."
- 🎲 Events: "Couples Fight Mid-Combat", "Make Up Kiss Heals Team", "Anniversary Celebration"
- 💕 Can evolve to Married (+permanent bonus), break up (Bitter Ex), or become Toxic Couple (betrayal)

**Toxic Couple** (Dynamic, Power Couple + betrayal/conflict events)
- ✅ +30% damage (fighting each other AND enemies)
- ❌ -25% team morale (everyone uncomfortable)
- ❌ +200% relationship drama events
- ❌ 20% chance to refuse cooperation per turn
- 📖 "Should break up. Won't break up. Team suffering. Drama incredible. Therapy needed."
- 🎲 Events: "Public Breakup Threat", "Passive Aggressive Combat", "Dramatic Reunion"
- 💕 Can reconcile (Power Couple), break up (Bitter Ex), or marry out of spite (Married But Toxic)

**Bitter Ex** (Dynamic, after Power Couple breakup)
- ✅ +15% damage (anger-fueled)
- ❌ -20% stats when near ex (awkward)
- ❌ -25% team morale (tension)
- ❌ Refuses to share equipment with ex
- 📖 "Used to date [EX]. Doesn't want to talk about it. Talks about it CONSTANTLY."
- 🎲 Events: "Forced To Work Together", "Jealous Of Ex's New Crush", "Reconciliation Attempt"
- 💕 Can reconcile (Power Couple), move on (trait fades after 50 missions), or escalate (Bitter Rival)

**Disaster Pining** (Dynamic, unrequited Secret Crush >20 missions)
- ✅ +15% charm (desperation)
- ❌ -20% focus (daydreaming)
- ❌ -15% team efficiency (distracted)
- ❌ +300% "pining disaster" events
- 📖 "Hopelessly in love with [CRUSH] who is OBLIVIOUS. Everyone suffering. Move on challenge: impossible."
- 🎲 Events: "Wrote Love Letter Mid-Combat", "Stared Longingly Instead Of Fighting", "Finally Confessed"
- 💕 Resolves via confession or moving on (50 mission timer)

### Rivalry Traits

**Bitter Rival** (Dynamic, develops via competition/conflict)
- ✅ +25% damage (trying to outperform rival)
- ✅ +20% rare loot (wants to show off)
- ❌ -20% team cooperation (focuses on rival, not objectives)
- ❌ 15% chance to prioritize rival over strategy
- 📖 "Hates [RIVAL] with passion. Every quest = competition. Exhausting."
- 🎲 Events: "Loot Stealing Accusation", "Kill Count Contest", "Rivalry Got Physical"
- 💕 Can evolve to Respect (save rival 10 times), Arch-Nemesis (betray rival), or resolve (trait fades)

**Competitive BFFs** (Dynamic, Bitter Rival + high friendship score)
- ✅ +20% stats (friendly competition)
- ✅ +15% team morale (fun rivalry)
- ✅ Share equipment bonuses
- ❌ +150% "competition" events
- ❌ 15% chance to prioritize contest over mission
- 📖 "Best friends who compete at EVERYTHING. Exhausting. Adorable. Effective."
- 🎲 Events: "Race To Boss", "Bet On Who Dies First", "Friendship Montage"
- 💕 Permanent unless betrayal

**Arch-Nemesis** (Dynamic, Bitter Rival + major betrayal)
- ✅ +40% damage vs nemesis (HATRED)
- ✅ +30% focus when nemesis present (obsessed)
- ❌ -30% team morale (constant tension)
- ❌ -25% cooperation with nemesis
- ❌ 25% chance to attack nemesis instead of enemy
- 📖 "PURE HATRED for [NEMESIS]. Obsessed. Vendetta. Everyone scared."
- 🎲 Events: "Attempted Murder", "Sabotage Incident", "Death Threat"
- 💕 Resolves via reconciliation (difficult) or one hero leaves team

### Mentor/Protégé Traits

**Mentor** (Dynamic, 15+ level difference + 50 missions together)
- ✅ Protégé gains +30% XP
- ✅ Protégé gains +15% stats (guidance)
- ✅ +10% team morale (teaching)
- ❌ Mentor -25% personal XP (focused on teaching)
- ❌ Mentor -15% damage (overprotective)
- 📖 "Teaching [PROTÉGÉ] the ropes. Proud parent energy. Overprotective."
- 🎲 Events: "Teaching Moment", "Protégé Saved Mentor", "Graduation Ceremony"
- 💕 Protégé can surpass (becomes Rival), honor (Legacy), or betray (Bitter)

**Protégé** (Dynamic, paired with Mentor)
- ✅ +30% XP when with mentor
- ✅ +15% stats (learns fast)
- ✅ +20% skill learning rate
- ❌ -20% stats when solo (lacks confidence)
- ❌ -10% focus when mentor in danger (protective)
- 📖 "Learning from [MENTOR]. Eager student. Kind of clingy."
- 🎲 Events: "Impressed Mentor", "Mentor Saved Protégé", "Rebellion Phase"
- 💕 Graduates when Level = Mentor level (becomes equal partners)

**Rebellious Protégé** (Dynamic, Protégé + disagreement events)
- ✅ +25% damage (proving mentor wrong)
- ✅ +20% XP (learning by defiance)
- ❌ -15% team cooperation (angsty)
- ❌ Refuses mentor's tactical advice (sometimes)
- 📖 "Done listening to [MENTOR]. Doing it MY way. Teenage angst energy."
- 🎲 Events: "I'm Not Your Student Anymore", "Mentor Saved Rebel Anyway", "Reconciliation"
- 💕 Can reconcile (Mentor/Protégé), graduate (Respect), or estrange (Bitter Rival)

### Family Traits

**Sibling Bond** (Dynamic, assigned at recruitment, permanent)
- ✅ +25% stats when together
- ✅ +30% to protect each other
- ✅ Can share equipment without penalty
- ✅ +15% coordination (know each other)
- ❌ +200% sibling drama events
- ❌ 25% chance to bicker mid-combat (-10% efficiency that turn)
- 📖 "[A] and [B] are siblings. Fight constantly. Would die for each other."
- 🎲 Events: "Sibling Rivalry", "Protected Sibling", "Borrowed Stuff Without Asking"
- 💕 Can become Estranged (betray 3 times) or Best Friend Siblings (protect 50 times)

**Found Family** (Dynamic, 200+ missions together with 3+ heroes)
- ✅ +20% stats with "family" (up to 4 heroes)
- ✅ +25% team morale
- ✅ Share buffs across family
- ✅ +30% to protect family
- ❌ -15% stats when family member dies (grief, 7 days)
- 📖 "Chosen family. Not blood. Stronger bond. Will kill for them."
- 🎲 Events: "Family Dinner", "Protected Family", "Family Drama"
- 💕 Can grow (add members), fracture (lose members), or strengthen

### Workplace Relationships

**Office Spouse** (Dynamic, 300+ missions together, NOT romantic)
- ✅ +15% efficiency together (perfect workflow)
- ✅ +20% coordination
- ✅ Finish each other's combat moves
- ✅ Share resources automatically
- ❌ -20% efficiency when separated (codependent)
- ❌ Other heroes feel like third wheel (-5% morale)
- 📖 "Not married. Act married. Know everything about [PARTNER]. Weird."
- 🎲 Events: "Bickered Like Old Couple", "Perfect Sync", "Inside Jokes"
- 💕 Permanent unless betrayal

**Work BFF** (Dynamic, 150+ missions together)
- ✅ +20% stats together
- ✅ +25% team morale (infectious friendship)
- ✅ Share buffs and equipment bonuses
- ❌ 20% chance to prioritize friendship over tactics (selfies mid-combat)
- ❌ -15% stats if BFF takes damage
- 📖 "Best friends. Do everything together. Inside jokes. Adorable."
- 🎲 Events: "BFF Montage", "Friendship Bracelets", "Fought Over Something Stupid"
- 💕 Can become Power Couple (romance) or Bitter Ex (friendship breakup)

**Workplace Nemesis** (Dynamic, conflict events)
- ✅ +20% damage (spite-fueled)
- ✅ +15% rare loot (competition)
- ❌ -25% team cooperation (sabotages nemesis)
- ❌ 15% chance to refuse cooperation
- 📖 "Hates [NEMESIS]. Makes it everyone's problem. HR nightmare."
- 🎲 Events: "Stole Credit", "Sabotaged Equipment", "Passive Aggressive Notes"
- 💕 Can evolve to Respect, Arch-Nemesis, or resolve

---

## 🎮 Gaming/Character Quirk Traits (120 total)

### Internet Culture Traits

**Chronically Online** (Uncommon)
- ✅ +30% fame rewards (social media influence)
- ✅ +25% alliance recruitment (viral posts)
- ✅ Can "summon" reinforcements (share on social media, +1 ally, 5% chance)
- ❌ -20% focus (checking phone mid-combat)
- ❌ -15% expedition efficiency (wifi breaks)
- 📖 "Terminally online. Posts everything. Ratioed a dragon. Needs to touch grass."
- 🎲 Events: "Went Viral", "Got Cancelled", "Twitter Fight With Boss", "Doxxed The Dungeon"
- 💕 Bonds with Social Media Star, conflicts with Touch Grass Needed

**Discord Mod** (Rare)
- ✅ +40% team coordination (dictatorial organization)
- ✅ Can "ban" 1 monster type from personal dungeons (+25% efficiency)
- ✅ +30% rule enforcement bonuses
- ❌ -30% team morale (insufferable rules)
- ❌ -20% all bonuses if authority challenged
- 📖 "Moderator energy. Power-hungry. Enforces arbitrary rules. Power trip."
- 🎲 Events: "Banned Someone For Vague Reasons", "Power Trip", "Server Drama"
- 💕 Conflicts with authority figures, bonds with other mods

**Social Media Star** (Uncommon)
- ✅ +40% fame (influencer)
- ✅ +30% gold (sponsorships)
- ✅ +25% team morale (content creation)
- ❌ -15% combat focus (filming everything)
- ❌ -20% if "content" goes badly (reputation hit)
- 📖 "Everything is content. 500K followers. Monetized suffering. #Ad #Dungeon"
- 🎲 Events: "Viral Moment", "Sponsor Deal", "Cancelled", "Ratio'd A Boss"
- 💕 Bonds with Chronically Online, Theater Kid

**Touch Grass Needed** (Rare, Meta)
- ✅ +40% stats in nature zones (finally outside)
- ✅ +30% healing from sunlight
- ❌ -25% stats in urban zones (overstimulated)
- ❌ -20% in dungeons (needs sky)
- 📖 "Has not been outside in years. Pale. Thrives in nature. Dies in cities."
- 🎲 Events: "Touched Grass (Euphoria)", "Saw Sun For First Time", "Overstimulated By City"
- 💕 Bonds with Nature's Chosen, conflicts with Chronically Online

### Gaming Culture Traits

**Gacha Addict** (Common, Meta)
- ✅ +50% rare loot (addicted to pulls)
- ✅ Can reroll loot 2 times
- ✅ +35% schematic drops (MUST COLLECT)
- ❌ -40% gold (spends on loot)
- ❌ 25% chance to obsessively rerun content for drops
- 📖 "Gacha-brained. Sees everything as loot box. Concerning addiction."
- 🎲 Events: "Spent Rent On Pulls", "Got Rare Drop (Euphoria)", "Pity System Hit"
- 💕 Bonds with Shiny Hunter and Hoarder, responsible heroes concerned

**Speedrunner** (Uncommon)
- ✅ -50% expedition time (GOTTA GO FAST)
- ✅ +30% efficiency (optimal routing)
- ✅ +20% sequence break chances
- ❌ -40% loot (skips everything)
- ❌ -35% XP (doesn't fight)
- 📖 "Speedrun mentality. Skips cutscenes. Clip through walls. Any% life."
- 🎲 Events: "Found Skip", "Clipped Through Boss", "World Record Attempt"
- 💕 Conflicts with Completionist, bonds with Tutorial Skipper

**Shiny Hunter** (Rare)
- ✅ +80% rare monster capture
- ✅ +60% rare schematic drops
- ✅ Can detect rare spawns
- ❌ -50% damage to common monsters (not interested)
- ❌ Refuses to kill rare monsters (capture only)
- ❌ -50% XP (only cares about rares)
- 📖 "Only cares about rare spawns. Will abandon mission for shiny."
- 🎲 Events: "Found Shiny", "Team Died While Hunting Shiny", "Collection Complete"
- 💕 Bonds with Completionist, conflicts with Speedrunner

**Completionist** (Rare)
- ✅ +40% loot (checks every corner)
- ✅ +35% schematic collection
- ✅ +30% achievement rewards
- ❌ +100% expedition time (must find EVERYTHING)
- ❌ -25% efficiency (exploring > objectives)
- 📖 "Must. Find. Everything. 100% or bust. Takes forever. Worth it."
- 🎲 Events: "Found Hidden Chest", "Took 4 Hours For Simple Mission", "100% Achievement"
- 💕 Bonds with Shiny Hunter, conflicts with Speedrunner

**Tutorial Skipper** (Common)
- ✅ +30% quick learning (figures it out)
- ✅ +25% efficiency (no hand-holding)
- ❌ -20% initial mission success (didn't read instructions)
- ❌ -15% complex mechanic understanding
- 📖 "Skips tutorials. Learns by dying. Refuses help. Eventually figures it out."
- 🎲 Events: "Should Have Read Tutorial", "Figured It Out Eventually", "Asked For Help (Finally)"
- 💕 Bonds with Speedrunner, conflicts with Perfectionist

**Min-Maxer** (Rare)
- ✅ +50% optimization (knows meta)
- ✅ +40% efficiency (perfect builds)
- ✅ +30% resource management
- ❌ -30% fun (everything is math)
- ❌ -25% flexibility (can't adapt off-meta)
- 📖 "Knows optimal DPS rotation. Judges your build. No fun allowed. Very effective."
- 🎲 Events: "Optimized The Fun Out", "Meta Changed (Panic)", "Build Shaming Incident"
- 💕 Bonds with Perfectionist, conflicts with Chaos Agent

### Personality Traits (Neurodivergent Rep)

**ADHD Chaos** (Common)
- ✅ +35% multitasking
- ✅ +30% creativity (random ideas)
- ✅ +40% hyperfocus (when interested)
- ❌ -30% sustained focus (squirrel!)
- ❌ -25% task completion (starts 10 things, finishes 1)
- 📖 "Chaotic. Creative. Forgetful. Hyperfocus or no focus. Time is fake."
- 🎲 Events: "Forgot The Mission", "Hyperfocus Breakthrough", "Started 5 Projects"
- 💕 Bonds with Creative Genius, conflicts with Perfectionist

**Autism Coded** (Uncommon)
- ✅ +50% efficiency in special interest (tanking, dragon lore, etc.)
- ✅ +35% pattern recognition
- ✅ +30% focus (hyperfocus)
- ✅ Immune to social pressure
- ❌ -25% in non-interest areas
- ❌ -20% team communication (different style)
- ❌ -30% in overstimulating environments
- 📖 "Special interest expert. Pattern genius. Communication: different. Relatable."
- 🎲 Events: "Hyperfocus Breakthrough", "Sensory Overload", "Info-dumped For 3 Hours"
- 💕 Bonds with other neurodivergent heroes

**Anxiety Spiral** (Common)
- ✅ +30% preparation (over-prepared)
- ✅ +25% threat detection (always vigilant)
- ✅ +20% backup plans
- ❌ -25% confidence
- ❌ -20% decision speed (overthinking)
- ❌ -15% sleep (nightmares)
- 📖 "Worried about everything. Prepared for everything. Exhausted always."
- 🎲 Events: "Panic Attack", "Correctly Predicted Disaster", "Catastrophizing Was Right"
- 💕 Bonds with Overthinker, conflicts with Reckless

**Depression (High-Functioning)** (Uncommon)
- ✅ +25% dark humor coping
- ✅ +20% empathy (knows pain)
- ✅ Immune to Fear (already numb)
- ❌ -20% motivation (why bother)
- ❌ -15% energy (exhausted)
- ❌ -10% team morale (brings vibe down)
- 📖 "Functional depression. Gets job done. Feels nothing. Dark humor coping."
- 🎲 Events: "Depressive Episode", "Gallows Humor", "Actually Helped Someone"
- 💕 Bonds with other mentally ill heroes, Himbo tries to cheer up (doesn't work)

**Overthinking Everything** (Common)
- ✅ +25% strategy quality
- ✅ +20% trap avoidance
- ✅ +15% tactical bonuses
- ❌ +100% expedition time (analysis paralysis)
- ❌ -20% damage (thinking > fighting)
- ❌ 30% chance to restart expedition (second-guessed)
- 📖 "Overthinks EVERYTHING. Simple choices = 3-hour debates. Occasionally right."
- 🎲 Events: "Overthinking Spiral", "Accidentally Correct", "Decision Paralysis"
- 💕 Conflicts with Tutorial Skipper, bonds with Perfectionist

### Energy/Vibe Traits

**Unhinged Energy** (Epic)
- ✅ +60% damage (chaotic violence)
- ✅ +40% crit chance (unpredictable)
- ✅ Immune to Fear/Confusion (already chaos)
- ❌ -35% team cooperation (unpredictable)
- ❌ -25% team morale (terrifying)
- ❌ 20% chance to attack random target
- 📖 "Absolute chaos. Unpredictable. Terrifying. Effective. Everyone scared."
- 🎲 Events: "Unhinged Moment", "Went Feral", "Scared Dragon", "Team Voted Kick"
- 💕 Everyone scared, bonds with other Unhinged

**Himbo/Bimbo Energy** (Uncommon)
- ✅ +35% team morale (positive vibes)
- ✅ +30% charm (likeable)
- ✅ Immune to mental debuffs (no thoughts)
- ✅ +20% luck (main character energy)
- ❌ -40% intelligence checks
- ❌ 30% chance to misunderstand instructions
- 📖 "Hot. Dumb. Kind. No thoughts, head empty. Heart of gold. Brain of silly putty."
- 🎲 Events: "Accidentally Seduced Boss", "Misunderstood Mission", "Positive Vibes Won"
- 💕 Everyone loves them, Overthinker has aneurysm

**Feral Gremlin** (Common)
- ✅ +35% damage at night (goblin hours)
- ✅ +30% chaos event success
- ✅ Can eat raw monster cores for healing
- ✅ +30% climbing/acrobatics
- ❌ -30% team morale (feral behavior)
- ❌ -25% reputation (menace)
- ❌ 25% chance to steal team's food
- 📖 "Feral. Small. Chaotic. Bites things. Climbs on people. Effective menace."
- 🎲 Events: "Bit The Boss", "Stole Lunch", "2AM Zoomies"
- 💕 Bonds with Goblin Mode, annoys everyone

**Caffeine Elemental** (Epic, evolved from Coffee Addict via 500 coffees consumed)
- ✅ +50% SPD (vibrating)
- ✅ +30% crit chance (jittery precision)
- ✅ +25% multitasking
- ✅ Immune to Sleep/Slow
- ❌ -20% HP (body is mostly coffee)
- ❌ Costs 50 gold/expedition (coffee budget)
- ❌ -15% accuracy (shaky hands)
- 📖 "No longer human. Pure caffeine. Vibrating. Medically alarming. VERY effective."
- 🎲 Events: "Vibrating Through Walls", "Saw All Timelines", "Heart Palpitations"
- 💕 Coffee Addicts worship them, medics concerned

### Social/Romance Traits

**Disaster Bisexual** (Uncommon)
- ✅ +25% charm (flirts with everyone)
- ✅ +30% relationship event frequency
- ✅ Can develop crush on any gender
- ❌ -20% focus (distracted by hotties)
- ❌ 40% chance to develop inappropriate crush (boss, villain, teammate)
- 📖 "Attracted to everyone. Disaster in motion. Romantic chaos. Finger guns. Bad decisions."
- 🎲 Events: "Flirted With Boss", "Inappropriate Crush", "Disaster Date"
- 💕 Can crush on ANYONE, relationships always messy

**Ace Vibes** (Common)
- ✅ Immune to charm effects
- ✅ +25% focus (no distractions)
- ✅ +20% efficiency (drama-free)
- ✅ +15% team morale (stable)
- ❌ -15% charm abilities
- ❌ Confused by romance plotlines (-10% engagement)
- 📖 "Not interested in romance. Confused why everyone's horny. Garlic bread supremacy."
- 🎲 Events: "Confused By Romance", "Rejected Flirting", "Just Wants Cake"
- 💕 Immune to Secret Crush, bonds with other aro/ace

**Introvert** (Common)
- ✅ +35% stats when solo
- ✅ +25% efficiency (no energy drain)
- ✅ Immune to morale penalties
- ❌ -25% stats in teams of 4+ (overstimulated)
- ❌ -20% team cooperation
- 📖 "Prefers solitude. Social battery always at 0%. Capable but exhausted."
- 🎲 Events: "Social Battery Depleted", "Hiding From Team", "Better Alone"
- 💕 Conflicts with Theater Kid, bonds with other Introverts

**Extrovert** (Common)
- ✅ +35% stats in teams of 4+ (energized)
- ✅ +30% team morale (social butterfly)
- ✅ +20% recruitment success
- ❌ -30% stats when solo (needs people)
- ❌ -15% efficiency (talks too much)
- 📖 "LOVES people. Never shuts up. Team exhausted. Hero energized. It's a lot."
- 🎲 Events: "Made Friends With Enemy", "Won't Stop Talking", "Overshared Trauma"
- 💕 Bonds with Team Player, drives Introvert insane

**Theater Kid Energy** (Uncommon)
- ✅ +30% drama event rewards
- ✅ +35% when performing (center stage)
- ✅ Can inspire team via speech (+15% team stats, 1 turn)
- ✅ +25% fame (main character)
- ❌ -20% stats when not center of attention
- ❌ -15% efficiency (monologues)
- 📖 "EVERYTHING is theater. Monologues mid-combat. Jazz hands. Exhausting. Entertaining."
- 🎲 Events: "Dramatic Monologue", "Musical Number", "Shakespearean Boss Fight"
- 💕 Bonds with Drama Queen, conflicts with Introvert

---

## ⚔️ Combat Specialist Traits (80 total)

### Enemy-Specific Traits

**Dragon Enthusiast** (Uncommon)
- ✅ +40% damage vs Dragons
- ✅ +35% Dragon capture rate
- ✅ +30% Dragon lore knowledge
- ❌ -20% damage vs non-Dragons (disappointed)
- ❌ Writes dragon fanfiction mid-combat (-10% focus)
- 📖 "LOVES dragons. Studies them. Fights them. Writes about them. It's concerning."
- 🎲 Events: "Dragon Fact Mid-Combat", "Captured Rare Dragon", "Fanfiction Published"
- 💕 Bonds with Monster Scholars, Dragon Slayers confused

**Spider Nemesis (Phobia Edition)** (Uncommon)
- ✅ +50% damage vs Spiders (RAGE)
- ✅ +30% Spider capture (exposure therapy)
- ✅ Immune to Web/Poison (adrenaline)
- ❌ -15% all stats in Spider zones (panic)
- ❌ 30% chance to freeze 1 turn vs Spiders (fear)
- ❌ Screams when seeing spiders (-15% stealth)
- 📖 "HATES spiders. Visceral terror. Kills them anyway. So much screaming."
- 🎲 Events: "Panic Attack", "Burned Forest To Kill Spider", "Accidentally Befriended Spider (Horror)"
- 💕 Bonds with phobia heroes, Spider lovers are enemies

**Slime Enthusiast** (Rare)
- ✅ +60% Slime capture
- ✅ +40% alchemy with slime materials
- ✅ Can communicate with slimes
- ✅ Slimes 50% less likely to attack
- ❌ -30% damage to slimes (they're friends!)
- ❌ -20% reputation (covered in slime)
- ❌ -15% team morale (slime smell)
- 📖 "LOVES slimes. Covered in slime. Slime friend. Gross. Effective at slime stuff."
- 🎲 Events: "Adopted A Slime", "Slime Gave Gift", "Team Complained About Smell"
- 💕 Bonds with Monster Whisperers, germophobes horrified

**Undead Bane (Blessed)** (Rare)
- ✅ +60% damage vs Undead
- ✅ +40% Undead capture
- ✅ Immune to Fear/Curse/Necromancy
- ✅ Heals 5% HP per Undead kill
- ❌ Takes +30% damage from Undead (they prioritize holy heroes)
- ❌ -25% healing from dark magic sources
- 📖 "VERY blessed. VERY holy. Undead furious. Walking holy grenade."
- 🎲 Events: "Divine Smite", "Undead Focus Fire", "Blessed Team Accidentally"
- 💕 Undead heroes uncomfortable, other holy heroes bond

### Combat Style Traits

**Berserker (Polite)** (Rare)
- ✅ +50% damage at low HP (<50%)
- ✅ +40% crit chance when raging
- ✅ +30% intimidation
- ❌ -25% DEF (reckless)
- ❌ -20% accuracy (blind rage)
- ❌ Apologizes mid-combat (-10% intimidation effectiveness)
- 📖 "RAGE. VIOLENCE. Also says 'please' and 'thank you'. Polite berserker."
- 🎲 Events: "Raged Politely", "Apologized While Killing", "Manners In Battle"
- 💕 Confuses enemies and allies

**Glass Cannon (Knows It)** (Uncommon)
- ✅ +60% damage
- ✅ +40% crit chance
- ❌ -40% HP
- ❌ -30% DEF
- ❌ Very aware of fragility (-15% confidence)
- 📖 "Huge damage. Dies if enemy sneezes. Knows this. Terrified but effective."
- 🎲 Events: "Almost Died (Again)", "One-Shot The Boss Before Dying", "Survived Somehow"
- 💕 Healers stressed, tanks overprotective

**Tank (Immovable)** (Rare)
- ✅ +50% HP
- ✅ +60% DEF
- ✅ +40% taunt effectiveness
- ✅ Immune to Knockback
- ❌ -40% SPD (slow)
- ❌ -30% damage (not a DPS)
- 📖 "Does not move. Does not die. Does not kill. Perfect tank. Boring. Effective."
- 🎲 Events: "Didn't Move For 20 Minutes", "Tanked Everything", "Still Alive Somehow"
- 💕 DPS appreciate them, Speedrunners frustrated

**Support (Reluctant DPS)** (Uncommon)
- ✅ +50% healing
- ✅ +40% buff effectiveness
- ✅ +30% team morale
- ❌ -35% personal damage (not a fighter)
- ❌ -25% evasion (focus on team)
- ❌ Feels guilty when dealing damage (-10% damage guilt)
- 📖 "Healer main. Reluctant DPS. Apologizes for damage. Kills you with kindness."
- 🎲 Events: "Apologized For Killing", "Healed Enemy Accidentally", "Supportive Violence"
- 💕 Team loves them, DPS confused by guilt

**Pacifist (Forced To Fight)** (Rare)
- ✅ +60% healing
- ✅ +50% diplomacy (avoids fights)
- ✅ +40% non-lethal capture
- ❌ -50% damage (doesn't want to hurt)
- ❌ -30% morale (ethically conflicted)
- ❌ Tries to talk to enemies first (-20% first turn damage)
- 📖 "Doesn't want to fight. Forced to fight. Guilt complex. Effective healer though."
- 🎲 Events: "Tried Diplomacy (Failed)", "Moral Crisis", "Felt Bad For Enemy"
- 💕 Other pacifists bond, violent heroes confused

### Weapon Specialist Traits

**Weeb Sword User** (Uncommon)
- ✅ +45% sword damage
- ✅ +35% katana damage specifically
- ✅ +30% anime reference bonuses
- ❌ -25% other weapon damage (swords only)
- ❌ -20% team morale (constant anime references)
- ❌ Studies blade mid-combat (-15% focus)
- 📖 "While you partied, I studied the blade. Unironically. Weeb. Effective swordsman."
- 🎲 Events: "Anime Reference Nobody Got", "Studied Blade Mid-Combat", "Teleports Behind You"
- 💕 Other weebs bond, non-weebs cringe

**Gun Enthusiast (In Fantasy World)** (Rare)
- ✅ +50% ranged damage
- ✅ +40% when using guns/firearms
- ✅ Can craft primitive firearms
- ❌ -30% magic damage (guns > magic)
- ❌ -25% reputation (bringing guns to sword fight)
- ❌ Everyone questions how guns exist here
- 📖 "Has gun. In fantasy world. Nobody knows how. Don't question it. It works."
- 🎲 Events: "Where Did You Get That", "Gunpowder Doesn't Exist Here", "Shot The Dragon"
- 💕 Mages confused, other gun users bond

**Bare Hands Only** (Epic)
- ✅ +70% unarmed damage
- ✅ +50% STR
- ✅ +40% intimidation (fights bare-handed)
- ✅ Immune to Disarm
- ❌ -60% damage with weapons (refuses to use)
- ❌ -40% equipment bonuses (no weapon slot)
- 📖 "No weapons. Just fists. Punches dragons. Insane. Terrifying. Respect."
- 🎲 Events: "Punched Dragon To Death", "Refused Epic Sword", "Fistfight Victory"
- 💕 Everyone scared and impressed

---

## 🌈 Elemental Affinity Traits (40 total)

**Pyromancer (Arsonist Tendencies)** (Rare)
- ✅ +50% Fire damage
- ✅ Immune to Burn
- ✅ Fire monsters in dungeons +35% power
- ✅ Can ignite things for area damage
- ❌ -35% Ice damage
- ❌ Takes +25% from Ice
- ❌ 30% chance to burn loot accidentally
- ❌ Team won't camp near them (fire safety)
- 📖 "LOVES fire. Too much. Arson charges pending. Keep extinguisher nearby."
- 🎲 Events: "Accidentally Set Camp On Fire", "Intentional Arson", "Fire Investigation"
- 💕 Ice heroes hate them, fire heroes enable

**Frostborn (Emotionally Cold Too)** (Rare)
- ✅ +50% Ice damage
- ✅ Immune to Freeze
- ✅ +40% Ice monster efficiency
- ✅ Calm under pressure (+20% focus)
- ❌ -35% Fire damage
- ❌ Takes +25% from Fire
- ❌ -20% team morale (emotionally distant)
- ❌ -15% empathy (ice cold personality)
- 📖 "Ice-aligned. Emotionally cold. Distant. Effective. Team thinks they need therapy."
- 🎲 Events: "Emotionally Unavailable", "Ice Cold Response", "Actually Cares (Rare)"
- 💕 Fire heroes hate them, other ice heroes relate

**Stormcaller (Living ADHD)** (Epic)
- ✅ +60% Lightning damage
- ✅ +45% SPD (electric energy)
- ✅ Can call lightning strikes
- ✅ Immune to Shock/Paralyze
- ❌ -30% sustained focus (electric energy = chaotic)
- ❌ -25% team coordination (unpredictable)
- ❌ 25% chance to shock allies accidentally
- 📖 "Lightning-aligned. Chaotic. Electric. ADHD incarnate. Fast. Unpredictable."
- 🎲 Events: "Shocked Teammate", "Lightning Strike Victory", "Electric Chaos"
- 💕 Chaos heroes bond, order heroes struggle

**Nature's Chosen (Vegan Protestor)** (Rare)
- ✅ +50% Nature damage
- ✅ +40% in forest/nature zones
- ✅ +35% healing from plants
- ✅ Can communicate with nature
- ❌ -30% in urban zones (hates cities)
- ❌ -25% vs Plant monsters (won't hurt plants)
- ❌ Vegan (requires plant-based rations, +20g cost)
- ❌ Lectures team about nature (-15% morale)
- 📖 "Nature-aligned. VERY vegan. Protests deforestation mid-combat. Effective in forests."
- 🎲 Events: "Vegan Lecture", "Hugged A Tree", "Protested Logging", "Nature Documentary"
- 💕 Other nature heroes bond, carnivores annoyed

**Shadow Touched (Edgy)** (Uncommon)
- ✅ +40% Dark damage
- ✅ +35% stealth
- ✅ +30% in darkness
- ❌ -30% in bright light (light-sensitive)
- ❌ -25% team morale (edgy energy)
- ❌ -20% reputation (dark = villain aesthetic)
- 📖 "Shadow-aligned. Edgy. Brooding. 'You wouldn't understand my darkness.' Effective rogue."
- 🎲 Events: "Edgy Monologue", "Brooded In Corner", "Darkness Speech"
- 💕 Other edgy heroes bond, Light heroes uncomfortable

**Holy Light (TOO Bright)** (Rare)
- ✅ +50% Holy damage
- ✅ +40% healing
- ✅ +35% vs Undead/Demons
- ✅ Glows (provides light)
- ❌ -30% stealth (literally glowing)
- ❌ -25% Dark damage
- ❌ Takes +25% from Dark
- ❌ Too optimistic (-15% team morale, exhausting)
- 📖 "Holy-aligned. VERY bright. Optimistic to annoying degree. Glows. Can't stealth."
- 🎲 Events: "Inspirational Speech (Exhausting)", "Ruined Stealth (Glowing)", "Blessed Everyone"
- 💕 Dark heroes hate them, cynics exhausted

---

## 💼 Career/Background Traits (60 total)

**Former HR Rep** (Uncommon)
- ✅ +35% team morale management
- ✅ +30% conflict resolution
- ✅ Can mediate relationship drama (-40% drama penalties)
- ✅ +25% reputation
- ❌ -25% combat stats (not a fighter)
- ❌ Files incident reports for everything (+40% paperwork)
- 📖 "Handles team drama. Corporate speak. NOT a fighter. 'Let's circle back on that goblin.'"
- 🎲 Events: "Mediated Drama", "Incident Report", "Workplace Training"
- 💕 Manages conflicts, CEO uses them, fighters annoyed

**Ex-Retail Worker** (Common)
- ✅ +40% patience (dealt with Karens)
- ✅ +35% de-escalation
- ✅ Immune to verbal abuse
- ✅ +25% gold (upselling skills)
- ❌ -20% combat stats (retail PTSD)
- ❌ Triggered by entitled behavior (-15% vs nobles/bosses)
- 📖 "Survived retail. Nothing scarier. Dead inside but polite. Customer service smile."
- 🎲 Events: "Retail Flashback", "Dealt With Karen Boss", "Service Voice Activated"
- 💕 Bonds with service workers, triggered by entitled heroes

**Former Accountant** (Rare)
- ✅ +50% gold income (financial optimization)
- ✅ +40% resource management
- ✅ +35% spreadsheet creation (tracks everything)
- ❌ -30% combat stats (numbers > violence)
- ❌ -25% creativity (by-the-book)
- ❌ Makes spreadsheets for everything (-20% team morale, boring)
- 📖 "Optimizes everything. Excel spreadsheets for dungeon runs. Boring. Effective. Rich."
- 🎲 Events: "Made Spreadsheet Mid-Combat", "Financial Report", "Optimized The Fun Out"
- 💕 CEO appreciates them, creative heroes bored

**Teacher (Burned Out)** (Uncommon)
- ✅ +40% XP for all allies (teaching)
- ✅ +35% skill learning rate
- ✅ +30% patience
- ❌ -25% personal XP (teaches others)
- ❌ -20% energy (exhausted from teaching)
- ❌ -15% morale (burned out)
- 📖 "Teaches everyone. Exhausted. Underpaid. Overworked. Team learns fast. Teacher struggles."
- 🎲 Events: "Taught Mid-Combat", "Educational Moment", "Too Tired To Function"
- 💕 Team learns from them, worries about burnout

**Nurse (Seen Things)** (Rare)
- ✅ +60% healing
- ✅ +50% triage (prioritizes healing)
- ✅ Immune to Panic (seen worse)
- ✅ +40% medical knowledge
- ❌ -30% bedside manner (blunt)
- ❌ -25% morale (dark humor coping)
- 📖 "Seen things. Heals you. Blunt. Dark humor. Trauma coping. Very effective."
- 🎲 Events: "Blunt Medical Assessment", "Dark Humor Incident", "Saved Everyone"
- 💕 Effective healer, bedside manner concerns

**Chef (Passionate)** (Uncommon)
- ✅ +50% food buff effectiveness
- ✅ +40% cooking quality
- ✅ +35% team morale (good food)
- ✅ Can craft food mid-expedition
- ❌ -25% combat stats (chef, not fighter)
- ❌ -20% efficiency (stops to cook)
- ❌ Offended by bad food (-30% morale in cheap taverns)
- 📖 "Passionate chef. Cooks mid-combat. Food incredible. NOT a fighter. Gordon Ramsay energy."
- 🎲 Events: "Cooked Mid-Battle", "Insulted Enemy's Cooking", "Food Critique"
- 💕 Team loves food, frustrated by combat delays

**Artist (Starving)** (Common)
- ✅ +40% creativity
- ✅ +35% morale (beautiful art)
- ✅ Can sell art for gold (+20% income)
- ✅ +30% aesthetic dungeon design
- ❌ -50% gold (spends on supplies)
- ❌ -25% combat focus (thinking about art)
- ❌ Distracted by beauty (-20% efficiency)
- 📖 "Artist. Starving. Talented. Poor. Makes everything beautiful. Combat secondary."
- 🎲 Events: "Stopped To Paint", "Sold Masterpiece", "Starving Artist Moment"
- 💕 Appreciates beauty, Accountant concerned about finances

---

## 🎮 Meta/Self-Aware Traits (30 total)

**Fourth Wall Observer** (Epic)
- ✅ +40% efficiency (knows mechanics)
- ✅ +35% rare loot (exploits RNG knowledge)
- ✅ +30% event prediction
- ✅ Immune to ambushes (read patch notes)
- ❌ -50% immersion (constant meta commentary)
- ❌ -30% team morale (ruins surprises)
- ❌ 15% chance of game bug (breaks reality)
- 📖 "Knows this is a game. Comments on mechanics. Talks to player. Deadpool energy."
- 🎲 Events: "Talked To Player", "Commented On Bad Design", "Reality Glitch"
- 💕 NPC Awareness bonds, everyone else unsettled

**Isekai Protagonist** (Legendary)
- ✅ +50% all stats (overpowered)
- ✅ +40% luck (protagonist energy)
- ✅ +35% XP (levels fast)
- ✅ Plot armor (+20% death save)
- ❌ -40% challenges (too easy)
- ❌ -30% team morale (steals spotlight)
- ❌ Attracts all romance options (-40% team focus, harem hijinks)
- 📖 "Transported from another world. Overpowered. Main character. Everyone loves/hates them."
- 🎲 Events: "Protagonist Moment", "Harem Incident", "Plot Armor Activated"
- 💕 Everyone attracted to them (chaos), team spotlight stolen

**NPC Awareness** (Rare)
- ✅ +30% pattern recognition (knows NPC behavior)
- ✅ +25% dialogue prediction
- ✅ +20% quest knowledge
- ❌ -25% engagement (knows outcomes)
- ❌ -20% surprise (seen this quest)
- 📖 "Aware they're an NPC. Existential crisis. Knows quest outcomes. Depressing. Effective."
- 🎲 Events: "Existential Crisis", "Predicted Quest", "NPC Monologue"
- 💕 Bonds with Fourth Wall Observer, others concerned

**Reincarnated (50th Loop)** (Mythic)
- ✅ +60% all stats (experience from loops)
- ✅ +50% pattern knowledge
- ✅ +40% prediction
- ✅ Knows boss mechanics perfectly
- ❌ -50% motivation (done this 49 times)
- ❌ -40% surprise (seen everything)
- ❌ -30% morale (existentially exhausted)
- 📖 "50th loop. Knows everything. Tired. SO tired. Just wants it to end. Still effective."
- 🎲 Events: "Not This Again", "Predicted Everything", "Loop Fatigue"
- 💕 Everyone confused, hero exhausted

---

## 🏰 Dungeon/Monster Mastery Traits (50 total)

**Monster Whisperer (Disney Princess)** (Rare)
- ✅ +60% monster capture
- ✅ +50% monster loyalty
- ✅ +40% taming success
- ✅ Monsters 50% less aggressive
- ❌ -30% damage to monsters (they're friends!)
- ❌ -25% team morale (monsters everywhere)
- ❌ Covered in monster fur/slime (-20% reputation)
- 📖 "Disney Princess energy. Monsters love them. Talks to animals. Covered in fur. Effective."
- 🎲 Events: "Befriended Boss", "Monster Followed Home", "Animal Choir"
- 💕 Monster enthusiasts bond, germophobes horrified

**Architect's Eye (HGTV Edition)** (Rare)
- ✅ +35% dungeon durability
- ✅ +30% schematic drops
- ✅ -35% construction cost
- ✅ Can preview dungeon layouts
- ✅ Dungeons are BEAUTIFUL (+15% team morale)
- ❌ -25% combat stats (thinking about blueprints)
- ❌ 35% chance to redesign mid-run (wastes time)
- 📖 "Sees world as blueprints. Open floor plan obsessed. Shiplap in dungeon. HGTV nightmare."
- 🎲 Events: "Redesigned Mid-Combat", "This Could Be Better", "Farmhouse Aesthetic"
- 💕 Bonds with Perfectionist, conflicts with Speedrunner

**Hoarder (It's Valuable!)** (Uncommon)
- ✅ +50% loot capacity
- ✅ +40% rare item find
- ✅ +35% material drops
- ✅ Never sells items (keeps everything)
- ❌ -30% SPD (carrying too much)
- ❌ -25% inventory management (full always)
- ❌ -20% gold (never sells, always buys)
- 📖 "Hoards everything. 'Might need it.' Never does. Encumbered constantly. Rich in items, poor in gold."
- 🎲 Events: "Found Rare Item In Hoard", "Over-Encumbered", "Refuses To Sell"
- 💕 Bonds with Completionist, Minimalist horrified

**Dungeon Flipper** (Rare)
- ✅ +40% dungeon resale value
- ✅ +35% aesthetic improvements
- ✅ +30% renovation efficiency
- ✅ Can "flip" dungeons for profit
- ❌ -25% combat focus (thinking about flips)
- ❌ Never keeps dungeons (sells immediately, -40% long-term value)
- 📖 "Flips dungeons. 'Buy low, sell high.' Property investor energy. Effective. Annoying."
- 🎲 Events: "Flipped Dungeon For Profit", "Renovation Mid-Mission", "Market Analysis"
- 💕 Accountant approves, sentimentalists annoyed

---

## 🔗 Multi-Trait Synergies & Conflicts

### Synergy System (Creates bonus effects)

**Power Couple + Mentor/Protégé = Power Family**
- ✅ +40% stats when all together
- ✅ +35% team morale (family goals)
- ✅ Share all buffs
- ❌ +200% family drama events

**ADHD Chaos + Caffeine Elemental + Creative Genius = Hyperfocus God**
- ✅ +80% damage (hyperfocused destruction)
- ✅ +60% creativity
- ✅ +50% multitasking
- ❌ +300% chaos events
- ❌ -50% sustainability (burns out)

**Autism Coded + Perfectionist + Overthinker = Analysis Master**
- ✅ +100% strategy quality (when they decide)
- ✅ +70% pattern recognition
- ✅ +60% optimization
- ❌ +400% decision time

**Min-Maxer + Former Accountant + Architect's Eye = Optimization God**
- ✅ +80% efficiency
- ✅ +70% resource management
- ✅ +60% gold income
- ❌ -60% fun (everything is spreadsheets)
- ❌ Team bored to death

**Chronically Online + Discord Mod + Social Media Star = Internet Menace**
- ✅ +70% fame
- ✅ +60% recruitment
- ✅ Can "cancel" enemies (remove from combat, 10% chance)
- ❌ -60% reputation
- ❌ +500% internet drama events

### Conflict System (Creates penalties)

**Speedrunner + Completionist = Eternal Argument**
- ❌ -30% efficiency (constant arguments)
- ❌ -25% team morale (never agree)
- ❌ 50% chance to split party

**Pyromancer + Frostborn = Elemental Clash**
- ❌ -25% elemental damage (interference)
- ❌ -20% team coordination
- ❌ +200% argument events

**Introvert + Extrovert = Social Energy Clash**
- ❌ -20% team morale (incompatible)
- ❌ -15% cooperation
- ❌ One exhausted, one lonely

**Pacifist + Berserker = Moral Conflict**
- ❌ -30% team cohesion (opposite philosophies)
- ❌ -25% morale
- ❌ +200% argument events

**CEO Mindset + Ex-Retail Worker = Class Warfare**
- ❌ -40% cooperation (class conflict)
- ❌ -35% team morale (tension)
- ❌ 40% chance of unionization

---

## 🎯 Trait Acquisition & Management

### Recruitment Tiers

**100g Common Recruit**:
- 3 base traits (random)
- 70% Common, 25% Uncommon, 5% Rare
- No guaranteed traits

**500g Veteran Recruit**:
- 4 base traits (curated)
- 40% Common, 40% Uncommon, 20% Rare
- 1 guaranteed archetype-matching trait

**1500g Elite Recruit**:
- 5 base traits (premium)
- 20% Common, 40% Uncommon, 30% Rare, 10% Epic
- 2 guaranteed archetype-matching traits
- Can reroll 1 trait for +50 gold

**Story Heroes** (Earned):
- 4-6 base traits (narrative-based)
- Fixed traits matching their character
- Cannot reroll (part of identity)

### Trait Reroll System (Post-Recruitment)

**Single Trait Reroll**: 50 gold (once per hero)
- Choose 1 unwanted trait to reroll
- New trait same rarity tier
- Cannot reroll Story Hero fixed traits

**Trait Evolution** (Gameplay-Based):
- Some traits evolve through gameplay
- Examples:
  - Coffee Addict → Caffeine Elemental (500 coffees consumed)
  - Secret Crush → Power Couple (confession success)
  - Dragon Enthusiast → Dragon Scholar (100 dragons studied)
- Evolution = upgrade, not replacement (keeps original stats + bonus)

### Trait Targeting

**Monster Capture Focus**:
- Capture 100+ of specific monster type → +20% chance for related trait on next recruit
- Example: 100 Dragons → +20% chance for Dragon Enthusiast

**Dungeon Specialization**:
- Run 50+ Personal Dungeons → +15% chance for dungeon-related trait
- Example: 50 runs → +15% chance for Architect's Eye

**Relationship Development**:
- Relationship traits develop naturally through gameplay
- Cannot be forced or purchased
- Emerge from team dynamics and events

---

## 📊 Trait Balance Framework

### TNP (Total Numeric Power) Calculation

**All traits must maintain TNP ≈ 0 (±15 acceptable variance)**

**Stat Value Weights**:
- Damage/Healing: 1.0x
- HP/DEF: 1.2x (survival more valuable)
- SPD: 0.8x (speed less impactful)
- Gold: 0.3x (resource, not combat)
- XP: 0.5x (long-term, not immediate)
- Morale: 0.4x (team-wide but soft)

**Event Frequency = 0 TNP** (cosmetic chaos is free)

**Example Balance Check**:
```
Caffeine Elemental:
✅ +50% SPD = +50 × 0.8 = +40 TNP
✅ +30% crit = +30 × 1.0 = +30 TNP
✅ +25% multitask = +25 × 1.0 = +25 TNP
❌ -20% HP = -20 × 1.2 = -24 TNP
❌ -50 gold/expedition = -50 × 0.3 = -15 TNP
❌ -15% accuracy = -15 × 1.0 = -15 TNP
❌ +200% events = 0 TNP (cosmetic)

Total TNP: (+40+30+25) - (24+15+15) = 95 - 54 = +41 TNP
Variance: +41 (acceptable, Epic tier can be +30 to +50)
```

### Rarity Power Budgets

- **Common**: TNP -10 to +10 (balanced)
- **Uncommon**: TNP -5 to +20 (slightly positive)
- **Rare**: TNP +10 to +30 (positive)
- **Epic**: TNP +20 to +50 (strong positive)
- **Legendary**: TNP +40 to +70 (very strong)
- **Mythic**: TNP +60 to +100 (game-changing)

### Playability Guidelines

**NEVER Include**:
- ❌ Instant death chances (breaks runs)
- ❌ >50% failure rates (frustrating)
- ❌ Permanent stat loss (punishing)
- ❌ Soft-lock scenarios (game-breaking)
- ❌ Required gold costs >100/expedition (economy breaking)

**ALWAYS Include**:
- ✅ Meaningful positives (worthwhile)
- ✅ Balanced negatives (trade-offs, not punishments)
- ✅ Funny flavor/events (gaming parody)
- ✅ Synergy potential (emergent gameplay)
- ✅ Player choice (opt-in to weird builds)

---

## 📝 Design Notes

**Tone Balance**:
- 70% Gaming/RPG parody (primary voice)
- 20% Character personality (heroes are people)
- 10% Corporate flavor (UI/system messages only)

**Every Trait Should**:
- Make players laugh (gaming culture humor)
- Create meaningful choice (trade-offs)
- Enable creativity (synergies/builds)
- Actually work in gameplay (balanced)

**Traits Are NOT**:
- Purely mechanical (need personality)
- Punishment mechanics (need positives)
- Unbalanced memes (need TNP ≈ 0)
- Corporate-voiced (that's UI only)

---

**This trait system balances gaming parody humor with actual playable mechanics, creating 300+ traits that are funny, characterful, AND balanced for strategic gameplay.**
