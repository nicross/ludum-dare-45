const chord = (function IIFE() {
  const grid = {}

  // TODO: Inversions and melodies
  const chords = shuffle([
    // Cm
    [
      [60,],
      [63,],
      [67,],
    ],
    // EbM
    [
      [63,],
      [67,],
      [70,],
    ],
    // G#M
    [
      [56,],
      [60,],
      [63,],
    ],
    // A#M
    [
      [58,],
      [62,],
      [65,],
    ],
  ]).map(
    chord => chord.map(
      notes => shuffle(notes.map(midiToFrequency))
    )
  )

  let chord

  function generateChord(x, y) {
    index = (x + y) % chords.length
    return chords[index].map(
      notes => randomValue(notes)
    )
  }

  function getChord(x, y) {
    if (!grid[x]) {
      grid[x] = {}
    }

    if (!grid[x][y]) {
      grid[x][y] = generateChord(x, y)
    }

    return grid[x][y]
  }

  function normalize(v) {
    return Math.round(v / 100)
  }

  return {
    get: () => chord,
    getChord: (x, y) => getChord(normalize(x), normalize(y)),
    getNote: (index) => current[index % current.length],
    update: function ({x, y}) {
      chord = getChord(
        normalize(x),
        normalize(y)
      )
      return this
    },
  }
})()
