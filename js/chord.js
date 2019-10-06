const chord = (function IIFE() {
  const grid = {}

  // TODO: Inversions and melodies
  const chords = [
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
  ].map(
    chord => chord.map(
      notes => notes.map(midiToFrequency)
    )
  )

  let chord

  function generateChord(x, y) {
    index = (x + y) % chords.length
    chord = chords[index].map(
      notes => notes[Math.floor(Math.random() * notes.length)]
    )
    return chord
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

  return {
    get: () => chord,
    getChord: (x, y) => getChord(x, y),
    getNote: (index) => current[index % current.length],
    update: function ({x, y}) {
      x = Math.round(x / 100)
      y = Math.round(y / 100)
      chord = getChord(x, y)
      return this
    },
  }
})()
