import {
  assertKeyDoesNotExist,
  attachActors,
  attachSelectors
} from '../../src/utils/storeApi'
import { nonPlainObjects } from '../utils'


describe('assertKeyDoesNotExist()', () => {

  test('returns true if key does not exist in storeApi', () => {

    const storeApi = {}
    const key = 'a'

    expect(assertKeyDoesNotExist(storeApi, key)).toBe(true)

  })


  test('throws an Error if key exists in storeApi', () => {

    const storeApi = {
      a: null
    }
    const key = 'a'

    expect(
      assertKeyDoesNotExist.bind(null, storeApi, key)
    ).toThrowError(/duplicate key/i)

  })

})


describe('attachActors()', () => {

  test('does nothing if actors is not a plain object', () => {

    nonPlainObjects.forEach(
      nonPlainObject => expect(
        attachActors(null, nonPlainObject)
      ).toBeUndefined()
    )

  })


  test('binds an actor to the store and attaches it to the storeApi', () => {

    const storeApi = {}
    const actors = {
      a: jest.fn(() => 'a')
    }
    const dispatch = jest.fn()

    attachActors(storeApi, actors, dispatch)

    expect(storeApi).toEqual({
      a: expect.any(Function)
    })

    storeApi.a(1)

    expect(actors.a).toHaveBeenCalledWith(1)
    expect(dispatch).toHaveBeenCalledWith('a')

  })


  test('binds a nested actor to the store and atteches it to the storeApi preserving nesting', () => {

    const storeApi = {}
    const actors = {
      a: {
        b: jest.fn(() => 'b')
      }
    }
    const dispatch = jest.fn()

    attachActors(storeApi, actors, dispatch)

    expect(storeApi).toEqual({
      a: {
        b: expect.any(Function)
      }
    })

    storeApi.a.b(1)

    expect(actors.a.b).toHaveBeenCalledWith(1)
    expect(dispatch).toHaveBeenCalledWith('b')

  })

})


describe('attachSelectors()', () => {

  test('does nothing if selectors is not a plain object', () => {

    nonPlainObjects.forEach(
      nonPlainObject => expect(
        attachSelectors(null, nonPlainObject)
      ).toBeUndefined()
    )

  })


  test('binds a selector to the store and attaches it to the storeApi', () => {

    const storeApi = {}
    const selectors = {
      a: jest.fn(() => 'a')
    }
    const getState = jest.fn(() => 'b')

    attachSelectors(storeApi, selectors, getState)

    expect(storeApi).toEqual({
      a: expect.any(Function)
    })

    expect(storeApi.a(1)).toBe('a')
    expect(selectors.a).toHaveBeenCalledWith('b', 1)
    expect(getState).toHaveBeenCalledTimes(1)

  })


  test('binds a nested selector to the store and atteches it to the storeApi preserving nesting', () => {

    const storeApi = {}
    const selectors = {
      a: {
        b: jest.fn(() => 'b')
      }
    }
    const getState = jest.fn(() => 'c')

    attachSelectors(storeApi, selectors, getState)

    expect(storeApi).toEqual({
      a: {
        b: expect.any(Function)
      }
    })

    expect(storeApi.a.b(1)).toBe('b')
    expect(selectors.a.b).toHaveBeenCalledWith('c', 1)
    expect(getState).toHaveBeenCalledTimes(1)

  })

})