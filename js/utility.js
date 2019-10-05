function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function inventItem(id, definition) {
  return Object.setPrototypeOf({
    ...definition,
    id,
  }, itemBase)
}

function spawnItem({index, ...options}) {
  index = index || Math.floor(Math.random() * items.length)
  const type = items[index]
  return Object.create(type).spawn(options)
}
