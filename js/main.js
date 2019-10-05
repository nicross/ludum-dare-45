function activate() {
  audio.activate()
  controls.activate()

  window.requestAnimationFrame(main)
}

function main() {
  position.update(
    controls.get()
  )

  window.requestAnimationFrame(main)
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.o-app').addEventListener('click', function onClick() {
    activate()

    this.classList.remove('o-app-inactive')
    this.removeEventListener('click', onClick)
  })
})
