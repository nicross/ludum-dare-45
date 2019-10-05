function activate() {
  audio.activate()
  controls.activate()

  window.requestAnimationFrame(main)
}

function main() {
  position.update(
    controls.get()
  )

  const {x, y} = position.get(),
    pickupDistance = 1

  pickups.filter((pickup) => {
    return distance(x, y, pickup.x, pickup.y) <= pickupDistance
  }).forEach((pickup) => {
    pickup.inventory = true
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
