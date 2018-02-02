import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { storesContextName } from '../utils/constants'
import { assertIsComponent, getDisplayName } from '../utils/general'


const errorHeader = 'React Zedux Error - withStores() - '


/**
  Accesses a store provided by a parent component.

  Since multiple parents may provide stores, each store needs an
  identifier of some sort. This identifier must be the "id" prop
  of a parent Provider:

    <Provider id={theId} ... > ... </Provider>

  This identifier must then be used to link this child store to
  the provided store:

    withStores({ storePropName: theId })(Child)
*/
export const withStores = propsToStoreIdsMap => WrappedComponent => {
  assertHasEntries(propsToStoreIdsMap)
  assertIsComponent(WrappedComponent, 'withStores', 'WrappedComponent')


  return class extends Component {
    static contextTypes = {
      [storesContextName]: PropTypes.instanceOf(Map).isRequired
    }


    static displayName = `WithStores(${getDisplayName(WrappedComponent)})`


    constructor(props, context) {
      super(props, context)

      this.state = pullStoresFromContext(propsToStoreIdsMap, context)
    }


    componentDidMount() {
      this.subscriptions = Object
        .entries(this.state)
        .map(this.subscribe)
    }


    componentWillUnmount() {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe()
      })
    }


    subscribe = ([ storePropName, store ]) => {
      return store.subscribe((oldState, newState) => {
        this.setState({
          [storePropName]: createStoreInterface(store, newState)
        })
      })
    }


    render() {
      const passThroughProps = this.props

      return (
        <WrappedComponent
          {...this.state}
          {...passThroughProps}
        />
      )
    }
  }
}


function assertHasEntries(map) {
  if (typeof map === 'object' && Object.entries(map).length) return true

  throw new Error(
    errorHeader
    + 'propsToStoreIdsMap must be an object with at least one entry.'
  )
}


function assertStoreExists(store, storePropName) {
  if (store) return true

  throw new ReferenceError(
    errorHeader
    + `Store not found for prop "${storePropName}". `
    + 'The given store id does not match the id of any provided stores.'
    + 'Did you forget the <Provider /> for this store?'
  )
}


function createStoreInterface(store, state) {
  return Object.create(store, {
    state: {
      enumerable: true,
      value: state || store.getState()
    }
  })
}


function pullStoresFromContext(propsToStoreIdsMap, context) {
  const providedStores = context[storesContextName]

  // Fail silently (for now) since React already logs an error
  // about the missing contextType
  if (!(providedStores instanceof Map)) return

  const stores = {}

  Object.entries(propsToStoreIdsMap).forEach(([ storePropName, storeId ]) => {
    const store = providedStores.get(storeId)

    assertStoreExists(store, storePropName)

    stores[storePropName] = createStoreInterface(store)
  })

  return stores
}
