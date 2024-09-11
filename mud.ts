import { Worker } from 'worker_threads'
import { Interface, createInterface } from 'readline'
import { map, Direction } from './map'
import type { Room, Exit, Map } from './map'
import type { Equipment, Item } from './items'
import { printMob } from './mobs'
import { Commands } from './commands'

let passiveRoomWorker = new Worker('./passive-room-worker.js')
passiveRoomWorker.on('message', (message) => {
  console.log(message);
})
passiveRoomWorker.removeAllListeners()

export interface Player {
  name: string
  location: number
  inventory: Item[]
  equipment?: Equipment
}

function parseInput(input: string): string[] {
  return input.toLowerCase().trim().split(' ')
}

function findRoom(map: Map, id: number): Room {
  const defaultRoom: Room = {
    id: -1,
    name: 'Unknown Room',
    description: 'This room does not exist',
    exits: [],
    items: [],
    mobs: [],
  }
  return map.rooms.find(room => room.id === id) || defaultRoom
}

function concatExitNames(exits: Exit[]): string {
  return exits.map(exit => exit.direction).join(', ')
}

function printRoom(room: Room): void {
  console.log(`----${room.name}----\n${room.description}`)
  room.mobs?.forEach(mob => console.log(`${mob.name} stands here.`))
  room.items?.forEach(item => console.log(`A ${item.name} is here.`))
  console.log(`Exits: ${concatExitNames(room.exits)}`)
}

function processInventory(inventory: Item[]): void {
  // Check if we have items
  if (!inventory || inventory.length === 0) {
    console.log('You are not carrying anything.')
    return
  }

  console.log('Inventory:')
  inventory.forEach(item => console.log(`- ${item.name}`))
  return
}

function convertIndexToWord(index: number): string {
  const lastChar = index.toString().slice(-1)
  switch (lastChar) {
    case '1':
      return index.toString() + 'st'
    case '2':
      return index.toString() + 'nd'
    case '3':
      return index.toString() + 'rd'
    default:
      return index.toString() + 'th'
  }
}

function spliceItem(originItems: Item[], destinationItems: Item[], index: number, foundItems: Item[]): void {
  const foundIndex = originItems.findIndex(x => x === foundItems[index - 1])
  originItems = originItems.splice(foundIndex, 1)
  destinationItems.push(foundItems[index - 1])
}

function equipItemFromInventory(player: Player, index: number, foundItems: Item[]): void {
  if (!player.equipment) {
    player.equipment = {}
  }

  // Equip item
  if (foundItems[index - 1].wornLocation) {
    player.equipment[foundItems[index - 1].wornLocation || ''] = foundItems[index - 1]
  }

  // Remove from inventory
  spliceItem(player.inventory, [], index, foundItems)
}

function transferItem(originItems: Item[], destinationItems: Item[], searchTerm: string, index: number = 1, all: boolean = false): void {
  const foundItems = originItems.filter(item => item.name.toLowerCase() === searchTerm || item.keywords?.includes(searchTerm))
  if (foundItems && foundItems.length > 0) {
    if (all) {
      for (let i = 1; i <= foundItems.length; i++) {
        spliceItem(originItems, destinationItems, i, foundItems)
      }
      return
    }

    // Check if index is within bounds
    if (index > foundItems.length) {
      console.log(`You do not see a ${convertIndexToWord(index)} ${searchTerm} here.`)
      return
    }
    spliceItem(originItems, destinationItems, index, foundItems)
  } else {
    console.log(`You do not see a ${searchTerm} here.`)
  }
}

function processLook(parsedInput: string[], room: Room) {
  // LOOk ROOM
  if (parsedInput.length === 1) {
    printRoom(room)
    return
  }

  // LOOK {TARGET}
  const target = parsedInput[1]
  // LOOK ITEM
  const item = room.items.find(item => item.name.toLowerCase() === target)
  if (item) {
    console.log(`${item.description}`)
    return
  }
  // LOOK MOB
  const mob = room.mobs.find(mob => mob.keywords.includes(target))
  if (mob) {
    printMob(mob)
    return
  }
  console.log(`You do not see a ${target} here`)
}

function processTake(parsedInput: string[], room: Room, player: Player) {
  if (parsedInput.length === 1) {
    console.log('Take what?')
    return
  }

  let index = 1
  let all = false
  let target = parsedInput[1]

  // Handle taking index or all
  if (parsedInput[1].indexOf('.') > -1) {
    const split = parsedInput[1].split('.')
    target = split[1].toLowerCase()
    if (split[0] === 'all') {
      all = true
    } else {
      // Try to parse index
      index = parseInt(split[0])
      if (!isNaN(index)) {
        index = Math.max(1, index)
      } else {
        console.log(`Take what?`)
        return
      }
    }
  }

  // Handle taking from container
  // TODO containers don't exist yet

  transferItem(room.items, player.inventory, target, index, all)
}

function normalizeDirection(direction: string) {
  if (direction === 'n') {
    return 'north'
  }
  if (direction === 's') {
    return 'south'
  }
  if (direction === 'e') {
    return 'east'
  }
  if (direction === 'w') {
    return 'west'
  }
  return direction
}

