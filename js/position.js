const position = (function IIFE() {
  const fps = 60,
    ifps = 1 / fps,
    tau = 2 * Math.PI

  const position = {
    angle: 0,
    x: 0,
    y: 0,
  }

  const vector = {
    rotation: 0,
    velocity: 0,
  }

  const maxVector = {
    rotation: ifps * (tau / 4),
    velocity: ifps * 2,
  }

  const acceleration = {
    rotation: ifps * maxVector.rotation / 2,
    velocity: ifps * maxVector.velocity / 2,
  }

  return {
    get: () => ({
      angle: position.angle,
      x: position.x,
      y: position.y,
    }),
    getVector: () => ({
      rotation: vector.rotation,
      velocity: vector.velocity,
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
        if (vector.velocity < maxVector.velocity) {
          vector.velocity -= acceleration.velocity
        }
      } else if (vector.velocity >= acceleration.velocity) {
        vector.velocity -= acceleration.velocity
      } else if (vector.velocity > 0) {
        vector.velocity = 0
      } else if (vector.velocity <= -acceleration.velocity) {
        vector.velocity += acceleration.velocity
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
        if (vector.rotation < maxVector.rotation) {
          vector.rotation -= acceleration.rotation
        }
      } else if (vector.rotation >= acceleration.rotation) {
        vector.rotation -= acceleration.rotation
      } else if (vector.rotation > 0) {
        vector.rotation = 0
      } else if (vector.rotation <= -acceleration.rotation) {
        vector.rotation += acceleration.rotation
      } else if (vector.rotation < 0) {
        vector.rotation = 0
      }

      position.angle = Math.abs((position.angle + vector.rotation) % tau)
      position.x += vector.velocity * Math.cos(position.angle)
      position.y += vector.velocity * Math.sin(position.angle)

      return this
    },
  }
})()
