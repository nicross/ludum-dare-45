const objectBase = {
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
    this.masterGain.gain.value = 1
    this.masterPan.pan.value = 0

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

    if (!this.inventory) {
      this.masterGain.gain.value = 1 / (this.getDistance(x, y) ** 2)
      this.masterPan.pan.value = angleToPan(
        -position.angleTowardPoint(this.x, this.y)
      )
    }

    this.onUpdate({angle, x, y})

    return this
  },
}
