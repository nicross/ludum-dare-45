'use strict'

const ambiance = (function IIFE() {
  const maxSpawns = 24
  const spawned = {}

  function hasSpawned(x, y) {
    return x in spawned && y in spawned[x]
  }

  function spawnAmbiance() {
    const count = Math.round(Math.random() * maxSpawns)

    for (let i = 0; i < count; i++) {
      spawn(randomValue(ambients), nextSpawnLocation(50, Math.PI, -Math.PI / 2))
    }
  }

  return {
    activate: function () {
      spawned[0] = {0: true}

      for (let i = 0; i < maxSpawns; i++) {
        spawnFrom(ambients, nextSpawnLocation(25, 2 * Math.PI, 0))
      }

      return this
    },
    update: ({x, y}) => {
      if (!hasSpawned(x, y)) {
        if (!spawned[x]) {
          spawned[x] = {}
        }

        spawned[x][y] = true
        spawnAmbiance()
      }

      return this
    }
  }
})()
