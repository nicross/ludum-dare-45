const debug = false
const objects = []

let stepX = 0,
  stepY = 0

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

  const grid = position.grid()
    pos = position.get(),
    step = position.step(),
    {a, d, x, y} = pos

  ambiance.update(grid)
  chord.update(grid)
  pickups.update(pos)

  const stepped = step.x != stepX || step.y != stepY
  if (stepped) {
    stepX = step.x
    stepY = step.y
  }

  objects.forEach((object) => {
    object.update(pos)

    if (stepped) {
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
