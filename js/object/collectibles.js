const collectibles = shuffle([
  inventObject({
    collectible: true,
    id: 'Root',
    onPickup: function () {
      this.gain.gain.linearRampToValueAtTime(0.125, audio.time(1))
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
          this.note = note
          this.oscillator.frequency.exponentialRampToValueAtTime(midiToFrequency(note), audio.time(0.5))
        }
      }
    },
  }),
  inventObject({
    collectible: true,
    id: 'Third',
    onPickup: function () {
      this.gain.gain.linearRampToValueAtTime(0.125, audio.time(1))

      this.isRampingMasterPan = true
      this.masterPan.pan.linearRampToValueAtTime(angleToPan(position.angleTowardDirection(0)), audio.time(1))
      setTimeout(() => this.isRampingMasterPan = false, 1000)
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
          this.note = note
          this.oscillator.frequency.exponentialRampToValueAtTime(midiToFrequency(note), audio.time(0.5))
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
      this.gain.gain.linearRampToValueAtTime(0.125, audio.time(1))

      this.isRampingMasterPan = true
      this.masterPan.pan.linearRampToValueAtTime(angleToPan(position.angleTowardDirection(Math.PI)), audio.time(1))
      setTimeout(() => this.isRampingMasterPan = false, 1000)
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
          this.note = note
          this.oscillator.frequency.exponentialRampToValueAtTime(midiToFrequency(note), audio.time(0.5))
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
