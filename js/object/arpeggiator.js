// TODO: Main quest reward - When player finds all three synths, spawn this collectible at (a0,0)
// On step, play the next note in the sequence: from the current chord (all notes), +/-1 from previous note in sequence
const arpeggiator = inventObject({
  isCollectible: true,
})
