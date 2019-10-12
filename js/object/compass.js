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

    this.rampNoiseFilterFrequency = createRamper(this.noise.filter.frequency, exponentialRamp)
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
      const home = position.angleTowardPoint(0, 0),
        strength = 1 - (Math.abs(home) / Math.PI)

      if (!this.rampNoiseFilterFrequency.state) {
        let frequency = audio.sampleRate() / 2
        frequency *= strength ** 2
        frequency /= 8
        frequency = Math.max(frequency, 20)
        this.rampNoiseFilterFrequency(frequency, IFPS / 2)
      }

      if (!this.rampNoiseOutputGain.state) {
        let gain = (1 - strength) ** 8
        gain = 0.0625 + (gain * 0.125)
        this.rampNoiseOutputGain(gain, IFPS / 2)
      }

      if (!this.rampMasterPan.state) {
        this.rampMasterPan(-angleToPan(home), IFPS / 2)
      }
    }
  },
})
