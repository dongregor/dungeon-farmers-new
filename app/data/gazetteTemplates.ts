// ========================================
// THE DAILY GRIND - Template Data
// ========================================
// All gazette content templates. Uses {variable} substitution.
// Variables available per section are documented above each group.

// ========================================
// HEADLINES
// ========================================
// Variables: {heroName}, {zoneName}, {itemName}, {rarity}, {bossName},
//            {level}, {prestigeLevel}, {guildName}, {archetype}

export const HEADLINE_TEMPLATES = {
  legendary_loot: [
    'BREAKING: {heroName} Returns From {zoneName} With {itemName} - Guild Treasure Vault "Running Out of Display Cases"',
    'LEGENDARY DROP IN {zoneName}: {heroName} Finds {itemName}, Teammates "Definitely Not Jealous"',
    '{itemName} DISCOVERED IN {zoneName} - {heroName} Claims It Was "Totally Calculated, Not Luck"',
  ],
  epic_loot: [
    '{heroName} Brings Home Epic Loot From {zoneName} - Quality of Life in Guild "Significantly Improved"',
    'EPIC HAUL: {heroName}\'s {zoneName} Expedition Yields {itemName}',
  ],
  prestige: [
    'EXCLUSIVE: {heroName} Reaches Prestige {prestigeLevel} - "I\'m Basically a God Now," Claims Hero Who Died Twice Yesterday',
    '{heroName} PRESTIGES AGAIN: Guildmates Unsure Whether to Be Impressed or Concerned',
    'PRESTIGE {prestigeLevel}: {heroName} Resets Everything, Insists "It\'s Worth It This Time"',
  ],
  level_up: [
    '{heroName} Hits Level {level}! Party Thrown, Cake Consumed, Training Dummy Destroyed',
    'MILESTONE: {heroName} Reaches Level {level} - "I Can Feel the Power," Hero Reports',
  ],
  big_gold_day: [
    'RECORD HAUL: Guild Earns {goldAmount} Gold in Single Day - Accountant "Cautiously Optimistic"',
    'GOLD RUSH: {guildName} Posts Best Day Yet With {goldAmount} Gold Across All Expeditions',
  ],
  new_recruit_rare: [
    'TALENT ACQUIRED: {rarity} {archetype} {heroName} Joins {guildName} - "Very Excited to Be Here," Lies New Recruit',
    'NEW HERO ALERT: {heroName} ({rarity} {archetype}) Signs With {guildName}, Immediately Asks About Benefits Package',
  ],
  retirement: [
    '{heroName} RETIRES AFTER LEGENDARY CAREER - "It\'s Been Real," Says Hero, Level {level}',
    'END OF AN ERA: {heroName} Hangs Up Their Sword After {expeditionCount} Expeditions',
  ],
  multi_expedition: [
    'BUSY DAY: {guildName} Completes {expeditionCount} Expeditions - Heroes "Exhausted But Rich"',
    '{expeditionCount} EXPEDITIONS IN ONE DAY: {guildName} Sets New Personal Record',
  ],
  fallback: [
    'SLOW NEWS DAY: Guild Mostly Stared at Walls, Sources Confirm',
    'NOTHING OF NOTE OCCURRED: Editor Forced to Report on Weather (See Forecast)',
    'ALL QUIET ON THE GUILD FRONT: {guildName} Enjoys Rare Day of Peace and Quiet',
    'BREAKING: Nothing Happened Yesterday and Honestly That\'s Fine',
    'GUILD ACTIVITY REPORT: *Crickets* - No Expeditions, No Drama, No Comment',
  ],
  inaugural: [
    'INAUGURAL ISSUE: {guildName} Officially Opens for Business!',
    'WELCOME TO THE DAILY GRIND: {guildName}\'s First Ever Gazette Edition',
  ],
}

// ========================================
// EXPEDITION DISPATCHES
// ========================================
// Variables: {leaderName}, {zoneName}, {subzoneName}, {efficiency},
//            {heroNames}, {partySize}, {goldEarned}, {xpEarned},
//            {duration}, {itemCount}, {notableEntry}, {traitQuote}

