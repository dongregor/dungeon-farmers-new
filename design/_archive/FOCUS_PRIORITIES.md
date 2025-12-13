# Development Focus Priorities - Dungeon Farmers

**Date**: 2025-11-02  
**Purpose**: Strategic prioritization for comprehensive game planning

---

## 🎯 Current Status Assessment

### ✅ Completed
- Core systems designed (heroes, monsters, dungeons, expeditions, equipment, alliances)
- Monetization strategy defined and validated
- Player experience journey mapped
- Design-monetization compatibility analyzed
- 3 critical questions resolved (monster reuse, schematic drops, content cadence)

### ⚠️ Remaining Gaps
- **15 open questions** across design documents
- **Beta testing plan** not yet detailed
- **Balance tuning specifics** undefined
- **Technical feasibility** not validated
- **Implementation priority** unclear for remaining features

---

## 🔥 Priority 1: Critical Design Decisions (Before Implementation)

### Must Decide Before Phase 2 Development

#### 1.1 **Ascension System Finalization** (HIGHEST PRIORITY)
**Why Critical**: Affects long-term progression, endgame engagement, player retention

**Questions to Resolve**:
- [ ] Single ascension with specialization paths OR multiple ascension tiers?
- [ ] Offensive vs Defensive specialization OR universal +50% boost?
- [ ] Permanent trait evolution from emergent stories OR temporary states?

**Impact**: 
- Affects hero system balance
- Determines endgame content design
- Influences player investment psychology

**Recommendation**: 
- **Single Ascension with Specialization Paths**
  - Simpler to implement
  - Adds strategic choice without complexity
  - Aligns with "player agency" pillar
  - Specialization paths: Offensive (+50% ATK growth), Defensive (+50% DEF growth), Balanced (+25% all stats)

**Decision Needed By**: Before Phase 2 (Month 3)

---

#### 1.2 **Alliance Raid Scaling** (HIGH PRIORITY)
**Why Critical**: Core social feature, affects difficulty balance, player coordination

**Questions to Resolve**:
- [ ] Exact difficulty scaling for 3-5 players?
- [ ] Power requirement formula per participant count?
- [ ] Reward scaling with participant count?

**Impact**:
- Affects social engagement
- Determines raid accessibility
- Influences alliance formation strategy

**Recommendation**:
- **3 players = 100% difficulty, 4 players = 120%, 5 players = 150%**
  - More players = harder content (maintains challenge)
  - Rewards scale proportionally: 3 players = base rewards, 5 players = 1.5x rewards
  - Power requirement: Total team power = (recommended power × participant count × difficulty multiplier)

**Decision Needed By**: Before Phase 3 (Month 5)

---

#### 1.3 **Guild Customization Depth** (MEDIUM-HIGH PRIORITY)
**Why Critical**: First impression, onboarding experience, player agency

**Questions to Resolve**:
- [ ] Guild master character customization OR first hero selection only?
- [ ] If customization: appearance only OR name only OR both?
- [ ] Impact on tutorial length and complexity?

**Impact**:
- Affects onboarding flow
- Determines tutorial complexity
- Influences player attachment

**Recommendation**:
- **First Hero Selection Only** (Keep Simple)
  - Faster onboarding (respects time principle)
  - Reduces tutorial complexity
  - First hero becomes "guild master" by default
  - Can add customization later as optional feature

**Decision Needed By**: Before Phase 1 completion (Month 2)

---

#### 1.4 **Dungeon Preview Feature** (MEDIUM PRIORITY)
**Why Critical**: Affects player confidence, reduces frustration, impacts resource spending

**Questions to Resolve**:
- [ ] Preview run before confirming build OR experiment and learn?
- [ ] If preview: free preview OR costs durability (1 run)?
- [ ] Preview shows rewards OR just layout?

**Impact**:
- Affects player confidence in spending resources
- Determines resource waste tolerance
- Influences learning curve

**Recommendation**:
- **Free Preview Run Before Confirming**
  - Shows exact rewards for that preview run
  - No durability cost for preview (build confirmation starts durability)
  - Builds confidence, reduces frustration
  - Aligns with "respect player time" pillar

**Decision Needed By**: Before Phase 2 (Month 3)

---

#### 1.5 **Recruitment Reroll Option** (MEDIUM PRIORITY)
**Why Critical**: Affects player agency, resource management, progression satisfaction

**Questions to Resolve**:
- [ ] Allow reroll trait for +50 Gold OR keep pure RNG?
- [ ] If reroll: single trait OR all traits?
- [ ] Reroll available once per recruitment OR unlimited?

**Impact**:
- Affects resource spending strategy
- Determines recruitment satisfaction
- Influences progression pacing

**Recommendation**:
- **Single Trait Reroll for +50 Gold**
  - Adds player agency without breaking economy
  - Prevents frustration from bad RNG
  - Encourages strategic resource management
  - Available once per recruitment

**Decision Needed By**: Before Phase 1 completion (Month 2)

---

### Phase 1 Priority: Core Experience Polish

