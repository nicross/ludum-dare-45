const audio = (function IIFE() {

  const context = new AudioContext()

  return {
    connect: (node) => {
      if (node instanceof AudioNode) {
        node.connect(context)
      }

      return this
    },
    disconnect: (node) => {
      if (node instanceof AudioNode) {
        node.disconnect(context)
      }

      return this
    },
  }
})()
