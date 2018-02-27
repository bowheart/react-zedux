# `Context.inject()`

An HOC. Curried. Accepts an optional `mapStoreToProps` parameter. Wraps the given component in the Context's Injector.

Unlike [`Context.consume()`](/types/context/consume.md), will not throw an error if the Context's [Provider](/types/context/Provider.md) is not an ancestor of the injected component. This is because injected components get their own Providers.

## Definition

```typescript
(
  mapStoreToProps?: string
    | string[]
    | ((store: WrappedStateContainer) => Object)
) => (component: ComponentType) => Component
```

Exactly the same as [`Context.consume()`](/types/context/consume.md). See that doc page for details on this HOC's overloads.

## Examples:

The following examples are all equivalent:

```js
import { compose } from 'zedux'
import HelloContext from '../contexts/HelloContext'
import WorldContext form '../contexts/WorldContext'

const HelloWorld = compose(
  HelloContext.inject('helloStore'),
  WorldContext.inject('worldStore')
)(
  ({ helloStore, worldStore }) =>
    `${helloStore.state} ${worldStore.state}`
)
```

or without using `inject()`:

```js
import { compose } from 'zedux'
import HelloContext from '../contexts/HelloContext'
import WorldContext form '../contexts/WorldContext'

const HelloWorld = compose(
  HelloContext.provide,
  HelloContext.consume('helloStore'),
  WorldContext.provide,
  WorldContext.consume('worldStore')
)(
  ({ helloStore, worldStore }) =>
    `${helloStore.state} ${worldStore.state}`
)
```

or without using HOCs:

```js
import HelloContext from '../contexts/HelloContext'
import WorldContext form '../contexts/WorldContext'

const HelloWorld = () => (
  <HelloContext.Injector>
    {helloStore => (
      <WorldContext.Injector>
        {worldStore =>
          `${helloStore.state} ${worldStore.state}`
        }
      </WorldContext.Injector>
    )}
  </HelloContext.Injector>
)
```

or just being lame:

```js
import HelloContext from '../contexts/HelloContext'
import WorldContext form '../contexts/WorldContext'

const HelloWorld = () => (
  <HelloContext.Provider>
    <HelloContext.Consumer>
      {helloStore => (
        <WorldContext.Provider>
          <WorldContext.Consumer>
            {worldStore =>
              `${helloStore.state} ${worldStore.state}`
            }
          </WorldContext.Consumer>
        </WorldContext.Provider>
      )}
    </HelloContext.Consumer>
  </HelloContext.Provider>
)
```