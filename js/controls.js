'use strict'

const controls = (function IIFE() {
  const backward = document.querySelector('.o-app--backward'),
    forward = document.querySelector('.o-app--forward'),
    left = document.querySelector('.o-app--left'),
    right = document.querySelector('.o-app--right')

  const controls = {
    arrowDown: false,
    arrowLeft: false,
    arrowRight: false,
    arrowUp: false,
    keyA: false,
    keyD: false,
    keyE: false,
    keyQ: false,
    keyS: false,
    keyW: false,
    uiBackward: false,
    uiForward: false,
    uiLeft: false,
    uiRight: false,
  }

  const keys = {
    37: 'arrowLeft',
    38: 'arrowUp',
    39: 'arrowRight',
    40: 'arrowDown',
    65: 'keyA',
    68: 'keyD',
    69: 'keyE',
    81: 'keyQ',
    83: 'keyS',
    87: 'keyW',
  }

  function onBackwardStart() {
    controls.uiBackward = true
  }

  function onBackwardStop() {
    controls.uiBackward = false
  }

  function onForwardStart() {
    controls.uiForward = true
  }

  function onForwardStop() {
    controls.uiForward = false
  }

  function onLeftStart() {
    controls.uiLeft = true
  }

  function onLeftStop() {
    controls.uiLeft = false
  }

  function onRightStart() {
    controls.uiRight = true
  }

  function onRightStop() {
    controls.uiRight = false
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
        if (e.which in keys) {
          controls[keys[e.which]] = true
        }
      })

      window.addEventListener('keyup', (e) => {
        if (e.which in keys) {
          controls[keys[e.which]] = false
        }
      })

      return this
    },
    get: () => ({
      moveBackward: controls.arrowDown || controls.keyS || controls.uiBackward,
      moveForward: controls.arrowUp || controls.keyW || controls.uiForward,
      moveLeft: controls.keyA,
      moveRight: controls.keyD,
      turnLeft: controls.arrowLeft || controls.keyQ || controls.uiLeft,
      turnRight: controls.arrowRight || controls.keyE || controls.uiRight,
    })
  }
})()
