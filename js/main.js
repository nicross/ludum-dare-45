const debug = true
const objects = []

let hasPickup,
  nextPickup = 0

function activate() {
  audio.activate()
  controls.activate()

  hasPickup = true
  objects.push(
    spawn(compass, {x: 0, y: 20}),
  )

  window.requestAnimationFrame(main)
}

function main() {
  position.update(
    controls.get()
  )

  chord.update(
    position.grid()
  )

  const {angle, x, y} = position.get(),
    d = position.distance(),
    pickupRadius = 2

  objects.filter((object) => {
    return !object.inventory && object.collectible && distance(x, y, object.x, object.y) <= pickupRadius
  }).forEach((object) => {
    object.pickup()
    hasPickup = false
    nextPickup += Math.min(d, 100)
  })

  if (!hasPickup && d >= nextPickup && collectibles.length) {
    hasPickup = true
    objects.push(
      spawn(collectibles.shift(), nextSpawnLocation(20))
    )
  }

  objects.forEach((object) => object.update({angle, x, y}))

  window.requestAnimationFrame(main)
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.o-app').addEventListener('click', function onClick() {
    activate()

    this.classList.remove('o-app-inactive')
    this.removeEventListener('click', onClick)
  })
})
