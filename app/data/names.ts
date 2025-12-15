import type { Gender, Culture } from '~~/types'

// Name pools by gender
export const FIRST_NAMES: Record<Gender, string[]> = {
  male: [
    // Classic fantasy
    'Aldric', 'Brom', 'Cedric', 'Dorian', 'Erik', 'Gareth', 'Hadrian', 'Leoric',
    'Marcus', 'Nolan', 'Orion', 'Roland', 'Theron', 'Victor', 'William',
    // Rustic
    'Bart', 'Finn', 'Gus', 'Hob', 'Jasper', 'Milo', 'Ned', 'Pip', 'Rolf', 'Tom',
    // Exotic
    'Azim', 'Dax', 'Kael', 'Orin', 'Thane', 'Vex', 'Zephyr',
    // Silly-adjacent
    'Bob', 'Greg', 'Kevin', 'Steve', 'Todd', 'Dave', 'Frank',
  ],
  female: [
    // Classic fantasy
    'Alara', 'Brynn', 'Celia', 'Elira', 'Freya', 'Helena', 'Lyra', 'Sera',
    'Astrid', 'Diana', 'Iris', 'Luna', 'Maya', 'Nora', 'Vera',
    // Rustic
    'Ada', 'Bess', 'Cora', 'Dottie', 'Effie', 'Greta', 'Mabel', 'Nell', 'Tilly', 'Wren',
    // Exotic
    'Ishara', 'Kira', 'Nyx', 'Riven', 'Sable', 'Vela', 'Zara',
    // Silly-adjacent
    'Barb', 'Brenda', 'Linda', 'Pam', 'Susan', 'Carol', 'Janet',
  ],
  nonbinary: [
    // Gender-neutral names
    'Ash', 'Blake', 'Casey', 'Drew', 'Ellis', 'Finley', 'Gray', 'Haven',
    'Indigo', 'Jordan', 'Kerry', 'Lane', 'Morgan', 'Nico', 'Phoenix',
    'Quinn', 'Reese', 'Sage', 'Taylor', 'Val', 'Winter', 'Wren',
  ],
}

// Culture-specific name weights (some names feel more "right" for certain cultures)
export const CULTURE_NAME_PREFERENCES: Record<Culture, Partial<Record<Gender, string[]>>> = {
  northfolk: {
    male: ['Brom', 'Erik', 'Finn', 'Gareth', 'Hadrian', 'Rolf', 'Thane', 'Theron'],
    female: ['Astrid', 'Brynn', 'Freya', 'Greta', 'Helga', 'Ingrid', 'Sigrid'],
  },
  coastborn: {
    male: ['Dorian', 'Marcus', 'Nolan', 'Orion', 'Victor', 'Bart', 'Jasper'],
    female: ['Celia', 'Diana', 'Helena', 'Iris', 'Luna', 'Marina', 'Vera'],
  },
  woodwalkers: {
    male: ['Aldric', 'Finn', 'Kael', 'Milo', 'Orin', 'Pip', 'Zephyr'],
    female: ['Alara', 'Elira', 'Lyra', 'Nyx', 'Sera', 'Vela', 'Wren'],
  },
  crownlanders: {
    male: ['Cedric', 'Dorian', 'Leoric', 'Roland', 'Victor', 'William', 'Bob', 'Greg'],
    female: ['Celia', 'Diana', 'Helena', 'Nora', 'Vera', 'Ada', 'Susan'],
  },
}

// Get a random name, optionally weighted by culture
export function getRandomName(gender: Gender, culture?: Culture): string {
  // 50% chance to use culture-preferred name if available
  if (culture && Math.random() < 0.5) {
    const preferred = CULTURE_NAME_PREFERENCES[culture][gender]
    if (preferred && preferred.length > 0) {
      return preferred[Math.floor(Math.random() * preferred.length)]
    }
  }

  const names = FIRST_NAMES[gender]
  return names[Math.floor(Math.random() * names.length)]
}
