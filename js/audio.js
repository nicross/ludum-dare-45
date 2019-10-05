const audio = (function IIFE() {
  const context = new AudioContext()

  return {
    activate: function () {
      context.resume()
      return this
    },
    context: () => context,
  }
})()
