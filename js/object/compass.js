'use strict'

const compass = inventObject({
  id: 'Compass',
  isCollectible: true,
  onPickup: function () {
    this.noise = createNoiseMachine()
    this.noise.output.connect(this.masterGain)

    this.rampMasterGain(0.125, 1)
    this.rampMasterPan(0, 1)

    this.noise.filter.Q.value = 4
    this.noise.filter.type = 'bandpass'

    this.rampNoiseOutputGain = createRamper(this.noise.output.gain, linearRamp)
    this.rampNoiseOutputGain(0.0625, 1)

    this.dinger.destroy()
    delete this.dinger
  },
  onSpawn: function () {
    this.dinger = createDinger()
    this.dinger.output.connect(this.masterGain)
  },
  onUpdate: function () {
    if (this.isCollected) {
      const north = position.angleTowardDirection(Math.PI / 2),
        strength = 1 - (Math.abs(north) / Math.PI)

      let frequency = audio.sampleRate() / 2
      frequency *= strength ** 2
      frequency /= 8

      this.noise.filter.frequency.value = frequency

      if (!this.rampNoiseOutputGain.state) {
        let gain = (1 - strength) ** 8
        gain = 0.0625 + (gain * 0.125)
        this.noise.output.gain.value = gain
      }

      if (!this.rampMasterPan.state) {
        this.masterPan.pan.value = -angleToPan(north)
      }
    }
  },
})
