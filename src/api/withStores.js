import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { storesContextName } from '../utils/constants'
import {
  assertIsComponent, getDisplayName, isPlainObject
} from '../utils/general'


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
export const withStores = (
  propsToStoreIdsMap, mapStoresToProps
) => WrappedComponent => {
  assertHasEntries(propsToStoreIdsMap)
  assertIsComponent(WrappedComponent, 'withStores', 'WrappedComponent')
  assertIsFunction(mapStoresToProps)


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
      const { state, props } = this
      const injectedProps = mapStoresToProps
        ? mapStoresToProps(state, props)
        : state

      assertIsObject(injectedProps)

      return (
        <WrappedComponent
          {...injectedProps}
          {...props}
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


function assertIsFunction(mapStoresToProps) {
  if (!mapStoresToProps || typeof mapStoresToProps === 'function') return true

  throw new TypeError(
    errorHeader
    + 'If passed, mapStoresToProps must be a function that returns '
    + 'a plain object. Received: ' + typeof mapStoresToProps
  )
}


function assertIsObject(thing) {
  if (isPlainObject(thing)) return true

  throw new TypeError(
    errorHeader
    + 'Expected mapStoresToProps to return a plain object.'
  )
}


function assertStoresAreProvided(providedStores, propsToStoreIdsMap) {
  if (providedStores instanceof Map) return true

  const firstStorePropName = Object.keys(propsToStoreIdsMap)[0]

  throw new ReferenceError(
    errorHeader
    + 'No stores have been provided! '
    + `Cannot access store for prop "${firstStorePropName}". `
    + 'Did you forget to wrap this component in a <Provider />?'
  )
}


function assertStoreExists(store, storePropName) {
  if (store) return true

  throw new ReferenceError(
    errorHeader
    + `Store not found for prop "${storePropName}". `
    + 'The given store id does not match the id of any provided stores. '
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

  assertStoresAreProvided(providedStores, propsToStoreIdsMap)

  const stores = {}

  Object.entries(propsToStoreIdsMap).forEach(([ storePropName, storeId ]) => {
    const store = providedStores.get(storeId)

    assertStoreExists(store, storePropName)

    stores[storePropName] = createStoreInterface(store)
  })

  return stores
}
