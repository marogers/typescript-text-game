import { Equipment, Item, item_Hat } from './items'

export function printMob(mob: Mob): void {
  let equipment = '\n'
  if (mob.equipment) {
    if (mob.equipment.head) equipment += `Head: ${mob.equipment.head.name}\n`
    if (mob.equipment.body) equipment += `Body: ${mob.equipment.body.name}\n`
    if (mob.equipment.arms) equipment += `Arms: ${mob.equipment.arms.name}\n`
    if (mob.equipment.hands) equipment += `Hands: ${mob.equipment.hands.name}\n`
    if (mob.equipment.legs) equipment += `Legs: ${mob.equipment.legs.name}\n`
    if (mob.equipment.feet) equipment += `Feet: ${mob.equipment.feet.name}\n`
    if (mob.equipment.back) equipment += `Back: ${mob.equipment.back.name}\n`
    if (mob.equipment.waist) equipment += `Waist: ${mob.equipment.waist.name}\n`
    if (mob.equipment.neck) equipment += `Neck: ${mob.equipment.neck.name}\n`
    if (mob.equipment.finger1) equipment += `Finger: ${mob.equipment.finger1.name}\n`
    if (mob.equipment.finger2) equipment += `Finger: ${mob.equipment.finger2.name}\n`

    // Trim last newline
    equipment = equipment.slice(0, equipment.length - 1)
  }
  console.log(`${mob.name}\n${mob.description}${equipment}`)
}

// Mobile
export interface Mob {
  name: string
  description: string
  keywords: string[]
  inventory?: Item[]
  equipment?: Equipment
  passiveActions?: string[]
  sentinel?: boolean
}

export const Barkeep = 
{
  name: 'Barkeep',
  description: 'A burly man with a bushy beard, wiping down the bar.',
  keywords: ['barkeep', 'man', 'burly'],
  inventory: [],
  equipment: {},
  passiveActions: ['The barkeep polishes a glass.'],
  sentinel: true,
}

export const Merchant = {
  name: 'Merchant',
  description: 'A merchant with a cart full of goods, hawking his wares.',
  keywords: ['merchant', 'man'],
  inventory: [],
  equipment: { head: item_Hat },
  passiveActions: ['The merchant carefully takes inventory of his products.'],
  sentinel: true,
}

export const Blacksmith = {
  name: 'Blacksmith',
  description: 'Rugged and muscular, the blacksmith is hard at work at the forge.',
  keywords: ['blacksmith', 'man', 'smith'],
  inventory: [],
  equipment: {},
  passiveActions: [
    'The blacksmith hammers away at a piece of metal.',
    'The blacksmith wipes sweat from his brow.',
    'The blacksmith fans the flames of the forge.'
  ],
  sentinel: true,
}
