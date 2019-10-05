function createNoiseMachine() {
  const context = audio.context(),
    source = context.createBufferSource()

  source.buffer = audio.noiseBuffer()
  source.loop = true
  source.start()

  const filter = context.createBiquadFilter()
  filter.frequency.value = context.sampleRate / 2
  filter.Q.value = 0
  filter.type = 'lowpass'

  const output = context.createGain()
  output.gain.value = 1

  source.connect(filter)
  filter.connect(output)

  return {
    filter,
    output,
    source,
  }
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function inventItem(id, definition) {
  return Object.setPrototypeOf({
    ...definition,
    id,
  }, itemBase)
}

function solveAngle(x1, y1, x2, y2, x3, y3) {
  const a = distance(x2, y2, x3, y3),
    b = distance(x1, y1, x3, y3),
    c = distance(x1, y1, x2, y2)

  let A = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c)
  A = Math.max(-1, Math.min(A, 1))
  A = Math.acos(A)

  return A
}

function spawnItem({index, ...options}) {
  index = index || Math.floor(Math.random() * items.length)
  const type = items[index]
  return Object.create(type).spawn(options)
}
