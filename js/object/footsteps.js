const footsteps = inventObject({
  collectible: true,
  id: 'Footsteps',
  onPickup: function () {
    this.gain.gain.setValueAtTime(1, audio.time(0))
    this.gain.gain.exponentialRampToValueAtTime(0.0625, audio.time(0.0625))
    this.noise.filter.frequency.exponentialRampToValueAtTime(20, audio.time(0.0625))
  },
  onSpawn: function () {
    this.gain = audio.context().createGain()
    this.gain.connect(this.masterGain)

    this.noise = createNoiseMachine()
    this.noise.output.connect(this.gain)
  },
  onStep: function () {
    if (!this.inventory || this.isStepping) {
      return
    }

    this.isStepping = true

    this.noise.filter.frequency.setValueAtTime(20, audio.time(0))
    this.noise.filter.frequency.exponentialRampToValueAtTime(800, audio.time(0.0625))
    this.noise.filter.frequency.exponentialRampToValueAtTime(20, audio.time(0.25))

    setTimeout(() => this.isStepping = false, 250)
  },
  onUpdate: function () {},
})