export const DISPATCH_TEMPLATES = [
  'Our correspondent embedded with {leaderName}\'s party reports the expedition to {zoneName} achieved {efficiency}% efficiency. {notableEntry}',
  'A party of {partySize} led by {leaderName} returned from {subzoneName} in {zoneName}. {goldEarned} gold recovered. {traitQuote}',
  '{leaderName}\'s {zoneName} expedition concluded after {duration}. The party brought back {itemCount} items and {goldEarned} gold. {notableEntry}',
  'DISPATCH FROM {zoneName}: {leaderName} reports mission complete. Efficiency: {efficiency}%. Gold: {goldEarned}. Morale: questionable. {traitQuote}',
  '{subzoneName} ({zoneName}) - {partySize}-hero team under {leaderName} completed their sweep. {notableEntry} All heroes accounted for.',
]

export const DISPATCH_NOTABLE_FALLBACKS = [
  'The expedition was largely uneventful.',
  'Nothing particularly noteworthy occurred. A refreshing change.',
  'All went according to plan, which is suspicious in itself.',
  'The party reports "it was fine." Riveting journalism.',
]

// ========================================
// HERO SPOTLIGHT
// ========================================
// Variables: {heroName}, {archetype}, {rarity}, {level},
//            {expeditionCount}, {goldEarned}, {traitName}, {traitQuote},
//            {trait1}, {trait2}

export const SPOTLIGHT_INTROS = [
  'After a solid day of adventuring ({expeditionCount} expeditions, {goldEarned} gold earned), {heroName} sat down with the Grind for an exclusive interview.',
  '{heroName}, a level {level} {rarity} {archetype}, has been making waves around the guild. We caught up with them between expeditions.',
  'This edition\'s spotlight falls on {heroName}, the {rarity} {archetype} who has been on everyone\'s lips lately.',
  'We tracked down {heroName} in the guild hall (they were {traitQuote}) for a quick chat about their recent adventures.',
]

export const SPOTLIGHT_TRAIT_COMMENTARY: Record<string, string[]> = {
  cheese_obsessed: [
    'When asked about their goals, {heroName} immediately pivoted to cheese. "I heard there\'s a dungeon with a cheese golem," they said, eyes gleaming. "I WILL find it."',
    '{heroName}\'s locker contains 47 cheese wheels. The guild has asked them to stop. They have not stopped.',
  ],
  chronic_napper: [
    '{heroName} fell asleep twice during our interview. We\'re choosing to interpret this as comfort rather than disrespect.',
    'Teammates describe working with {heroName} as "effective but narcoleptic." They reportedly slept through a boss encounter and still dealt damage somehow.',
  ],
  overly_dramatic: [
    '"EVERY expedition is the greatest challenge of my LIFE," declared {heroName}, gesturing wildly at a routine forest patrol.',
    '{heroName} narrates everything in third person. "{heroName} grants this interview graciously," they announced upon sitting down.',
  ],
  conspiracy_theorist: [
    '{heroName} spent most of the interview explaining how Big Potion is suppressing healing magic. "Follow the gold," they whispered.',
    'Our reporter noticed {heroName}\'s quarters are covered in connected string and notes. "It all makes sense when you see the pattern," they insisted.',
  ],
  bug_phobia: [
    '{heroName} requested this interview be conducted OUTSIDE. "No caves. No basements. If I see ONE spider, this is over."',
    'Despite their bug phobia, {heroName} has been assigned to cave expeditions three times this week. They describe this as "a conspiracy."',
  ],
  afraid_of_heights: [
    '{heroName} politely declined to meet us on the guild\'s observation deck. We conducted the interview in the basement instead.',
    'Mountain expeditions remain {heroName}\'s least favorite assignment. "I don\'t see why we can\'t fight evil at sea level," they argued.',
  ],
  amateur_botanist: [
    '{heroName} showed us their pressed flower collection during the interview. It\'s genuinely impressive. We\'re not sure how it helps with combat.',
    '"People think I\'m weird for cataloging plants during battles," said {heroName}. "But you know what? I found three new species last week."',
  ],
  rock_collector: [
    '{heroName}\'s pack weighs three times what anyone else carries. "These aren\'t ROCKS, they\'re SPECIMENS," they corrected us.',
    'The guild hall is running out of shelf space for {heroName}\'s rock collection. Management is "in discussions."',
  ],
  superstitious: [
    '{heroName} knocked on wood seventeen times during our conversation. We counted.',
    'Before every expedition, {heroName} performs a 12-step ritual that takes longer than the actual expedition.',
  ],
  terrible_singer: [
    'We attempted an interview with {heroName}, but they insisted on singing their answers. We have transcribed what we could.',
    'Party members report that {heroName}\'s singing has "tactical applications" - specifically, making enemies flee in terror.',
  ],
  compulsive_counter: [
    '{heroName} informed us this interview contained "exactly 247 words so far." We did not verify this.',
    '"There are 14 tiles on this floor, 3 cracks in the ceiling, and 2 cobwebs," {heroName} reported unprompted.',
  ],
  wannabe_chef: [
    '{heroName} prepared a "dungeon stew" for our meeting. Ingredients included things we\'d rather not identify. It was... edible.',
    '"Everything is a potential ingredient if you\'re brave enough," {heroName} said, eyeing a decorative plant suspiciously.',
  ],
  claustrophobic: [
    '{heroName} requested we meet in the guild\'s largest room. With all windows open. And the door propped wide.',
    'Cave assignments remain a sore subject. "I do my best work in open fields," {heroName} stated firmly.',
  ],
  dragon_survivor: [
    '{heroName} has that look in their eyes. The kind you get after surviving a dragon. "Everything else is easy after that," they said quietly.',
    'Other heroes look at {heroName} differently since the dragon incident. With respect. And a little fear.',
  ],
  cursed: [
    'Three things fell off the wall during our interview with {heroName}. Unrelated, they assure us.',
    '{heroName}\'s curse acted up during our meeting. The reporter\'s quill exploded. Classic.',
  ],
}

