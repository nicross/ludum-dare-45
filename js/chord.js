'use strict'

const chord = (function IIFE() {
  const grid = {}
  const transpose = Math.floor(Math.random() * 12) - 6

  const chords = shuffle([
    // Cm
    [
      [60,],
      [63,],
      [67,68],
    ],
    // EbM
    [
      [63,],
      [67,68],
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
            for (let i = -2; i <= 0; i++) {
              notes.push(note + (i * 12) + transpose)
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
    const index = Math.abs((x + y) % chords.length)

    return chords[index].map(
      notes => randomValue(notes)
    ).sort()
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

  function getRandomNote(x, y) {
    let index = Math.abs(Math.round(x + y)) % chords.length

    return randomValue(
      randomValue(chords[index])
    )
  }

  function normalize(v) {
    return Math.floor(v / 50)
  }

  return {
    get: () => currentChord,
    getChord: (x, y) => getChord(normalize(x), normalize(y)),
    getNote: (index) => currentChord[index % currentChord.length],
    getRandomNote: (x, y) => getRandomNote(x, y),
    update: function ({x, y}) {
      currentChord = getChord(x, y)
      return this
    },
  }
})()
