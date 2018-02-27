import React from 'react'
import TestRenderer from 'react-test-renderer'
import { createStore as createReduxStore } from 'redux'
import { Observable } from 'rxjs'
import { createStore as createZeduxStore } from 'zedux'

import { createContext } from '../../src/index'


describe('observables', () => {

  test('consumes an RxJS observable', done => {

    const interval$ = Observable.interval(100)
    const Context = createContext(interval$)
    const values = []

    const wrapper = TestRenderer.create(
      <Context.Injector>
        {({ state }) => {
          values.push(state)

          if (state === 5) finish()
        }}
      </Context.Injector>
    )

    const finish = () => {
      wrapper.unmount()

      expect(values).toEqual([ undefined, 0, 1, 2, 3, 4, 5 ])

      done()
    }

  })


  test('consumes a Redux store', () => {

    const reducer = (state = 0, action) => action.state || state
    const store = createReduxStore(reducer)
    const Context = createContext(store)
    const renderProp = jest.fn()

    const wrapper = TestRenderer.create(
      <Context.Injector>
        {renderProp}
      </Context.Injector>
    )

    expect(renderProp).toHaveBeenLastCalledWith({
      state: 0
    })

    store.dispatch({ type: 'a', state: 1 })

    expect(renderProp).toHaveBeenLastCalledWith({
      state: 1
    })

    wrapper.unmount()

  })


  test('consumes a Redux store as observable', () => {

    const reducer = (state = 0, action) => action.state || state
    const store = createReduxStore(reducer)
    const state$ = Observable.from(store)
    const Context = createContext(state$)
    const renderProp = jest.fn()

    const wrapper = TestRenderer.create(
      <Context.Injector>
        {renderProp}
      </Context.Injector>
    )

    expect(renderProp).toHaveBeenLastCalledWith({
      state: 0
    })

    store.dispatch({ type: 'a', state: 1 })

    expect(renderProp).toHaveBeenLastCalledWith({
      state: 1
    })

    wrapper.unmount()

  })


  test('consumes a Zedux store', () => {

    const reducer = (state = 0, action) => action.state || state
    const store = createZeduxStore().use(reducer)
    const Context = createContext(store)
    const renderProp = jest.fn()

    const wrapper = TestRenderer.create(
      <Context.Injector>
        {renderProp}
      </Context.Injector>
    )

    expect(renderProp).toHaveBeenLastCalledWith({
      state: 0
    })

    store.dispatch({ type: 'a', state: 1 })

    expect(renderProp).toHaveBeenLastCalledWith({
      state: 1
    })

    wrapper.unmount()

  })


  test('consumes a Zedux store as observable', () => {

    const reducer = (state = 0, action) => action.state || state
    const store = createZeduxStore().use(reducer)

    // Zedux does not yet support conform to the observable spec.
    // Polyfill this for now.
    store[Symbol.observable] = () => ({
      subscribe(observer) {
        observer.next(store.getState())

        return store.subscribe(observer.next.bind(observer))
      }
    })

    const state$ = Observable.from(store)
    const Context = createContext(state$)
    const renderProp = jest.fn()

    const wrapper = TestRenderer.create(
      <Context.Injector>
        {renderProp}
      </Context.Injector>
    )

    expect(renderProp).toHaveBeenLastCalledWith({
      state: 0
    })

    store.dispatch({ type: 'a', state: 1 })

    expect(renderProp).toHaveBeenLastCalledWith({
      state: 1
    })

    wrapper.unmount()

  })

})