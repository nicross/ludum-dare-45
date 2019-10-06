const ambients = [
  inventObject({
    id: 'Waterfall',
    onSpawn: function () {
      this.noise = createNoiseMachine()
      this.noise.output.connect(this.masterGain)

      this.noise.filter.frequency.value = Math.random() * audio.sampleRate() / 12
      this.noise.output.gain.value = 0.25 + (Math.random() * 0.75)
    },
  }),
  inventObject({
    id: 'Wind',
    onSpawn: function () {
      this.noise = createNoiseMachine()
      this.noise.filter.frequency.value = Math.random() * audio.sampleRate() / 8
      this.noise.output.gain.value = 0.125
      this.noise.output.connect(this.masterGain)
    },
    onUpdate: function () {
      if (!this.isRampingNoiseFilterFrequency) {
        this.rampNoiseFilterFrequency(Math.random() * audio.sampleRate() / 8, Math.random() * 8)
      }
      if (!this.isRampingNoiseOutputGain) {
        this.rampNoiseOutputGain(0.125 + (Math.random() * 0.25), 4 + (Math.random() * 8))
      }
    },
    rampNoiseFilterFrequency: function (value, duration) {
      this.isRampingNoiseFilterFrequency = true

      const original = this.noise.filter.frequency.value,
        strength = duration * (0.25 + (Math.random() * 0.75))

      this.noise.filter.frequency.setValueAtTime(original, audio.time())
      this.noise.filter.frequency.exponentialRampToValueAtTime(value, audio.time(duration))
      this.noise.filter.frequency.exponentialRampToValueAtTime(original, audio.time(duration + strength))

      setTimeout(() => this.isRampingNoiseFilterFrequency = false, (duration + strength) * 1000)

      return this
    },
    rampNoiseOutputGain: function (value, duration) {
      this.isRampingNoiseOutputGain = true

      const original = this.noise.output.gain.value,
        strength = duration * (0.25 + (Math.random() * 0.75))

      this.noise.output.gain.setValueAtTime(original, audio.time())
      this.noise.output.gain.exponentialRampToValueAtTime(value, audio.time(duration))
      this.noise.output.gain.exponentialRampToValueAtTime(original, audio.time(duration + strength))

      setTimeout(() => this.isRampingNoiseOutputGain = false, (duration + strength) * 1000)

      return this
    },
  }),
  inventObject({
    id: 'Creature',
    onSpawn: function () {
      const context = audio.context()

      this.size = Math.random()
      this.speed = Math.random()
      this.vector = 2 * Math.PI * Math.random()

      this.gain = context.createGain()
      this.gain.gain.value = 0.25 + (this.size * 0.25)

      this.oscillator = context.createOscillator()
      this.oscillator.type = 'sawtooth'
      this.oscillator.start()

      this.oscillator.connect(this.gain)
      this.gain.connect(this.masterGain)
    },
    onUpdate: function () {
      const {x, y} = position.get()

      this.vector += (Math.random() > 0.5 ? 1 : -1) * Math.random() * this.size
      this.x += Math.cos(this.vector) * this.speed
      this.y += Math.sin(this.vector) * this.speed
      this.oscillator.detune.value = Math.sin(this.vector) * 10

      const note = chord.getRandomNote(x, y)
      if (this.note != note) {
        this.oscillator.frequency.exponentialRampToValueAtTime(midiToFrequency(note), audio.time(8))
        this.note = note
      }
    },
  }),
]