#### 1.6 **Demo Tutorial Flow Validation** (HIGH PRIORITY)
**Why Critical**: Determines conversion rate, player understanding, first impression

**Action Items**:
- [ ] Create detailed tutorial flow diagram
- [ ] Define exact tutorial steps and triggers
- [ ] Validate personal dungeon preview timing
- [ ] Test tutorial length (target: 15-20 minutes)
- [ ] Ensure upgrade CTA placement is optimal

**Deliverable**: Complete tutorial flow document with timing, triggers, and branching paths

**Due**: Before Phase 1 completion (Month 2)

---

## ⚖️ Priority 2: Balance & Economy Tuning (Before Beta)

### Critical Numbers to Define

#### 2.1 **Gold Economy Balance** (HIGH PRIORITY)
**Action Items**:
- [ ] Define exact gold earnings per hour per level tier
- [ ] Calculate gold sinks (recruitment, dungeons, crafting, ascension)
- [ ] Validate progression pacing (time to recruit hero, build dungeon, craft item)
- [ ] Ensure no single bottleneck dominates progression

**Deliverable**: Economy balance spreadsheet with:
- Expected gold income/hour by player level
- All gold sinks with costs
- Progression timestamps (when should player have X heroes, Y dungeons, etc.)

**Due**: Before Beta Testing (Month 6)

---

#### 2.2 **Hero Power Scaling** (HIGH PRIORITY)
**Action Items**:
- [ ] Define exact stat growth curves per archetype
- [ ] Calculate power rating formula (validate examples)
- [ ] Define expedition difficulty vs power requirement curve
- [ ] Ensure no archetype becomes mandatory

**Deliverable**: Power scaling spreadsheet with:
- Stat growth per level per archetype
- Power rating calculation examples
- Difficulty curves for all content types

**Due**: Before Beta Testing (Month 6)

---

#### 2.3 **Monster Capture & Dungeon Balance** (HIGH PRIORITY)
**Action Items**:
- [ ] Validate 5-15% capture rate feels good (not frustrating, not too easy)
- [ ] Calculate dungeon construction costs vs farming efficiency
- [ ] Ensure personal dungeons are faster but cost resources (trade-off clear)
- [ ] Balance durability (10-20 runs) vs construction costs

**Deliverable**: Balance validation document with:
- Capture rate testing scenarios
- Cost/efficiency calculations
- Durability tuning rationale

**Due**: Before Beta Testing (Month 6)

---

#### 2.4 **Equipment Set Bonus Tuning** (MEDIUM PRIORITY)
**Action Items**:
- [ ] Define exact set bonus percentages (2/4/6 piece)
- [ ] Ensure set bonuses feel impactful but not mandatory
- [ ] Validate multiple viable builds exist
- [ ] Calculate equipment power contribution (30-40% of total)

**Deliverable**: Equipment balance document with:
- All set bonuses defined with exact percentages
- Power contribution breakdown
- Build viability analysis

**Due**: Before Beta Testing (Month 6)

---

## 📋 Priority 3: Implementation Readiness (During Development)

### Technical Validation

#### 3.1 **Monster Reuse Cooldown Implementation** (HIGH PRIORITY)
**Action Items**:
- [ ] Design cooldown UI indicators (visual, timer display)
- [ ] Define cooldown data structure (per-monster, timestamp-based)
- [ ] Implement cooldown reset logic
- [ ] Test edge cases (dungeon destroyed before cooldown expires, etc.)

**Decision Status**: ✅ DECIDED - Cooldown-based (24-hour) reassignment  
**Implementation Needed**: UI/UX design, data structure, edge case handling

**Due**: During Phase 2 (Month 3-4)

---

#### 3.2 **Schematic Drop Rate Implementation** (HIGH PRIORITY)
**Action Items**:
- [ ] Implement drop rate system per content type
- [ ] Create difficulty modifier calculations
- [ ] Test first-clear vs repeat-clear rates
- [ ] Validate drop rate distribution feels fair

**Decision Status**: ✅ DECIDED - Difficulty-based with content type modifiers  
**Implementation Needed**: Drop rate system, modifier calculations, testing

**Due**: During Phase 2 (Month 3-4)

---

#### 3.3 **Content Update Pipeline Design** (MEDIUM PRIORITY)
**Action Items**:
- [ ] Design modular content system (easy to add zones/monsters/schematics)
- [ ] Create content update workflow
- [ ] Define asset reuse strategy
- [ ] Plan content update cadence implementation

**Decision Status**: ✅ DECIDED - Major every 3 months, minor monthly  
**Implementation Needed**: Content system architecture, update workflow

**Due**: During Phase 3 (Month 5-6)

---

## 🧪 Priority 4: Validation & Testing (Before Launch)

### Pre-Launch Validation

#### 4.1 **Beta Testing Program Design** (HIGH PRIORITY)
**Action Items**:
- [ ] Define beta testing structure (closed beta, open beta)
- [ ] Create feedback collection system
- [ ] Design conversion rate tracking
- [ ] Plan beta reward system
- [ ] Define beta testing success criteria

