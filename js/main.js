function activate() {
  audio.activate()
  controls.activate()

  pickups.push(
    // Compass
    spawnItem(1, {x: 0, y: 20}),
  )

  window.requestAnimationFrame(main)
}

function main() {
  position.update(
    controls.get()
  )

  chord.update(
    position.get()
  )

  const {angle, x, y} = position.get(),
    pickupDistance = 2

  pickups.filter((item) => {
    return !item.inventory && item.collectible && distance(x, y, item.x, item.y) <= pickupDistance
  }).forEach((item) => {
    item.pickup()
  })

  pickups.forEach((pickup) => pickup.update({angle, x, y}))

  window.requestAnimationFrame(main)
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.o-app').addEventListener('click', function onClick() {
    activate()

    this.classList.remove('o-app-inactive')
    this.removeEventListener('click', onClick)
  })
})
