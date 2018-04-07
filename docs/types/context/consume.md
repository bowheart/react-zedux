# `Context.consume()`

An HOC. Curried. Accepts an optional `mapStoreToProps` parameter. Wraps the given component in the Context's [Consumer](/types/context/Consumer.md).

Will throw an error if the resulting component is not used as a descendant of the Context's [Provider](/types/context/Provider.md). See the [Consumer doc](/types/context/Consumer.md) for details.

## Definition

```typescript
(
  mapStoreToProps?: string
    | string[]
    | ((store: WrappedStateContainer) => Object)
) => (component: ComponentType) => Component
```

See the [WrappedStateContainer type](/types/WrappedStateContainer.md)

## Examples

The different overloads:

```js
// Passes each property of the store as a prop on the wrapped
// component. Not ideal, as this clobbers the prop namespace.
// Also definitely can't be composed with other consume() HOCs :(
Context.consume()

// Passes the store as a single prop of the wrapped component.
Context.consume('storePropName')

// Plucks properties off the store and passes them as props
// with the same name to the wrapped component.
Context.consume([ 'dispatch', 'getState' ])

// Aliases store properties as prop names. Useful for preventing
// name collisions when consuming multiple contexts.
Context.consume({
  state: 'todosState', // reads "consume 'state' as 'todosState'"
  setState: 'setTodosState'
})

// Manually map props to values from the store. Similar to
// `connect()` from React Redux.
Context.consume(storeApi => ({
  todosState: storeApi.getState(),
  todos: storeApi.selectTodos()
}))
```

All above overloads also apply to [`Context.inject()`](/types/context/inject.md).

The consume HOC is useful for composing Consumers together:

```js
import { compose } from 'zedux'
import HelloContext from '../contexts/HelloContext'
import WorldContext from '../contexts/WorldContext'

const HelloWorld = compose(
  HelloContext.consume('helloStore'),
  WorldContext.consume('worldStore')
)(
  ({ helloStore, worldStore }) =>
    `${helloStore.state} ${worldStore.state}`
)
```

This example is equivalent to:

```js
import { compose } from 'zedux'
import HelloContext from '../contexts/HelloContext'
import WorldContext from '../contexts/WorldContext'

const HelloWorld = () => (
  <HelloContext.Consumer>
    {helloStore => (
      <WorldContext.Consumer>
        {worldStore =>
          `${helloStore.state} ${worldStore.state}`
        }
      </WorldContext.Consumer>
    )}
  </HelloContext.Consumer>
)
```