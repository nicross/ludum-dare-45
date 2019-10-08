'use strict'

const position = (function IIFE() {
  const fps = 60,
    ifps = 1 / fps,
    tau = 2 * Math.PI

  const position = {
    a: -Math.PI / 2,
    d: 0,
    x: 0,
    y: 0,
  }

  const vector = {
    rotation: 0,
    velocity: 0,
  }

  const maxVector = {
    rotation: ifps * (tau / 8),
    velocity: ifps * 2,
  }

  const acceleration = {
    rotation: ifps * maxVector.rotation,
    velocity: ifps * maxVector.velocity / 4,
  }

  return {
    angleTowardDirection: (radians) => {
      return normalizeAngle(radians - position.a)
    },
    angleTowardPoint: (x, y) => {
      return normalizeAngle(Math.atan2(y - position.y, x - position.x) - position.a)
    },
    distance: () => getDistance(),
    get: () => Object.assign(position),
    getVector: () => ({
      rotation: vector.rotation,
      velocity: vector.velocity,
    }),
    grid: () => ({
      x: Math.round(position.x / 50),
      y: Math.round(position.y / 50),
    }),
    step: () => ({
      x: Math.floor(position.x),
      y: Math.floor(position.y),
    }),
    update: (state) => {
      if (state.movingForward) {
        if (vector.velocity < 0) {
          vector.velocity = 0
        }
        if (vector.velocity < maxVector.velocity) {
          vector.velocity += acceleration.velocity
        }
      } else if (state.movingBackward) {
        if (vector.velocity > 0) {
          vector.velocity = 0
        }
        if (vector.velocity > -maxVector.velocity) {
          vector.velocity -= acceleration.velocity
        }
      } else if (vector.velocity >= acceleration.velocity * 2) {
        vector.velocity -= acceleration.velocity * 2
      } else if (vector.velocity > 0) {
        vector.velocity = 0
      } else if (vector.velocity <= -(acceleration.velocity * 2)) {
        vector.velocity += acceleration.velocity * 2
      } else if (vector.velocity < 0) {
        vector.velocity = 0
      }

      if (state.turningLeft) {
        if (vector.rotation < 0) {
          vector.rotation = 0
        }
        if (vector.rotation < maxVector.rotation) {
          vector.rotation += acceleration.rotation
        }
      } else if (state.turningRight) {
        if (vector.rotation > 0) {
          vector.rotation = 0
        }
        if (vector.rotation > -maxVector.rotation) {
          vector.rotation -= acceleration.rotation
        }
      } else if (vector.rotation >= acceleration.rotation * 2) {
        vector.rotation -= acceleration.rotation * 2
      } else if (vector.rotation > 0) {
        vector.rotation = 0
      } else if (vector.rotation <= -(acceleration.rotation * 2)) {
        vector.rotation += acceleration.rotation * 2
      } else if (vector.rotation < 0) {
        vector.rotation = 0
      }

      position.a = (position.a + vector.rotation) % tau

      if (position.a < 0) {
        position.a += tau
      }

      position.x += vector.velocity * Math.cos(position.a)
      position.y += vector.velocity * Math.sin(position.a)
      position.d = distance(0, 0, position.x, position.y)

      return this
    },
  }
})()
