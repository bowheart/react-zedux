import { StoreApi } from '../api/StoreApi'


export function assertApiIsValid(api) {
  if (isObservable(api.store)) return true

  const constructorName = api.constructor.name

  throw new TypeError(
    `React Zedux Error - new ${constructorName}() - `
    + 'instantiated api must have a visible "store" property '
    + 'whose value is an observable (e.g. a Zedux store).'
  )
}


export function assertIsPlainObject(thing, context) {
  if (isPlainObject(thing)) return true

  throw new TypeError(
    `React Zedux Error - ${context} - `
    + 'Expected a plain object.'
  )
}


/**
  Retrieve the displayName of a component

  Returns 'Unknown' if no displayName is found
*/
export const getDisplayName = Component =>
  Component.displayName
    || Component.name
    || 'Unknown'


export function getProvidedValue(Api) {
  if (!isStoreApi(Api)) return Api

  const api = new Api()

  assertApiIsValid(api)

  return api._bindControls(Api)
}


export function isObservable(thing) {
  return thing && typeof thing.subscribe === 'function'
}


/**
  Checks whether thing is a plain old object.

  The object may originate from another realm or have its prototype
  explicitly set to Object.prototype, but it may not have a null
  prototype or prototype chain more than 1 layer deep.
*/
export function isPlainObject(thing) {
  if (typeof thing !== 'object' || !thing) return false

  let prototype = Object.getPrototypeOf(thing)
  if (!prototype) return false // it was created with Object.create(null)

  // If the prototype chain is exactly 1 layer deep, it's a normal object
  return Object.getPrototypeOf(prototype) === null
}


export function isStoreApi(Thing) {
  return Thing && Thing.prototype instanceof StoreApi
}


export function resolveProps(mapper, store, method) {
  if (!mapper) return store

  if (typeof mapper === 'string') return { [mapper]: store }

  if (Array.isArray(mapper)) {
    const props = {}

    for (let key of mapper) props[key] = store[key]

    return props
  }

  if (typeof mapper === 'function') {
    const props = mapper(store)

    assertIsPlainObject(props, 'mapStoreToProps')

    return props
  }

  throw new TypeError(
    `React Zedux Error - Context.${method}() - `
    + 'invalid mapStoreToProps parameter. mapStoreToProps may be undefined, '
    + 'a string, an array, or a function that returns an object. '
    + `Received ${typeof mapper}.`
  )
}


export function wrapStore(store, state) {
  return Object.create(store, {
    state: { value: state, enumerable: true }
  })
}
