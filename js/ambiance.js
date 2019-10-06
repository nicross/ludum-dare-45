const ambiance = (function IIFE() {
  const maxSpawns = 8
  const spawned = {}

  function hasSpawned(x, y) {
    return x in spawned && y in spawned[x]
  }

  function spawnAmbiance() {
    const count = Math.floor(Math.random() * maxSpawns)

    for (let i = 0; i < count; i++) {
      objects.push(
        spawnFrom(ambients, nextSpawnLocation(50, Math.PI, -Math.PI / 2))
      )
    }
  }

  return {
    activate: function () {
      spawned[0] = {0: true}
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