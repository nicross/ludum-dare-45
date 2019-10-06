const chord = (function IIFE() {
  const grid = {}
  const transpose = Math.floor(Math.random() * 24) - 12

  // TODO: Odd notes
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
      notes => shuffle(
        notes.reduce(
          (notes, note) => {
            for (let i = -1; i <= 1; i++) {
              notes.push(
                midiToFrequency((note + (i * 12)) + transpose)
              )
            }
            return notes
          },
          []
        )
      )
    )
  )

  let currentChord

  function generateChord(x, y) {
    index = (x + y) % chords.length
    
    return shuffle(
      chords[index].map(
        notes => randomValue(notes)
      )
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
    return Math.round(v / 50)
  }

  return {
    get: () => currentChord,
    getChord: (x, y) => getChord(normalize(x), normalize(y)),
    getNote: (index) => currentChord[index % currentChord.length],
    update: function ({x, y}) {
      currentChord = getChord(
        normalize(x),
        normalize(y)
      )
      return this
    },
  }
})()
