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

    const cx = x + Math.sin(angle),
      cy = y + Math.cos(angle)

    const a = this.getDistance(cx, cy),
      b = distance(x, y, cx, cy),
      c = this.getDistance(x, y)

    const A = Math.acos(Math.max(-1, Math.min((b ** 2 + c ** 2 - a ** 2) / (2 * b * c), 1)))

    let normal = A
    normal /= Math.PI
    normal *= 2
    normal -= 1

    return normal
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
  spawn: function ({x, y}) {
    const context = audio.context()

    this.inventory = false
    this.x = x
    this.y = y

    this.masterGain = new GainNode(context)
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
  // TODO: Compass - White noise with filter that's brightest when facing north
  // TODO: Kick - Footstep sounds, increases power via inventory size?
  // TODO: 1+3+5 - Subtle notes that change chords based on x/y position
  // TODO: Seashell - You can hear the ocean
  // TODO: Snare - Every other footstep
  // TODO: Non-collectible ambient sounds
]
