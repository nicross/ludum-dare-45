'use strict'

const objectBase = {
  cull: function (state) {
    this.isCulled = Boolean(state)

    if (this.isCulled) {
      this.masterPan.disconnect()
    } else {
      this.masterPan.connect(audio.context().destination)
    }

    this.onCull()

    return this
  },
  destroy: function () {
    this.masterPan.disconnect()
    return this
  },
  onCull: function() {},
  onPickup: function () {},
  onSpawn: function () {},
  onStep: function () {},
  onUpdate: function () {},
  pickup: function () {
    this.isCollected = true
    delete this.x
    delete this.y

    this.rampMasterGain(1, audio.time(0.5))
    this.masterPan.pan.value = 0

    this.onPickup.apply(this, arguments)

    return this
  },
  spawn: function (options) {
    const context = audio.context(),
      {x, y} = position.get()

    Object.entries(options).forEach(([key, value]) => this[key] = value)

    this.d = distance(this.x, this.y, x, y)
    this.isCulled = false

    this.masterGain = context.createGain()
    this.masterPan = context.createStereoPanner()

    this.masterGain.connect(this.masterPan)
    this.masterPan.connect(context.destination)

    this.rampMasterGain = createRamper(this.masterGain.gain, exponentialRamp)
    this.rampMasterPan = createRamper(this.masterPan.pan, linearRamp)

    this.masterGain.gain.value = ZERO_GAIN
    this.rampMasterGain(distanceToGain(this.d), 1)

    this.onSpawn()

    return this
  },
  update: function ({x, y}) {
    if (this.isCulled) {
      return this
    }

    this.d = distance(this.x, this.y, x, y)

    if (!this.isCollected) {
      if (!this.rampMasterGain.state) {
        this.masterGain.gain.value = distanceToGain(this.d, this.radius)
      }
      this.masterPan.pan.value = angleToPan(
        -position.angleTowardPoint(this.x, this.y)
      )
    }

    this.onUpdate.apply(this, arguments)

    return this
  },
}