function processMovement(parsedInput: string[], room: Room, player: Player) {
  const direction = normalizeDirection(parsedInput[0])
  const exit = room.exits.find(exit => exit.direction == direction)
  if (direction in Direction && exit) {
    player.location = exit.room
    const room = findRoom(map, exit.room)
    printRoom(room)
    return
  } else {
    console.log('You cannot go that way.')
    return
  }
}

function processQuit(rl: Interface) {
  console.log('Goodbye!')
  rl.close()
  process.exit(0)
}

function processDrop(parsedInput: string[], room: Room, player: Player) {
  if (parsedInput.length === 1) {
    console.log('Drop what?')
    return
  }

  let index = 1
  let all = false
  let target = parsedInput[1]

  // Handle dropping index or all
  if (parsedInput[1].indexOf('.') > -1) {
    const split = parsedInput[1].split('.')
    target = split[1].toLowerCase()
    if (split[0] === 'all') {
      all = true
    } else {
      // Try to parse index
      index = parseInt(split[0])
      if (!isNaN(index)) {
        index = Math.max(1, index)
      } else {
        console.log(`Drop what?`)
        return
      }
    }
  }

  transferItem(player.inventory, room.items, target, index, all)
}

function processEquip(player: Player) {
  let equipment = 'Equipment:\n'
  if (player.equipment) {
    if (player.equipment.head) equipment += `Head: ${player.equipment.head.name}\n`
    if (player.equipment.body) equipment += `Body: ${player.equipment.body.name}\n`
    if (player.equipment.arms) equipment += `Arms: ${player.equipment.arms.name}\n`
    if (player.equipment.hands) equipment += `Hands: ${player.equipment.hands.name}\n`
    if (player.equipment.legs) equipment += `Legs: ${player.equipment.legs.name}\n`
    if (player.equipment.feet) equipment += `Feet: ${player.equipment.feet.name}\n`
    if (player.equipment.back) equipment += `Back: ${player.equipment.back.name}\n`
    if (player.equipment.waist) equipment += `Waist: ${player.equipment.waist.name}\n`
    if (player.equipment.neck) equipment += `Neck: ${player.equipment.neck.name}\n`
    if (player.equipment.finger1) equipment += `Finger: ${player.equipment.finger1.name}\n`
    if (player.equipment.finger2) equipment += `Finger: ${player.equipment.finger2.name}\n`

    // Trim last newline
    equipment = equipment.slice(0, equipment.length - 1)
    console.log(`${equipment}`)
  } else {
    console.log('You have nothing equipped.')
  
  }
}

function processWear(parsedInput: string[], player: Player) {
  if (parsedInput.length === 1) {
    console.log('Wear what?')
    return
  }

  let index = 1
  let all = false
  let target = parsedInput[1]

  // Handle wearing index or all
  if (parsedInput[1].indexOf('.') > -1) {
    const split = parsedInput[1].split('.')
    target = split[1].toLowerCase()
    if (split[0] === 'all') {
      all = true
    } else {
      // Try to parse index
      index = parseInt(split[0])
      if (!isNaN(index)) {
        index = Math.max(1, index)
      } else {
        console.log(`Wear what?`)
        return
      }
    }
  }

  const foundItems = player.inventory.filter(item => item.name.toLowerCase() === target || item.keywords?.includes(target))
  if (foundItems && foundItems.length > 0) {
    if (all) {
      for (let i = 1; i <= foundItems.length; i++) {
        equipItemFromInventory(player, i, foundItems)
      }
      return
    }

    // Check if index is within bounds
    if (index > foundItems.length) {
      console.log(`You do not have a ${convertIndexToWord(index)} ${target}.`)
      return
    }
    equipItemFromInventory(player, index, foundItems)
  } else {
    console.log(`You do not have a ${target}.`)
  }
}

async function main() {
  const rl: Interface = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  let player: Player = {
    name: 'Wayne',
    location: 1,
    inventory: []
  }

  // Print initial room
  printRoom(findRoom(map, player.location))

  while (true) {
    // Locate room
    const room = findRoom(map, player.location)
    
    // This seems goofy but it works for now..
    passiveRoomWorker.removeAllListeners()
    passiveRoomWorker = new Worker('./passive-room-worker.js')
    passiveRoomWorker.on('message', (message) => {
      console.log(message);
    })
    passiveRoomWorker.postMessage({ room })

    // Wait for user input
    const input = await new Promise<string>((resolve) => rl.question(`\n>`, resolve))
    
    // Parse and clean input
    const parsedInput = parseInput(input)

    // Send to correct command processor
    switch (parsedInput[0]) {
      case Commands.north:
      case Commands.n:
      case Commands.south:
      case Commands.s:
      case Commands.east:
      case Commands.e:
      case Commands.west:
      case Commands.w:
        processMovement(parsedInput, room, player)
        continue
      case Commands.look:
      case Commands.l:
        processLook(parsedInput, room)
        continue
      case Commands.inventory:
      case Commands.inv:
      case Commands.i:
        processInventory(player.inventory)
        continue
      case Commands.quit:
      case Commands.q:
        processQuit(rl)
        break
      case Commands.take:
      case Commands.t:
        processTake(parsedInput, room, player)
        continue
      case Commands.drop:
      case Commands.d:
        processDrop(parsedInput, room, player)
        continue
      case Commands.equip:
      case Commands.eq:
        processEquip(player)
        continue
      case Commands.wear:
        processWear(parsedInput, player)
        continue
      default:
        break
    }
        
    console.log('Invalid command')
  }
}

main()
