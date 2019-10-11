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

      this.noise.filter.frequency.value = randomBetween(20, 5500)
      this.noise.output.gain.value = randomBetween(0.25, 1)

      this.radius = randomBetween(1, 4)
    },
  }),
  inventObject({
    id: 'Wind',
    onCull: function () {
      // TODO: Destroy or create nodes
    },
    onSpawn: function () {
      this.noise = createNoiseMachine()
      this.noise.filter.frequency.value = randomBetween(20, 5500)
      this.noise.output.gain.value = 0.125
      this.noise.output.connect(this.masterGain)

      this.radius = randomBetween(1, 8)
    },
    onUpdate: function () {
      if (!this.isRampingNoiseFilterFrequency) {
        this.rampNoiseFilterFrequency(randomBetween(120, 5500), randomBetween(1, 8))
      }
      if (!this.isRampingNoiseOutputGain) {
        this.rampNoiseOutputGain(randomBetween(0.167, 0.325), randomBetween(4, 12))
      }
    },
    rampNoiseFilterFrequency: function (value, duration) {
      this.isRampingNoiseFilterFrequency = true

      const original = this.noise.filter.frequency.value,
        totalDuration = randomBetween(duration * 1.25, duration * 2)

      this.noise.filter.frequency.setValueAtTime(original, audio.time())
      this.noise.filter.frequency.exponentialRampToValueAtTime(value, audio.time(duration))
      this.noise.filter.frequency.exponentialRampToValueAtTime(original, audio.time(totalDuration))

      setTimeout(() => this.isRampingNoiseFilterFrequency = false, totalDuration * 1000)

      return this
    },
    rampNoiseOutputGain: function (value, duration) {
      this.isRampingNoiseOutputGain = true

      const original = this.noise.output.gain.value,
        totalDuration = randomBetween(duration * 1.25, duration * 2)

      this.noise.output.gain.setValueAtTime(original, audio.time())
      this.noise.output.gain.exponentialRampToValueAtTime(value, audio.time(duration))
      this.noise.output.gain.exponentialRampToValueAtTime(original, audio.time(totalDuration))

      setTimeout(() => this.isRampingNoiseOutputGain = false, totalDuration * 1000)

      return this
    },
  }),
  inventObject({
    id: 'Chirper',
    chirp: function () {
      this.isChirping = true

      const times = Math.floor(randomBetween(0, 6))
      let duration = 0

      this.gain.gain.setValueAtTime(ZERO_GAIN, audio.time())

      for (let i = 0; i <= times; i++) {
        const detune = randomBetween(-33.333, 33.333),
          frequency = midiToFrequency(chord.getRandomNote(this.x, this.y)) * 2,
          size = randomBetween(0, this.size),
          start = randomBetween(0.125, 0.25),
          stop = randomBetween(0.25, 0.75)

        this.oscillator.detune.setValueAtTime(detune, audio.time(duration))
        this.oscillator.frequency.setValueAtTime(frequency, audio.time(duration))
        this.gain.gain.exponentialRampToValueAtTime(size, audio.time(duration + start))
        this.gain.gain.exponentialRampToValueAtTime(ZERO_GAIN, audio.time(duration + start + stop))

        duration += start + stop
      }

      duration += randomBetween(0, 8)

      setTimeout(() => {this.isChirping = false}, duration * 1000)
    },
    onCull: function () {
      // TODO: Destroy or create nodes
    },
    onSpawn: function () {
      const context = audio.context()

      this.size = randomBetween(0.125, 0.625)

      this.gain = context.createGain()
      this.gain.connect(this.masterGain)
      this.gain.gain.value = 0.00001

      this.oscillator = context.createOscillator()
      this.oscillator.type = 'triangle'
      this.oscillator.connect(this.gain)
      this.oscillator.start()

      this.radius = randomBetween(0, 1)
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

      this.radius = randomBetween(2, 4)
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

      this.gain.gain.setValueAtTime(ZERO_GAIN, audio.time())
      this.gain.gain.exponentialRampToValueAtTime(strength, audio.time(duration / 2))
      this.gain.gain.exponentialRampToValueAtTime(ZERO_GAIN, audio.time(duration))

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
      this.vector = randomBetween(0, TAU)

      this.gain = context.createGain()
      this.gain.gain.value = randomBetween(0.25, 0.5)

      this.oscillator = context.createOscillator()
      this.oscillator.type = 'sawtooth'
      this.oscillator.start()

      this.oscillator.connect(this.gain)
      this.gain.connect(this.masterGain)

      this.rampOscilatorFrequency = createRamper(this.oscillator.frequency, exponentialRamp)

      this.radius = randomBetween(0, 0.25)
    },
    onUpdate: function () {
      const {x, y} = position.get()

      this.vector += randomBetween(-this.size, this.size)
      this.x += Math.cos(this.vector) * this.speed
      this.y += Math.sin(this.vector) * this.speed
      this.oscillator.detune.value = Math.sin(this.vector) * 10

      if (!this.rampOscilatorFrequency.state) {
        this.rampOscilatorFrequency(
          midiToFrequency(chord.getRandomNote(x, y)),
          randomBetween(0, 8)
        )
      }
    },
  }),
  inventObject({
    id: 'Creature',
    onCull: function () {
      // TODO: Destroy or create nodes
    },
    onSpawn: function () {

    },
    onUpdate: function () {

    },
  })
  // TODO: Creature - Moves slower than Insect with a less erratic path, calls out like the subwoofer but with frequency modulation (and up an octave)
]
