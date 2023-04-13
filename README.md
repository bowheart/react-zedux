# [DEPRECATED]

This repo has moved to [`Omnistac/zedux`](https://github.com/omnistac/zedux) - specifically the [`react` package](https://github.com/omnistac/zedux/tree/master/packages/react).

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

To learn from us, check out the [documentation](https://bowheart.github.io/react-zedux/gettingStarted/overview).

To learn comprehensively, check out the [tests](https://github.com/bowheart/react-zedux/tree/master/test).

Or keep reading for a brief run-down:

## Quick start

A Zedux app has many stores composed together in a store hierarchy. A React app has many components composed together in a component hierarchy. A React Zedux app ties the two hierarchies together at various points. These "tie-in" points are called Providers.

A Provider is just a special component that "provides" an observable (e.g. a Zedux store) to its descendants.

Any descendant that accesses the provided observable is called a Consumer.

And that's really it! At a high level, you now know just about everything about React Zedux.

> React Zedux uses the [new context api](https://github.com/facebook/react/issues/12152) of React 16.3. As such, it is (currently) incompatible with earlier versions of React. The React Zedux api is heavily based off the new context api. So if you're familiar with it, you'll feel right at home!

### A basic example

```js
import React from 'react'
import { createContext } from 'react-zedux'
import { createStore } from 'zedux'

/*
  React Zedux creates consumable contexts from observables.
  Here we're using a global Zedux store. But we could use
  any observable (e.g. from RxJS or a Redux store).
*/
const store = createStore().hydrate('world')

/*
  Meet the Context. This guy makes our dreams come true.
  Just pass the observable to createContext() and React Zedux
  will handle subscribing and reacting to updates.
*/
const Context = createContext(store)

/*
  The Context works just like a normal React Context object.
  We just provide and consume it:
*/
const HelloWorld = () => (
  <Context.Provider>
    <Context.Consumer>{store => 'hello ' + store.getState()}</Context.Consumer>
  </Context.Provider>
)
```

React Zedux actually has a shorthand for this "provide and consume" scenario:

```js
const HelloWorld = () => (
  <Context.Injector>{store => 'hello ' + store.getState()}</Context.Injector>
)
```

We can use `<Context.Injector>` to simultaneously provide and consume the store. This is mostly just for your prototyping pleasure, though it certainly has some uses (e.g. encouraging a strict separation of data and ui and allowing a parent Provider to also consume the observable it provides).

Typically we'll use a `<Context.Provider>` together with any number of `<Context.Consumer>`s. The power of Consumers, of course, is that they can consume the provided observable even as a deeply nested descendant of the Provider.

### Higher-Order Components

We can consume a Context by using either render props or Higher-Order Components. The following two examples are equivalent:

**Render prop:**

```js
import Context from './contexts/Context'

const App = () => (
  <Context.Injector>
    {store =>
      // This function-as-child is a render prop.
      // A wrapped form of the Context's observable is
      // passed to this function.
      store.getState()
    }
  </Context.Injector>
)
```

**HOC:**

```js
import Context from './contexts/Context'

// Context.inject() is an HOC alternative to <Context.Injector>
// The render prop is now gone. In its place, we're telling React
// Zedux to pass the store to the wrapped component as a normal
// prop called "store"
const App = Context.inject('store')(({ store }) => store.getState())
```

See the [inject HOC documentation](https://bowheart.github.io/react-zedux/types/context/inject) for more info on this guy. Also see the [consume HOC](https://bowheart.github.io/react-zedux/types/context/inject) for all possible overloads of `Context.inject()`.

### The Context object

The [Context object](https://bowheart.github.io/react-zedux/types/Context) returned by `createContext()` contains 3 React (First-Order) components:

```js
import { createContext } from 'react-zedux'
import { createStore } from 'zedux'

const Context = createContext(createStore())

Context.Provider // provides the observable to descendants
Context.Consumer // consumes a provided observable
Context.Injector // a shorthand for providing and consuming
```

and 3 Higher-Order Components:

```js
Context.provide
Context.consume()
Context.inject()
```

> Note that unlike `Context.consume()` and `Context.inject()`, `Context.provide` is not curried.

You can get by with just `<Context.Provider>` and `<Context.Consumer>`. The rest is just sugar, but it definitely comes in handy.

See the [Context documentation](https://bowheart.github.io/react-zedux/types/Context).

### Render props!

`<Context.Consumer>` and `<Context.Injector>` take a single function as their only child. This is the [render prop technique](https://reactjs.org/docs/render-props.html). It works exactly like React's `<Context.Consumer>`. This function will be called every time the context's obervable emits (read: "the store's state updates").

Render props are awesome, but they can lead to rightward code drift. You could use another library such as [react-composer](https://github.com/jamesplease/react-composer) to prevent this. But we could just as easily use the Zedux `compose()` utility with the Context's Higher-Order Components:

```js
import { createContext } from 'react-zedux'
import { compose, createStore } from 'zedux'

const HelloContext = createContext(createStore().hydrate('hello'))
const WorldContext = createContext(createStore().hydrate('world'))

const HelloWorld = compose(
  HelloContext.inject('helloStore'),
  WorldContext.inject('worldStore')
)(
  ({ helloStore, worldStore }) =>
    `${helloStore.getState()} ${worldStore.getState()}`
)
```

The render props are now gone, replaced with normal, explicitly named props. This HelloWorld component is equivalent to:

```js
const HelloWorld = () => (
  <HelloContext.Provider>
    <HelloContext.Consumer>
      {helloStore => (
        <WorldContext.Provider>
          <WorldContext.Consumer>
            {worldStore => `${helloStore.getState()} ${worldStore.getState()}`}
          </WorldContext.Consumer>
        </WorldContext.Provider>
      )}
    </HelloContext.Consumer>
  </HelloContext.Provider>
)
```

You can see why React Zedux offers some sugar.

### Summary

We use [`createContext()`](https://bowheart.github.io/react-zedux/api/createContext) to create a Context from an observable or StoreApi.

We use [`<Context.Provider>`](https://bowheart.github.io/react-zedux/types/context/Provider) to provide the observable to descendants.

We use [`<Context.Consumer>`](https://bowheart.github.io/react-zedux/types/context/Consumer) to consume a provided observable.

We use [`<Context.Injector>`](https://bowheart.github.io/react-zedux/types/context/Injector) to simultaneously provide and consume the store.

[`Context.provide`](https://bowheart.github.io/react-zedux/types/context/provide), [`Context.consume()`](https://bowheart.github.io/react-zedux/types/context/consume), and [`Context.inject()`](https://bowheart.github.io/react-zedux/types/context/inject) are alternatives to their First-Order counterparts, with a few added features.

We didn't get to [component-bound stores](https://bowheart.github.io/react-zedux/api/StoreApi), [time travel](https://bowheart.github.io/react-zedux/guides/timeTravel), or general [usage with observables](https://bowheart.github.io/react-zedux/guides/usingObservables), but check all that out in the [full documentation](https://bowheart.github.io/react-zedux/gettingStarted/gettingStarted/overview)!

### Notes

We used zero configuration patterns in all these examples. This was for simplicity, of course. Don't let this fool you! Every one of these stores is capable of containing every last speck of Zedux awesomeness.

We also didn't name our wrapped function components. We should.

## Contributing

All contributions on any level are most welcome. Just jump right in. Open an issue. PRs, just keep the coding style consistent and the tests at 100% (branches, functions, lines, everything 100%, plz). Let's make this awesome!

Bugs can be submitted to https://github.com/bowheart/react-zedux/issues

## License

The [MIT License](https://github.com/bowheart/react-zedux/blob/master/LICENSE.md).
