'use strict'

const ambiance = (function IIFE() {
  const maxSpawns = 64
  const spawned = {}

  function hasSpawned(x, y) {
    return x in spawned && y in spawned[x]
  }

  function spawnAmbiance(d) {
    const count = Math.round(Math.random() * Math.max(4 * d, maxSpawns))

    for (let i = 0; i < count; i++) {
      spawn(randomValue(ambients), nextSpawnLocation(50, Math.PI, -Math.PI / 2))
    }
  }

  return {
    activate: function () {
      spawned[0] = {0: true}
      return this
    },
    update: ({d, x, y}) => {
      if (!hasSpawned(x, y)) {
        if (!spawned[x]) {
          spawned[x] = {}
        }

        spawned[x][y] = true
        spawnAmbiance(d)
      }

      return this
    }
  }
})()
