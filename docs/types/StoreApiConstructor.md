# StoreApiConstructor

This is just a type to represent the constructor of a class that extends [`StoreApi`](/api/StoreApi.md). This constructor is a [StateContainer](/types/StateContainer.md) so it can be passed directly to [`createContext()`](/api/createContext.md).

## Definition

```typescript
interface StoreApiConstructor<TState> {
  new (): StoreApi<TState>
  actors?: { [key: string]: Actor }
  selectors?: { [key: string]: Selector }
}
```

**actors** &ndash; optional object containing valid actors. Can contain nested actor maps.

**selectors** &ndash; optional object containing valid selectors. Can contain nested selector maps.

See the [Actor](https://bowheart.github.io/zedux/docs/types/Actor.html) and [Selector](https://bowheart.github.io/zedux/docs/types/Selector.html) types from Zedux.

## Examples

We could set these properties literally on the constructor:

```js
import { StoreApi } from 'react-zedux'
import { createStore } from 'zedux'

class CounterApi extends StoreApi {
  store = createStore().hydrate(0)
}

CounterApi.actors = {
  increment: () => state => state + 1
}
```

Or just use the `static` keyword:

```js
import { StoreApi } from 'react-zedux'
import { createStore } from 'zedux'

class CounterApi extends StoreApi {
  static actors = {
    increment: () => state => state + 1
  }

  store = createStore().hydrate(0)
}
```

## Notes

See the [StoreApi documentation](/api/StoreApi.md) for examples of how the actors and selectors are bound to the store.