const compass = inventObject({
  collectible: true,
  id: 'Compass',
  onPickup: function () {
    this.masterGain.gain.linearRampToValueAtTime(0.125, time(1))
    this.masterPan.pan.linearRampToValueAtTime(0, time(1))

    this.isRampingNoiseGain = true
    this.noise.output.gain.linearRampToValueAtTime(0.125, time(1))
    setTimeout(() => this.isRampingNoiseGain = false, 1000)
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

      this.noise.filter.frequency.value = frequency

      if (!this.isRampingNoiseGain) {
        let gain = (1 - strength) ** 4
        gain = 0.125 + (gain * 0.25)
        this.noise.output.gain.value = gain
      }
    }
  },
})
