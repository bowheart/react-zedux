# `Context.provide`

An HOC. Wraps the given component in the Context's Provider.

Note that unlike [`Context.consume()`](/types/context/consume.md) and [`inject()`](/types/context/inject.md), this HOC is not curried.

```js
const enhancer = compose(
  Context.provide, // Not curried!
  Context.consume('store') // Curried
)
```

Note that this example is equivalent to:

```js
const enhancer = Context.inject('store')
```

## Definition

```typescript
(component: ComponentType) => Component
```

**component** &ndash; a React component. Will be wrapped in the Context's [Provider](/types/context/Provider.md).

## Example

```js
import React from 'react'
import { createContext } from 'react-zedux'
import { createStore } from 'zedux'

const Context = createContext(createStore())

const Todos = Context.provide(
  () => (
    <>
      <AddTodo />
      <TodoList />
      <Filters />
    </>
  )
)
```

This example is exactly equivalent to:

```js
import React from 'react'
import { createContext } from 'react-zedux'
import { createStore } from 'zedux'

const Context = createContext(createStore())

const Todos = () => (
  <Context.Provider>
    <AddTodo />
    <TodoList />
    <Filters />
  </Context.Provider>
)
```

## Notes

You won't use `Context.provide` much. Most of its use cases are covered by [`Context.inject()`](/types/context/inject.md) and [`Context.Provider`](/types/context/Provider.md). In fact, this HOC is the least useful thing in all of React Zedux. Poor thing.