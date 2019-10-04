const controls = (function IIFE() {

  const backwardButton = document.querySelector('.o-app--backward'),
    forwardButton = document.querySelector('.o-app--forward'),
    leftButton = document.querySelector('.o-app--left'),
    rightButton = document.querySelector('.o-app--right')

  let movingBackward = false,
    movingForward = false,
    turningLeft = false,
    turningRight = false

  backwardButton.addEventListener('mouseover', onBackwardStart)
  backwardButton.addEventListener('touchstart', onBackwardStart)
  backwardButton.addEventListener('mouseout', onBackwardStop)
  backwardButton.addEventListener('touchend', onBackwardStop)

  forwardButton.addEventListener('mouseover', onForwardStart)
  forwardButton.addEventListener('touchstart', onForwardStart)
  forwardButton.addEventListener('mouseout', onForwardStop)
  forwardButton.addEventListener('touchend', onForwardStop)

  leftButton.addEventListener('mouseover', onLeftStart)
  leftButton.addEventListener('touchstart', onLeftStart)
  leftButton.addEventListener('mouseout', onLeftStop)
  leftButton.addEventListener('touchend', onLeftStop)

  rightButton.addEventListener('mouseover', onRightStart)
  rightButton.addEventListener('touchstart', onRightStart)
  rightButton.addEventListener('mouseout', onRightStop)
  rightButton.addEventListener('touchend', onRightStop)

  window.addEventListener('keydown', (e) => {
    switch (e.which) {
      case 38:
      case 87:
        return onForwardStart()
      case 39:
      case 68:
        return onLeftStart()
      case 40:
      case 83:
        return onBackwardStart()
      case 37:
      case 65:
        return onRightStart()
    }
  })

  window.addEventListener('keyup', (e) => {
    switch (e.which) {
      case 38:
      case 87:
        return onForwardStop()
      case 39:
      case 68:
        return onLeftStop()
      case 40:
      case 83:
        return onBackwardStop()
      case 37:
      case 65:
        return onRightStop()
    }
  })

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
    getState: () => ({
      movingBackward,
      movingForward,
      turningLeft,
      turningRight,
    })
  }
})()
