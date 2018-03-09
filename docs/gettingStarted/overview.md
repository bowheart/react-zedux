# Overview

React Zedux is a utility library for creating consumable React Contexts out of [Observables](/types/Observable.md).

React Zedux uses the [new context api](https://github.com/facebook/react/issues/12152) of React 16.3. As such, it is (currently) incompatible with earlier versions of React. The React Zedux api is heavily based off the new context api. So if you're familiar with it, you'll feel right at home!

## Features

- Support for consuming Zedux stores, including easy code splitting, store composition, and time travel.

- Support for consuming Redux stores.

- Support for consuming other observables, e.g. from RxJS.

- A small and easy-to-learn api. Highly orthogonal to React's own `createContext()`.

- Easy to test.

- Higher-Order Components are provided as convenient alternatives to render props in certain situations (e.g. when composing multiple consumers together).

## A full example

Ready to start digging in? (Don't worry, it doesn't get too deep). Here's a full simple counter app:

```js
import React from 'react'
import { render } from 'react-dom'
import { StoreApi, createContext } from 'react-zedux'

// Create a store api. This will create a new Zedux store every
// time the context's Provider is mounted.
class CounterApi extends StoreApi {
  store = createStore().hydrate(0)

  // Some bound inducer factories
  static actors = {
    increment: () => state => state + 1,
    decrement: () => state => state - 1
  }
}

// Create the context...
const CounterContext = createContext(CounterApi)

// ...provide it...
function Counter() {
  return (
    <CounterContext.Provider>
      <CounterDisplay />
      <CounterControls />
    </CounterContext.Provider>
  )
}

// ...and consume it!
const CounterDisplay = CounterContext.consume([ 'state' ])(
  ({ state }) => `Counter value: ${state}`
)

const CounterControls = CounterContext.consume(
  [ 'increment', 'decrement' ]
)(
  ({ increment, decrement }) => (
    <>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </>
  )
)

// (and render stuff for fun)
render(
  <>
    <Counter />
    <Counter />
    <Counter />
  </>,
  document.getElementById('root')
)
```

Relevant doc pages:

- [`createContext()`](/api/createContext.md)
- ['StoreApi`](/api/StoreApi.md)
- [`Context.Provider`](/types/context/Provider.md)
- [`Context.consume()`](/types/context/consume.md)