**Deliverable**: Beta testing plan document with:
- Beta structure and phases
- Feedback collection methods
- Analytics tracking requirements
- Success metrics definition

**Due**: Month 6 (Before Phase 4)

---

#### 4.2 **Demo Conversion Optimization** (HIGH PRIORITY)
**Action Items**:
- [ ] A/B test demo tutorial messaging
- [ ] Test personal dungeon preview effectiveness
- [ ] Validate upgrade CTA placement and wording
- [ ] Measure actual conversion rates vs 15% target
- [ ] Iterate based on data

**Deliverable**: Conversion optimization report with:
- A/B test results
- Conversion funnel analysis
- Optimization recommendations
- Final conversion rate target

**Due**: During Beta Testing (Month 6-7)

---

#### 4.3 **Player Experience Validation** (HIGH PRIORITY)
**Action Items**:
- [ ] Test complete player journey (Phase 0-6) with real players
- [ ] Validate dopamine hits occur at intended moments
- [ ] Ensure no major frustration points
- [ ] Test offline progress functionality
- [ ] Validate session length matches design (5-15min OR 30min+)

**Deliverable**: Player experience validation report

**Due**: During Beta Testing (Month 6-7)

---

## 📊 Priority 5: Emergent Story System Decisions (Can Defer)

### Lower Priority (Post-Launch Enhancement)

#### 5.1 **Emergent Story System Mechanics** (LOW-MEDIUM PRIORITY)
**Why Deferrable**: System is enhancement, not core to MVP

**Questions to Resolve**:
- [ ] Negative events preventable OR pure RNG?
- [ ] Relationships permanent OR temporary?
- [ ] Trait evolution permanent OR temporary?
- [ ] Social Media Star alliance integration?

**Recommendation**: 
- **Hybrid Approach**: Some events preventable (equipment maintenance), some pure RNG (weather, random encounters)
- **Temporary Relationships**: More dynamic storytelling, creates new stories over time
- **Temporary Trait Evolution**: Creates memorable moments without permanent power creep
- **Social Media Star**: Bonus alliance points, cosmetic social posts (no power advantage)

**Decision Needed By**: Before implementing emergent story system (Post-launch feature)

---

## 🎯 Recommended Focus Order

### Week 1-2: Critical Design Decisions
1. ✅ Ascension system finalization
2. ✅ Alliance raid scaling definition
3. ✅ Guild customization decision
4. ✅ Dungeon preview decision
5. ✅ Recruitment reroll decision

### Week 3-4: Tutorial & Onboarding Polish
1. Create detailed tutorial flow
2. Validate demo tutorial effectiveness
3. Design upgrade CTA placement
4. Test tutorial timing and pacing

### Month 2: Implementation Foundation
1. Implement decided systems (monster reuse, schematic drops)
2. Create economy balance framework
3. Define power scaling formulas
4. Begin technical implementation

### Month 3-4: Balance Tuning
1. Create balance spreadsheets
2. Test economy balance
3. Validate progression pacing
4. Tune numbers based on testing

### Month 5-6: Beta Preparation
1. Design beta testing program
2. Create feedback systems
3. Prepare analytics tracking
4. Finalize balance numbers

### Month 6-7: Beta Testing & Validation
1. Run closed beta
2. Collect feedback
3. Optimize conversion rates
4. Validate player experience

---

## 📈 Success Metrics for Planning Phase

**Design Completeness**:
- ✅ 0 critical questions blocking implementation
- ✅ All balance formulas defined
- ✅ All progression curves validated
- ✅ Tutorial flow finalized

**Implementation Readiness**:
- ✅ All Phase 1 systems fully designed
- ✅ Phase 2 systems design complete
- ✅ Technical architecture validated
- ✅ Balance numbers defined

**Validation Readiness**:
- ✅ Beta testing plan created
- ✅ Feedback systems designed
- ✅ Analytics tracking defined
- ✅ Success criteria established

---

## 🚀 Immediate Next Steps

**This Week**:
1. **Decide Ascension System** - Single with specialization paths (RECOMMENDED)
2. **Define Raid Scaling** - 3 players = 100%, 4 = 120%, 5 = 150% (RECOMMENDED)
3. **Finalize Guild Customization** - First hero only (RECOMMENDED)
4. **Decide Dungeon Preview** - Free preview run (RECOMMENDED)
5. **Decide Recruitment Reroll** - Single trait reroll for +50 Gold (RECOMMENDED)

**Next 2 Weeks**:
1. Create detailed tutorial flow document
2. Design economy balance framework
3. Define power scaling formulas
4. Create balance validation spreadsheets

**Next Month**:
1. Validate all balance numbers
2. Create beta testing plan
3. Begin technical implementation
4. Design analytics tracking

---

**Focus Summary**: Resolve critical design decisions first (this week), then polish onboarding (next 2 weeks), then focus on balance tuning (month 2), then prepare for validation (months 5-6).

