import { createStore, createStoreApi } from '../../src/index'


describe('createStoreApi()', () => {

  test('throws an error if no store is passed', () => {

    expect(createStoreApi).toThrowError(/a valid zedux store/i)

  })


  test('returns an object that extends the store', () => {

    const store = createStore()
    const api = createStoreApi(store)

    expect(Object.keys(api)).toHaveLength(0)
    expect(Object.getPrototypeOf(api)).toBe(store)

  })


  test('adds bound actors to the store', () => {

    const actor = jest.fn(() => ({ type: 'a' }))
    const store = createStore()

    const { dispatch } = store
    store.dispatch = jest.fn(dispatch)

    const api = createStoreApi(store, {
      actors: { actor }
    })

    api.actor('b')

    expect(actor).toHaveBeenCalledWith('b')
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'a'
    })

  })


  test('adds bound selectors to the store', () => {

    const selector = jest.fn(() => {})
    const store = createStore()
      .hydrate('a')

    const { getState } = store
    store.getState = jest.fn(getState)

    const api = createStoreApi(store, {
      selectors: { selector }
    })

    expect(store.getState).not.toHaveBeenCalled()

    api.selector('b')

    expect(selector).toHaveBeenCalledWith('a', 'b')
    expect(store.getState).toHaveBeenCalledTimes(1)

  })


  test('adds curried hooks to the store', () => {

    const hookImplementation = jest.fn()
    const hook = jest.fn(() => hookImplementation)
    const store = createStore()

    const api = createStoreApi(store, {
      hooks: { hook }
    })

    api.hook('a')

    expect(hook).toHaveBeenCalledWith(api)
    expect(hookImplementation).toHaveBeenCalledWith('a')

  })

})
