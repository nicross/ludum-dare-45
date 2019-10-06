const debug = false
const objects = []

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

  objects.forEach((object) => object.update(pos))

  window.requestAnimationFrame(main)
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.o-app').addEventListener('click', function onClick() {
    activate()

    this.classList.remove('o-app-inactive')
    this.removeEventListener('click', onClick)
  })
})
