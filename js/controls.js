const controls = (function IIFE() {

  const backward = document.querySelector('.o-app--backward'),
    forward = document.querySelector('.o-app--forward'),
    left = document.querySelector('.o-app--left'),
    right = document.querySelector('.o-app--right')

  let movingBackward = false,
    movingForward = false,
    turningLeft = false,
    turningRight = false

  function onBackwardStart() {
    movingBackward = true
  }

  function onBackwardStop() {
    movingBackward = false
  }

  function onForwardStart() {
    movingForward = true
  }

  function onForwardStop() {
    movingForward = false
  }

  function onLeftStart() {
    turningLeft = true
  }

  function onLeftStop() {
    turningLeft = false
  }

  function onRightStart() {
    turningRight = true
  }

  function onRightStop() {
    turningRight = false
  }

  return {
    activate: () => {
      backward.addEventListener('mouseover', onBackwardStart)
      backward.addEventListener('touchstart', onBackwardStart)
      backward.addEventListener('mouseout', onBackwardStop)
      backward.addEventListener('touchend', onBackwardStop)

      forward.addEventListener('mouseover', onForwardStart)
      forward.addEventListener('touchstart', onForwardStart)
      forward.addEventListener('mouseout', onForwardStop)
      forward.addEventListener('touchend', onForwardStop)

      left.addEventListener('mouseover', onLeftStart)
      left.addEventListener('touchstart', onLeftStart)
      left.addEventListener('mouseout', onLeftStop)
      left.addEventListener('touchend', onLeftStop)

      right.addEventListener('mouseover', onRightStart)
      right.addEventListener('touchstart', onRightStart)
      right.addEventListener('mouseout', onRightStop)
      right.addEventListener('touchend', onRightStop)

      window.addEventListener('keydown', (e) => {
        switch (e.which) {
          case 38:
          case 87:
            return onForwardStart()
          case 39:
          case 68:
            return onRightStart()
          case 40:
          case 83:
            return onBackwardStart()
          case 37:
          case 65:
            return onLeftStart()
        }
      })

      window.addEventListener('keyup', (e) => {
        switch (e.which) {
          case 38:
          case 87:
            return onForwardStop()
          case 39:
          case 68:
            return onRightStop()
          case 40:
          case 83:
            return onBackwardStop()
          case 37:
          case 65:
            return onLeftStop()
        }
      })

      return this
    },
    get: () => ({
      movingBackward,
      movingForward,
      turningLeft,
      turningRight,
    })
  }
})()
