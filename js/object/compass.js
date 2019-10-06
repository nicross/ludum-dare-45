const compass = inventObject({
  collectible: true,
  id: 'Compass',
  onPickup: function () {
    this.masterGain.gain.linearRampToValueAtTime(0.125, audio.time(1))
    this.masterPan.pan.linearRampToValueAtTime(0, audio.time(1))

    this.isRampingNoiseGain = true
    this.noise.output.gain.linearRampToValueAtTime(0.125, audio.time(1))
    setTimeout(() => this.isRampingNoiseGain = false, 1000)
  },
  onSpawn: function () {
    this.noise = createNoiseMachine()
    this.noise.output.connect(this.masterGain)
  },
  onUpdate: function () {
    if (this.inventory) {
      const north = position.angleTowardDirection(Math.PI / 2),
        strength = 1 - (Math.abs(north) / Math.PI)

      let frequency = audio.context().sampleRate / 2
      frequency *= strength ** 2
      frequency /= 8

      this.noise.filter.frequency.value = frequency

      if (!this.isRampingNoiseGain) {
        let gain = (1 - strength) ** 4
        gain = 0.125 + (gain * 0.25)
        this.noise.output.gain.value = gain
      }
    }
  },
})
