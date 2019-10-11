'use strict'

const resonatorBase = inventObject({
  isCollectible: true,
  onPickup: function () {
    const context = audio.context()

    this.triangleGain = context.createGain()
    this.triangleGain.connect(this.gain)

    this.triangle = context.createOscillator()
    this.triangle.type = 'triangle'
    this.triangle.connect(this.triangleGain)
    this.triangle.frequency.value = midiToFrequency(this.note)
    this.triangle.start()

    this.gain.gain.setValueAtTime(1, audio.time(0))
    this.gain.gain.exponentialRampToValueAtTime(0.025, audio.time(1))

    if (this.cardinalDirection) {
      this.rampMasterPan(angleToPan(position.angleTowardDirection(this.cardinalDirection)), 2)
    }
  },
  onSpawn: function () {
    const context = audio.context()

    this.note = chord.getNote(this.chordNote)

    this.gain = context.createGain()
    this.gain.connect(this.masterGain)

    this.sine = context.createOscillator()
    this.sine.connect(this.gain)
    this.sine.frequency.value = midiToFrequency(this.note)
    this.sine.start()
  },
  onUpdate: function ({vector}) {
    if (this.isCollected) {
      this.triangleGain.gain.value = vector.velocity / position.maxVector().velocity

      if (!this.isRampingMasterPan && typeof this.cardinalDirection != 'undefined') {
        this.masterPan.pan.value = angleToPan(position.angleTowardDirection(this.cardinalDirection))
      }
    }

    const note = chord.getNote(this.chordNote)

    if (note == this.note) {
      return
    }

    const currentFrequency = midiToFrequency(this.note),
      nextFrequency = midiToFrequency(note),
      rampDuration = 1

    this.sine.frequency.setValueAtTime(currentFrequency, audio.time())
    this.sine.frequency.exponentialRampToValueAtTime(nextFrequency, audio.time(rampDuration))

    if (this.isCollected) {
      this.triangle.frequency.setValueAtTime(currentFrequency, audio.time())
      this.triangle.frequency.exponentialRampToValueAtTime(nextFrequency, audio.time(rampDuration))
    }

    this.note = note
  },
})

const resonators = [
  inventObject({
    id: 'Root',
    chordNote: 0,
  }, resonatorBase),
  inventObject({
    id: 'Third',
    cardinalDirection: 0,
    chordNote: 1,
  }, resonatorBase),
  inventObject({
    id: 'Fifth',
    cardinalDirection: Math.PI,
    chordNote: 2,
  }, resonatorBase),
]
