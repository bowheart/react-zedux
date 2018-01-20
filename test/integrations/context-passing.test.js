import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'

import {
  Provider, compose, createStore, withProvider, withStores
} from '../../src/index'


describe('context-passing', () => {

  test('withStores() hooks into a <Provider />', () => {

    const store = createStore()
      .hydrate('aa')

    const Component = ({ a }) => a.state
    const Consumer = withStores({ a: 1 })(Component)

    const wrapper = mount(
      <Provider id={1} store={store}>
        <Consumer />
      </Provider>
    )

    expect(wrapper.text()).toBe('aa')

    store.setState('bb')

    expect(wrapper.text()).toBe('bb')

    wrapper.unmount()

  })


  test('multiple withStores() consumers hook into multiple <Provider />s', () => {

    const store1 = createStore()
      .hydrate('aa')

    const store2 = createStore()
      .hydrate('bb')

    const store3 = createStore()
      .hydrate('cc')

    const Component1 = ({ one }) => one.getState()
    const Component2 = ({ one, two }) => one.getState() + two.getState()
    const Component3 = ({ one, three }) => one.getState() + three.getState()

    const Consumer1 = withStores({ one: store1 })(Component1)
    const Consumer2 = withStores({ one: store1, two: store2 })(Component2)
    const Consumer3 = withStores({ one: store1, three: store3 })(Component3)

    const wrapper = mount(
      <Provider id={store1} store={store1}>
        <div>
          <Provider id={store2} store={store2}>
            <Provider id={store3} store={store3}>
              <Consumer1 />
              <div>
                <p>
                  <Consumer2 />
                </p>
                <Consumer3 />
              </div>
            </Provider>
          </Provider>
        </div>
      </Provider>
    )

    expect(wrapper.text()).toBe('aaaabbaacc')

    wrapper.unmount()

  })


  test('withProvider() provides a store to itself and its children', () => {

    class RootProvider extends Component {
      static propTypes = {
        children: PropTypes.node
      }

      store = createStore()
        .hydrate('abc')

      render() {
        return (
          <Provider id={RootProvider} store={this.store}>
            {this.props.children}
          </Provider>
        )
      }
    }

    const enhance = compose(
      withProvider(RootProvider),
      withStores({ rootStore: RootProvider })
    )

    const App = enhance(
      ({ rootStore }) => <Child>{rootStore.state}</Child>
    )

    const Child = withStores({ rootStore: RootProvider })(
      ({ children, rootStore }) => children + rootStore.state
    )

    const wrapper = mount(<App />)

    expect(wrapper.text()).toBe('abcabc')

    wrapper.unmount()

  })

})
