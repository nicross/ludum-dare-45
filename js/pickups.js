const pickups = (function IIFE() {
  const pickupRadius = 2

  let hasPickup,
    nextPickup = 0

  return {
    activate: () => {
      hasPickup = true
      objects.push(
        spawn(compass, {x: 0, y: 20}),
      )
    },
    update: ({a, d, x, y}) => {
      objects.filter((object) => {
        return !object.inventory && object.collectible && distance(x, y, object.x, object.y) <= pickupRadius
      }).forEach((object) => {
        object.pickup()
        hasPickup = false
        nextPickup += Math.min(d, 100)
      })

      if (!hasPickup && d >= nextPickup && collectibles.length) {
        hasPickup = true
        objects.push(
          spawn(collectibles.shift(), nextSpawnLocation(20, Math.PI / 2, -Math.PI / 4))
        )
      }

      return this
    }
  }
})()
