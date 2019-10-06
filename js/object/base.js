const objectBase = {
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
