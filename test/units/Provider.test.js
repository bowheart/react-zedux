import React from 'react'
import { mount, render, shallow } from 'enzyme'

import { contextifyComponent } from '../utils'
import { Provider } from '../../src/index'
import { storesContextName } from '../../src/utils/constants'


describe('<Provider />', () => {

  test('logs an error if the "id" prop is not passed', () => {

    /* eslint-disable no-console */

    const spy = jest.fn()
    const oldConsoleError = console.error
    console.error = spy

    shallow(
      <Provider store={{}} />
    )

    expect(spy).toHaveBeenCalled()

    console.error = oldConsoleError

    /* eslint-enable no-console */

  })


  test('logs an error if the "store" prop is not passed', () => {

    /* eslint-disable no-console */

    const spy = jest.fn()
    const oldConsoleError = console.error
    console.error = spy

    shallow(
      <Provider id="a" />
    )

    expect(spy).toHaveBeenCalled()

    console.error = oldConsoleError

    /* eslint-enable no-console */

  })


  test('renders all children', () => {

    const wrapper = render(
      <Provider id="a" store={{}}>
        <div>b</div>
        <span>
          <a>c</a>
        </span>
      </Provider>
    )

    expect(
      wrapper.text()
    ).toBe('bc')

  })


  test('provides a stores map to all children via the context api', () => {

    const Child1 = contextifyComponent(jest.fn(() => 'a'))
    const Child2 = contextifyComponent(jest.fn(() => 'b'))

    const store = {}

    const wrapper = mount(
      <Provider id="c" store={store}>
        <Child1 />
        <Child2 />
      </Provider>
    )

    wrapper.unmount()

    const expectedContext = { [storesContextName]: new Map().set('c', store) }

    expect(Child1).toHaveBeenCalledWith({}, expectedContext)
    expect(Child2).toHaveBeenCalledWith({}, expectedContext)

  })


  test('multiple providers provide multiple stores to all children', () => {

    const Child1 = contextifyComponent(jest.fn(() => 'a'))
    const Child2 = contextifyComponent(jest.fn(() => 'b'))
    const Child3 = contextifyComponent(jest.fn(() => 'c'))

    const store1 = {}
    const store2 = {}

    const wrapper = mount(
      <Provider id="d" store={store1}>
        <Provider id="e" store={store2}>
          <Child1 />
          <div>
            <Child2 />
          </div>
        </Provider>
        <Child3 />
      </Provider>
    )

    wrapper.unmount()

    const expectedContext1 = {
      [storesContextName]: new Map().set('d', store1).set('e', store2)
    }

    const expectedContext2 = {
      [storesContextName]: new Map().set('d', store1)
    }

    expect(Child1).toHaveBeenCalledWith({}, expectedContext1)
    expect(Child2).toHaveBeenCalledWith({}, expectedContext1)
    expect(Child3).toHaveBeenCalledWith({}, expectedContext2)

  })

})
