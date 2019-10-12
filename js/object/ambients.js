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
    id: 'Tweeter',
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
      if (!this.isTweeting) {
        this.tweet()
      }
    },
    tweet: function () {
      this.isTweeting = true

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

      setTimeout(() => {this.isTweeting = false}, duration * 1000)
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

      const duration = scale(strength, 0, 1, 1, 8),
        gain = scale(strength, 0, 1, 0.25, 0.75),
        pause = Math.random()

      this.gain.gain.setValueAtTime(ZERO_GAIN, audio.time())
      this.gain.gain.exponentialRampToValueAtTime(gain, audio.time(duration / 2))
      this.gain.gain.exponentialRampToValueAtTime(ZERO_GAIN, audio.time(duration))

      setTimeout(() => {this.isWoofing = false}, (duration + pause) * 1000)
    },
  }),
  inventObject({
    id: 'Bugger',
    onCull: function () {
      // TODO: Destroy or create nodes
    },
    onSpawn: function () {
      const context = audio.context()

      this.size = Math.random()
      this.speed = Math.random()
      this.vector = randomBetween(0, TAU)

      this.gain = context.createGain()
      this.gain.gain.value = randomBetween(0.125, 0.25)

      this.oscillator = context.createOscillator()
      this.oscillator.type = 'sawtooth'
      this.oscillator.start()

      this.oscillator.connect(this.gain)
      this.gain.connect(this.masterGain)

      this.rampOscilatorFrequency = createRamper(this.oscillator.frequency, exponentialRamp)
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
    id: 'Oinker',
    call: function () {
      this.isCalling = true

      const root = midiToFrequency(chord.getRootNote(this.x, this.y)),
        times = Math.floor(randomBetween(1, 4))

      let duration = 0

      this.gain.gain.setValueAtTime(ZERO_GAIN, audio.time())

      for (let i = 0; i < times; i++) {
        const detune = randomBetween(-33.333, 33.333),
          modulation = randomBetween(20, 80),
          size = i == 0 ? randomBetween(0.5, 1) : randomBetween(0.166, 0.5),
          start = randomBetween(0.125, 0.333),
          stop = i == 0 ? randomBetween(0.75, 1) : randomBetween(0.25, 0.5)

        this.carrier.detune.setValueAtTime(detune, audio.time(duration))
        this.carrier.frequency.setValueAtTime(root, audio.time(duration))
        this.modulator.frequency.setValueAtTime(1 + (4 * i), audio.time(duration))
        this.modulator.frequency.exponentialRampToValueAtTime(modulation, audio.time(duration + start + stop))
        this.gain.gain.exponentialRampToValueAtTime(size, audio.time(duration + start))
        this.gain.gain.exponentialRampToValueAtTime(ZERO_GAIN, audio.time(duration + start + stop))

        duration += start + stop
      }

      duration += randomBetween(4, 8)

      setTimeout(() => {this.isCalling = false}, duration * 1000)
    },
    onCull: function () {
      // TODO: Destroy or create nodes
    },
    onSpawn: function () {
      const context = audio.context()

      this.radius = randomBetween(1, 2)
      this.speed = Math.random()
      this.vector = randomBetween(0, TAU)

      this.gain = context.createGain()
      this.gain.gain.value = ZERO_GAIN

      this.carrier = context.createOscillator()
      this.carrier.type = 'sawtooth'
      this.carrier.start()

      this.modulator = context.createOscillator()
      this.modulator.type = 'sine'
      this.modulator.start()

      this.modulator.connect(this.carrier.frequency)
      this.carrier.connect(this.gain)
      this.gain.connect(this.masterGain)
    },
    onUpdate: function () {
      if (!this.isCalling) {
        this.call()
        this.speed = Math.random()
        this.vector += randomBetween(-Math.PI / 4, Math.PI / 4)
      }

      this.x += Math.cos(this.vector) * this.speed * IFPS / GRID_LENGTH
      this.y += Math.sin(this.vector) * this.speed * IFPS / GRID_LENGTH
    },
  })
]
