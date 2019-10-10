'use strict'

const pickups = (function IIFE() {
  const things = [
    compass,
    shuffle(resonators),
  ]

  const pickupRadius = 2,
    pickupRelocate = 50

  let nextPickup = 0,
    pickupSpawned = false,
    rewardSpawned = false

  return {
    activate: () => {
      pickupSpawned = true
      spawn(footsteps, nextSpawnLocation(25, Math.PI / 2, -Math.PI / 4))
    },
    update: ({d, x, y}) => {
      objects.filter((object) => {
        return !object.inventory && object.isCollectible
      }).forEach((object) => {
        const dTo = distance(x, y, object.x, object.y)

        if (dTo <= pickupRadius) {
          object.pickup()
          pickupSpawned = false
          nextPickup = d + 25 + (Math.random() * 50)
        } else if (dTo >= pickupRelocate) {
          const moveTo = nextSpawnLocation(50, Math.PI / 2, -Math.PI / 4)
          object.x = moveTo.x
          object.y = moveTo.y
        }
      })

      if (!pickupSpawned && d >= nextPickup && things.length) {
        pickupSpawned = true
        spawn(things.shift(), nextSpawnLocation(50, Math.PI / 2, -Math.PI / 4))
      }

      if (!pickupSpawned && !rewardSpawned && !things.length) {
        rewardSpawned = true
        spawn(arpeggio, {x: 0, y: 0})
      }

      return this
    }
  }
})()
