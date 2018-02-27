# `Context.Consumer`

A React component. Consumes the provided observable.

Consumers must appear as descendants of the Context's Provider or React Zedux will throw an error.

## Definition

```typescript
export interface Consumer extends Component<{
  children: (value: WrappedStateContainer) => ReactNode
}, {}> {}
```

**children** &ndash; A render prop! Required. A function that will receive the [WrappedStateContainer](/types/WrappedStateContainer) of the provided observable and should return a React node or array of nodes.

## Provider-less Consumers

If the Provider is not an ancestor of the Consumer, React Zedux will throw an error:

```js
import { render } from 'react-dom'
import RootContext from '../contexts/RootContext'

const HelloWorld = () => (
  <Context.Consumer>
    {store => store.getState()}
  </Context.Consumer>
)

const App = () => (
  <HelloWorld />
)

render(
  <App />,
  document.getElementById('root')
)

// Throws ReferenceError
```

This is for your safety. ;) If you really want to provide and consume the store, either explicitly include the [`<Context.Provider>`](/types/context/Provider.md) or use [`<Context.Injector>`](/types/context/Injector.md) instead.

React Zedux requires you to explicitly include the Provider to avoid unexpected behavior in the case of component-bound stores. If you want a new store created every time component X is mounted, then explicitly include the Provider there. Otherwise, include the Provider higher up in the component hierarchy.

## Examples

Simple example. Provide the Context at the app level. Consume the Context wherever.

```js
import { createContext } from 'react-zedux'
import { createStore } from 'zedux'

const Context = createContext(
  createStore().hydrate('hello world')
)

const HelloWorld = () => (
  <Context.Consumer>
    {store => store.getState()}
  </Context.Consumer>
)

const App = () => (
  <Context.Provider>
    <HelloWorld />
  </Context.Provider>
)
```