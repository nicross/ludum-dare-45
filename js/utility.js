function angleToPan(radians) {
  return scale(flattenAngle(radians), -Math.PI / 2, Math.PI / 2, -1, 1)
}

function createCollectibleSound() {
  const context = audio.context()
}

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

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function flattenAngle(angle) {
  const wrap = Math.PI / 2

  if (angle > wrap) {
    angle = wrap - (angle - wrap)
  }

  if (angle < -wrap) {
    angle = (-angle - wrap) - wrap
  }

  return angle
}

function inventObject(definition, prototype) {
  return Object.setPrototypeOf({
    ...definition,
  }, objectBase.isPrototypeOf(prototype) ? prototype : objectBase)
}

function midiToFrequency(note) {
  return 440 * Math.pow(2, (note - 69) / 12)
}

function nextSpawnLocation(baseDistance, theta, offset) {
  const {a, x, y} = position.get()

  const randomAngle = debug
    ? 0
    : (Math.random() * theta) + offset

  const angle = a + randomAngle,
    distance = (baseDistance * 0.5) + (Math.random() * baseDistance * 0.5)

  return {
    x: x + (Math.cos(angle) * distance),
    y: y + (Math.sin(angle) * distance),
  }
}

function normalizeAngle(angle) {
  angle %= 2 * Math.PI

  if (angle > Math.PI) {
    angle -= 2 * Math.PI
  }

  if (angle < -Math.PI) {
    angle += 2 * Math.PI
  }

  return angle
}

function randomValue(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ]
}

function scale(value, min, max, a, b) {
  return ((b - a) * (value - min) / (max - min)) + a
}

function shuffle(array) {
  if (debug) {
    return array.slice()
  }

  array = array.slice()

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

function solveAngle(ax, ay, bx, by, cx, cy) {
  const a = distance(bx, by, cx, cy),
    b = distance(ax, ay, cx, cy),
    c = distance(ax, ay, bx, by)

  let A = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c)
  A = Math.max(-1, Math.min(A, 1))
  A = Math.acos(A)

  return A
}

function spawn(prototype, options) {
  const instance = Object.create(prototype).spawn(options)
  objects.push(instance)
  return instance
}

function spawnFrom(prototypes, options) {
  return spawn(randomValue(prototypes), options)
}
