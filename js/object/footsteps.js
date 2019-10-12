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
  onStep: function () {
    if (!this.isCollected || this.isStepping) {
      return
    }

    this.isStepping = true

    this.noise.filter.frequency.setValueAtTime(1, audio.time(0))
    this.noise.filter.frequency.exponentialRampToValueAtTime(800, audio.time(0.0625))
    this.noise.filter.frequency.exponentialRampToValueAtTime(1, audio.time(0.2))

    setTimeout(() => this.isStepping = false, 200)
  },
  onUpdate: function () {},
})
