import { createStore } from 'zedux'

import { StoreApi } from '../../src/index'
import {
  assertApiIsValid,
  assertIsPlainObject,
  getDisplayName,
  getProvidedValue,
  isObservable,
  isPlainObject,
  isStoreApi,
  resolveProps,
  wrapStore
} from '../../src/utils/general'
import { nonPlainObjects, plainObjects } from '../utils'


describe('assertApiIsValid()', () => {

  test('returns true if thing.store is an observable', () => {

    expect(
      assertApiIsValid({ store: { subscribe() { } } })
    ).toBe(true)

    expect(
      assertApiIsValid({ store: createStore() })
    ).toBe(true)

  })


  test('throws an error containing the store api constructor\'s name if thing.store is not an observable', () => {

    class TestApi extends StoreApi { }
    const apiInstance = new TestApi()

    expect(
      assertApiIsValid.bind(null, apiInstance)
    ).toThrowError(/new TestApi/)

  })

})


describe('assertIsPlainObject()', () => {

  test('returns true if thing is a plain object', () => {

    plainObjects.forEach(
      plainObject => expect(assertIsPlainObject(plainObject)).toBe(true)
    )

  })


  test('throws an error if thing is not a plain object', () => {

    nonPlainObjects.forEach(
      nonPlainObject => expect(
        assertIsPlainObject.bind(null, nonPlainObject, 'test context')
      ).toThrowError(/test context/)
    )

  })

})


describe('getDisplayName()', () => {

  test('returns the displayName of a component', () => {

    const Component = () => 'a'
    Component.displayName = 'A'

    expect(getDisplayName(Component)).toBe('A')

  })


  test('returns the name of a component if no displayName is present', () => {

    const Component = () => 'a'

    expect(getDisplayName(Component)).toBe('Component')

  })


  test('returns "Unknown" if the component has no displayName and is anonymous (has no name)', () => {

    expect(getDisplayName(() => 'a')).toBe('Unknown')

  })

})


describe('getProvidedValue()', () => {

  test('returns thing if thing is not a class that extends StoreApi', () => {

    const Api = {}

    expect(getProvidedValue(Api)).toBe(Api)

  })


  test('returns an instance of thing with actors and selectors bound if thing extends StoreApi', () => {

    const store = createStore()
      .hydrate(1)

    class Api extends StoreApi {
      static actors = {
        a: () => () => 'a',
        b: {
          c: () => () => 'c'
        }
      }

      static selectors = {
        d: state => state
      }

      store = store
    }

    const api = getProvidedValue(Api)

    api.a()

    expect(store.getState()).toBe('a')
    expect(api.d()).toBe('a')
    
    api.b.c()

    expect(store.getState()).toBe('c')
    expect(api.d()).toBe('c')

  })

})


describe('isObservable()', () => {

  test('returns falsy if thing is not an observable', () => {

    expect(isObservable('a')).toBe(false)
    expect(isObservable(1)).toBe(false)
    expect(isObservable([])).toBe(false)
    expect(isObservable(null)).toBe(null)
    expect(isObservable({})).toBe(false)

  })


  test('returns true if thing is an observable', () => {

    expect(isObservable({ subscribe() {} })).toBe(true)
    expect(isObservable(createStore())).toBe(true)

  })

})


describe('isPlainObject()', () => {

  test('returns true if the given variable is a plain object', () => {

    plainObjects.forEach(
      plainObject => expect(isPlainObject(plainObject)).toBe(true)
    )

  })


  test('returns false if the given variable is not a plain object', () => {

    nonPlainObjects.forEach(
      nonPlainObject => expect(isPlainObject(nonPlainObject)).toBe(false)
    )

  })

})


describe('isStoreApi()', () => {

  test('returns falsy if thing does not extend StoreApi', () => {

    expect(isStoreApi('a')).toBe(false)
    expect(isStoreApi(1)).toBe(false)
    expect(isStoreApi([])).toBe(false)
    expect(isStoreApi(null)).toBe(null)
    expect(isStoreApi({})).toBe(false)
    expect(isStoreApi(class {})).toBe(false)

  })


  test('returns tru if thing extends StoreApi', () => {

    expect(isStoreApi(class extends StoreApi {})).toBe(true)

  })

})


describe('resolveProps()', () => {

  test('returns store if mapper is falsy', () => {

    const mapper = null
    const store = {}

    expect(resolveProps(mapper, store)).toBe(store)

  })


  test('returns an object whose only property is the store set to the mapper key if mapper is a string', () => {

    const mapper = 'a'
    const store = {}

    expect(resolveProps(mapper, store)).toEqual({
      a: store
    })

  })


  test('returns an object with properties plucked from store if mapper is an array', () => {

    const mapper = [ 'a', 'b' ]
    const store = {
      a: 1,
      b: 2,
      c: 3
    }

    expect(resolveProps(mapper, store)).toEqual({
      a: 1,
      b: 2
    })

  })


  test('throws an error if mapper is a function and does not return an object', () => {

    const mapper = jest.fn(() => 'a')
    const store = {}

    expect(
      resolveProps.bind(null, mapper, store)
    ).toThrowError(TypeError)

  })


  test('returns the plain object returned by mapper if mapper is a function', () => {

    const obj = {}
    const mapper = jest.fn(() => obj)
    const store = {}

    expect(resolveProps(mapper, store)).toBe(obj)

  })


  test('throws a TypeError if mapper is invalid', () => {

    [1, {}].forEach(
      thing => expect(
        resolveProps.bind(null, thing, {}, 'method name')
      ).toThrowError(/method name/)
    )

  })

})


describe('wrapStore()', () => {
  
  test('returns an object whose prototype is set to the store and contains a single, enumerable "state" property set to state', () => {

    const store = {}
    const state = {}
    const wrappedStore = wrapStore(store, state)

    expect(wrappedStore).toEqual({
      state
    })

    expect(Object.getPrototypeOf(wrappedStore)).toBe(store)

  })

})
