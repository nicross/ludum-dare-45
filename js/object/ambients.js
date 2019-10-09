'use strict'

const ambients = [
  inventObject({
    id: 'Waterfall',
    onCull: function () {
      // TODO: Destroy or create nodes
    },
    onSpawn: function () {
      this.noise = createNoiseMachine()
      this.noise.output.connect(this.masterGain)

      this.noise.filter.frequency.value = Math.random() * audio.sampleRate() / 12
      this.noise.output.gain.value = 0.25 + (Math.random() * 0.75)
    },
  }),
  inventObject({
    id: 'Wind',
    onCull: function () {
      // TODO: Destroy or create nodes
    },
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
    id: 'Chirper',
    chirp: function () {
      this.isChirping = true

      const times = Math.floor(Math.random() * 6)
      let duration = 0

      this.gain.gain.setValueAtTime(0.00001, audio.time())

      for (let i = 0; i <= times; i++) {
        const detune = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 33.333,
          frequency = midiToFrequency(chord.getRandomNote(this.x, this.y)) * 2,
          start = 0.125 + (Math.random() * 0.125),
          stop = 0.25 + (Math.random() * 0.5)

        this.oscillator.detune.setValueAtTime(detune, audio.time(duration))
        this.oscillator.frequency.setValueAtTime(frequency, audio.time(duration))
        this.gain.gain.exponentialRampToValueAtTime(this.size * Math.random(), audio.time(duration + start))
        this.gain.gain.exponentialRampToValueAtTime(0.00001, audio.time(duration + start + stop))

        duration += start + stop
      }

      duration += Math.random() * 8

      setTimeout(() => {this.isChirping = false}, duration * 1000)
    },
    onCull: function () {
      // TODO: Destroy or create nodes
    },
    onSpawn: function () {
      const context = audio.context()

      this.size = 0.125 + (Math.random() * 0.5)

      this.gain = context.createGain()
      this.gain.connect(this.masterGain)
      this.gain.gain.value = 0.00001

      this.oscillator = context.createOscillator()
      this.oscillator.type = 'triangle'
      this.oscillator.connect(this.gain)
      this.oscillator.start()
    },
    onUpdate: function () {
      if (!this.isChirping) {
        this.chirp()
      }
    },
  }),
  inventObject({
    id: 'Subwoofer',
    onSpawn: function () {
      const context = audio.context()

      this.gain = context.createGain()
      this.gain.connect(this.masterGain)

      this.oscillator = context.createOscillator()
      this.oscillator.frequency.value = midiToFrequency(chord.getRootNote(this.x, this.y))
      this.oscillator.type = 'sine'
      this.oscillator.connect(this.gain)
      this.oscillator.start()
    },
    onUpdate: function () {
      if (!this.isWoofing) {
        this.woof()
      }
    },
    woof: function () {
      this.isWoofing = true

      const strength = Math.random()

      const duration = strength * 8,
        pause = Math.random()

      this.gain.gain.setValueAtTime(0.00001, audio.time())
      this.gain.gain.exponentialRampToValueAtTime(strength, audio.time(duration / 2))
      this.gain.gain.exponentialRampToValueAtTime(0.00001, audio.time(duration))

      setTimeout(() => {this.isWoofing = false}, (duration + pause) * 1000)
    },
  }),
  inventObject({
    id: 'Insect',
    onCull: function () {
      // TODO: Destroy or create nodes
    },
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

      if (!this.isRampingOscilatorFrequency) {
        this.rampOscilatorFrequency(
          midiToFrequency(chord.getRandomNote(x, y)),
          Math.random() * 8
        )
      }
    },
    rampOscilatorFrequency: function (value, duration) {
      this.isRampingOscilatorFrequency = true
      this.oscillator.frequency.exponentialRampToValueAtTime(value, audio.time(duration))
      setTimeout(() => this.isRampingOscilatorFrequency = false, duration * 1000)
    },
  }),
  // TODO: Creature - Moves slower than Insect with a less erratic path, calls out like the subwoofer but with frequency modulation (and up an octave)
]
