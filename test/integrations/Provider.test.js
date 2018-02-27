import React from 'react'
import TestRenderer from 'react-test-renderer'
import { createStore } from 'zedux'

import { createContext } from '../../src/index'


describe('Provider', () => {

  test('subscribes to and unsubscribes from the store', () => {

    const subscription = {
      unsubscribe: jest.fn()
    }
    const store = {
      subscribe: jest.fn(() => subscription)
    }
    const Context = createContext(store)

    const wrapper = TestRenderer.create(
      <Context.Provider />
    )

    wrapper.unmount()
    
    expect(store.subscribe).toHaveBeenCalledTimes(1)
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)

  })


  test('calls onMount() prop in componentDidMount', () => {

    const store = createStore()
      .hydrate('a')

    const Context = createContext(store)
    const onMount = jest.fn()

    const wrapper = TestRenderer.create(
      <Context.Provider onMount={onMount} />
    )

    wrapper.unmount()

    expect(onMount).toHaveBeenCalledWith(
      { state: 'a' },
    )

  })


  test('calls onUnmount() prop in componentDidMount', () => {

    const store = createStore()
      .hydrate('a')

    const Context = createContext(store)
    const onUnmount = jest.fn()

    const wrapper = TestRenderer.create(
      <Context.Provider onUnmount={onUnmount} />
    )

    wrapper.unmount()

    expect(onUnmount).toHaveBeenCalledWith(
      { state: 'a' }
    )

  })

})


describe('provide()', () => {

  test('the wrapped component provides the value', () => {

    const store = createStore().hydrate('a')
    const Context = createContext(store)
    const Component = jest.fn(props => props.children)
    const WrappedComponent = Context.provide(Component)
    const renderProp = jest.fn(() => 'c')

    const wrapper = TestRenderer.create(
      <WrappedComponent>
        <Context.Consumer>
          {renderProp}
        </Context.Consumer>
      </WrappedComponent>
    )

    wrapper.unmount()

    expect(renderProp).toHaveBeenCalledWith({
      state: 'a'
    })

  })

})