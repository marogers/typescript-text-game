
export enum WornLocation {
  head = 'head',
  body = 'body',
  arms = 'arms',
  hands = 'hands',
  legs = 'legs',
  feet = 'feet',
  back = 'back',
  waist = 'waist',
  neck = 'neck',
  finger1 = 'finger1',
  finger2 = 'finger2'
}

// Item
export interface Item {
  name: string
  description: string
  keywords?: string[]
  weight?: number // in pounds
  value?: number // in gold
  wornLocation?: WornLocation
}

// Worn
export interface Equipment {
  head?: Item
  body?: Item
  arms?: Item
  hands?: Item
  legs?: Item
  feet?: Item
  back?: Item
  waist?: Item
  neck?: Item
  finger1?: Item
  finger2?: Item
}

export const item_Hat: Item = {
  name: 'Hat',
  description: 'A simple hat to keep the sun off your face.',
  keywords: ['hat'],
  weight: 0.5,
  value: 1,
  wornLocation: WornLocation.head
}

export const item_Gloves: Item = {
  name: 'Gloves',
  description: 'A pair of brown leather gloves.',
  keywords: ['gloves', 'leather'],
  weight: 0.5,
  value: 1,
  wornLocation: WornLocation.hands
}

export const item_Apple: Item = {
  name: 'Apple',
  description: 'A juicy red apple.',
  keywords: ['apple', 'fruit'],
  weight: 0.5,
  value: 1
}

export const item_Mug: Item = {
  name: 'Mug',
  description: 'A sturdy wooden mug, half-full of ale.',
  keywords: ['mug', 'cup'],
  weight: 1,
  value: 1
}