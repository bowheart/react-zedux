import React, { Component } from 'react'

import { assertIsComponent, getDisplayName } from '../utils/general'


/**
  Wraps a component in a Provider.

  Useful when a component needs to provide a store to its children
  but also needs access to the store.

  Only supports a single Provider. If multiple are needed, they
  can be composed together.

  Example usage:

    const provideAndConsume = compose(
      withProvider(TodosProvider),
      withProvider(TodontsProvider),
      withStores({
        todos: TodosProvider,
        todonts: TodontsProvider
      })
    )

    const WrappedTodos = provideAndConsume(Todos)
*/
export const withProvider = Provider => WrappedComponent => {
  const method = 'withProvider'

  assertIsComponent(Provider, method, 'Provider')
  assertIsComponent(WrappedComponent, method, 'WrappedComponent')

  const providerName = getDisplayName(Provider)
  const componentName = getDisplayName(WrappedComponent)


  return class extends Component {
    static displayName = `WithProvider(${providerName})(${componentName})`


    render() {
      const passThroughProps = this.props

      return (
        <Provider>
          <WrappedComponent {...passThroughProps} />
        </Provider>
      )
    }
  }
}
