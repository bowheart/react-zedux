import React, { Component, createContext as createReactContext } from 'react'
import PropTypes from 'prop-types'

import {
  getDisplayName,
  getProvidedValue,
  isStoreApi,
  isObservable,
  resolveProps,
  wrapStore
} from '../utils/general'


/*
  The default value we supply to React.createContext()
  Used to determine if <Provider> has been...provided.
*/
const DEFAULT = '@@react-zedux/default'


/**
 * Creates a consumable context out of a state container.
 *
 * The state container can be either:
 *   1. An observable (e.g. a Zedux store)
 *   2. A class that extends ReactZedux.StoreApi
 *
 * Since `new StoreApiExtendingClass()` must return an object that
 * has an observable `store` property, option 2 is really just an
 * extension of option 1. But since it will be instantiated once
 * for every <Provider>, it allows for dynamic observable creation.
 *
 * Returns an object containing 3 First-Order Components:
 *
 * <Provider>, <Consumer>, and <Injector>
 *
 * and their corresponding Higher-Order Components:
 *
 * provide(), consume(), inject()
 *
 * Provider and Consumer must be used together.
 * An error will be thrown if Consumer is used alone.
 *
 * Use Injector to simultaneously provide and consume the context.
 *
 * @export
 * @param {(Observable|function(new:StoreApi))} stateContainer
 * @returns {Context}
 */
export function createContext(stateContainer) {
  if (!isStoreApi(stateContainer) && !isObservable(stateContainer)) {
    throw new TypeError(
      'React Zedux Error - createContext() - '
      + 'Passed argument must be either an observable or a class '
      + 'that extends ReactZedux.StoreApi'
    )
  }

  const ReactContext = createReactContext(DEFAULT)

  const Provider = createProvider(ReactContext, stateContainer)
  const provide = createProvideHoc(Provider)
  const Consumer = createConsumer(ReactContext)
  const consume = createConsumeHoc(Consumer)
  const Injector = createInjector(Provider, ReactContext)
  const inject = createInjectHoc(Injector)

  return {
    Provider,
    provide,
    Consumer,
    consume,
    Injector,
    inject
  }
}


function createConsumeHoc(Consumer) {
  return mapStoreToProps => WrappedComponent =>
    class extends Component {
      static displayName = `Consume(${getDisplayName(WrappedComponent)})`

      render() {
        return (
          <Consumer>
            {value => (
              <WrappedComponent
                {...resolveProps(mapStoreToProps, value, 'consume')}
                {...this.props}
              />
            )}
          </Consumer>
        )
      }
    }
}


function createConsumer(ReactContext) {
  return class Consumer extends Component {
    static propTypes = {
      children: PropTypes.func.isRequired
    }


    render() {
      const { children } = this.props

      return (
        <ReactContext.Consumer>
          {value => {
            if (value !== DEFAULT) {
              return children(value)
            }

            throw new ReferenceError(
              'React Zedux Error - <Context.Consumer> - '
              + 'Context not found. Did you forget to include the '
              + '<Context.Provider>? If you want to simultaneously provide '
              + 'and consume the context, use <Context.Injector>.'
            )
          }}
        </ReactContext.Consumer>
      )
    }
  }
}


function createInjectHoc(Injector) {
  return mapStoreToProps => WrappedComponent =>
    class extends Component {
      static displayName = `Inject(${getDisplayName(WrappedComponent)})`

      static propTypes = {
        onMount: PropTypes.func,
        onUnmount: PropTypes.func
      }

      render() {
        const { onMount, onUnmount, ...passThroughProps } = this.props

        return (
          <Injector {...{ onMount, onUnmount }}>
            {value => (
              <WrappedComponent
                {...resolveProps(mapStoreToProps, value, 'inject')}
                {...passThroughProps}
              />
            )}
          </Injector>
        )
      }
    }
}


function createInjector(Provider, ReactContext) {
  return class Injector extends Component {
    static propTypes = {
      children: PropTypes.func.isRequired,
      onMount: PropTypes.func,
      onUnmount: PropTypes.func
    }

    render() {
      const { children, onMount, onUnmount } = this.props

      return (
        <Provider {...{ onMount, onUnmount }}>
          <ReactContext.Consumer>
            {children}
          </ReactContext.Consumer>
        </Provider>
      )
    }
  }
}


function createProvideHoc(Provider) {
  return WrappedComponent =>
    class extends Component {
      static displayName = `Provide(${getDisplayName(WrappedComponent)})`

      render() {
        return (
          <Provider>
            <WrappedComponent {...this.props} />
          </Provider>
        )
      }
    }
}


function createProvider(ReactContext, stateContainer) {
  return class Provider extends Component {
    static propTypes = {
      children: PropTypes.node,
      onMount: PropTypes.func,
      onUnmount: PropTypes.func
    }

    value = getProvidedValue(stateContainer)

    state = {
      store: wrapStore(
        this.value,
        typeof this.value.getState === 'function'
          ? this.value.getState()
          : undefined
      )
    }

    componentDidMount() {
      const {
        props: { onMount },
        state: { store },
        value
      } = this

      this.subscription = value.subscribe(newState => {

        // Support Redux non-value-emitting observable nonsense
        if (
          typeof newState === 'undefined'
          && typeof value.getState === 'function'
        ) {
          newState = value.getState()
        }

        this.setState({
          store: wrapStore(value, newState)
        })
      })

      if (typeof onMount === 'function') onMount(store)
    }

    componentWillUnmount() {
      const { onUnmount } = this.props

      if (typeof onUnmount === 'function') onUnmount(this.state.store)

      // Support both methods of unsubscribing
      typeof this.subscription === 'function'
        ? this.subscription()
        : this.subscription.unsubscribe()
    }

    render() {
      return (
        <ReactContext.Provider value={this.state.store}>
          {this.props.children}
        </ReactContext.Provider>
      )
    }
  }
}
