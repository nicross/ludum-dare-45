'use strict'

function angleToPan(radians, distance, radius) {
  const factor = 1 - Math.max(0, ((radius - distance) / radius) || 0)
  return factor * scale(flattenAngle(radians), -Math.PI / 2, Math.PI / 2, -1, 1)
}

function createDinger() {
  const context = audio.context()

  const gain = context.createGain()
  gain.gain.value = 0

  const osc = context.createOscillator()
  osc.type = 'square'
  osc.frequency.value = 220
  osc.start()

  let dingTimeout;

  function ding() {
    gain.gain.setValueAtTime(0.00001, audio.time(1))
    gain.gain.exponentialRampToValueAtTime(1, audio.time(1.125))
    gain.gain.exponentialRampToValueAtTime(0.00001, audio.time(1.75))
    gain.gain.exponentialRampToValueAtTime(1, audio.time(2))
    gain.gain.exponentialRampToValueAtTime(0.00001, audio.time(2.75))
    dingTimeout = setTimeout(ding, 3000)
  }
  ding()

  osc.connect(gain)

  return {
    destroy: function () {
      osc.stop()
      clearTimeout(dingTimeout)
      gain.disconnect()
    },
    output: gain,
  }
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

function createCancelableTimeout(duration) {
  const container = {}

  const timeout = new Promise((resolve, reject) => {
    container.reject = () => reject()
    container.timeout = setTimeout(resolve, duration)
  })

  timeout.cancel = () => {
    container.reject()
    clearTimeout(container.timeout)
  }

  return timeout
}

function createRamper(audioParam, rampFn) {
  const container = (...args) => {
    container.state = true

    const timeout = rampFn(audioParam, ...args)
    timeout.then(() => container.state = false)
    container.cancel = () => timeout.cancel()

    return timeout
  }

  container.cancel = () => {}
  container.state = false

  return container
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function distanceToGain(d, radius = 0) {
  const gain = 1 / (Math.max(1, d - radius) ** 2)
  return Math.max(ZERO_GAIN, Math.min(1, gain))
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

function exponentialRamp(audioParam, value, duration) {
  audioParam.setValueAtTime(audioParam.value, audio.time())
  audioParam.exponentialRampToValueAtTime(value, audio.time(duration))

  const timeout = createCancelableTimeout(duration * 1000)
  timeout.then(null, () => audioParam.cancelAndHoldAtTime(0))

  return timeout
}

function inventObject(definition, prototype) {
  return Object.setPrototypeOf({
    ...definition,
  }, objectBase.isPrototypeOf(prototype) ? prototype : objectBase)
}

function linearRamp(audioParam, value, duration) {
  audioParam.setValueAtTime(audioParam.value, audio.time())
  audioParam.linearRampToValueAtTime(value, audio.time(duration))

  const timeout = createCancelableTimeout(duration * 1000)
  timeout.then(null, () => audioParam.cancelAndHoldAtTime(0))

  return timeout
}

function midiToFrequency(note) {
  return 440 * Math.pow(2, (note - 69) / 12)
}

function nextSpawnLocation(baseDistance, theta, offset) {
  const {a, vector, x, y} = position.get()
  baseDistance += Math.abs(FPS * vector.velocity)

  const randomAngle = DEBUG
    ? 0
    : randomBetween(0, theta) + offset

  const angle = (vector.velocity >= 0 ? 1 : -1) * (a + randomAngle),
    totalDistance = randomBetween(baseDistance, baseDistance * 2)

  return {
    x: x + (Math.cos(angle) * totalDistance),
    y: y + (Math.sin(angle) * totalDistance),
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

function randomBetween(min, max) {
  return min + (Math.random() * (max - min))
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
  if (DEBUG) {
    return array.slice()
  }

  array = array.slice()

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

function spawn(prototype, options) {
  const instance = Object.create(prototype).spawn(options)
  objects.push(instance)
  return instance
}
