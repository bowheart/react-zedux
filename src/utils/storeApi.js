import { compose } from 'zedux'

import { isPlainObject } from './general'


const errorHeader = 'React Zedux Error - createStoreApi() - '


export function addActors(storeApi, actors, dispatch) {
  if (!isPlainObject(actors)) return

  // Bind each actor to the store
  Object.entries(actors).forEach(([ key, actor ]) => {
    assertKeyDoesNotExist(storeApi, key)

    // Allow for nested actor collections.
    if (typeof actor !== 'function') {
      const namespace = {}

      addActors(namespace, actor, dispatch)

      return storeApi[key] = namespace
    }

    const boundActor = compose(dispatch, actor)
    boundActor.type = actor.type
    boundActor.toString = actor.toString()

    storeApi[key] = boundActor
  })
}


export function addHooks(storeApi, hooks) {
  if (!isPlainObject(hooks)) return

  Object.entries(hooks).forEach(([ key, hook ]) => {
    assertKeyDoesNotExist(storeApi, key)

    // Allow for nested hook collections.
    if (typeof hook !== 'function') {
      const namespace = {}

      addHooks(namespace, hook)

      return storeApi[key] = namespace
    }

    // Partially apply the curried hooks with the storeApi
    // It'll be fully mutated before any inner functions are called.
    const appliedHook = hook(storeApi)

    assertIsFunction(appliedHook)

    storeApi[key] = appliedHook
  })
}


export function addSelectors(storeApi, selectors, getState) {
  if (!isPlainObject(selectors)) return

  // Bind each selector to the store
  Object.entries(selectors).forEach(([ key, selector ]) => {
    assertKeyDoesNotExist(storeApi, key)

    // Allow for nested selector collections.
    if (typeof selector !== 'function') {
      const namespace = {}

      addSelectors(namespace, selector, getState)

      return storeApi[key] = namespace
    }

    storeApi[key] = (...args) => selector(getState(), ...args)
  })
}


function assertIsFunction(thing) {
  if (typeof thing === 'function') return true

  throw new TypeError(
    errorHeader
    + 'Hooks must be curried functions (hook = storeApi => () => {}). '
    + 'Given hook did not return a function.'
  )
}


function assertKeyDoesNotExist(storeApi, key) {
  if (!storeApi[key]) return true

  throw new Error(
    errorHeader
    + `Duplicate key ${key} found.`
  )
}
