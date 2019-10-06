const debug = true
const objects = []

function activate() {
  audio.activate()
  controls.activate()

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
    position.get()
  )

  const {angle, x, y} = position.get(),
    pickupDistance = 2

  objects.filter((object) => {
    return !object.inventory && object.collectible && distance(x, y, object.x, object.y) <= pickupDistance
  }).forEach((object) => {
    object.pickup()

    if (collectibles.length) {
      objects.push(
        spawn(collectibles.shift(), nextSpawnLocation(20))
      )
    }
  })

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
