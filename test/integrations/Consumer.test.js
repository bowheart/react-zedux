import React from 'react'
import TestRenderer from 'react-test-renderer'
import { render } from 'enzyme'
import { createStore } from 'zedux'

import { StoreApi, createContext } from '../../src/index'


describe('Consumer', () => {
  
  test('throws an error if the coupled <Provider> does not exist up the hierarchy', () => {

    const Context = createContext(createStore())

    expect(
      render.bind(null, <Context.Consumer>{() => {}}</Context.Consumer>)
    ).toThrowError(ReferenceError)

  })


  test('receives the provided value', () => {

    const store = createStore().hydrate('a')
    const Context = createContext(store)
    const renderProp = jest.fn(({ state }) => state)

    const wrapper = TestRenderer.create(
      <Context.Provider>
        <Context.Consumer>
          {renderProp}
        </Context.Consumer>
      </Context.Provider>
    )

    wrapper.unmount()

    expect(renderProp).toHaveBeenCalledWith({
      state: 'a'
    })

  })


  test('receives updates from the store', () => {

    const store = createStore().hydrate('a')
    const Context = createContext(store)
    const renderProp = jest.fn(({ state }) => state)

    const wrapper = TestRenderer.create(
      <Context.Provider>
        <Context.Consumer>
          {renderProp}
        </Context.Consumer>
      </Context.Provider>
    )

    expect(renderProp).toHaveBeenLastCalledWith({
      state: 'a'
    })

    store.setState('b')

    wrapper.unmount()

    expect(renderProp).toHaveBeenCalledTimes(2)
    expect(renderProp).toHaveBeenLastCalledWith({
      state: 'b'
    })

  })


  test('nested consumers all receive the store', () => {

    const store = createStore().hydrate('a')
    const Context = createContext(store)
    const renderProp1 = jest.fn(() => (
      <div>
        <Context.Consumer>
          {renderProp2}
        </Context.Consumer>
      </div>
    ))
    const renderProp2 = jest.fn()

    const wrapper = TestRenderer.create(
      <Context.Provider>
        <Context.Consumer>
          {renderProp1}
        </Context.Consumer>
      </Context.Provider>
    )

    expect(renderProp1).toHaveBeenLastCalledWith({
      state: 'a'
    })

    expect(renderProp2).toHaveBeenLastCalledWith({
      state: 'a'
    })

    store.setState('b')

    wrapper.unmount()

    expect(renderProp1).toHaveBeenLastCalledWith({
      state: 'b'
    })

    expect(renderProp2).toHaveBeenLastCalledWith({
      state: 'b'
    })

  })


  test('nested providers provide the same global store', () => {

    const store = createStore().hydrate('a')
    const Context = createContext(store)
    const renderProp1 = jest.fn(() => (
      <div>
        <Context.Provider>
          <Context.Consumer>
            {renderProp2}
          </Context.Consumer>
        </Context.Provider>
      </div>
    ))
    const renderProp2 = jest.fn()

    const wrapper = TestRenderer.create(
      <Context.Provider>
        <Context.Consumer>
          {renderProp1}
        </Context.Consumer>
      </Context.Provider>
    )

    expect(renderProp1).toHaveBeenLastCalledWith({
      state: 'a'
    })

    expect(renderProp2).toHaveBeenLastCalledWith({
      state: 'a'
    })

    store.setState('b')

    wrapper.unmount()

    expect(renderProp1).toHaveBeenLastCalledWith({
      state: 'b'
    })

    expect(renderProp2).toHaveBeenLastCalledWith({
      state: 'b'
    })

  })


  test('nested providers provide new instances of fractal stores', done => {

    let counter = 0

    class TestApi extends StoreApi {
      store = createStore().hydrate(counter++)
    }

    const Context = createContext(TestApi)
    const renderProp1 = jest.fn(() => (
      <div>
        <Context.Provider
          onMount={store => {
            store.setState(counter++)
          }}
        >
          <Context.Consumer>
            {renderProp2}
          </Context.Consumer>
        </Context.Provider>
      </div>
    ))
    const renderProp2 = jest.fn(({ state }) => {
      if (state === 2) finish()
    })

    const wrapper = TestRenderer.create(
      <Context.Provider>
        <Context.Consumer>
          {renderProp1}
        </Context.Consumer>
      </Context.Provider>
    )

    expect(renderProp1).toHaveBeenLastCalledWith({
      state: 0
    })

    expect(renderProp2).toHaveBeenCalledWith({
      state: 1
    })

    function finish() {
      expect(renderProp2).toHaveBeenLastCalledWith({
        state: 2
      })

      done()
    }

    wrapper.unmount()

  })

})


describe('consume()', () => {

  test('the wrapped component receives the provided value', () => {

    const store = createStore().hydrate('a')
    const Context = createContext(store)
    const Component = jest.fn(() => 'a')
    const WrappedComponent = Context.consume('b')(Component)

    const wrapper = TestRenderer.create(
      <Context.Provider>
        <WrappedComponent />
      </Context.Provider>
    )

    wrapper.unmount()

    expect(Component).toHaveBeenCalledWith({
      b: {
        state: 'a'
      }
    }, {})

  })

})