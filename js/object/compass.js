const compass = inventObject({
  collectible: true,
  id: 'Compass',
  onPickup: function () {

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

      let gain = (1 - strength) ** 4
      gain = 0.0125 + (gain * 0.25)

      this.noise.filter.frequency.value = frequency
      this.noise.output.gain.value = gain
    }
  },
})
