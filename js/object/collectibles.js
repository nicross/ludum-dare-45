const collectibles = shuffle([
  inventObject({
    collectible: true,
    id: 'Root',
    onPickup: function () {
      this.gain.gain.setValueAtTime(1, audio.time())
      this.gain.gain.exponentialRampToValueAtTime(0.125, audio.time(1))
    },
    onSpawn: function () {
      const context = audio.context()

      this.note = chord.getChord(this.x, this.y)[0]

      this.gain = context.createGain({gain: 1})
      this.gain.connect(this.masterGain)

      this.oscillator = context.createOscillator()
      this.oscillator.connect(this.gain)
      this.oscillator.frequency.value = midiToFrequency(this.note)
      this.oscillator.start()
    },
    onUpdate: function () {
      if (this.inventory) {
        const note = chord.getNote(0)

        if (this.note != note) {
          this.oscillator.frequency.setValueAtTime(midiToFrequency(this.note), audio.time())
          this.oscillator.frequency.exponentialRampToValueAtTime(midiToFrequency(note), audio.time(1))
          this.note = note
        }
      }
    },
  }),
  inventObject({
    collectible: true,
    id: 'Third',
    onPickup: function () {
      this.gain.gain.setValueAtTime(1, audio.time(0))
      this.gain.gain.exponentialRampToValueAtTime(0.125, audio.time(1))

      this.rampMasterPan(angleToPan(position.angleTowardDirection(0)), 1)
    },
    onSpawn: function () {
      const context = audio.context()

      this.note = chord.getChord(this.x, this.y)[1]

      this.gain = context.createGain({gain: 1})
      this.gain.connect(this.masterGain)

      this.oscillator = context.createOscillator()
      this.oscillator.connect(this.gain)
      this.oscillator.frequency.value = midiToFrequency(this.note)
      this.oscillator.start()
    },
    onUpdate: function () {
      if (this.inventory) {
        const note = chord.getNote(1)

        if (this.note != note) {
          this.oscillator.frequency.setValueAtTime(midiToFrequency(this.note), audio.time())
          this.oscillator.frequency.exponentialRampToValueAtTime(midiToFrequency(note), audio.time(1))
          this.note = note
        }

        if (!this.isRampingMasterPan) {
          this.masterPan.pan.value = angleToPan(position.angleTowardDirection(0))
        }
      }
    },
  }),
  inventObject({
    collectible: true,
    id: 'Fifth',
    onPickup: function () {
      this.gain.gain.setValueAtTime(1, audio.time())
      this.gain.gain.exponentialRampToValueAtTime(0.125, audio.time(1))

      this.rampMasterPan(angleToPan(position.angleTowardDirection(Math.PI)), 1)
    },
    onSpawn: function () {
      const context = audio.context()

      this.note = chord.getChord(this.x, this.y)[2]

      this.gain = context.createGain({gain: 1})
      this.gain.connect(this.masterGain)

      this.oscillator = context.createOscillator()
      this.oscillator.connect(this.gain)
      this.oscillator.frequency.value = midiToFrequency(this.note)
      this.oscillator.start()
    },
    onUpdate: function () {
      if (this.inventory) {
        const note = chord.getNote(2)

        if (this.note != note) {
          this.oscillator.frequency.setValueAtTime(midiToFrequency(this.note), audio.time())
          this.oscillator.frequency.exponentialRampToValueAtTime(midiToFrequency(note), audio.time(1))
          this.note = note
        }

        if (!this.isRampingMasterPan) {
          this.masterPan.pan.value = angleToPan(position.angleTowardDirection(Math.PI))
        }
      }
    },
  }),
  // TODO: Kick - Footstep sounds, increases power via inventory size?
  // TODO: Seashell - You can hear the ocean
  // TODO: Snare - Every other footstep
])
