import { Component } from 'react'
import PropTypes from 'prop-types'

import { storesContextName } from '../utils/constants'


/**
  A component that provides a store to its descendants.

  Since a Zedux app will typically have many stores, each Provided
  store in the component hierarchy needs an identifier of some sort.

  For singleton stores, the identifier can be the store itself.

  For component-bound stores, the identifier may be a component
  that composes this Provider. For example:

    class TodosProvider extends Component {
      store = createStore()

      render() {
        return (
          <Provider id={TodosProvider} store={this.store}>
            {this.props.children}
          </Provider>
        )
      }
    }
*/
export class Provider extends Component {
  static childContextTypes = {
    [storesContextName]: PropTypes.object.isRequired
  }


  static contextTypes = {
    [storesContextName]: PropTypes.object
  }


  static propTypes = {
    children: PropTypes.node,
    id: PropTypes.any.isRequired,
    store: PropTypes.object.isRequired
  }


  getChildContext() {
    const stores = this.context[storesContextName]
    const { id, store } = this.props

    return {
      [storesContextName]: new Map(stores).set(id, store)
    }
  }


  render() {
    return this.props.children
  }
}
