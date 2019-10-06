const debug = true
const objects = []

function activate() {
  audio.activate()
  controls.activate()
  pickups.activate()
  
  window.requestAnimationFrame(main)
}

function main() {
  position.update(
    controls.get()
  )

  const pos = position.get(),
    {a, d, x, y} = pos

  chord.update(position.grid())
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