export const SPOTLIGHT_GENERIC_COMMENTARY = [
  '{heroName}\'s teammates describe them as "reliable" and "only slightly unhinged." High praise in this guild.',
  'When asked about their future goals, {heroName} said: "More gold, more XP, maybe a vacation."',
  '{heroName} has been with the guild since level 1 and shows no signs of slowing down.',
  '"I just want to do my job and not die," said {heroName}. A modest but relatable ambition.',
]

export const SPOTLIGHT_STATS_LINE = 'Stats: {goldEarned} gold earned, {expeditionCount} expeditions completed.'

// ========================================
// GOSSIP - "WHISPERS & RUMORS"
// ========================================

// Hero drama (trait-driven) - Variables: {hero1}, {hero2}, {trait1}, {trait2}, {topic}
export const GOSSIP_HERO_DRAMA = [
  'Sources say {hero1} and {hero2} got into an argument over {topic}. Neither will comment. The rest of the guild is taking sides.',
  '{hero1} was overheard calling {hero2} "a bad influence." {hero2} reportedly took this as a compliment.',
  'Tensions are rising between {hero1} and {hero2}. Guild management is "monitoring the situation."',
  '{hero1} and {hero2} were seen sharing drinks at the tavern. An unlikely friendship? Or a strategic alliance? Sources unclear.',
  '{hero1} borrowed {hero2}\'s equipment without asking. Again. A formal complaint has been filed.',
  'Guild gossip suggests {hero1} has been trying to teach {hero2} their skills. Results described as "mixed."',
]

export const GOSSIP_DRAMA_TOPICS: Record<string, string[]> = {
  cheese_obsessed: ['the merits of aged cheddar', 'whether cheese is an acceptable breakfast food (it is)', 'the alleged "cheese shortage"'],
  chronic_napper: ['napping during guard duty', 'appropriate nap locations', 'the definition of "a quick rest"'],
  overly_dramatic: ['volume levels during expeditions', 'whether monologuing counts as a combat strategy', 'theatrical entrance protocol'],
  conspiracy_theorist: ['whether the guild master is "actually in charge"', 'potion pricing conspiracies', 'the suspicious behavior of local merchants'],
  terrible_singer: ['music quality standards', 'the definition of "talent"', 'whether singing should be banned in dungeons'],
  compulsive_counter: ['counting methodology', 'whether 47 is really the most important number', 'inventory organization systems'],
  superstitious: ['lucky charm authenticity', 'whether rituals actually work', 'acceptable pre-expedition superstitions'],
  wannabe_chef: ['cooking standards', 'what qualifies as "food"', 'the ethics of cooking monster parts'],
  amateur_botanist: ['plant identification accuracy', 'whether specimens belong in the guild hall', 'approved sample collection methods'],
  rock_collector: ['weight limits for personal items', 'whether rocks count as "essential equipment"', 'shelf space allocation'],
  bug_phobia: ['acceptable insect proximity thresholds', 'cave expedition assignments', 'who left a fake spider in whose locker'],
  afraid_of_heights: ['mountain mission volunteers', 'second-floor office assignments', 'ladder safety regulations'],
  claustrophobic: ['cave expedition scheduling', 'minimum room sizes', 'the ventilation in the guild basement'],
}

