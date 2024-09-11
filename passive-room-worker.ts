import { parentPort } from 'worker_threads'
import { Room } from './map'

// To satisfy the linter
if (!parentPort) {
  process.abort()
}

parentPort.on('message', (message) => {
  const room: Room = message.room

  // Collect passive actions of all room inhabitants
  const actions: string[] = room?.mobs?.map(mob => mob.passiveActions || []).flat()

  setInterval(() => {
    // To satisfy the linter
    if (!parentPort) {
      process.abort()
    }

    // Randomly decide if we should send a passive action to the parent thread
    if (Math.random() > 0.5) {
      // Randomly select a passive action
      const action = actions[Math.floor(Math.random() * actions.length)]
      parentPort.postMessage(action)
    }
  }, 10000 * 60) // 5 minutes
})