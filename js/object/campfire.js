'use strict'

const campfire = inventObject({
  id: 'Campfire',
  crack: function () {
    this.isCracking = true

    const count = randomBetween(0, 3)
    let duration = 0

    for (let i = 0; i < count; i += 1) {
      const pause = randomBetween(0.0625, 0.25),
        start = randomBetween(0.0125, 0.25),
        stop = randomBetween(0.125, 0.5)

      const frequency = randomBetween(2500, 5000),
        gain = randomBetween(0.00625, 0.0125)

      this.crackle.filter.frequency.setValueAtTime(frequency, audio.time(duration))
      this.crackle.output.gain.setValueAtTime(ZERO_GAIN, audio.time(duration))
      this.crackle.output.gain.exponentialRampToValueAtTime(gain, audio.time(duration + start))
      this.crackle.output.gain.exponentialRampToValueAtTime(ZERO_GAIN, audio.time(duration + start + stop))

      duration += start + stop + pause
    }

    duration += randomBetween(2, 6)

    setTimeout(() => {this.isCracking = false}, duration * 1000)
  },
  onCull: function () {
    // TODO: Destroy or create nodes
  },
  onSpawn: function () {
    this.crackle = createNoiseMachine()
    this.crackle.output.gain.value = ZERO_GAIN
    this.crackle.output.connect(this.masterGain)

    this.roar = createNoiseMachine()
    this.roar.output.connect(this.masterGain)

    this.roar.filter.frequency.value = 40
    this.roar.output.gain.value = 0.125

    this.rampRoarFilter = createRamper(this.roar.filter.frequency, exponentialRamp)

    this.gainRadius = GRID_LENGTH / 8
    this.panRadius = 1
  },
  onUpdate: function () {
    if (!this.isCracking) {
      this.crack()
    }
    if (!this.rampRoarFilter.state) {
      this.rampRoarFilter(
        randomBetween(40, 120),
        randomBetween(0.25, 1)
      )
    }
  },
})
