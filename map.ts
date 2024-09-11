import { Item, item_Apple, item_Hat, item_Mug, item_Gloves } from './items'
import { Barkeep, Merchant, Blacksmith } from './mobs'
import type { Mob } from './mobs'

export enum Direction {
  north = 'north',
  south = 'south',
  east = 'east',
  west = 'west'
}

export interface Room {
  id: number
  name: string
  description: string
  exits: Exit[]
  items: Item[]
  mobs: Mob[]
}

export interface Exit {
  direction: Direction
  room: number
}

export interface Map {
  rooms: Room[]
}

export const map: Map = {
  rooms: [
    {
      id: 1,
      name: 'The Tavern',
      description: 'A warm and inviting tavern with a roaring fire in the hearth. The barkeep is busy cleaning glasses behind the bar.',
      exits: [
        {
          direction: Direction.north,
          room: 2
        }
      ],
      items: [item_Mug, item_Hat, item_Hat, item_Gloves],
      mobs: [Barkeep]
    },
    {
      id: 2,
      name: 'Town Square',
      description: 'The town square is bustling with activity. Merchants hawk their wares and children play in the fountain.',
      exits: [
        {
          direction: Direction.west,
          room: 3
        },
        {
          direction: Direction.south,
          room: 1
        }
      ],
      items: [item_Apple],
      mobs: [Merchant]
    },
    {
      id: 3,
      name: 'The Blacksmith',
      description: 'The blacksmith\'s forge is roaring and the air is thick with the smell of hot metal.',
      exits: [
        {
          direction: Direction.east,
          room: 2
        }
      ],
      items: [],
      mobs: [Blacksmith]
    }
  ]
}