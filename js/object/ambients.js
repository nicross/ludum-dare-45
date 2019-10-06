const ambients = [
  inventObject({
    id: 'Waterfall',
    onSpawn: function () {
      this.noise = createNoiseMachine()
      this.noise.output.connect(this.masterGain)
    },
  }),
]
