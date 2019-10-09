'use strict'

const cullingDistance = 100,
  debug = false,
  objects = []

function activate() {
  audio.activate()
  controls.activate()
  ambiance.activate()
  pickups.activate()

  window.requestAnimationFrame(main)
}

function main() {
  position.update(
    controls.get()
  )

  const {grid, isGrid, isStep, x, y} = position.get()

  if (isGrid) {
    ambiance.update(grid)
    chord.update(grid)
  }

  pickups.update({x, y})

  objects.forEach((object) => {
    if (!object.collectible) {
      const d = object.getDistance(x, y)

      if (!object.isCulled && d > cullingDistance) {
        object.cull(true)
      } else if (object.isCulled && d < cullingDistance) {
        object.cull(false)
      }
    }

    object.update({x, y})

    if (isStep) {
      object.onStep()
    }
  })

  window.requestAnimationFrame(main)
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.o-app').addEventListener('click', function onClick() {
    activate()

    this.classList.remove('o-app-inactive')
    this.removeEventListener('click', onClick)
  })
})
