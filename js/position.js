'use strict'

const position = (function IIFE() {
  const position = {
    a: -Math.PI / 2,
    d: 0,
    grid: {
      x: 0,
      y: 0,
    },
    isStep: true,
    isGrid: true,
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
    rotation: IFPS * (TAU / 8),
    velocity: IFPS * 2,
  }

  const acceleration = {
    rotation: IFPS * maxVector.rotation,
    velocity: IFPS * maxVector.velocity / 4,
  }

  return {
    angleTowardDirection: (radians) => {
      return normalizeAngle(radians - position.a)
    },
    angleTowardPoint: (x, y) => {
      return normalizeAngle(Math.atan2(y - position.y, x - position.x) - position.a)
    },
    get: () => ({
      ...position,
      vector: {
        ...vector,
      },
    }),
    maxVector: () => Object.assign(maxVector),
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
      } else if (vector.velocity <= -(acceleration.velocity * 2)) {
        vector.velocity += acceleration.velocity * 2
      } else if (vector.velocity != 0) {
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
      } else if (vector.rotation <= -(acceleration.rotation * 2)) {
        vector.rotation += acceleration.rotation * 2
      } else if (vector.rotation != 0) {
        vector.rotation = 0
      }

      position.a = (position.a + vector.rotation) % TAU

      if (position.a < 0) {
        position.a += TAU
      }

      position.x += vector.velocity * Math.cos(position.a)
      position.y += vector.velocity * Math.sin(position.a)
      position.d = distance(0, 0, position.x, position.y)

      const stepX = Math.round(position.x / STEP_LENGTH),
        stepY = Math.round(position.y / STEP_LENGTH)

      if (stepX != position.step.x || stepY != position.step.y) {
        position.isStep = true
        position.step = {
          x: stepX,
          y: stepY,
        }
      } else if (position.isStep) {
        position.isStep = false
      }

      const gridX = Math.round(position.x / GRID_LENGTH),
        gridY = Math.round(position.y / GRID_LENGTH)

      if (gridX != position.grid.x || gridY != position.grid.y) {
        position.isGrid = true
        position.grid = {
          d: distance(0, 0, gridX, gridY),
          x: gridX,
          y: gridY,
        }
      } else if (position.isGrid) {
        position.isGrid = false
      }

      return this
    },
  }
})()
