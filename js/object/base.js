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
  onUpdate: function () {},
  pickup: function () {
    this.inventory = true
    this.rampMasterGain(1, audio.time(0.5))
    this.masterPan.pan.value = 0

    this.onPickup.apply(this, arguments)

    return this
  },
  rampMasterGain: function (value, duration) {
    this.isRampingMasterGain = true
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, audio.time())
    this.masterGain.gain.exponentialRampToValueAtTime(value, audio.time(duration))

    setTimeout(() => this.isRampingMasterGain = false, duration * 1000)

    return this
  },
  rampMasterPan: function (value, duration) {
    this.isRampingMasterPan = true
    this.masterPan.pan.setValueAtTime(this.masterPan.pan.value, audio.time())
    this.masterPan.pan.linearRampToValueAtTime(value, audio.time(duration))

    setTimeout(() => this.isRampingMasterPan = false, duration * 1000)

    return this
  },
  spawn: function (options) {
    const context = audio.context(),
      {x, y} = position.get()

    Object.entries(options).forEach(([key, value]) => this[key] = value)

    this.masterGain = context.createGain()
    this.masterPan = context.createStereoPanner()

    this.masterGain.connect(this.masterPan)
    this.masterPan.connect(context.destination)

    this.masterGain.gain.value = 1 / 10 ** 10
    this.rampMasterGain(distanceToGain(this.getDistance(x, y)), 2)

    this.onSpawn()

    return this
  },
  update: function ({x, y}) {
    const context = audio.context()

    if (!this.inventory) {
      if (!this.isRampingMasterGain) {
        this.masterGain.gain.value = distanceToGain(this.getDistance(x, y))
      }

      this.masterPan.pan.value = angleToPan(
        -position.angleTowardPoint(this.x, this.y)
      )
    }

    this.onUpdate.apply(this, arguments)

    return this
  },
}
