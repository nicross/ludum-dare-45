const audio = (function IIFE() {

  const context = new AudioContext()

  return {
    activate: () => {
      context.resume()
      return this
    },
    connect: (node, channel = 0) => {
      if (node instanceof AudioNode) {
        node.connect(context, channel)
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
