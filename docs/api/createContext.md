# `createContext()`

Turns a [StateContainer](/types/StateContainer.md) into a consumable [Context](/types/Context.md).

## Definition

```typescript
function createContext<
  TState,
  TContainer extends StateContainer<TState>
>(
  stateContainer: TContainer
): Context<WrappedStateContainer<TState, TContainer>>
```

See the [StateContainer](/types/StateContainer.md), [WrappedStateContainer](/types/WrappedStateContainer.md), and [Context](/types/Context.md) types.

## Examples

Create Context from Zedux store:

```js
import { createContext } from 'react-zedux'
import { createStore } from 'zedux'

const Context = createContext(createStore())
```

Create Context from observable:

```js
import { createContext } from 'react-zedux'
import { Observable } from 'rxjs'

const Context = createContext(Observable.interval(1000))
```

Create Context from Redux store:

```js
import { createContext } from 'react-zedux'
import { createStore } from 'redux'
import rootReducer from './rootReducer'

const Context = createContext(createStore(rootReducer))
```