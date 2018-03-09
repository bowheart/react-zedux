# `WrappedStateContainer`

This is what is actually passed to consumers of a [Context](/types/Context.md). The properties (own and inherited) of this object are what can be:

- Plucked in `Context.consume()`:

```js
const SomeComponent = Context.consume([ 'prop1', 'prop2' ])(
  ({ prop1, prop2 }) => ...
)
```

- Dereferenced in a `<Context.Consumer>`'s render prop:

```js
<Context.Consumer>
  {({ prop1, prop2 }) => ...}
</Context.Consumer>
```

- Dereferenced in a wrapped component's normal props:

```js
const SomeComponent = Context.consume('store')(
  ({ store: { state: { prop1, prop2 } } }) => ...
)
```

## Definition

```typescript
interface WrappedStateContainer<TState> extends StateContainer<TState> {
  state: ReadOnly<TState>
}
```

## Motivation

Convenience, mostly ;)

Before React Zedux feeds the state container to consumers, it extends it with an object that contains a single property, `state`. The `state` property can be easily destructured in an SFC's function signature:

```js
import { createContext } from 'react-zedux'
import { createStore } from 'zedux'

const Context = createContext(
  createStore().hydrate({
    hello: 'something',
    world: 'spicy'
  })
)

const HelloWorld = Context.inject([ 'state' ])(
  ({ state: { hello, world } }) => `${hello} ${world}`
)
```

The actual object passed to consumers looks like this:

```js
{
  state: any,
  [[prototype]]: {
    dispatch()
    getState()
    // etc...
  }
}
```

This is called a wrapped state container. This is for performance and consumption/testing convenience. But it can be a gotcha if you don't know about it. Since the store's properties are not own properties of the wrapped state container, tests only need to specify the expected state:

```js
expect(renderProp).toHaveBeenCalledWith({
  state: 'expected state'
})
```

You may be tempted to write a test like this:

```js
expect(renderProp).toHaveBeenCalledWith(store)
```

This'll fail. As we already stated so beautifully. But let's state it again. For fun.

**The state container itself is not passed to consumers. It is first wrapped in another object.**

## Examples

What is actually passed to the consumers of a StoreApi?

```js
import { StoreApi, createContext } from 'react-zedux'
import { createStore } from 'zedux'

class Api extends StoreApi {
  static actors = {
    anActor: () => () => 'b'
  }

  store = createStore().hydrate('a')

  aMethod = () => {
    return this.store.getState()
  }
}

const Context = createContext(Api)

const SomeComponent = () => (
  <Context.Injector>
    {console.log}
  </Context.Injector>
)

/*
  logs:
  {
    state: 'a',
    [[prototype]]: {
      anActor: fn(),
      aMethod: fn(),
      dispatch: fn(),
      getState: fn(),
      ...etc... (the rest of the store's methods here)
      store: {
        dispatch: fn(),
        getState: fn()
        ...etc... (same thing)
      }
    }
  }
*/
```