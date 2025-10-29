/**
 * Sets up a proxy object that can be used to listen to changes on a given object.
 * @param {Object} fromState
 * @returns Proxy object with onChange method
 */
export function getProxyState(fromState) {
  const callbacks = new Map()

  const handler = {
    set(obj, propName, value) {
      const previousValue = obj[propName]
      obj[propName] = value
      for (const callback of callbacks.get(propName) || []) callback(value, previousValue)
      return true
    },
  }

  const target = {
    onChange: (propName, callback) => {
      if (!callbacks.has(propName)) callbacks.set(propName, [])
      callbacks.get(propName).push(callback)

      return () => {
        const arr = callbacks.get(propName)
        const index = arr.indexOf(callback)
        arr.splice(index, 1)
        if (arr.length === 0) callbacks.delete(propName)
      }
    },
    ...fromState,
  }

  return new Proxy(target, handler)
}
