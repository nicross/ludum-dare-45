'use strict'

const pickups = (function IIFE() {
  const pickupRadius = 2,
    pickupRelocate = 50

  let nextPickup = 12.5,
    pickupSpawned = false

  return {
    activate: () => {
      collectibles.unshift(footsteps, compass)
    },
    update: ({d, x, y}) => {
      objects.filter((object) => {
        return !object.inventory && object.collectible
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

      if (!pickupSpawned && d >= nextPickup && collectibles.length) {
        pickupSpawned = true
        spawn(collectibles.shift(), nextSpawnLocation(50, Math.PI / 2, -Math.PI / 4))
      }

      return this
    }
  }
})()
