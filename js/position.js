'use strict'

const position = (function IIFE() {
  const fps = 60,
    gridLength = 50,
    ifps = 1 / fps,
    stepLength = 1,
    tau = 2 * Math.PI

  const position = {
    a: -Math.PI / 2,
    d: 0,
    grid: {
      x: 0,
      y: 0,
    },
    isStep: false,
    isGrid: false,
    step: {
      x: 0,
      y: 0,
    },
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
    get: () => Object.assign(position),
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

      const stepX = Math.round(position.x / stepLength),
        stepY = Math.round(position.y / stepLength)

      if (stepX != position.step.x || stepY != position.step.y) {
        position.isStep = true
        position.step.x = stepX
        position.step.y = stepY
      } else if (position.isStep) {
        position.isStep = false
      }

      const gridX = Math.round(position.x / gridLength),
        gridY = Math.round(position.y / gridLength)

      if (gridX != position.grid.x || gridY != position.grid.y) {
        position.isGrid = true
        position.step.x = gridX
        position.step.y = gridY
      } else if (position.isGrid) {
        position.isGrid = false
      }

      return this
    },
    vector: () => Object.assign(vector),
  }
})()
