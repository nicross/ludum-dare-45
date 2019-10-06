const items = [
  inventObject({
    collectible: true,
    id: 'Foobar',
    onPickup: function () {
      this.oscillator.type = 'triangle'
    },
    onSpawn: function () {
      this.oscillator = new OscillatorNode(audio.context())
      this.oscillator.connect(this.masterGain)
      this.oscillator.start()
    },
  }),
  inventObject({
    collectible: true,
    id: 'Compass',
    onPickup: function () {

    },
    onSpawn: function () {
      this.noise = createNoiseMachine()
      this.noise.output.connect(this.masterGain)
    },
    onUpdate: function ({angle, x, y}) {
      if (this.inventory) {
        const north = 4 * solveAngle(x, y + 1, x, y, x + Math.cos(angle), y + Math.sin(angle)),
          strength = north / (2 * Math.PI)

        let frequency = audio.context().sampleRate / 2
        frequency *= strength ** 2
        frequency /= 8

        let gain = (1 - strength) ** 2
        gain = 0.125 + (gain * 0.5)

        this.noise.filter.frequency.value = frequency
        this.noise.output.gain.value = gain
      }
    },
  }),
  inventObject({
    collectible: true,
    id: 'Root',
    onSpawn: function () {
      this.oscillator = audio.context.createOscillator()
      this.oscillator.connect(this.masterGain)
      this.oscillator.frequency.value = chord.getChord(x, y)[0]
    },
    onUpdate: function () {
      if (this.inventory) {
        // TODO: Glide frequency if it differs
        this.oscillator.frequency.value = chord.getNote(0)
      }
    },
  }),
  inventObject({
    collectible: true,
    id: 'Third',
    onSpawn: function () {
      this.oscillator = audio.context.createOscillator()
      this.oscillator.connect(this.masterGain)
      this.oscillator.frequency.value = chord.getChord(x, y)[1]
    },
    onUpdate: function () {
      if (this.inventory) {
        this.oscillator.frequency.value = chord.getNote(1)
        // TODO: Glide frequency if it differs
        // TODO: Pan due east
      }
    },
  }),
  inventObject({
    collectible: true,
    id: 'Fifth',
    onSpawn: function () {
      this.oscillator = audio.context.createOscillator()
      this.oscillator.connect(this.masterGain)
      this.oscillator.frequency.value = chord.getChord(x, y)[2]
    },
    onUpdate: function () {
      if (this.inventory) {
        this.oscillator.frequency.value = chord.getNote(2)
        // TODO: Glide frequency if it differs
        // TODO: Pan due west
      }
    },
  }),
  // TODO: Kick - Footstep sounds, increases power via inventory size?
  // TODO: Seashell - You can hear the ocean
  // TODO: Snare - Every other footstep
  // TODO: Non-collectible ambient sounds
]
