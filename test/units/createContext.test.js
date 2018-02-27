import { createStore } from 'zedux'
import { createContext, StoreApi } from '../../src/index'


describe('createContext()', () => {

  test('throws an error if passed a non-component/store/api', () => {

    expect(createContext.bind(null, 1)).toThrowError(TypeError)
    expect(createContext.bind(null, 'a')).toThrowError(TypeError)
    expect(createContext.bind(null, null)).toThrowError(TypeError)

  })


  test('accepts a Zedux store', () => {

    const store = createStore()
    const Context = createContext(store)
    const provider = new Context.Provider({})

    expect(provider.value).toBe(store)

  })


  test('accepts a StoreApi constructor', () => {

    const store = {
      subscribe() {}
    }
    class Api extends StoreApi {
      store = store
    }
    const Context = createContext(Api)
    const provider = new Context.Provider({})

    expect(provider.value.store).toBe(store)

  })


  test('accepts any observable', () => {

    const observable = {
      subscribe() {}
    }
    const Context = createContext(observable)
    const provider = new Context.Provider({})

    expect(provider.value).toBe(observable)

  })

})