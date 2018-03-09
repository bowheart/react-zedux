# `StoreApi`

Defines an api around a Zedux store or other observable. Used to create component-bound stores (stores that live and die with a React component).

## Definition

```typescript
class StoreApi<TState> {
  _bindControls(
    StoreApiClass: StoreApiConstructor<TState>
  ): StoreApi<TState>
}

interface StoreApi<TState> {
  store: Observable<TState>
}
```

See the [StoreApiConstructor](/types/StoreApiConstructor.md) and [Observable](/types/Observable.md) types.

## The gist

To create a component-bound store simply create a class that extends `StoreApi`. This class **must** have a visible `store` instance property whose value is an [Observable](/types/Observable.md).

The class may also take static `actors` and `selectors` properties. See the [StoreApiConstructor type](/types/StoreApiConstructor.md) for more details.

This class constructor may be passed directly to [`createContext()`](/api/createContext.md). React Zedux will instantiate it every time the resulting Context's `<Provider>` (or `<Injector>`) is mounted. React Zedux will also call `storeApi._bindControls()` to bind any actors/selectors to the store and merge those and all properties of the store into the api instance itself.

React Zedux will throw an error if there are any duplicate keys between the actors map, the selectors map, and the store's own properties. This mitigates the problems associated with this "mixin" sort of behavior.

## Examples

A simple component-bound store.

```js
import React from 'react'
import { StoreApi, createContext } from 'react-zedux'
import { createStore } from 'zedux'

class CounterApi extends StoreApi {

  /*
    The `store` property is required. React Zedux will throw
    an error if it isn't a valid observable.

    Here we're creating a new store every time the CounterApi is
    instantiated. This will create a component-bound store. Note
    that we could set it to a global store if we just want to
    take advantage of the other features offered by StoreApis.
  */
  store = createStore().hydrate(0)
}

/*
  We pass the class constructor directly to `createContext()`.
  React Zedux will instantiate it every time a <Provider>
  is mounted.
*/
const CounterContext = createContext(CounterApi)

// Some components. Part of a complete example.
const Counter = () => (
  <CounterContext.Injector>
    {({ state }) => state}
  </CounterContext.Injector>
)

// Now every time we mount a <Counter>, React Zedux creates
// a new counter store.
const App = () => (
  <>
    <Counter />
    <Counter />
  </>
)
```

The StoreApi is useful for defining a store's api (hence the name...). The "api" is the interface consumers use to interact with the store. The StoreApi can bind actors and selectors to the store and provide hooks and other utilities for accessing and modifying the store's data.

```js
import React from 'react'
import { StoreApi, createContext } from 'react-zedux'
import { createStore, select } from 'zedux'

class TodosApi extends StoreApi {

  /*
    A StoreApi can take static `actors` and `selectors` properties.
    These will be bound to the store and merged into the TodosApi
    instance.
  */
  static actors = {

    // A simple inducer factory
    addTodo: text => state => [
      ...state,
      { text, isComplete: false }
    ]
  }

  static selectors = {

    // A simple, memoized selector
    selectIncompleteTodos: select(
      state => state.filter(todo => todo.isComplete)
    )
  }

  store = createStore().hydrate([])
}

const TodosContext = createContext(TodosApi)

// Now when we mount a TodosContext.Provider, React Zedux will bind
// these actors and selectors to the store and merge them into the
// api instance.
const Todos = () => (
  <TodosContext.Injector>
    {({ addTodo, selectIncompleteTodos }) => {
      addTodo('be awesome')

      selectIncompleteTodos()
      // [ { text: 'be awesome' isComplete: false } ]
    }}
  </TodosContext.Injector>
)
```

The `actors` and `selectors` can contain nested namespaces. React Zedux will preserve the nesting. This can be useful for creating hooks (such as actors that perform a check before proceeding with a dispatch):

```js
import React from 'react'
import { StoreApi, createContext } from 'react-zedux'

class TodosApi extends StoreApi {
  static actors = {
    wrappedActors: {
      addTodo: text => state => [
        ...state,
        { text, isComplete: false }
      ]
    }
  }

  store = createStore().hydrate([])

  addTodo(text) {
    const todos = this.store.getState()

    if (todos.some(todo => todo.text === text)) {
      return todos // a todo already exists with that name
    }

    // We're good; proceed with the dispatch
    return this.wrappedActors.addTodo(text)
  }
}

const Todos = () => (
  <TodosContext.Injector>
    {({ addTodo }) => {
      addTodo('nest a selector now')
    }}
  </TodosContext.Injector>
)
```

## Testing

Just be sure to call `storeApi._bindControls()` manually:

```js
import { StoreApi } from 'react-zedux'
import { createStore } from 'zedux'

class TodosApi extends StoreApi {
  static actors = {
    addTodo: text => state => [
      ...state,
      { text, isComplete: false }
    ]
  }

  store = createStore().hydrate([])
}

const todosApi = new TodosApi()
  ._bindControls() // yes, it can be chained

todosApi.addTodo('a')

expect(todosApi.getState()).toBe([
  { text: 'a', isComplete: false }
])
```

## Method Api

### `_bindControls()`

#### Definition

```typescript
() => StoreApi<TState>
```

Returns the StoreApi instance for chaining.

#### Explanation

Given a StoreApi instance like so:

```js
import { StoreApi } from 'react-zedux'
import { createStore } from 'zedux'

class CounterApi extends StoreApi {
  store = createStore().hydrate(0)

  static actors = {
    increment: () => state => state + 1
  }

  static selectors = {
    selectNumTimesTen: state => state * 10
  }
}

const counterApi = new CounterApi()
```

calling

```js
counterApi._bindControls()
```

Will:

- Merge all properties of `counterApi.store` into `counterApi`. Will throw an error if any of those properties already exist on `counterApi`.

- Bind the `increment` actor to the store.

- Stick the bound `increment` actor on `counterApi`. Will throw an error if `increment` already exists on `counterApi`.

- Bind the `selectNumTimesTen` selector to the store.

- Stick the bound `selectNumTimesTen` selector on `counterApi`. Will throw an error if `selectNumTimesTen` already exists on `counterApi`.

## Notes

You don't have to use the auto-binding feature of StoreApis. The following two examples are equivalent:

```js
import { StoreApi } from 'react-zedux'
import { createStore } from 'zedux'

class CounterApi extends StoreApi {
  store = createStore().hydrate(0)

  increment() {
    this.store.dispatch(state => state + 1) // or this.dispatch(...)
  }
}
```

and:

```js
import { StoreApi } from 'react-zedux'
import { createStore } from 'zedux'

class CounterApi extends StoreApi {
  store = createStore().hydrate(0)

  static actors = {
    increment: () => state => state + 1
  }
}
```