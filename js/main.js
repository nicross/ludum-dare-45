'use strict'

const CULLING_DISTANCE = 100,
  DEBUG = false,
  FPS = 60,
  GRID_LENGTH = 50,
  IFPS = 1 / FPS,
  TAU = Math.PI * 2,
  ZERO_GAIN = 1 / 10 ** 6

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

  const {d, grid, isGrid, isStep, vector, x, y} = position.get()

  if (isGrid) {
    ambiance.update(grid)
    chord.update(grid)
  }

  pickups.update({d, x, y})

  for (let object of objects) {
    if (!object.isCollectible) {
      if (!object.isCulled && object.d > CULLING_DISTANCE) {
        object.cull(true)
      } else if (object.isCulled && object.d < CULLING_DISTANCE) {
        object.cull(false)
      }
    }

    object.update({vector, x, y})
  }

  window.requestAnimationFrame(main)
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.o-app').addEventListener('click', function onClick() {
    activate()

    this.classList.remove('o-app-inactive')
    this.removeEventListener('click', onClick)
  })

  document.querySelector('.o-app--activate').addEventListener('transitionend', function onTransitionEnd() {
    this.hidden = true
    this.removeEventListener('transitionend', onTransitionEnd)
  })
})
