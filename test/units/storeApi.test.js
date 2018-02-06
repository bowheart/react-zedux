import { addActors, addHooks, addSelectors } from '../../src/utils/storeApi'


describe('addActors()', () => {

  test('does nothing if a non-object is passed', () => {

    const storeApi = {}
    const actors = []
    actors.a = () => {}

    addActors(storeApi, actors)

    expect(Object.keys(storeApi)).toHaveLength(0)

  })


  test('throws an error if an actor\'s key exists in the storeApi', () => {

    const storeApi = {
      a: 1
    }
    const actors = {
      a: 2
    }

    expect(
      addActors.bind(null, storeApi, actors)
    ).toThrowError(/duplicate key/i)

  })


  test('creates a new function with the same `type` and `toString()` properties as the original actor', () => {

    const storeApi = {}
    const actor = () => {}

    actor.type = 'a'
    actor.toString = () => actor.type

    const actors = { actor }

    addActors(storeApi, actors, () => {})

    expect(storeApi.actor).not.toBe(actor)
    expect(storeApi.actor.type).toBe(actor.type)
    expect(storeApi.actor.toString).toBe(actor.toString())

  })


  test('wraps the actor in a call to dispatch()', () => {

    const storeApi = {}
    const actor = jest.fn(() => 'a')
    const dispatch = jest.fn()

    const actors = { actor }

    addActors(storeApi, actors, dispatch)

    storeApi.actor('b')

    expect(actor).toHaveBeenCalledWith('b')
    expect(dispatch).toHaveBeenCalledWith('a')

  })


  test('allows for nested actor collections', () => {

    const storeApi = {}
    const actor = () => {}

    const actors = { nested: { actor } }

    addActors(storeApi, actors, () => {})

    expect(typeof storeApi.nested).toBe('object')
    expect(typeof storeApi.nested.actor).toBe('function')

  })

})


describe('addHooks()', () => {

  test('does nothing if a non-object is passed', () => {

    const storeApi = {}
    const hooks = []
    hooks.a = () => {}

    addHooks(storeApi, hooks)

    expect(Object.keys(storeApi)).toHaveLength(0)

  })


  test('throws an error if a hook\'s key exists in the storeApi', () => {

    const storeApi = {
      a: 1
    }
    const hooks = {
      a: 2
    }

    expect(
      addHooks.bind(null, storeApi, hooks)
    ).toThrowError(/duplicate key/i)

  })


  test('throws an error if the hook does not return a function', () => {

    const storeApi = {}
    const hooks = {
      hook: () => {}
    }

    expect(
      addHooks.bind(null, storeApi, hooks)
    ).toThrowError(/hook did not return a function/i)

  })


  test('partially applies the hook, passing the storeApi', () => {

    const storeApi = {}
    const hookImplementation = jest.fn()
    const hook = jest.fn(() => hookImplementation)

    const hooks = { hook }

    addHooks(storeApi, hooks)

    expect(hook).toHaveBeenCalledWith(storeApi)

    storeApi.hook('b')

    expect(hookImplementation).toHaveBeenCalledWith('b')

  })


  test('allows for nested hook collections', () => {

    const storeApi = {}
    const hook = () => () => {}

    const hooks = { nested: { hook } }

    addHooks(storeApi, hooks)

    expect(typeof storeApi.nested).toBe('object')
    expect(typeof storeApi.nested.hook).toBe('function')

  })

})


describe('addSelectors()', () => {

  test('does nothing if a non-object is passed', () => {

    const storeApi = {}
    const selectors = []
    selectors.a = () => {}

    addSelectors(storeApi, selectors)

    expect(Object.keys(storeApi)).toHaveLength(0)

  })


  test('throws an error if a selector\'s key exists in the storeApi', () => {

    const storeApi = {
      a: 1
    }
    const selectors = {
      a: 2
    }

    expect(
      addSelectors.bind(null, storeApi, selectors)
    ).toThrowError(/duplicate key/i)

  })


  test('calls getState(), passing the result and any other args to the selector', () => {

    const storeApi = {}
    const selector = jest.fn()
    const getState = jest.fn(() => 'a')

    const selectors = { selector }

    addSelectors(storeApi, selectors, getState)

    storeApi.selector('b')

    expect(selector).toHaveBeenCalledWith('a', 'b')
    expect(getState).toHaveBeenCalled()

  })


  test('allows for nested selector collections', () => {

    const storeApi = {}
    const selector = () => {}

    const selectors = { nested: { selector } }

    addSelectors(storeApi, selectors, () => {})

    expect(typeof storeApi.nested).toBe('object')
    expect(typeof storeApi.nested.selector).toBe('function')

  })

})
