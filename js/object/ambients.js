const ambients = [
  inventObject({
    id: 'Waterfall',
    onSpawn: function () {
      this.noise = createNoiseMachine()
      this.noise.output.connect(this.masterGain)

      this.noise.filter.frequency.value = Math.random() * audio.sampleRate() / 8
      this.noise.output.gain.value = 0.25 + (Math.random() * 0.75)
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
