const itemBase = {
  calculateGain: function ({x, y}) {
    if (this.inventory) {
      return 1
    }

    return 1 / this.getDistance(x, y) ** 2
  },
  calculatePan: function ({angle, x, y}) {
    if (this.inventory) {
      return 0
    }

    return angleToPan(
      solveAngle(x, y, this.x, this.y, x + Math.sin(angle), y + Math.cos(angle))
    )
  },
  destroy: function () {
    this.masterPan.disconnect(context.destination)
    return this
  },
  getDistance: function (x, y) {
    return distance(this.x, this.y, x, y)
  },
  onPickup: function () {},
  onSpawn: function () {},
  onUpdate: function ({angle, x, y}) {},
  pickup: function () {
    this.inventory = true
    this.onPickup()
    return this
  },
  spawn: function (options) {
    const context = audio.context()

    Object.entries(options).forEach(([key, value]) => this[key] = value)

    this.masterGain = context.createGain()
    this.masterPan = context.createStereoPanner()

    this.masterGain.connect(this.masterPan)
    this.masterPan.connect(context.destination)

    this.onSpawn()

    return this
  },
  update: function ({angle, x, y}) {
    const context = audio.context()

    this.masterGain.gain.value = this.calculateGain({x, y})
    this.masterPan.pan.value = this.calculatePan({angle, x, y})

    this.onUpdate({angle, x, y})

    return this
  },
}

const items = [
  inventItem('Foobar', {
    collectible: true,
    onPickup: function () {
      this.oscillator.type = 'triangle'
    },
    onSpawn: function () {
      this.oscillator = new OscillatorNode(audio.context())
      this.oscillator.connect(this.masterGain)
      this.oscillator.start()
    },
  }),
  inventItem('Compass', {
    collectible: true,
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
  // TODO: Compass - White noise with filter that's brightest when facing north
  // TODO: Kick - Footstep sounds, increases power via inventory size?
  // TODO: 1+3+5 - Subtle notes that change chords based on x/y position, (a randomly generated, infinitely expanding map, of 3 voices per cell--each of the 3 items has a slightly different timbre and glide speed between notes)
  // TODO: Seashell - You can hear the ocean
  // TODO: Snare - Every other footstep
  // TODO: Non-collectible ambient sounds
]
