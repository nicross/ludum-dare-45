'use strict'

const CULLING_DISTANCE = 100,
  DEBUG = false

function activate() {
  chord.update(
    position.get().grid
  )

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

  const {d, grid, isGrid, isStep, x, y} = position.get()

  if (isGrid) {
    ambiance.update(grid)
    chord.update(grid)
  }

  pickups.update({d, x, y})

  for (let object of objects) {
    if (!object.isCollectible) {
      const d = object.getDistance(x, y)

      if (!object.isCulled && d > CULLING_DISTANCE) {
        object.cull(true)
      } else if (object.isCulled && d < CULLING_DISTANCE) {
        object.cull(false)
      }
    }

    object.update({x, y})

    if (isStep) {
      object.onStep()
    }
  }

  window.requestAnimationFrame(main)
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.o-app').addEventListener('click', function onClick() {
    activate()

    this.classList.remove('o-app-inactive')
    this.removeEventListener('click', onClick)
  })
})