// Zone rumors - Variables: {zoneName}, {monsterType}
export const GOSSIP_ZONE_RUMORS = [
  'Strange lights reported above {zoneName}. Locals blame "the usual."',
  'Merchants returning from {zoneName} report unusually aggressive monster activity. Expedition teams advised to bring extra potions.',
  'A mysterious figure was seen near the {zoneName} entrance. Description matches no known hero or monster. Probably fine.',
  'Rumor has it a hidden cache of gold was discovered somewhere in {zoneName}. Nobody can confirm the exact location.',
  'Adventurers from rival guilds have been spotted scouting {zoneName}. Competition may be increasing.',
  'Local farmers near {zoneName} complain about noise. "Sounds like someone\'s fighting in there all day," one reported.',
  'A map to an unexplored section of {zoneName} appeared on the guild notice board. Nobody knows who posted it.',
  'Weather conditions in {zoneName} described as "weird" by returning parties. Pack accordingly.',
]

// Meta-gaming gossip
export const GOSSIP_META = [
  'Anonymous hero complains: "Why do we keep doing the same zones? Is someone making us repeat content?" Existential crisis ongoing.',
  'Hero support group for "people who keep getting the same loot drops" meets Tuesdays at the tavern.',
  'Local economist baffled by loot drop rates. "The math doesn\'t add up," says no one who understands RNG.',
  'Several heroes report a strange feeling of being "watched" and "managed." Guild therapist says this is normal.',
  'A petition to "buff healers" has been circulating the guild. Tank mains are suspiciously silent.',
  'Guild philosopher poses the question: "If nobody runs the expedition, does the loot still drop?" Debate rages.',
  'Someone graffitied "NERF TANKS" on the guild hall wall. Investigation ongoing. Suspects: everyone.',
  'Heroes debate: is it ethical to farm the same dungeon 47 times? Consensus: "If the loot is good, yes."',
]

// ========================================
// CLASSIFIEDS
// ========================================

export const CLASSIFIEDS_STATIC = [
  'FOR SALE: Slightly used healing potion. Tastes like feet but it works. 50 gold OBO. Serious inquiries only.',
  'WANTED: Party healer. Must be okay with "creative tanking strategies." Previous healer quit. (Unrelated.)',
  'LOST: One (1) enchanted sword. Last seen flying out of my hands during boss fight. If found, DO NOT touch the glowy bit.',
  'HELP WANTED: Dungeon architect seeks monsters willing to stand in rooms and look threatening. Flexible hours.',
  'PERSONAL: Tall, dark, handsome warrior seeks someone who won\'t judge my rock collection. Must like caves.',
  'NOTICE: The guild suggestion box has been removed after someone submitted "more cheese" 47 times. You know who you are.',
  'FOR RENT: Prime dungeon real estate. 3 rooms, 2 traps, 1 boss chamber. Monsters not included.',
  'SEEKING: Expedition partners who DON\'T sing. Non-negotiable. Will pay extra.',
  'FOUND: One mysterious orb, glowing purple, probably cursed. Come claim it. Please. It\'s making noises.',
  'GUILD ANNOUNCEMENT: The coffee machine in the break room is NOT a potion dispenser. Stop putting reagents in it.',
  'SERVICES: Professional torch-holder available for dungeon runs. Competitive rates. Will also hold snacks.',
  'WANTED: Someone to explain what "synergy" means. Asking for a friend (the friend is me).',
  'FOR SALE: "How to Tank Without Dying" guidebook. Slightly bloodstained. Ironic? Perhaps.',
  'LOST AND FOUND: A pile of rocks has appeared in the guild hallway. If these are yours, please collect them immediately.',
  'PERSONAL: Looking for a quest partner who doesn\'t monologue during combat. This is a REAL problem.',
  'NOTICE: Whoever is leaving cheese in the armory, please stop. The mice are getting ideas.',
  'HELP WANTED: Brave soul needed to clean the guild basement. Last person sent down hasn\'t been seen in 3 days. Probably fine.',
  'FOR SALE: Map to "guaranteed" legendary treasure. Map sold as-is. No refunds. Cartographer not liable for dragon encounters.',
  'GUILD SOCIAL: Friday night potluck at the tavern. Bring a dish. Monster parts do NOT count as a dish, {heroName}.',
  'WANTED: Volunteers for experimental potion testing. Side effects may include: glowing, levitation, existential dread.',
]

