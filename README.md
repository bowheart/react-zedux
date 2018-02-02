# React Zedux

[![Build Status](https://travis-ci.org/bowheart/react-zedux.svg?branch=master)](https://travis-ci.org/bowheart/react-zedux)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0459ebf8444c36752eac/test_coverage)](https://codeclimate.com/github/bowheart/react-zedux/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/0459ebf8444c36752eac/maintainability)](https://codeclimate.com/github/bowheart/react-zedux/maintainability)
[![npm](https://img.shields.io/npm/v/react-zedux.svg)](https://www.npmjs.com/package/react-zedux)

Modular and composable state-binding power. These are the official React bindings for [Zedux](https://github.com/bowheart/zedux).

## Installation

Install using npm:

```bash
npm install --save react-zedux
```

Or yarn:

```bash
yarn add react-zedux
```

Or include the appropriate unpkg build on your page (module exposed as `ReactZedux`):

### Development

```html
<script src="https://unpkg.com/react-zedux/dist/react-zedux.js"></script>
```

### Production

```html
<script src="https://unpkg.com/react-zedux/dist/react-zedux.min.js"></script>
```

## Getting started

To learn by example, check out the [examples in the Zedux repo](https://github.com/bowheart/zedux/tree/master/examples) &ndash; they use React Zedux quite heavily.

To learn by getting dirty, fiddle with [this codepen](https://codepen.io/bowheart/pen/MrKMmw?editors=0010).

To learn comprehensively, check out the [tests](https://github.com/bowheart/react-zedux/tree/master/test).

To learn from us, keep reading; the documentation follows:

## Quick start

A Zedux app has many stores composed together in a store hierarchy. A React app has many components composed together in a component hierarchy. A React Zedux app ties the two hierarchies together at various points. These "tie-in" points are called Providers. A Provider is just a special component that "provides" a Zedux store to its descendants:

```javascript
import React from 'react'
import { render } from 'react-dom'
import App from './App'

/*
  React Zedux re-exports all the Zedux built-ins.
  This gives our normal component files one less dependency.
  Here, createStore is from Zedux, Provider is from React Zedux.
*/
import { Provider, createStore } from 'react-zedux'

/*
  A Zedux app will typically have a single root store.
  Here we're using a global store.
  This store will never die.
*/
const rootStore = createStore()

// The rootStore will typically wrap the whole application.
render(
  <Provider id="root" store={rootStore}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

### Store categories

In a React Zedux app, there are two types of stores:

1. Global store &ndash; lives as long as the application does unless lazy-loaded (#codesplitting) or explicitly destroyed.

2. Component-bound store &ndash; born when its component is mounted and dies when its component is unmounted.

```javascript
import React, { Component } from 'react'
import { createStore } from 'zedux'

// I am a global store.
const globalStore = createStore()

class MyComponent extends Component {

  // I am a component-bound store.
  store = createStore().hydrate('woot!')

  render() {
    return this.store.getState()
  }
}
```

Not all stores have to be part of the global store hierarchy. Components can create completely isolated stores if they want. But for awesome debugging experiences, it can be useful to attach component-bound stores to the global store hierarchy. More on that in the below [section on time travel](#time-travel).

### Identifying stores

A component deep in the hierarchy may have many stores provided to it. How do we pick and choose which parent-provided store to use? The answer won't surprise you. Because...it isn't surprising. Each store needs a unique identifier.

The `<Provider />` component takes a required `id` prop. This id may be anything, but will typically be a custom Provider component. More on those in the next section.

In our first example, we used a string (`'root'`) as the Provider's `id` prop. This is basically frowned upon and don't do it. For real. But you can. If you want. Just please export the string as a constant so you're not magic-stringificating all over the place.

### Custom Providers

In React Zedux, a store specifies how it's consumed. In practice, we'll rarely use `<Provider />` components on the fly. Typically we'll wrap them in a custom Provider component that adds additional functionality for consumers. Custom Providers also serve as an easy identifier for the stores they provide.

Custom Providers are the "component" in component-bound stores; they create a store in their `constructor` (or as a class field, if you're cool enough for that):

```javascript
import React, { Component } from 'react'
import { Provider, createStore } from 'react-zedux'

/*
  Meet your first custom Provider.
  He's a React component that wraps his children in the special
  <Provider /> component. He also creates a component-bound store
  whose life is tied to his own lifecycle.

  Note that we set the `id` prop to TodosProvider itself
*/
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
```

The custom Provider will **not** typically subscribe to its store &ndash; that's the consumer's job. But, of course, if there is any cleanup work to do with the store, that'll go in the custom Provider's `componentWillUnmount` lifecycle hook.

Component + Provider combos are the meat of React Zedux. You'll quickly find that this pattern is more effective than React's built-in state handling when even very shallow component hierarchies are involved.

This also encourages a very strict separation of data and ui. Most apps will be able to use class components for custom Providers and function components for everything else.

### Consuming the store

So this Provider stuff is cool and all...but how does a child component *use* it? Why, `withStores()`, of course. `withStores()` is an Higher-Order Component that wraps a component in any number of stores.

Let's continue with our `TodosProvider` example above:

```javascript
import { withStores } from 'react-zedux'

/*
  Here's the component in our Component + Provider combo.
  He just wraps his children in the TodosProvider.
  Easy, easy.
*/
function Todos() {
  return (
    <TodosProvider>
      <TodoList />
    </TodosProvider>
  )
}

/*
  Let's consume this thing!
  This is a simple component wrapped in the withStores HOC.
  `todosStore` is the name of prop we want passed to our component.
  `TodosProvider` is that store's id. This is the value of the `id`
  prop we passed to the Provider.
*/
const TodoList = withStores({
  todosStore: TodosProvider
})(
  ({ todosStore }) => todosStore.getState().map(
    todo => <p key={todo.id}>{todo.text}</p>
  )
)
```

`withStores()` accepts a single argument - a props-to-storeIds map. React Zedux will find the specified stores in the list of provided stores and pass them to our component as the specified props.

The "store" passed to the wrapped component will actually be an object that extends the store. This object has a single extra prop &ndash; `state` &ndash; whose value is guaranteed to be the current state of the store. This can be convenient for parameter destructuring:

```javascript
({
  todosStore: { state }
}) => state.map(
  todo => <p key={todo.id}>{todo.text}</p>
)
```

### Time travel

Wouldn't it be great if we could have global stores and component-bound stores and still keep a single, global record of all state changes? Oh! We can.

```javascript
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider, createStore } from 'react-zedux'

// The root store is where we'll implement time travel
const rootStore = createStore()

// Our custom provider
class CounterProvider extends Component {
  static storeIdCounter = 0

  store = createStore().hydrate(0) // set the initial state
  storeId = 'counter' + CounterProvider.storeIdCounter++

  componentDidMount() {

    // The magic; attach each counter store to the root store
    rootStore.use({ [this.storeId]: this.store })
  }

  componentWillUnmount() {

    // Unattach each counter store when its component dies
    rootStore.use({ [this.storeId]: null })
  }

  render() {
    return this.store.getState()
  }
}

// Render some stuff for fun
render(
  <div>
    <CounterProvider />
    <CounterProvider />
  </div>,
  document.getElementById('root'),
  () => {
    rootStore.getState() // { counter1: 0, counter2: 0 }
  }
)
```

Here we accessed the rootStore globally, but we can just as easily wrap a custom Provider in a `withStores()` HOC that grabs a parent store for us. On that note, we don't have to attach everything directly to the root. This is a hierarchy, after all! We could attach it to a store that attaches to a store that attaches to the root. Neat, eh?

### Comparison to React Redux

If you're coming from [React Redux](https://github.com/reactjs/react-redux), here's a side-by-side comparison:

React Redux | React Zedux
------------|------------
A component specifies how it consumes the store &ndash; `connect()` | A store specifies how it's consumed &ndash; usually via custom Providers
A single root store is provided to all components | Many stores are provided at different points in the component hierarchy
Global store(s) | Global and component-bound stores
Various "state" and "dispatch" props are injected into the wrapped component | A single prop per store is injected into the wrapped component
Bloated presentational components | Bloated container components
`mapStateToProps` and `mapDispatchToProps` | `mapStoresToProps`

Since Zedux stores are composable, each store will typically be much smaller than a Redux store. This makes it much more practical for individual components to interface with the store itself.

Also worth noting, both React Redux and React Zedux bloat your code somewhere. React Redux bloats presentational component files a little more. React Zedux chooses to offload that bloat to the more sparse and data-capable container components.

### A full example

Alright, enough talk. Here's a full simple counter app:

```javascript
import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { Provider, createStore, withStores } from 'react-zedux'

class CounterProvider extends Component {
  constructor(props) {
    super(props)

    // We use Object.create() to extend the store so we're not
    // destroying any built-ins. Not usually necessary.
    const store = Object.create(createStore().hydrate(0))

    store.increment = () => store.dispatch(state => state + 1)
    store.decrement = () => store.dispatch(state => state - 1)

    this.store = store
  }

  render() {
    return (
      <Provider id={CounterProvider} store={this.store}>
        {this.props.children}
      </Provider>
    )
  }
}

function Counter() {
  return (
    <CounterProvider>
      <CounterDisplay />
      <CounterControls />
    </CounterProvider>
  )
}

const CounterDisplay = withStores({
  counterStore: CounterProvider
})(
  ({ counterStore: { state } }) => `Counter value: ${state}`
)

const CounterControls = withStores({
  counterStore: CounterProvider
})(
  ({ counterStore: { increment, decrement } }) => (
    <Fragment>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </Fragment>
  )
)

render(
  <Fragment>
    <Counter />
    <Counter />
    <Counter />
  </Fragment>,
  document.getElementById('root')
)
```

### Summary

We use `<Provider />` to provide a store to a component's descendants.

We use `withStores()` to access stores provided by parents.

Every provided store needs a unique identifier, which will usually be a custom Provider component.

Custom Providers are used to define a store's api &ndash; how child components can interact with the store. This is nice for binding action creators, selectors, and hooks to the store.

We can create global or component-bound stores. Attaching component-bound stores to the global store hierarchy is easy, but not always necessary.

And that's really it. There's not much to it. Go rock the state management world!

### Notes

We used zero configuration patterns in all these examples. This was for simplicity, of course. Don't let this fool you! Every one of these stores is capable of containing every last speck of Zedux awesomeness.

We also didn't name our wrapped function components. We should.

## Method API

React Zedux exposes one First-Order Component:

- `<Provider />`

and two Higher-Order Components:

- `withStores()`
- `withProvider()`

### `<Provider />`

Provides a store to its descendants.

Props:

- **id** - any (required) - Anything that uniquely identifies the store. Usually a custom Provider component that wraps its children in a `<Provider />`.

- **store** - Observable (required) - Any object with a `subscribe()` method that returns a `subscription` object that contains an `unsubscribe()` method. Phew. Will typically be a Zedux store or an object extending it.

```javascript
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider, createStore } from 'react-zedux'

export default TodosProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  store = createStore().hydrate([])

  render() {
    return (
      <Provider id={TodosProvider} store={this.store}>
        {this.props.children}
      </Provider>
    )
  }
}
```

### `withStores()`

An HOC. Pulls any number of stores off the list of provided stores and passes them to the wrapped store via props. Handles subscribing to and unsubscribing from the provided stores.

Params:

- **mapStoresToProps** - non-empty object (required) - A map of `propName` to `storeId` pairs.

Returns a component enhancer used to wrap a component in the given store(s). The wrapped component will receive `extendedStore` objects as the requested props.

An `extendedStore` object contains one property &ndash; `state` &ndash; whose value is guaranteed to always be the current state of the store. The `extendedStore` object's prototype will be the store itself.

```javascript
import React from 'react'
import { withStores } from 'react-zedux'
import TodosProvider from './TodosProvider'

export default withStores({
  todosStore: TodosProvider
})(TodoList)

function TodoList({
  todosStore: { state: todos }
}) {
  return (
    todos.map(todo =>
      <p key={todo.id}>{todo.text}</p>
    )
  )
}
```

### `withProvider()`

An HOC. Wraps a component in a custom Provider.

We skipped this guy in the quick start. He's just a convenient shorthand when a component needs to provide a store to its descendants, but also needs access to the store.

Params:

- **CustomProvider** - React component (required) - Should be a component that wraps its children in a `<Provider />` component.

Returns a component enhancer used to wrap a component in the given Provider.

```javascript
import React, { Fragment } from 'react'
import { compose, withProvider, withStores } from 'react-zedux'
import TodosProvider from './TodosProvider'
import TodoList from './TodoList'

// Simultaneously provide and consume the store
const enhance = compose(
  withProvider(TodosProvider),
  withStores({ todosStore: TodosProvider })
)

export default enhance(Todos)

function Todos({
  todosStore: { state: todos }
}) {
  return (
    <Fragment>
      <div>Total todos: {todos.length}</div>
      <TodoList />
    </Fragment>
  )
}
```

These provide/consume enhancers can actually be used as a decent replacement for React's built-in state management. This makes for some nice separation of concerns:

```javascript
import React, { Component } from 'react'
import { Provider, createStore, withProvider, withStores } from 'react-zedux'

class FormProvider extends Component {
  store = createStore()
    .hydrate({
      firstName: '',
      lastName: ''
    })

  componentWillMount() {
    this.store.setField = ({ currentTarget }) => {
      this.store.setState({
        [currentTarget.name]: currentTarget.value
      })
    }
  }

  render() {
    return (
      <Provider id={FormProvider} store={this.store}>
        {this.props.children}
      </Provider>
    )
  }
}

function FormUi({ formStore }) {
  return (
    <form>
      <input name="firstName" value={firstName} onChange={setField} />
      <input name="lastName" value={lastName} onChange={setField} />
    </form>
  )
}

export default compose(
  withProvider(FormProvider),
  withStores({ formStore: FormProvider })
)(FormUi)
```

Do we recommend this? Well...

## Contributing

All contributions on any level are most welcome. Just jump right in. Open an issue. PRs, just keep the coding style consistent and the tests at 100% (branches, functions, lines, everything 100%, plz). Let's make this awesome!

Bugs can be submitted to https://github.com/bowheart/react-zedux/issues

## License

The [MIT License](https://github.com/bowheart/react-zedux/blob/master/LICENSE.md).
