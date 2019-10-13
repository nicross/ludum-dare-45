'use strict'

const footsteps = inventObject({
  id: 'Footsteps',
  isCollectible: true,
  onPickup: function () {
    this.gain = audio.context().createGain()
    this.gain.gain.setValueAtTime(0.075, audio.time())
    this.gain.connect(this.masterGain)

    this.noise = createNoiseMachine()
    this.noise.output.connect(this.gain)
    this.noise.filter.frequency.value = 1

    this.dinger.destroy()
    delete this.dinger
  },
  onSpawn: function () {
    this.dinger = createDinger()
    this.dinger.output.connect(this.masterGain)
  },
  onUpdate: function ({vector}) {
    if (this.isCollected && !this.isStepping && vector.velocity > 0) {
      this.step(vector.velocity)
    }
  },
  step: function (velocity) {
    this.isStepping = true

    const maxVector = position.maxVector(),
      ratio = velocity / maxVector.velocity

    const duration = scale(ratio, 0, 1, 1, 0.25),
      lower = scale(ratio, 0, 1, 400, 800),
      upper = scale(ratio, 0, 1, 800, 1200)

    this.noise.filter.frequency.setValueAtTime(1, audio.time(0))
    this.noise.filter.frequency.exponentialRampToValueAtTime(randomBetween(lower, upper), audio.time(0.0625))
    this.noise.filter.frequency.exponentialRampToValueAtTime(1, audio.time(0.2))

    setTimeout(() => this.isStepping = false, duration * 1000)
  },
})
