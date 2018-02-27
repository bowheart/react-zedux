# Observable

This is ultimately what is always consumed in React Zedux. An observable or a [StoreApi](/api/StoreApi.md) may be passed to [`createContext()`](/api/createContext.md). But since a StoreApi is just a wrapper around an observable, observables are what it all comes down to.

## Definition

```typescript
interface Observable<TState> {
  getState?(): TState
  subscribe(observer: Observer<TState>): { unsubscribe(): void } | (() => void)
}
```

Observables can take many forms. But they must have a `subscribe()` function that accepts an observer function. The observer should be called every time the observable emits (for a store, that's when the store's state updates).

They can return either:

- A function that can be called to unsubscribe from the observable.
- An object containing an `unsubscribe()` property that can be called to unsubscribe from the observable.

If the observer is not passed the new state, React Zedux will try to call the observable's optional `getState()` method to retrieve the new state. This is because Redux. Yep.

## Examples

The following are all valid observables:

```js
import { Observable } from 'rxjs'

const state$ = Observable.interval(1000)
```

```js
import { BehaviorSubject } from 'rxjs'

const state$ = new BehaviorSubject()
```

```js
import { createStore } from 'zedux'

const store = createStore()
```

```js
import { createStore } from 'redux'
import rootReducer from './rootReducer'

const store = createStore(rootReducer)
```

```js
import { createStore } from 'redux'
import { Observable } from 'rxjs'
import rootReducer from './rootReducer'

const store = createStore(rootReducer)
const state$ = Observable.from(store)
```

These can all be passed directly to [`createContext()`](/api/createContext.md) or set as a [StoreApi's store prop](/api/StoreApi.md).