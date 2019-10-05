const audio = (function IIFE() {

  const context = new AudioContext()

  return {
    activate: () => {
      context.resume()
      return this
    },
    context: () => context,
  }
})()
