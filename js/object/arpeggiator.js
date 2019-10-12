'use strict'

const arpeggiator = inventObject({
  createSynth: function() {
    const context = audio.context()

    const gain = context.createGain(),
      oscillator = context.createOscillator(),
      pan = context.createStereoPanner()

    const lfo = {
      gain: context.createGain(),
      oscillator: context.createOscillator()
    }

    gain.gain.value = ZERO_GAIN
    lfo.gain.gain.value = ZERO_GAIN
    lfo.oscillator.frequency.value = 1

    oscillator.start()
    lfo.oscillator.start()

    lfo.oscillator.connect(lfo.gain)
    lfo.gain.connect(gain.gain)
    oscillator.connect(gain)
    gain.connect(pan)
    pan.connect(this.synthGain)

    return {
      destroy: function (duration) {
        this.rampGain(ZERO_GAIN, duration)
        this.rampPan(0, duration)

        setTimeout(() => {
          oscillator.stop()
          lfo.oscillator.stop()
          pan.disconnect()
        }, duration * 1000)
      },
      gain,
      lfo,
      oscillator,
      pan,
      rampFrequency: createRamper(oscillator.frequency, exponentialRamp),
      rampGain: createRamper(gain.gain, exponentialRamp),
      rampLfoFrequency: createRamper(lfo.oscillator.frequency, exponentialRamp),
      rampLfoGain: createRamper(lfo.gain.gain, exponentialRamp),
      rampPan: createRamper(pan.pan, linearRamp),
    }
  },
  isCollectible: true,
  onPickup: function () {
    this.rampSynthGain(0.125, 0.5)

    this.synths.forEach((synth, index) => {
      if (index == 0) {
        return
      }

      const pan = (index % 2 ? 1 : -1) * index / this.synths.length
      synth.rampPan(pan, audio.time(index * 0.25))
    })
  },
  onSpawn: function () {
    const context = audio.context()

    this.synths = []

    this.synthGain = context.createGain()
    this.synthGain.gain.value = 1
    this.synthGain.connect(this.masterGain)

    this.rampSynthGain = createRamper(this.synthGain.gain, exponentialRamp)

    this.gainRadius = this.panRadius = GRID_LENGTH / 2
  },
  onUpdate: function () {
    const {grid} = position.get(),
      chordIndex = this.isCollected ? chord.getIndex(grid.x, grid.y) : chord.getIndex(0, 0)

    if (chordIndex == this.chordIndex) {
      return
    }

    const notes = chord.getAll(grid.x, grid.y)

    if (this.synths.length > notes.length) {
      this.synths.splice(notes.length).forEach((synth) => synth.destroy())
    } else if (this.synths.length < notes.length) {
      for (let i = 0, count = notes.length - this.synths.length; i < count; i += 1) {
        this.synths.push(this.createSynth())
      }
    }

    this.synths.forEach((synth, index) => {
      synth.rampFrequency(midiToFrequency(notes[index]), 0.5)
      synth.rampGain(1 / notes.length, 0.5)
      synth.rampLfoFrequency((1 / (notes.length * 2)) * (index + 1), 0.5)
      synth.rampLfoGain(1 / notes.length, 0.5)
      synth.rampPan((index % 2 ? 1 : -1) * index / notes.length, 0.5)
    })

    this.chordIndex = chordIndex
  },
})
