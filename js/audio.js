'use strict'

const audio = (function IIFE() {
  const context = new AudioContext()

  const noiseBufferSize = 4 * context.sampleRate
  const noiseBuffer = context.createBuffer(1, noiseBufferSize, context.sampleRate)
  const noiseBufferData = noiseBuffer.getChannelData(0)

  for (let i = 0; i < noiseBufferSize; i += 1) {
    noiseBufferData[i] = (2 * Math.random()) - 1
  }

  return {
    activate: function () {
      context.resume()
      return this
    },
    context: () => context,
    noiseBuffer: () => noiseBuffer,
    sampleRate: () => context.sampleRate,
    time: (delta = 0) => context.currentTime + delta,
  }
})()