// Dynamic classifieds - Variables: {heroName}, {zoneName}, {itemName}, {level}, {archetype}
export const CLASSIFIEDS_DYNAMIC = [
  'WANTED: Heroes for {zoneName} expedition. Minimum level {level}. Apply at the guild hall. Dental not included.',
  '{heroName} is looking for expedition partners. Requirements: "just don\'t be weird about it."',
  'GUILD NOTICE: {heroName} has been banned from the guild kitchen until further notice.',
  '{heroName} is selling hand-drawn maps of {zoneName}. Accuracy: "roughly approximate." Price: 10 gold.',
]

// ========================================
// LETTERS TO THE EDITOR
// ========================================
// Variables: {heroName}, {zoneName}, {zoneType}, {traitName}, {dayCount}, {expeditionCount}

export const LETTERS_HATED_ZONE: Record<string, string[]> = {
  bug_phobia: [
    'Dear Daily Grind,\nI have been assigned to {zoneName} for the THIRD time this week. As someone with documented Bug Phobia, I find this deeply concerning. I have filed a formal complaint with guild management. It was ignored. Again.\nRegards,\n{heroName}',
  ],
  afraid_of_heights: [
    'Dear Daily Grind,\nWhoever keeps scheduling me for mountain expeditions: I SEE YOU. My fear of heights is ON RECORD. The view is NOT "worth it." Please reassign.\nSincerely,\n{heroName}',
  ],
  claustrophobic: [
    'Dear Daily Grind,\nAnother cave expedition. Another panic attack. Is this what "career development" looks like? Requesting transfer to ANY zone with a visible sky.\nDesperately,\n{heroName}',
  ],
}

export const LETTERS_OVERWORKED = [
  'Dear Daily Grind,\nI have been on {expeditionCount} expeditions in the past day. I would like to formally request: a break. Just one. Please. My everything hurts.\nExhaustedly,\n{heroName}',
  'Dear Daily Grind,\n{expeditionCount} expeditions. One day. Zero breaks. Is this a guild or a sweatshop? Asking for myself.\nTired but not quitting (yet),\n{heroName}',
]

export const LETTERS_BENCHED = [
  'Dear Daily Grind,\nI haven\'t been sent on an expedition in {dayCount} days. Am I fired? Is this a performance issue? I\'ve been stress-eating in the tavern. Please advise.\nSincerely,\n{heroName}',
  'Dear Daily Grind,\nStill here. Still waiting. Still not on any expeditions. Beginning to think the guild forgot I exist. If anyone reads this, I\'m available.\nHopefully,\n{heroName}',
]

// ========================================
// STATS COMMENTARY
// ========================================

export const STATS_MVP_REASONS = [
  'highest gold earned',
  'most expeditions completed',
  'carried the team (literally)',
  'best efficiency ratings',
  'most items discovered',
]

export const STATS_FUN_STATS = [
  'Times {heroName} mentioned cheese: estimated 47',
  'Rocks collected by {heroName}: too many',
  'Naps taken by {heroName}: more than expeditions completed',
  'Dramatic monologues delivered: at least {count}',
  'Lucky rituals performed before expeditions: {count}',
  'Plants identified by {heroName}: probably all of them',
  'Conspiracy theories proposed: {count}, none confirmed',
  'Terrible songs sung by {heroName}: the guild has lost count',
  'Items counted by {heroName}: literally everything',
  'Experimental dishes cooked by {heroName}: {count} (edible: {edibleCount})',
  'Average expedition enthusiasm level: moderate to concerning',
  'Guild coffee consumption: {count} cups (new record)',
  'Heroes who complained about their assignments: all of them',
]

// ========================================
// FORECAST
// ========================================

export const FORECAST_TEMPLATES = [
  'Clear skies over {zoneName}. Excellent expedition weather. {otherZone} reports fog - proceed with caution.',
  'Mild conditions across all zones. Perfect day for adventuring. Or napping. We don\'t judge.',
  'Storm warning for {zoneName}. Pack extra gear. {otherZone} looks clear if you prefer dry combat.',
  'Beautiful day ahead. The kind of day where nothing can go wrong. (Famous last words.)',
  'Overcast with a chance of treasure. Visibility in {zoneName}: adequate. Monster activity: moderate.',
  'Surprisingly pleasant conditions everywhere. Suspiciously pleasant, even. Stay alert.',
  'Hot and dry in {zoneName}. Bring water. {otherZone} is cool and damp. Bring a towel.',
  'All zones reporting normal conditions. "Normal" being relative when you\'re fighting monsters.',
]
