function main() {
  position.update(
    controls.get()
  )

  window.requestAnimationFrame(main)
}

window.addEventListener('DOMContentLoaded', () => {
  window.requestAnimationFrame(main)
})
