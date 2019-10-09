'use strict'

const compass = inventObject({
  collectible: true,
  id: 'Compass',
  onPickup: function () {
    this.noise = createNoiseMachine()
    this.noise.output.connect(this.masterGain)

    this.rampMasterGain(0.125, 1)
    this.rampMasterPan(0, 1)

    this.noise.filter.Q.value = 4
    this.noise.filter.type = 'bandpass'

    this.isRampingNoiseGain = true
    this.noise.output.gain.linearRampToValueAtTime(0.0625, audio.time(1))
    setTimeout(() => this.isRampingNoiseGain = false, 1000)

    this.dinger.destroy()
    delete this.dinger
  },
  onSpawn: function () {
    this.dinger = createDinger()
    this.dinger.output.connect(this.masterGain)
  },
  onUpdate: function () {
    if (this.inventory) {
      const north = position.angleTowardDirection(Math.PI / 2),
        strength = 1 - (Math.abs(north) / Math.PI)

      let frequency = audio.sampleRate() / 2
      frequency *= strength ** 2
      frequency /= 8

      this.noise.filter.frequency.value = frequency

      if (!this.isRampingNoiseGain) {
        let gain = (1 - strength) ** 8
        gain = 0.0625 + (gain * 0.125)
        this.noise.output.gain.value = gain
      }

      if (!this.isRampingMasterPan) {
        this.masterPan.pan.value = angleToPan(north)
      }
    }
  },
})
