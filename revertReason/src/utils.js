function findByKey (object, key, visitedObjects = []) {
  if (visitedObjects.includes(object)) {
    return null
  }

  visitedObjects.push(object)

  for (const [objectKey, value] of Object.entries(object)) {
    if (key === objectKey) {
      return value
    }

    if (typeof value === 'object' && value !== undefined && value !== null) {
      const objectValue = findByKey(value, key, visitedObjects)

      if (objectValue !== null) {
        return objectValue
      }
    }
  }

  return null
}

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

module.exports = {
  findByKey,
  getCircularReplacer
}
