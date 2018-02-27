import { isPlainObject } from '../utils/general'


export function assertKeyDoesNotExist(storeApi, key) {
  if (typeof storeApi[key] === 'undefined') return true

  throw new Error(
    'React Zedux Error - storeApi._bindControls() - '
    + `Duplicate key ${key} found.`
  )
}


export function attachActors(storeApi, actors, dispatch) {
  if (!isPlainObject(actors)) return

  // Bind each actor to the store
  Object.entries(actors).forEach(([key, actor]) => {
    assertKeyDoesNotExist(storeApi, key)

    // Allow for nested actor collections.
    if (typeof actor !== 'function') {
      const namespace = {}

      attachActors(namespace, actor, dispatch)

      return storeApi[key] = namespace
    }

    const boundActor = (...args) => dispatch(actor(...args))
    boundActor.type = actor.type
    boundActor.toString = actor.toString()

    storeApi[key] = boundActor
  })
}


export function attachSelectors(storeApi, selectors, getState) {
  if (!isPlainObject(selectors)) return

  // Bind each selector to the store
  Object.entries(selectors).forEach(([key, selector]) => {
    assertKeyDoesNotExist(storeApi, key)

    // Allow for nested selector collections.
    if (typeof selector !== 'function') {
      const namespace = {}

      attachSelectors(namespace, selector, getState)

      return storeApi[key] = namespace
    }

    storeApi[key] = (...args) => selector(getState(), ...args)
  })
}


export function flattenStore(storeApi, store) {
  for (let key in store) {
    assertKeyDoesNotExist(storeApi, key)

    storeApi[key] = store[key]
  }
}