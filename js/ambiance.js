'use strict'

const ambiance = (function IIFE() {
  const maxSpawns = 32,
    minSpawns = 8

  const spawned = {}

  function handleSpawns(gridX, gridY) {
    for (let x = gridX - 1; x <= gridX + 1; x += 1) {
      for (let y = gridY - 1; y <= gridY + 1; y += 1) {
        if (hasSpawned(x, y)) {
          continue
        }

        if (!spawned[x]) {
          spawned[x] = {}
        }

        spawned[x][y] = true

        spawnAmbient(x, y, distance(0, 0, x, y))
      }
    }
  }

  function hasSpawned(x, y) {
    return x in spawned && y in spawned[x]
  }

  function spawnAmbient(x, y, d) {
    const count = Math.round(
      randomBetween(Math.min(d, minSpawns), Math.min(4 * d, maxSpawns))
    )

    for (let i = 0; i < count; i++) {
      spawn(randomValue(ambients), {
        x: randomBetween(GRID_LENGTH * x, GRID_LENGTH * (x + 1)) - (GRID_LENGTH / 2),
        y: randomBetween(GRID_LENGTH * y, GRID_LENGTH * (y + 1)) - (GRID_LENGTH / 2),
      })
    }
  }

  return {
    activate: function () {
      handleSpawns(0, 0)
      spawn(campfire, {x: 0, y: 0})
      return this
    },
    update: ({x, y}) => {
      handleSpawns(x, y)
      return this
    }
  }
})()
