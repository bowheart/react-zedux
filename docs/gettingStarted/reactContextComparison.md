# React context comparison

## Signature

`React.createContext(defaultValue: any)`

vs.

`ReactZedux.createContext(stateContainer: StateContainer)`

See the [StateContainer type](/types/StateContainer.md)

## Consumption

React:

```js
import { createContext } from 'react'

const Context = createContext('default value')

const SomeComponent = () => (
  <Context.Consumer>
    {console.log}
  </Context.Consumer>
)

// logs 'default value'
```

React Zedux:

```js
import { createContext } from 'react-zedux'
import { createStore } from 'zedux'

const Context = createContext(createStore())

const SomeComponent = () => (
  <Context.Consumer>
    {console.log}
  </Context.Consumer>
)

// Throws ReferenceError
```

React allows a Context's Consumer to be used without its Provider.

React Zedux will throw an error if a `<Consumer>` is used without its matching `<Provider>`. This is safer than having a silent failover case. If you really want to provide and consume the store, either explicitly include the `<Provider>` or use the `<Injector>` instead.

## The Context object

`React.createContext()` returns an object with two properties:

```js
import { createContext } from 'react'

const Context = createContext('default value')

Context.Provider // a React component
Context.Consumer // a React component
```

`ReactZedux.createContext()` also returns an object with those 2 properties. But it adds a little sugar too:

```js
import { createContext } from 'react-zedux'
import { createStore } from 'zedux'

const Context = createContext(createStore())

Context.Provider // a React component
Context.Consumer // a React component
Context.Injector // a React component

Context.provide // an Higher-Order Component
Context.consume() // an Higher-Order Component
Context.inject() // an Higher-Order Component
```

These other properties are just for convenience. See the [Context type](/types/Context.md) for more info.

## Notes

Note that `Context.provide` is not curried like the other HOCs.