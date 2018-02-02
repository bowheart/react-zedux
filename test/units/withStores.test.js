import React from 'react'
import { mount, render } from 'enzyme'

import { createStore, withStores } from '../../src/index'
import { storesContextName } from '../../src/utils/constants'


describe('withStores()', () => {

  test('throws an error if propsToStoreIdsMap is not an object', () => {

    const nonObjects = [ 'a', '', 0, 1, true, false ]

    nonObjects.forEach(nonObject =>
      expect(
        withStores(nonObject)
      ).toThrowError(/must be an object with at least one entry/i)
    )

  })


  test('throws an error if propsToStoreIdsMap has no entries', () => {

    const invalidMaps = [ {}, new Map().set('a', 1) ]

    invalidMaps.forEach(invalidMap =>
      expect(
        withStores(invalidMap)
      ).toThrowError(/must be an object with at least one entry/i)
    )

  })


  test('throws an error if WrappedComponent is not a React component', () => {

    expect(
      withStores({ a: 1 })
    ).toThrowError(/must be a react component/i)

    expect(
      withStores({ a: 1 }).bind(null, 'a')
    ).toThrowError(/must be a react component/i)

  })


  test('returns a component whose displayName contains the name of the WrappedComponent', () => {

    const WrappedComponent = () => 'a'
    const Component = withStores({ a: 1 })(WrappedComponent)

    expect(typeof Component).toBe('function')
    expect(typeof Component.prototype.render).toBe('function')
    expect(Component.displayName).toBe('WithStores(WrappedComponent)')

  })


  test('logs an error if no parent provides the special stores context property', () => {

    /* eslint-disable no-console */

    const spy = jest.fn()
    const oldConsoleError = console.error
    console.error = spy

    const WrappedComponent = () => 'a'
    const Component = withStores({ a: 1 })(WrappedComponent)

    render(<Component />)

    expect(spy).toHaveBeenCalled()

    console.error = oldConsoleError

    /* eslint-enable no-console */

  })


  test('throws an error if the given store id does not match any provided stores', () => {

    /* eslint-disable no-console */

    const spy = jest.fn()
    const oldConsoleError = console.error
    console.error = spy

    const WrappedComponent = jest.fn(() => 'a')
    const Component = withStores({ a: 1 })(WrappedComponent)

    const store = {}
    const context = { [storesContextName]: new Map().set(2, store) }

    expect(mount.bind(
      null,
      <Component />,
      { context }
    )).toThrowError(ReferenceError)

    expect(spy).toHaveBeenCalled()

    console.error = oldConsoleError

    /* eslint-enable no-console */

  })


  test('pulls a store off the provided context', () => {

    const WrappedComponent = jest.fn(() => 'a')
    const Component = withStores({ a: 1 })(WrappedComponent)

    const store = {
      getState: () => 2,
      subscribe: () => {
        return {
          unsubscribe: () => {}
        }
      }
    }

    const context = { [storesContextName]: new Map().set(1, store) }

    const wrapper = mount(
      <Component />,
      { context }
    )

    wrapper.unmount()

    expect(WrappedComponent).toHaveBeenCalledWith(
      { a: { state: 2 } },
      {}
    )

  })


  test('informs the WrappedComponent of state updates', () => {

    const WrappedComponent = jest.fn(() => 'a')
    const Component = withStores({ a: 1 })(WrappedComponent)

    const store = createStore()
      .hydrate(2)

    const context = { [storesContextName]: new Map().set(1, store) }

    const wrapper = mount(
      <Component />,
      { context }
    )

    expect(WrappedComponent).toHaveBeenLastCalledWith({ a: { state: 2 } }, {})

    store.setState(3)

    wrapper.unmount()

    expect(WrappedComponent).toHaveBeenLastCalledWith({ a: { state: 3 } }, {})
    expect(WrappedComponent).toHaveBeenCalledTimes(2)

  })


  test('passes props on to the WrappedComponent', () => {

    const WrappedComponent = jest.fn(() => 'a')
    const Component = withStores({ a: 1 })(WrappedComponent)

    const store = createStore()
      .hydrate(2)

    const context = { [storesContextName]: new Map().set(1, store) }

    const wrapper = mount(
      <Component b={3} c={4} />,
      { context }
    )

    wrapper.unmount()

    expect(WrappedComponent).toHaveBeenCalledWith(
      {
        a: {
          state: 2
        },
        b: 3,
        c: 4
      },
      {}
    )

  })

})
