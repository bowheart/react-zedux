import React from 'react'
import TestRenderer from 'react-test-renderer'
import { compose, createStore } from 'zedux'

import { createContext } from '../../src/index'


describe('nested stores', () => {

  test('a component can be injected with multiple contexts', () => {

    const store1 = createStore()
      .hydrate(1)

    const store2 = createStore()
      .hydrate(2)

    const Context1 = createContext(store1)
    const Context2 = createContext(store2)

    const Component = jest.fn(() => 'c')
    const WrappedComponent = compose(
      Context1.inject('a'),
      Context2.inject('b')
    )(Component)

    const wrapper = TestRenderer.create(
      <WrappedComponent />
    )

    wrapper.unmount()

    expect(Component).toHaveBeenCalledWith({
      a: { state: 1 },
      b: { state: 2 }
    }, {})

  })


  test('a provided store can attach itself to a parent-provided store', () => {

    const parentStore = createStore()
    const ParentContext = createContext(parentStore)
    const childStore = createStore()
      .hydrate('a')

    const ChildContext = createContext(childStore)

    const wrapper = TestRenderer.create(
      <ParentContext.Injector>
        {providedParentStore => (
          <ChildContext.Injector
            onMount={childStoreApi => {
              providedParentStore.use({
                a: childStoreApi
              })
            }}
            onUnmount={() => {
              providedParentStore.use({ a: null })
            }}
          >
            {providedChildStore => providedChildStore.getState()}
          </ChildContext.Injector>
        )}
      </ParentContext.Injector>
    )

    expect(parentStore.getState()).toEqual({
      a: 'a'
    })

    wrapper.unmount()

    expect(parentStore.getState()).toEqual({})

  })

})