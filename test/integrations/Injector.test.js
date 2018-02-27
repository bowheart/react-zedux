import React from 'react'
import TestRenderer from 'react-test-renderer'
import { createStore } from 'zedux'

import { createContext } from '../../src/index'


describe('Injector', () => {

  test('provides and consumes the value', () => {

    const store = createStore().hydrate('a')
    const Context = createContext(store)
    const renderProp = jest.fn(({ state }) => state)

    const wrapper = TestRenderer.create(
      <Context.Injector>
        {renderProp}
      </Context.Injector>
    )

    wrapper.unmount()

    expect(renderProp).toHaveBeenCalledWith({
      state: 'a'
    })

  })


  test('provides and receives updates from the store', () => {

    const store = createStore().hydrate('a')
    const Context = createContext(store)
    const renderProp = jest.fn(({ state }) => state)

    const wrapper = TestRenderer.create(
      <Context.Injector>
        {renderProp}
      </Context.Injector>
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

})


describe('inject()', () => {

  test('the wrapped component provides and consumes the value', () => {

    const store = createStore().hydrate('a')
    const Context = createContext(store)
    const Component = jest.fn(() => 'a')
    const WrappedComponent = Context.inject('b')(Component)

    const wrapper = TestRenderer.create(
      <WrappedComponent />
    )

    wrapper.unmount()

    expect(Component).toHaveBeenCalledWith({
      b: {
        state: 'a'
      }
    }, {})

  })

})